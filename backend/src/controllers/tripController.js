const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { TRIP_STATUSES } = require('../utils/constants');

/**
 * Schedule a new trip (Admin/Dispatcher)
 * POST /api/v1/trips
 */
exports.scheduleTrip = catchAsync(async (req, res, next) => {
    const { route_id, vehicle_id, driver_id, scheduled_departure } = req.body;

    if (!route_id || !vehicle_id || !driver_id || !scheduled_departure) {
        return next(new AppError('Missing required fields: route_id, vehicle_id, driver_id, scheduled_departure', 400));
    }

    // Check if vehicle is available at that time (MySQL doesn't have exclusion constraint)
    const [conflict] = await pool.execute(`
        SELECT id FROM trips
        WHERE vehicle_id = ?
          AND status != 'cancelled'
          AND (
              (scheduled_departure <= ? AND estimated_arrival > ?) OR
              (scheduled_departure < ? AND estimated_arrival >= ?)
          )
    `, [vehicle_id, scheduled_departure, scheduled_departure, scheduled_departure, scheduled_departure]);

    if (conflict.length > 0) {
        return next(new AppError('Vehicle is already scheduled for a trip overlapping with this time.', 409));
    }

    // Get route duration
    const [routeRows] = await pool.execute(
        'SELECT base_duration_mins FROM routes WHERE id = ?',
        [route_id]
    );
    if (routeRows.length === 0) {
        return next(new AppError('Route not found', 404));
    }
    const durationMins = routeRows[0].base_duration_mins;

    // Calculate estimated arrival
    const estimatedArrival = new Date(new Date(scheduled_departure).getTime() + durationMins * 60000);

    // Insert trip
    const [result] = await pool.execute(`
        INSERT INTO trips (route_id, vehicle_id, driver_id, scheduled_departure, estimated_arrival, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
    `, [route_id, vehicle_id, driver_id, scheduled_departure, estimatedArrival]);

    const tripId = result.insertId;

    // Audit log
    await logAction(req.user.id, 'TRIP_SCHEDULED', 'TRIP', tripId, null, { route_id, vehicle_id, driver_id, scheduled_departure }, req);

    // Get full trip details
    const [tripRows] = await pool.execute(`
        SELECT t.*, r.origin_city_id, r.destination_city_id,
               c1.name AS origin, c2.name AS destination,
               v.plate_number, u.full_name AS driver_name
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        JOIN vehicles v ON t.vehicle_id = v.id
        JOIN users u ON t.driver_id = u.id
        WHERE t.id = ?
    `, [tripId]);

    res.status(201).json({
        success: true,
        data: tripRows[0]
    });
});

/**
 * List trips with filters
 * GET /api/v1/trips
 * Query: ?status=scheduled&date=2026-06-25&route_id=1
 */
