import api from './axios';

/**
 * Driver API Services
 * All endpoints under /driver
 * Access: driver only
 */

/**
 * Get today's manifest (assigned trips)
 * GET /api/v1/driver/trips
 */
export const getManifest = () => api.get('/driver/trips');

/**
 * Get settlement history
 * GET /api/v1/driver/settlements
 */
export const getSettlements = () => api.get('/driver/settlements');

/**
 * Request payout
 * POST /api/v1/driver/payout/request
 */
export const requestPayout = (data) => api.post('/driver/payout/request', data);

/**
 * Get driver's penalties
 * GET /api/v1/driver/penalties
 */
export const getDriverPenalties = () => api.get('/driver/penalties');