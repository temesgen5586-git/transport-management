/**
 * Validation functions for user inputs
 */

/**
 * Validate Ethiopian phone number (format: 09XXXXXXXX)
 */
const isValidPhone = (phone) => {
    return /^09[0-9]{8}$/.test(phone);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate Ethiopian National ID (Fayda) – 10 to 12 digits
 */
const isValidNationalId = (id) => {
    return /^[0-9]{10,12}$/.test(id);
};

/**
 * Check if a value is a positive number
 */
const isPositiveNumber = (val) => {
    return typeof val === 'number' && val > 0;
};

/**
 * Check if a string is not empty and has a minimum length
 */
const isNonEmptyString = (val, minLength = 1) => {
    return typeof val === 'string' && val.trim().length >= minLength;
};

/**
 * Check if a value is a valid date string
 */
const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
};

module.exports = {
    isValidPhone,
    isValidEmail,
    isValidNationalId,
    isPositiveNumber,
    isNonEmptyString,
    isValidDate,
};