import api from './axios';

/**
 * Trip API Services
 * All endpoints under /trips
 */

/**
 * Schedule a new trip (Admin only)
 * POST /api/v1/trips
 */
export const scheduleTrip = (data) => api.post('/trips', data);

/**
 * Get all trips with filters
 * GET /api/v1/trips?status=scheduled&date=2026-06-25
 */
export const getTrips = (params) => api.get('/trips', { params });

/**
 * Get live trips (real-time GPS)
 * GET /api/v1/trips/live
 */
export const getLiveTrips = () => api.get('/trips/live');

/**
 * Get a single trip by ID
 * GET /api/v1/trips/:id
 */
export const getTrip = (id) => api.get(`/trips/${id}`);

/**
 * Driver depart (check-in with GPS)
 * POST /api/v1/trips/:id/depart
 */
export const departTrip = (id, data) => api.post(`/trips/${id}/depart`, data);

/**
 * Driver complete trip
 * POST /api/v1/trips/:id/complete
 */
export const completeTrip = (id) => api.post(`/trips/${id}/complete`);

/**
 * Cancel a trip (Admin only)
 * PATCH /api/v1/trips/:id/cancel
 */
export const cancelTrip = (id) => api.patch(`/trips/${id}/cancel`);