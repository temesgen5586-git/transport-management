const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { TRANSACTION_TYPES, PAYMENT_STATUSES, BOOKING_STATUSES } = require('../utils/constants');

/**
 * Get wallet balance
 * GET /api/v1/wallet/balance
 */
exports.getBalance = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(
        'SELECT wallet_balance FROM users WHERE id = ?',
        [req.user.id]
    );
    res.status(200).json({ success: true, data: { balance: parseFloat(rows[0].wallet_balance) } });
});

/**
 * Get wallet transaction history (last 50)
 * GET /api/v1/wallet/history
 */
exports.getHistory = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(`
        SELECT id, amount, transaction_type, balance_after, description, created_at
        FROM wallet_transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    `, [req.user.id]);
    res.status(200).json({ success: true, data: rows });
});

/**
 * Initiate a deposit (creates payment gateway log)
 * POST /api/v1/wallet/deposit
 */
exports.initiateDeposit = catchAsync(async (req, res, next) => {
    const { amount, gateway, phone } = req.body;
    const user_id = req.user.id;

    if (!amount || amount <= 0) {
        return next(new AppError('Invalid amount', 400));
    }
    if (!gateway || !['telebirr', 'cbebirr', 'cbe_bank'].includes(gateway)) {
        return next(new AppError('Invalid gateway. Allowed: telebirr, cbebirr, cbe_bank', 400));
    }

    // Insert payment log
    const [result] = await pool.execute(`
        INSERT INTO payment_gateway_logs (user_id, amount, gateway, gateway_transaction_id, status)
        VALUES (?, ?, ?, ?, 'pending')
    `, [user_id, amount, gateway, `DEP-${Date.now()}`]);

    const logId = result.insertId;

    // In production: call the gateway API here (e.g., Telebirr)
    // For now, we just simulate a pending transaction.

    res.status(202).json({
        success: true,
        message: `Deposit initiated. Complete payment on ${gateway.toUpperCase()}.`,
        data: { transaction_id: logId, status: 'pending' }
    });
});

/**
 * Cancel a booking and refund to wallet (smart refund logic)
 * POST /api/v1/wallet/refund
 */
exports.refundBooking = catchAsync(async (req, res, next) => {
    const { booking_id } = req.body;
    const user_id = req.user.id;

    if (!booking_id) {
        return next(new AppError('booking_id is required', 400));
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get booking details
        const [bookingRows] = await connection.execute(`
            SELECT b.id, b.price, t.scheduled_departure
            FROM bookings b
            JOIN trips t ON b.trip_id = t.id
            WHERE b.id = ? AND b.user_id = ? AND b.booking_status = 'confirmed'
        `, [booking_id, user_id]);

        if (bookingRows.length === 0) {
            return next(new AppError('Booking not found or already cancelled', 404));
        }
        const booking = bookingRows[0];

        const now = new Date();
        const dep = new Date(booking.scheduled_departure);
        const hoursUntilDeparture = (dep - now) / 3600000;

        let refundPct = 0;
        let refundAmount = 0;

        if (hoursUntilDeparture > 12) {
            refundPct = 1.0;
        } else if (hoursUntilDeparture >= 2 && hoursUntilDeparture <= 12) {
            refundPct = 0.85;
        } else {
            // No refund if < 2 hours
            refundPct = 0;
        }

        if (refundPct > 0) {
            refundAmount = booking.price * refundPct;
            // Credit wallet
            await connection.execute(
                'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
                [refundAmount, user_id]
            );
            // Log transaction
            await connection.execute(`
                INSERT INTO wallet_transactions (user_id, amount, transaction_type, balance_after, booking_id, description)
                VALUES (?, ?, 'refund_credit', (SELECT wallet_balance FROM users WHERE id = ?), ?, ?)
            `, [user_id, refundAmount, user_id, booking_id, `Refund ${refundPct * 100}% for cancellation`]);
        }

        // Update booking
        await connection.execute(
            'UPDATE bookings SET booking_status = "cancelled", payment_status = "refunded" WHERE id = ?',
            [booking_id]
        );

        await logAction(user_id, 'BOOKING_CANCELLED', 'BOOKING', booking_id, null, { refund_amount: refundAmount, refund_pct: refundPct }, req);

        await connection.commit();

        res.status(200).json({
            success: true,
            message: `Booking cancelled. Refunded ${refundPct * 100}% to wallet.`,
            data: { refunded_amount: refundAmount }
        });

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
});
