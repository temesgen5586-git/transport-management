import api from './axios';

/**
 * Booking API Services
 * All endpoints under /bookings
 */

/**
 * Create a new booking
 * POST /api/v1/bookings
 */
export const createBooking = (data) => api.post('/bookings', data);

/**
 * Get all bookings for current user
 * GET /api/v1/bookings
 */
export const getBookings = () => api.get('/bookings');

/**
 * Get a single booking by ID
 * GET /api/v1/bookings/:id
 */
export const getBooking = (id) => api.get(`/bookings/${id}`);

/**
 * Check-in passenger (QR scan)
 * PATCH /api/v1/bookings/:id/checkin
 */
export const checkinBooking = (id, data) => api.patch(`/bookings/${id}/checkin`, data);

/**
 * Cancel a booking (customer)
 * PATCH /api/v1/bookings/:id/cancel
 */
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);