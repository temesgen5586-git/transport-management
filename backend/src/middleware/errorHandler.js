const AppError = require('../utils/appError');

/**
 * Send error response in development environment (includes stack trace).
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message,
        stack: err.stack,
        status: err.status,
    });
};

/**
 * Send error response in production environment (no stack trace).
 */
const sendErrorProd = (err, res) => {
    // Operational errors: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    } else {
        // Programming or unknown errors: don't leak details to client
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            error: 'Something went very wrong!',
        });
    }
};

/**
 * Global error handler middleware.
 * This catches ALL errors and formats them properly.
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error to console for debugging
    console.error('❌ Error:', err.message);
    console.error('📍 Path:', req.path);
    console.error('👤 User:', req.user?.id || 'Anonymous');

    // Handle specific error types
    let error = { ...err };
    error.message = err.message;

    // MySQL duplicate entry error (ER_DUP_ENTRY)
    if (err.code === 'ER_DUP_ENTRY') {
        const field = err.message.match(/Duplicate entry '(.+)' for key '(.+)'/);
        const key = field ? field[2] : 'field';
        error = new AppError(`Duplicate value for ${key}. Please use a unique value.`, 409);
    }

    // MySQL foreign key constraint error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        error = new AppError('Referenced record does not exist. Please check your input.', 400);
    }

    // MySQL invalid UUID format
    if (err.code === 'ER_INVALID_JSON') {
        error = new AppError('Invalid JSON format.', 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token. Please log in again.', 401);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError('Your token has expired. Please log in again.', 401);
    }

    // Send appropriate response
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
};

/**
 * Catch-all for unhandled promise rejections.
 * This should be attached to the process globally.
 */
const handleUnhandledRejection = (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
};

/**
 * Catch-all for unhandled exceptions.
 * This should be attached to the process globally.
 */
const handleUncaughtException = (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
};

// Attach global handlers (if not already attached)
process.on('unhandledRejection', handleUnhandledRejection);
process.on('uncaughtException', handleUncaughtException);

module.exports = {
    globalErrorHandler,
    handleUnhandledRejection,
    handleUncaughtException,
};