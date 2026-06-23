const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');

/**
 * Get audit logs with filters and pagination
 * GET /api/v1/audit/logs
 * Query: ?user_id=uuid&action_type=BOOKING_CREATED&start_date=2026-01-01&end_date=2026-06-01&limit=50&offset=0
 */
exports.getAuditLogs = catchAsync(async (req, res, next) => {
    const { user_id, action_type, entity_type, start_date, end_date, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (user_id) {
        query += ' AND user_id = ?';
        params.push(user_id);
    }
    if (action_type) {
        query += ' AND action_type = ?';
        params.push(action_type);
    }
    if (entity_type) {
        query += ' AND entity_type = ?';
        params.push(entity_type);
    }
    if (start_date) {
        query += ' AND created_at >= ?';
        params.push(start_date);
    }
    if (end_date) {
        query += ' AND created_at <= ?';
        params.push(end_date);
    }

    const [totalRows] = await pool.execute(
        query.replace('SELECT *', 'SELECT COUNT(*) AS total'),
        params
    );
    const total = totalRows[0].total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.execute(query, params);

    res.status(200).json({
        success: true,
        data: rows,
        pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

/**
 * Export audit logs as JSON (for legal archiving)
 * GET /api/v1/audit/export
 */
exports.exportAuditLogs = catchAsync(async (req, res, next) => {
    const { start_date, end_date } = req.query;
    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];

    if (start_date) {
        query += ' AND created_at >= ?';
        params.push(start_date);
    }
    if (end_date) {
        query += ' AND created_at <= ?';
        params.push(end_date);
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=audit_export_${Date.now()}.json`);
    res.status(200).json(rows);
});