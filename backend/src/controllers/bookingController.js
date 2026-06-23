const { pool } = require('../config/db');
const { generateQRHash } = require('../services/qrService');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { BOOKING_STATUSES, PAYMENT_STATUSES } = require('../utils/constants');

/**
 * Create a new booking (seat reservation)
 * POST /api/v1/bookings
 */
exports.createBooking = catchAsync(async (req, res, next) => {
    const { trip_id, seat_number, payment_method = 'wallet' } = req.body;
    const user_id = req.user.id;

    if (!trip_id || !seat_number) {
        return next(new AppError('trip_id and seat_number are required', 400));
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check trip and capacity
        const [tripRows] = await connection.execute(`
            SELECT t.id, t.scheduled_departure, v.vehicle_type_id, vt.max_capacity,
                   (SELECT COUNT(*) FROM bookings WHERE trip_id = t.id AND booking_status != 'cancelled') AS booked_count
            FROM trips t
            JOIN vehicles v ON t.vehicle_id = v.id
            JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
            WHERE t.id = ? AND t.status = 'scheduled'
            FOR UPDATE
        `, [trip_id]);

        if (tripRows.length === 0) {
            return next(new AppError('Trip not available or not scheduled', 400));
        }
        const trip = tripRows[0];
        if (trip.booked_count >= trip.max_capacity) {
            return next(new AppError('Vehicle is FULL for this trip', 409));
        }

        // 2. Calculate price
        const [priceRows] = await connection.execute(`
            SELECT (r.distance_km * 1.5 + vt.base_fare_multiplier * 50) AS price
            FROM routes r, vehicle_types vt
            WHERE r.id = (SELECT route_id FROM trips WHERE id = ?) AND vt.id = ?
        `, [trip_id, trip.vehicle_type_id]);
        const price = parseFloat(priceRows[0].price);

        // 3. Check wallet balance if wallet payment
        if (payment_method === 'wallet') {
            const [userRows] = await connection.execute(
                'SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE',
                [user_id]
            );
            if (parseFloat(userRows[0].wallet_balance) < price) {
                return next(new AppError('Insufficient wallet balance', 402));
            }
        }

        // 4. Generate QR hash
        const qr_hash = generateQRHash(trip_id, user_id, seat_number);

        // 5. Insert booking
        const [bookingResult] = await connection.execute(`
            INSERT INTO bookings (trip_id, user_id, seat_number, qr_code_hash, price, payment_status)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [trip_id, user_id, seat_number, qr_hash, price, 'paid']);

        const bookingId = bookingResult.insertId;

        // 6. Deduct wallet if wallet payment
        if (payment_method === 'wallet') {
            await connection.execute(
                'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
                [price, user_id]
            );
            await connection.execute(`
                INSERT INTO wallet_transactions (user_id, amount, transaction_type, balance_after, booking_id, description)
                VALUES (?, ?, 'booking_payment', (SELECT wallet_balance FROM users WHERE id = ?), ?, 'Trip booking')
            `, [user_id, -price, user_id, bookingId]);
        }

        // 7. Audit log
        await logAction(user_id, 'BOOKING_CREATED', 'BOOKING', bookingId, null, { trip_id, seat_number, price }, req);

        await connection.commit();

        // Fetch the booking for response
        const [newBooking] = await connection.execute(
            'SELECT id, seat_number, qr_code_hash FROM bookings WHERE id = ?',
            [bookingId]
        );

        res.status(201).json({
            success: true,
            message: 'Booking confirmed.',
            data: {
                booking_id: newBooking[0].id,
                seat: newBooking[0].seat_number,
                qr_code: newBooking[0].qr_code_hash
            }
        });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});

/**
 * Get all bookings for current user
 * GET /api/v1/bookings
 */
exports.getBookings = catchAsync(async (req, res, next) => {
    const user_id = req.user.id;
    const [rows] = await pool.execute(`
        SELECT b.id, b.seat_number, b.price, b.booking_status, b.payment_status, b.created_at,
               t.scheduled_departure,
               r.origin_city_id, r.destination_city_id,
               c1.name AS origin, c2.name AS destination
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `, [user_id]);

    res.status(200).json({ success: true, data: rows });
});

/**
 * Get a single booking by ID
 * GET /api/v1/bookings/:id
 */
exports.getBooking = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await pool.execute(`
        SELECT b.*, t.scheduled_departure, t.estimated_arrival,
               c1.name AS origin, c2.name AS destination,
               v.plate_number, u.full_name AS driver_name
        FROM bookings b
        JOIN trips t ON b.trip_id = t.id
        JOIN routes r ON t.route_id = r.id
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        JOIN vehicles v ON t.vehicle_id = v.id
        JOIN users u ON t.driver_id = u.id
        WHERE b.id = ? AND b.user_id = ?
    `, [id, user_id]);

    if (rows.length === 0) {
        return next(new AppError('Booking not found or not owned by you', 404));
    }

    res.status(200).json({ success: true, data: rows[0] });
});

/**
 * Check-in passenger (station dispatcher scans QR)
 * PATCH /api/v1/bookings/:id/checkin
 */
exports.checkinBooking = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { qr_code_hash } = req.body;

    if (!qr_code_hash) {
        return next(new AppError('QR code hash is required', 400));
    }

    // Verify QR matches booking
    const [rows] = await pool.execute(
        'SELECT id, booking_status FROM bookings WHERE id = ? AND qr_code_hash = ?',
        [id, qr_code_hash]
    );
    if (rows.length === 0) {
        return next(new AppError('Invalid QR code or booking not found', 404));
    }
    const booking = rows[0];
    if (booking.booking_status !== 'confirmed') {
        return next(new AppError(`Booking is already ${booking.booking_status}`, 400));
    }

    // Update status
    await pool.execute(
        'UPDATE bookings SET booking_status = ?, checked_in_at = NOW() WHERE id = ?',
        ['checked_in', id]
    );

    await logAction(req.user.id, 'BOOKING_CHECKED_IN', 'BOOKING', id, null, { checked_in_at: new Date() }, req);

    res.status(200).json({
        success: true,
        message: 'Passenger checked in successfully.',
        data: { booking_status: 'checked_in' }
    });
});