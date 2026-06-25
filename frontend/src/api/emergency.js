import api from './axios';

/**
 * Emergency API Services
 * All endpoints under /emergency
 */

/**
 * Trigger emergency (SOS)
 * POST /api/v1/emergency
 */
export const triggerEmergency = (data) => api.post('/emergency', data);

/**
 * Get emergency logs
 * GET /api/v1/emergency/logs
 */
export const getEmergencyLogs = () => api.get('/emergency/logs');

/**
 * Get a single emergency log
 * GET /api/v1/emergency/logs/:id
 */
export const getEmergencyLog = (id) => api.get(`/emergency/logs/${id}`);

/**
 * Resolve an emergency
 * PATCH /api/v1/emergency/logs/:id/resolve
 */
export const resolveEmergency = (id, data) => api.patch(`/emergency/logs/${id}/resolve`, data);