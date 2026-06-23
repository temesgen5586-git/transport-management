const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in. Please log in.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const [rows] = await pool.execute(
        'SELECT id, national_id, full_name, phone, email, role, wallet_balance FROM users WHERE id = ?',
        [decoded.id]
    );
    if (rows.length === 0) {
        return next(new AppError('The user no longer exists.', 401));
    }
    req.user = rows[0];
    next();
});