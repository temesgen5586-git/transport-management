// src/utils/validators.js
// Validation functions

/**
 * Validate Ethiopian phone number
 * Format: 09XXXXXXXX (10 digits starting with 09)
 */
export const isValidPhone = (phone) => {
    return /^09[0-9]{8}$/.test(phone);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate Ethiopian National ID (Fayda)
 * Format: 10-12 digits
 */
export const isValidNationalId = (id) => {
    return /^[0-9]{10,12}$/.test(id);
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
    return value !== null && value !== undefined && String(value).trim().length > 0;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
    return value && value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value, max) => {
    return value && value.length <= max;
};

/**
 * Validate password confirmation matches
 */
export const passwordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

/**
 * Validate a positive number
 */
export const isPositiveNumber = (value) => {
    return !isNaN(value) && parseFloat(value) > 0;
};

/**
 * Validate a number is within a range
 */
export const isInRange = (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate a date is not in the past
 */
export const isFutureDate = (date) => {
    return new Date(date) > new Date();
};

/**
 * Validate a date is not in the future
 */
export const isPastDate = (date) => {
    return new Date(date) < new Date();
};

/**
 * Validate a date is within operating hours (12:00 AM - 2:00 PM Ethiopian time)
 */
export const isWithinOperatingHours = (date) => {
    const d = new Date(date);
    const localTime = new Date(d.toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }));
    const hours = localTime.getHours();
    return hours >= 0 && hours <= 14;
};

/**
 * Validate a URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate a UUID
 */
export const isValidUuid = (uuid) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

/**
 * Validate seat number format (e.g., A12, B7)
 */
export const isValidSeatNumber = (seat) => {
    return /^[A-Z][0-9]{1,2}$/.test(seat);
};

/**
 * Validate plate number format (e.g., AA-12345)
 */
export const isValidPlateNumber = (plate) => {
    return /^[A-Z]{2}-[0-9]{3,5}$/.test(plate);
};

/**
 * Validate amount (positive number with 2 decimal places)
 */
export const isValidAmount = (amount) => {
    return /^[0-9]+(\.[0-9]{1,2})?$/.test(amount) && parseFloat(amount) > 0;
};

/**
 * Create a validation schema (composes multiple validators)
 */
export const createValidator = (validators, errorMessage) => {
    return (value) => {
        for (const validator of validators) {
            const result = validator(value);
            if (result !== true) {
                return result;
            }
        }
        return true;
    };
};

/**
 * Combine multiple validators into one
 */
export const composeValidators = (...validators) => {
    return (value) => {
        for (const validator of validators) {
            const result = validator(value);
            if (result !== true) {
                return result;
            }
        }
        return true;
    };
};

// Common validation rules
export const validators = {
    required: (message = 'This field is required') => (value) => {
        return isRequired(value) || message;
    },
    minLength: (min, message) => (value) => {
        return (value && value.length >= min) || message || `Minimum ${min} characters required`;
    },
    maxLength: (max, message) => (value) => {
        return (value && value.length <= max) || message || `Maximum ${max} characters allowed`;
    },
    email: (message = 'Invalid email format') => (value) => {
        return isValidEmail(value) || message;
    },
    phone: (message = 'Invalid phone number') => (value) => {
        return isValidPhone(value) || message;
    },
    nationalId: (message = 'Invalid National ID') => (value) => {
        return isValidNationalId(value) || message;
    },
    password: (message = 'Password must be at least 6 characters') => (value) => {
        return isValidPassword(value) || message;
    },
    positiveNumber: (message = 'Must be a positive number') => (value) => {
        return isPositiveNumber(value) || message;
    },
    amount: (message = 'Invalid amount') => (value) => {
        return isValidAmount(value) || message;
    },
    futureDate: (message = 'Date must be in the future') => (value) => {
        return isFutureDate(value) || message;
    },
    withinOperatingHours: (message = 'Must be between 12:00 AM and 2:00 PM Ethiopian time') => (value) => {
        return isWithinOperatingHours(value) || message;
    },
};