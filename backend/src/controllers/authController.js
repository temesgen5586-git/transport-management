const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isValidPhone, isValidEmail, isValidNationalId } = require('../utils/validators');
const { logAction } = require('../services/auditService');
const { ROLES } = require('../utils/constants');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRY || '90d' });

/**
 * Register a new user (Public)
 * Always creates a 'customer' role.
 * POST /api/v1/auth/register
 */
exports.register = catchAsync(async (req, res, next) => {
    // ✅ Role is forced to 'customer' – ignore any role sent in request
    const { national_id, full_name, phone, email, password } = req.body;
    const role = 'customer';

    // Validate inputs
    if (!national_id || !full_name || !phone || !password) {
        return next(new AppError('Missing required fields: national_id, full_name, phone, password', 400));
    }
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

    // Insert user with explicit UUID and role = 'customer'
    await pool.execute(`
        INSERT INTO users (id, national_id, full_name, phone, email, password_hash, role, is_verified, wallet_balance)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)
    `, [national_id, full_name, phone, email || null, hashedPassword, role, false, 0]);

    // Fetch the newly created user
    const [userRows] = await pool.execute(
        'SELECT id, full_name, role, wallet_balance FROM users WHERE phone = ?',
        [phone]
    );

    if (userRows.length === 0) {
        return next(new AppError('User created but could not be retrieved. Please try again.', 500));
    }

    const user = userRows[0];

    // Audit log
    await logAction(user.id, 'USER_REGISTERED', 'USER', user.id, null, { role }, req);

    // Generate JWT
    const token = signToken(user.id);

    res.status(201).json({
        success: true,
        token,
        data: { user }
    });
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
exports.login = catchAsync(async (req, res, next) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return next(new AppError('Please provide phone and password.', 400));
    }

    const [rows] = await pool.execute(
        'SELECT id, full_name, password_hash, role, wallet_balance, is_verified FROM users WHERE phone = ?',
        [phone]
    );
    if (rows.length === 0) {
        return next(new AppError('Incorrect phone or password.', 401));
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return next(new AppError('Incorrect phone or password.', 401));
    }

    // Audit log
    await logAction(user.id, 'USER_LOGIN', 'USER', user.id, null, { login_time: new Date() }, req);

    const token = signToken(user.id);
    res.status(200).json({
        success: true,
        token,
        data: {
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role,
                wallet_balance: parseFloat(user.wallet_balance),
                is_verified: user.is_verified
            }
        }
    });
});

/**
 * Get current user profile
 * GET /api/v1/auth/me
 */
exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: { user: req.user }
    });
});