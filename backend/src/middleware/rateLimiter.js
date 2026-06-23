/**
 * Simple in-memory rate limiter (for development).
 * For production, use Redis-based rate limiting.
 */
const rateLimit = require('express-rate-limit');

// Simple rate limiter: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Stricter limiter for sensitive endpoints (e.g., auth)
 * 5 requests per minute
 */
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: {
        success: false,
        error: 'Too many attempts, please try again after 1 minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    limiter,
    authLimiter,
};