exports.getTrips = catchAsync(async (req, res, next) => {
    const { status, date, route_id, vehicle_id, driver_id } = req.query;
    let query = `
        SELECT t.id, t.scheduled_departure, t.estimated_arrival, t.status,
               r.origin_city_id, r.destination_city_id,
               c1.name AS origin, c2.name AS destination,
               v.plate_number, u.full_name AS driver_name
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        JOIN vehicles v ON t.vehicle_id = v.id
        JOIN users u ON t.driver_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (status) {
        query += ' AND t.status = ?';
        params.push(status);
    }
    if (date) {
        query += ' AND DATE(t.scheduled_departure) = ?';
        params.push(date);
    }
    if (route_id) {
        query += ' AND t.route_id = ?';
        params.push(route_id);
    }
    if (vehicle_id) {
        query += ' AND t.vehicle_id = ?';
        params.push(vehicle_id);
    }
    if (driver_id) {
        query += ' AND t.driver_id = ?';
        params.push(driver_id);
    }

    query += ' ORDER BY t.scheduled_departure DESC LIMIT 100';

    const [rows] = await pool.execute(query, params);
    res.status(200).json({ success: true, data: rows });
});

/**
 * Get live trips (real-time GPS for active trips)
 * GET /api/v1/trips/live
 */
exports.getLiveTrips = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(`
        SELECT id, vehicle_id, driver_id, current_latitude, current_longitude, status, scheduled_departure
        FROM trips
        WHERE status IN ('departed', 'en_route')
        ORDER BY scheduled_departure ASC
    `);
    res.status(200).json({ success: true, data: rows });
});

/**
 * Driver: Depart for a trip (check-in with GPS)
 * POST /api/v1/trips/:id/depart
 */
exports.driverDepart = catchAsync(async (req, res, next) => {
    const trip_id = req.params.id;
    const driver_id = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return next(new AppError('Latitude and longitude are required', 400));
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check trip
        const [tripRows] = await connection.execute(
            'SELECT scheduled_departure, status FROM trips WHERE id = ? AND driver_id = ?',
            [trip_id, driver_id]
        );
        if (tripRows.length === 0) {
            return next(new AppError('Trip not found or not assigned to you', 404));
        }
        const trip = tripRows[0];
        if (trip.status !== 'scheduled') {
            return next(new AppError(`Trip is already ${trip.status}`, 400));
        }

        // Check delay (>15 mins auto-cancel)
        const now = new Date();
        const dep = new Date(trip.scheduled_departure);
        const diffMinutes = (now - dep) / 60000;
        if (diffMinutes > 15) {
            // Auto-cancel
            await connection.execute('UPDATE trips SET status = ? WHERE id = ?', ['cancelled', trip_id]);
            await connection.execute(`
                INSERT INTO penalties (driver_id, trip_id, penalty_type, amount, description)
                VALUES (?, ?, 'delay', 10.00, 'Auto-cancelled for 15-min delay')
            `, [driver_id, trip_id]);
            await connection.commit();
            return res.status(409).json({
                success: false,
                error: 'Departure delayed > 15 mins. Order revoked and penalty applied.'
            });
        }

        // Update trip
        await connection.execute(`
            UPDATE trips
            SET status = 'departed', actual_departure = NOW(), current_latitude = ?, current_longitude = ?
            WHERE id = ?
        `, [latitude, longitude, trip_id]);

        await logAction(driver_id, 'TRIP_DEPARTED', 'TRIP', trip_id, null, { latitude, longitude }, req);

        await connection.commit();

        res.status(200).json({ success: true, message: 'Trip departed successfully' });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});

/**
 * Driver: Complete trip (trigger settlement)
 * POST /api/v1/trips/:id/complete
 */
exports.completeTrip = catchAsync(async (req, res, next) => {
    const trip_id = req.params.id;
    const driver_id = req.user.id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check trip
        const [tripRows] = await connection.execute(
            'SELECT id FROM trips WHERE id = ? AND driver_id = ? AND status = "departed"',
            [trip_id, driver_id]
        );
        if (tripRows.length === 0) {
            return next(new AppError('Trip not found or not departed', 404));
        }

        // Update status
        await connection.execute(
            'UPDATE trips SET status = "completed", actual_arrival = NOW() WHERE id = ?',
            [trip_id]
        );

        // Calculate earnings from bookings
        const [earnings] = await connection.execute(
            'SELECT SUM(price) AS total FROM bookings WHERE trip_id = ? AND booking_status != "cancelled"',
            [trip_id]
        );
        const gross = parseFloat(earnings[0].total) || 0;
        const net = gross * 0.7;
        const fee = gross * 0.3;

        // Insert settlement
        await connection.execute(`
            INSERT INTO driver_settlements (driver_id, trip_id, gross_earning, institution_fee, net_earning, final_payout)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [driver_id, trip_id, gross, fee, net, net]);

        // Credit driver's wallet
        await connection.execute(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [net, driver_id]
        );
        await connection.execute(`
            INSERT INTO wallet_transactions (user_id, amount, transaction_type, balance_after, description)
            VALUES (?, ?, 'driver_payout', (SELECT wallet_balance FROM users WHERE id = ?), 'Trip completion payout')
        `, [driver_id, net, driver_id]);

        await logAction(driver_id, 'TRIP_COMPLETED', 'TRIP', trip_id, null, { gross, net }, req);

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Trip completed.',
            data: { net_earning: net }
        });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});