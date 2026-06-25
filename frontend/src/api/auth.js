import api from './axios';

/**
 * Authentication API Services
 * All endpoints under /auth
 */

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
export const getProfile = () => api.get('/auth/me');

/**
 * Request password reset
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = (phone) => api.post('/auth/forgot-password', { phone });

/**
 * Reset password with token
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = (data) => api.post('/auth/reset-password', data);

/**
 * Logout (client-side only)
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};