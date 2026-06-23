

// // ==================== 🆕 GET USERS (With Role Filter) ====================

// /**
//  * Get all users (optional role filter)
//  * GET /api/v1/admin/users
//  * Access: super_admin, dispatcher
//  */
// exports.getUsers = catchAsync(async (req, res, next) => {
//     const { role } = req.query;
//     let query = 'SELECT id, national_id, full_name, phone, email, role, is_verified, wallet_balance, created_at FROM users';
//     const params = [];

//     if (role) {
//         query += ' WHERE role = ?';
//         params.push(role);
//     }

//     query += ' ORDER BY created_at DESC';

//     const [rows] = await pool.execute(query, params);
//     res.status(200).json({ success: true, data: rows });
// });




const { pool } = require('../config/db');
const { logAction } = require('../services/auditService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const { isValidPhone, isValidEmail, isValidNationalId } = require('../utils/validators');
const { ROLES } = require('../utils/constants');

// ==================== CITIES ====================

exports.addCity = catchAsync(async (req, res, next) => {
    const { name, region, latitude, longitude } = req.body;
    if (!name || !region || !latitude || !longitude) {
        return next(new AppError('name, region, latitude, longitude are required', 400));
    }

    const [result] = await pool.execute(`
        INSERT INTO cities (name, region, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `, [name, region, latitude, longitude]);

    await logAction(req.user.id, 'CITY_CREATED', 'CITY', result.insertId, null, { name, region }, req);

    const [rows] = await pool.execute('SELECT * FROM cities WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
});

exports.getCities = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute('SELECT * FROM cities ORDER BY name');
    res.status(200).json({ success: true, data: rows });
});

exports.updateCity = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, region, latitude, longitude } = req.body;

    await pool.execute(
        'UPDATE cities SET name = ?, region = ?, latitude = ?, longitude = ? WHERE id = ?',
        [name, region, latitude, longitude, id]
    );
    await logAction(req.user.id, 'CITY_UPDATED', 'CITY', id, null, { name, region, latitude, longitude }, req);
    res.status(200).json({ success: true, message: 'City updated' });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await pool.execute('DELETE FROM cities WHERE id = ?', [id]);
    await logAction(req.user.id, 'CITY_DELETED', 'CITY', id, null, null, req);
    res.status(200).json({ success: true, message: 'City deleted' });
});

// ==================== ROUTES ====================

exports.createRoute = catchAsync(async (req, res, next) => {
    const { origin_city_id, destination_city_id, distance_km, base_duration_mins } = req.body;
    if (!origin_city_id || !destination_city_id || !distance_km || !base_duration_mins) {
        return next(new AppError('All fields are required', 400));
    }

    const [result] = await pool.execute(`
        INSERT INTO routes (origin_city_id, destination_city_id, distance_km, base_duration_mins)
        VALUES (?, ?, ?, ?)
    `, [origin_city_id, destination_city_id, distance_km, base_duration_mins]);

    await logAction(req.user.id, 'ROUTE_CREATED', 'ROUTE', result.insertId, null, req.body, req);

    const [rows] = await pool.execute('SELECT * FROM routes WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
});

exports.getRoutes = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(`
        SELECT r.*, c1.name AS origin, c2.name AS destination
        FROM routes r
        JOIN cities c1 ON r.origin_city_id = c1.id
        JOIN cities c2 ON r.destination_city_id = c2.id
        ORDER BY r.id
    `);
    res.status(200).json({ success: true, data: rows });
});

exports.updateRoute = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { distance_km, base_duration_mins, is_active } = req.body;

    await pool.execute(
        'UPDATE routes SET distance_km = ?, base_duration_mins = ?, is_active = ? WHERE id = ?',
        [distance_km, base_duration_mins, is_active, id]
    );
    await logAction(req.user.id, 'ROUTE_UPDATED', 'ROUTE', id, null, req.body, req);
    res.status(200).json({ success: true, message: 'Route updated' });
});

exports.deleteRoute = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await pool.execute('DELETE FROM routes WHERE id = ?', [id]);
    await logAction(req.user.id, 'ROUTE_DELETED', 'ROUTE', id, null, null, req);
    res.status(200).json({ success: true, message: 'Route deleted' });
});

// ==================== VEHICLES ====================

