const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Get today's manifest for driver
 * GET /api/v1/driver/trips
 */
exports.getManifest = catchAsync(async (req, res, next) => {
    const driver_id = req.user.id;

    const [rows] = await pool.execute(`
        SELECT t.id AS trip_id,
               r.origin_city_id, r.destination_city_id,
               c1.name AS origin, c2.name AS destination,
               t.scheduled_departure, t.estimated_arrival,
               (SELECT COUNT(*) FROM bookings b WHERE b.trip_id = t.id AND b.booking_status != 'cancelled') AS passenger_count,
               v.plate_number
        FROM trips t
        JOIN routes r ON t.route_id = r.id
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        JOIN vehicles v ON t.vehicle_id = v.id
        WHERE t.driver_id = ?
          AND t.status IN ('scheduled', 'boarding', 'departed')
          AND t.scheduled_departure > NOW() - INTERVAL 1 DAY
        ORDER BY t.scheduled_departure ASC
    `, [driver_id]);

    res.status(200).json({ success: true, data: rows });
});

/**
 * Get driver settlement history
 * GET /api/v1/driver/settlements
 */
exports.getSettlements = catchAsync(async (req, res, next) => {
    const driver_id = req.user.id;

    const [rows] = await pool.execute(`
        SELECT id, trip_id, gross_earning, net_earning, penalty_deductions,
               final_payout, payout_status, settled_at
        FROM driver_settlements
        WHERE driver_id = ?
        ORDER BY settled_at DESC
        LIMIT 50
    `, [driver_id]);

    res.status(200).json({ success: true, data: rows });
});

/**
 * Request payout (withdraw wallet balance)
 * POST /api/v1/driver/payout/request
 */
exports.requestPayout = catchAsync(async (req, res, next) => {
    const { amount } = req.body;
    const driver_id = req.user.id;

    if (!amount || amount <= 0) {
        return next(new AppError('Please provide a valid amount', 400));
    }

    // Check balance
    const [balanceRows] = await pool.execute(
        'SELECT wallet_balance FROM users WHERE id = ?',
        [driver_id]
    );
    const balance = parseFloat(balanceRows[0].wallet_balance);
    if (balance < amount) {
        return next(new AppError('Insufficient wallet balance', 400));
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Deduct from wallet
        await connection.execute(
            'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
            [amount, driver_id]
        );

        // Log transaction
        await connection.execute(`
            INSERT INTO wallet_transactions (user_id, amount, transaction_type, balance_after, description)
            VALUES (?, ?, 'driver_payout', (SELECT wallet_balance FROM users WHERE id = ?), 'Payout requested')
        `, [driver_id, -amount, driver_id]);

        // Audit log
        await logAction(driver_id, 'PAYOUT_REQUESTED', 'USER', driver_id, null, { amount }, req);

        await connection.commit();

        // In production: call paymentService.processDriverPayout(amount, driver_phone)
        // For now, just return success

        res.status(202).json({
            success: true,
            message: 'Payout request submitted for processing.',
            data: { status: 'processing' }
        });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});