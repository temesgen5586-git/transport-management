const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Create a freight order
 * POST /api/v1/freight/orders
 */
exports.createOrder = catchAsync(async (req, res, next) => {
    const { pickup_city_id, dropoff_city_id, weight_kg, volume_cbm } = req.body;
    const shipper_id = req.user.id;

    if (!pickup_city_id || !dropoff_city_id || !weight_kg) {
        return next(new AppError('pickup_city_id, dropoff_city_id, weight_kg are required', 400));
    }

    const [result] = await pool.execute(`
        INSERT INTO freight_orders (shipper_user_id, pickup_city_id, dropoff_city_id, weight_kg, volume_cbm, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
    `, [shipper_id, pickup_city_id, dropoff_city_id, weight_kg, volume_cbm || null]);

    await logAction(shipper_id, 'FREIGHT_ORDER_CREATED', 'FREIGHT_ORDER', result.insertId, null, req.body, req);

    const [rows] = await pool.execute('SELECT * FROM freight_orders WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
});

/**
 * List freight orders for current shipper
 * GET /api/v1/freight/orders
 */
exports.getOrders = catchAsync(async (req, res, next) => {
    const user_id = req.user.id;
    const [rows] = await pool.execute(`
        SELECT fo.*, c1.name AS pickup_city, c2.name AS dropoff_city
        FROM freight_orders fo
        JOIN cities c1 ON fo.pickup_city_id = c1.id
        JOIN cities c2 ON fo.dropoff_city_id = c2.id
        WHERE fo.shipper_user_id = ?
        ORDER BY fo.created_at DESC
    `, [user_id]);
    res.status(200).json({ success: true, data: rows });
});

/**
 * Match return load (find cargo from dropoff location)
 * POST /api/v1/freight/orders/:id/match
 */
exports.matchReturnLoad = catchAsync(async (req, res, next) => {
    const order_id = req.params.id;
    const user_id = req.user.id;

    // Get dropoff city of the given order
    const [orderRows] = await pool.execute(
        'SELECT dropoff_city_id FROM freight_orders WHERE id = ? AND shipper_user_id = ?',
        [order_id, user_id]
    );
    if (orderRows.length === 0) {
        return next(new AppError('Order not found or not owned by you', 404));
    }
    const dropoffCity = orderRows[0].dropoff_city_id;

    // Find pending orders that start from this dropoff city (return load opportunities)
    const [matches] = await pool.execute(`
        SELECT fo.id, fo.weight_kg, fo.volume_cbm, c.name AS destination_city
        FROM freight_orders fo
        JOIN cities c ON fo.dropoff_city_id = c.id
        WHERE fo.pickup_city_id = ?
          AND fo.status = 'pending'
          AND fo.id != ?
        LIMIT 10
    `, [dropoffCity, order_id]);

    res.status(200).json({
        success: true,
        message: `Found ${matches.length} return-load opportunities from your dropoff location.`,
        data: matches
    });
});

/**
 * Upload customs document
 * POST /api/v1/freight/documents
 */
exports.uploadCustomsDoc = catchAsync(async (req, res, next) => {
    const { freight_order_id, document_type, file_url } = req.body;

    if (!freight_order_id || !document_type || !file_url) {
        return next(new AppError('freight_order_id, document_type, file_url are required', 400));
    }

    const [result] = await pool.execute(`
        INSERT INTO customs_documents (freight_order_id, document_type, file_url, customs_status)
        VALUES (?, ?, ?, 'submitted')
    `, [freight_order_id, document_type, file_url]);

    await logAction(req.user.id, 'CUSTOMS_DOCUMENT_UPLOADED', 'FREIGHT_ORDER', freight_order_id, null, { document_type }, req);

    // In production: Here you would call the Ethiopian Customs Authority API
    // For now, just mark as submitted.

    res.status(201).json({
        success: true,
        message: 'Document submitted for customs pre-clearance.',
        data: { id: result.insertId, customs_status: 'submitted' }
    });
});