exports.registerVehicle = catchAsync(async (req, res, next) => {
    const { plate_number, vehicle_type_id, model, year_made } = req.body;
    if (!plate_number || !vehicle_type_id) {
        return next(new AppError('plate_number and vehicle_type_id are required', 400));
    }

    const [result] = await pool.execute(`
        INSERT INTO vehicles (plate_number, vehicle_type_id, model, year_made)
        VALUES (?, ?, ?, ?)
    `, [plate_number, vehicle_type_id, model, year_made]);

    await logAction(req.user.id, 'VEHICLE_REGISTERED', 'VEHICLE', result.insertId, null, req.body, req);

    const [rows] = await pool.execute('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
});

exports.getVehicles = catchAsync(async (req, res, next) => {
    const [rows] = await pool.execute(`
        SELECT v.*, vt.name AS vehicle_type
        FROM vehicles v
        JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        ORDER BY v.created_at DESC
    `);
    res.status(200).json({ success: true, data: rows });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { model, year_made, maintenance_status, is_active } = req.body;

    await pool.execute(
        'UPDATE vehicles SET model = ?, year_made = ?, maintenance_status = ?, is_active = ? WHERE id = ?',
        [model, year_made, maintenance_status, is_active, id]
    );
    await logAction(req.user.id, 'VEHICLE_UPDATED', 'VEHICLE', id, null, req.body, req);
    res.status(200).json({ success: true, message: 'Vehicle updated' });
});

exports.deleteVehicle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await pool.execute('DELETE FROM vehicles WHERE id = ?', [id]);
    await logAction(req.user.id, 'VEHICLE_DELETED', 'VEHICLE', id, null, null, req);
    res.status(200).json({ success: true, message: 'Vehicle deleted' });
});

// ==================== DASHBOARD STATS ====================

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const [stats] = await pool.execute(`
        SELECT
            (SELECT COUNT(*) FROM trips WHERE status = 'scheduled') AS scheduled_trips,
            (SELECT COUNT(*) FROM trips WHERE status IN ('departed', 'en_route')) AS active_trips,
            (SELECT COUNT(*) FROM users WHERE role = 'driver') AS total_drivers,
            (SELECT COALESCE(SUM(price), 0) FROM bookings WHERE payment_status = 'paid') AS total_revenue,
            (SELECT COUNT(*) FROM vehicles WHERE maintenance_status = 'service_due') AS vehicles_needing_service
    `);
    res.status(200).json({ success: true, data: stats[0] });
});

// ==================== ADMIN USER MANAGEMENT ====================

/**
 * Get all users (optional role filter)
 * GET /api/v1/admin/users
 * Access: super_admin, dispatcher
 */
exports.getUsers = catchAsync(async (req, res, next) => {
    const { role } = req.query;
    let query = 'SELECT id, national_id, full_name, phone, email, role, is_verified, wallet_balance, created_at FROM users';
    const params = [];

    if (role) {
        query += ' WHERE role = ?';
        params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    res.status(200).json({ success: true, data: rows });
});

/**
 * Admin creates a user with any role.
 * POST /api/v1/admin/users
 * Access: super_admin, dispatcher
 * 
 * 🛡️ ENFORCES: Only ONE super_admin allowed in the entire system.
 */
exports.createUserByAdmin = catchAsync(async (req, res, next) => {
    const { national_id, full_name, phone, email, password, role } = req.body;

    // Validate required fields
    if (!national_id || !full_name || !phone || !password || !role) {
        return next(new AppError('Missing required fields: national_id, full_name, phone, password, role', 400));
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
        return next(new AppError(`Invalid role. Allowed: ${Object.values(ROLES).join(', ')}`, 400));
    }

    // ================================================================
    // 🛡️ NEW CHECK: Only ONE super_admin allowed in the entire system
    // ================================================================
    if (role === 'super_admin') {
        const [existingAdmin] = await pool.execute(
            'SELECT id FROM users WHERE role = ?',
            ['super_admin']
        );
        if (existingAdmin.length > 0) {
            return next(new AppError('A super admin already exists. Only one super admin is allowed.', 409));
        }
    }

    // Validate phone, national_id, email
    if (!isValidNationalId(national_id)) {
        return next(new AppError('Invalid National ID format. Must be 10-12 digits.', 400));
    }
    if (!isValidPhone(phone)) {
        return next(new AppError('Invalid phone number. Must be 09XXXXXXXX', 400));
    }
    if (email && !isValidEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    // Check if user already exists
    const [existing] = await pool.execute(
        'SELECT id FROM users WHERE national_id = ? OR phone = ?',
        [national_id, phone]
    );
    if (existing.length > 0) {
        return next(new AppError('User with this National ID or Phone already exists.', 409));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user with explicit UUID
    await pool.execute(`
        INSERT INTO users (id, national_id, full_name, phone, email, password_hash, role, is_verified, wallet_balance)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)
    `, [national_id, full_name, phone, email || null, hashedPassword, role, false, 0]);

    // Fetch the new user
    const [userRows] = await pool.execute(
        'SELECT id, full_name, role, wallet_balance FROM users WHERE phone = ?',
        [phone]
    );

    if (userRows.length === 0) {
        return next(new AppError('User created but could not be retrieved.', 500));
    }

    const user = userRows[0];

    // Audit log
    await logAction(req.user.id, 'ADMIN_CREATED_USER', 'USER', user.id, null, { role, created_by: req.user.id }, req);

    res.status(201).json({
        success: true,
        message: `User created successfully with role: ${role}`,
        data: { user }
    });
});