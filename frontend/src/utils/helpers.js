// src/utils/helpers.js
// General helper functions

/**
 * Format a date to Ethiopian local time string
 */
export const formatDate = (date, format = 'full') => {
    const d = new Date(date);
    const options = {
        timeZone: 'Africa/Addis_Ababa',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    if (format === 'date') {
        delete options.hour;
        delete options.minute;
    }
    if (format === 'time') {
        return d.toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    if (format === 'short') {
        return d.toLocaleString('en-ET', {
            timeZone: 'Africa/Addis_Ababa',
            month: 'short',
            day: 'numeric',
        });
    }

    return d.toLocaleString('en-ET', options);
};

/**
 * Format currency in Ethiopian Birr (ETB)
 */
export const formatCurrency = (amount, showSymbol = true) => {
    const num = parseFloat(amount) || 0;
    if (showSymbol) {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    }
    return new Intl.NumberFormat('en-ET', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

/**
 * Format a number with commas
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a phone number to Ethiopian format
 */
export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    if (cleaned.length === 9) {
        return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5)}`;
    }
    return phone;
};

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Check if a string is a valid UUID
 */
export const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

/**
 * Generate a random UUID (v4)
 */
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Generate a random OTP
 */
export const generateOTP = (length = 6) => {
    return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();
};

/**
 * Generate a booking reference number (BRN)
 */
export const generateBookingRef = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BRN-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Get the current Ethiopian timestamp
 */
export const getEthiopianTime = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Addis_Ababa',
    });
};

/**
 * Parse a number safely (returns 0 if invalid)
 */
export const parseNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
};

/**
 * Check if a value is a positive number
 */
export const isPositiveNumber = (val) => {
    return typeof val === 'number' && val > 0;
};