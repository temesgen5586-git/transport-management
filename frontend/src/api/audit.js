import api from './axios';

/**
 * Audit API Services
 * All endpoints under /audit
 * Access: auditor or super_admin only
 */

/**
 * Get audit logs with filters
 * GET /api/v1/audit/logs
 */
export const getAuditLogs = (params) => api.get('/audit/logs', { params });

/**
 * Export audit logs as JSON
 * GET /api/v1/audit/export
 */
export const exportAuditLogs = (params) => api.get('/audit/export', {
    params,
    responseType: 'blob',
});

/**
 * Get a single audit log
 * GET /api/v1/audit/logs/:id
 */
export const getAuditLog = (id) => api.get(`/audit/logs/${id}`);