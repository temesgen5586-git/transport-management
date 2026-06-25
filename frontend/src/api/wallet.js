import api from './axios';

/**
 * Get wallet balance
 * GET /api/v1/wallet/balance
 */
export const getBalance = () => api.get('/wallet/balance');

/**
 * Get transaction history
 * GET /api/v1/wallet/history
 */
export const getHistory = () => api.get('/wallet/history');

/**
 * Initiate deposit
 * POST /api/v1/wallet/deposit
 */
export const deposit = (data) => api.post('/wallet/deposit', data);

/**
 * Cancel booking and refund
 * POST /api/v1/wallet/refund
 */
export const refund = (data) => api.post('/wallet/refund', data);