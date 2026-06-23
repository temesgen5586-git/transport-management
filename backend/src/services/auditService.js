const { pool } = require('../config/db');

exports.logAction = async (userId, actionType, entityType, entityId, oldValues = null, newValues = null, req = null) => {
    try {
        const ip = req?.ip || req?.connection?.remoteAddress || null;
        const userAgent = req?.headers?.['user-agent'] || null;

        await pool.execute(`
            INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [userId, actionType, entityType, entityId, oldValues, newValues, ip, userAgent]);
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
};