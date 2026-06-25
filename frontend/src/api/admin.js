import api from './axios';

/**
 * Admin API Services
 * All endpoints under /admin
 * Access: super_admin or dispatcher
 */

// ==================== USERS ====================

/**
 * Get all users (optional role filter)
 * GET /api/v1/admin/users?role=driver
 */
export const getUsers = (role) => api.get(`/admin/users${role ? `?role=${role}` : ''}`);

/**
 * Create a new user (with role)
 * POST /api/v1/admin/users
 */
export const createUser = (data) => api.post('/admin/users', data);

/**
 * Update a user
 * PUT /api/v1/admin/users/:id
 */
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data);

/**
 * Delete a user
 * DELETE /api/v1/admin/users/:id
 */
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// ==================== CITIES ====================

/**
 * Get all cities
 * GET /api/v1/admin/cities
 */
export const getCities = () => api.get('/admin/cities');

/**
 * Create a city
 * POST /api/v1/admin/cities
 */
export const createCity = (data) => api.post('/admin/cities', data);

/**
 * Update a city
 * PUT /api/v1/admin/cities/:id
 */
export const updateCity = (id, data) => api.put(`/admin/cities/${id}`, data);

/**
 * Delete a city
 * DELETE /api/v1/admin/cities/:id
 */
export const deleteCity = (id) => api.delete(`/admin/cities/${id}`);

// ==================== ROUTES ====================

/**
 * Get all routes
 * GET /api/v1/admin/routes
 */
export const getRoutes = () => api.get('/admin/routes');

/**
 * Create a route
 * POST /api/v1/admin/routes
 */
export const createRoute = (data) => api.post('/admin/routes', data);

/**
 * Update a route
 * PUT /api/v1/admin/routes/:id
 */
export const updateRoute = (id, data) => api.put(`/admin/routes/${id}`, data);

/**
 * Delete a route
 * DELETE /api/v1/admin/routes/:id
 */
export const deleteRoute = (id) => api.delete(`/admin/routes/${id}`);

// ==================== VEHICLES ====================

/**
 * Get all vehicles with occupancy
 * GET /api/v1/admin/vehicles
 */
export const getVehicles = () => api.get('/admin/vehicles');

/**
 * Register a vehicle
 * POST /api/v1/admin/vehicles
 */
export const registerVehicle = (data) => api.post('/admin/vehicles', data);

/**
 * Update a vehicle
 * PUT /api/v1/admin/vehicles/:id
 */
export const updateVehicle = (id, data) => api.put(`/admin/vehicles/${id}`, data);

/**
 * Delete a vehicle
 * DELETE /api/v1/admin/vehicles/:id
 */
export const deleteVehicle = (id) => api.delete(`/admin/vehicles/${id}`);

/**
 * Update vehicle capacity
 * PATCH /api/v1/admin/vehicles/:id/capacity
 */
export const updateVehicleCapacity = (id, data) => api.patch(`/admin/vehicles/${id}/capacity`, data);

/**
 * Get vehicle with full details
 * GET /api/v1/admin/vehicles/:id
 */
export const getVehicleWithDetails = (id) => api.get(`/admin/vehicles/${id}`);

/**
 * Get fleet capacity summary
 * GET /api/v1/admin/fleet/capacity
 */
export const getFleetCapacity = () => api.get('/admin/fleet/capacity');

// ==================== VEHICLE TYPES ====================

/**
 * Get all vehicle types
 * GET /api/v1/admin/vehicle-types
 */
export const getVehicleTypes = () => api.get('/admin/vehicle-types');

/**
 * Create a vehicle type
 * POST /api/v1/admin/vehicle-types
 */
export const createVehicleType = (data) => api.post('/admin/vehicle-types', data);

/**
 * Update a vehicle type
 * PUT /api/v1/admin/vehicle-types/:id
 */
export const updateVehicleType = (id, data) => api.put(`/admin/vehicle-types/${id}`, data);

/**
 * Delete a vehicle type
 * DELETE /api/v1/admin/vehicle-types/:id
 */
export const deleteVehicleType = (id) => api.delete(`/admin/vehicle-types/${id}`);

// ==================== STATS & DASHBOARD ====================

/**
 * Get dashboard statistics
 * GET /api/v1/admin/stats
 */
export const getStats = () => api.get('/admin/stats');

// ==================== PENALTIES ====================

/**
 * Get all penalties (with filters)
 * GET /api/v1/admin/penalties
 */
export const getPenalties = (params) => api.get('/admin/penalties', { params });

/**
 * Update a penalty (mark as paid)
 * PATCH /api/v1/admin/penalties/:id
 */
export const updatePenalty = (id, data) => api.patch(`/admin/penalties/${id}`, data);