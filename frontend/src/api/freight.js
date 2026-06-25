import api from './axios';

/**
 * Freight API Services
 * All endpoints under /freight
 */

// ==================== FREIGHT ORDERS ====================

/**
 * Create a freight order
 * POST /api/v1/freight/orders
 */
export const createOrder = (data) => api.post('/freight/orders', data);

/**
 * Get all freight orders
 * GET /api/v1/freight/orders
 */
export const getOrders = () => api.get('/freight/orders');

/**
 * Get a single freight order
 * GET /api/v1/freight/orders/:id
 */
export const getOrder = (id) => api.get(`/freight/orders/${id}`);

/**
 * Match return load (find cargo from dropoff location)
 * POST /api/v1/freight/orders/:id/match
 */
export const matchReturnLoad = (id) => api.post(`/freight/orders/${id}/match`);

// ==================== CUSTOMS DOCUMENTS ====================

/**
 * Get all customs documents
 * GET /api/v1/admin/customs-documents
 */
export const getCustomsDocuments = () => api.get('/admin/customs-documents');

/**
 * Upload a customs document
 * POST /api/v1/admin/customs-documents
 */
export const uploadCustomsDocument = (data) => api.post('/admin/customs-documents', data);

/**
 * Delete a customs document
 * DELETE /api/v1/admin/customs-documents/:id
 */
export const deleteCustomsDocument = (id) => api.delete(`/admin/customs-documents/${id}`);