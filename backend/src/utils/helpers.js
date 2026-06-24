/**
 * Helper Functions for EthioTrans System
 * Common utilities for formatting, validation, and data manipulation
 */

/**
 * Format a date to Ethiopian local time string
 * @param {Date|string} date - Date object or string
 * @param {string} format - 'full', 'date', 'time', or 'short'
 * @returns {string} Formatted date string
 */
const formatDate = (date, format = 'full') => {
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
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, showSymbol = true) => {
    if (showSymbol) {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 2,
        }).format(amount);
    }
    return new Intl.NumberFormat('en-ET', {
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Generate a random 6-digit OTP
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} OTP as string
 */
const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
};

/**
 * Generate a random UUID (v4)
 * @returns {string} UUID string
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Check if a string is a valid UUID
 * @param {string} str - String to check
 * @returns {boolean} True if valid UUID
 */
const isValidUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

/**
 * Truncate a string to a given length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
const truncateText = (text, maxLength = 50, suffix = '...') => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
};

/**
 * Calculate the number of hours between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Hours between dates
 */
const hoursBetween = (date1, date2) => {
    return Math.abs(new Date(date1) - new Date(date2)) / 36e5;
};

/**
 * Calculate the number of minutes between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Minutes between dates
 */
const minutesBetween = (date1, date2) => {
    return Math.abs(new Date(date1) - new Date(date2)) / 60000;
};

/**
 * Generate a booking reference number (BRN)
 * @returns {string} Booking reference number
 */
const generateBookingRef = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BRN-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate a transaction reference number
 * @returns {string} Transaction reference
 */
const generateTransactionRef = () => {
    const prefix = 'TXN';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString(36).toUpperCase().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate a payment reference number
 * @param {string} gateway - Payment gateway name
 * @returns {string} Payment reference
 */
const generatePaymentRef = (gateway = 'TELEBIRR') => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString(36).toUpperCase().padStart(4, '0');
    return `${gateway}-${timestamp}-${random}`;
};

/**
 * Check if a value is a positive number
 * @param {any} val - Value to check
 * @returns {boolean} True if positive number
 */
const isPositiveNumber = (val) => {
    return typeof val === 'number' && val > 0;
};

/**
 * Parse a number safely (returns 0 if invalid)
 * @param {any} val - Value to parse
 * @returns {number} Parsed number
 */
const parseNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format a phone number to Ethiopian format
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
const formatPhone = (phone) => {
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
 * Mask sensitive data (e.g., email, phone)
 * @param {string} value - Value to mask
 * @param {string} type - 'email' or 'phone'
 * @returns {string} Masked value
 */
const maskData = (value, type = 'email') => {
    if (!value) return '';
    if (type === 'email') {
        const [local, domain] = value.split('@');
        if (local.length <= 2) return `${local[0]}***@${domain}`;
        return `${local.substring(0, 2)}***${local.substring(local.length - 2)}@${domain}`;
    }
    if (type === 'phone') {
        if (value.length <= 4) return '***' + value.slice(-2);
        return '***' + value.slice(-4);
    }
    return value;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Get the current Ethiopian timestamp
 * @returns {string} ISO string with Ethiopian timezone
 */
const getEthiopianTime = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Addis_Ababa',
    });
};

/**
 * Convert a decimal to percentage
 * @param {number} num - Decimal number
 * @param {number} decimals - Number of decimal places
 * @returns {string} Percentage string
 */
const toPercent = (num, decimals = 0) => {
    return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Generate a random alphanumeric string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const randomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * ================================================================
 * 🕒 ETHIOPIAN TRANSPORT OPERATING HOURS CHECK
 * ================================================================
 * Check if a given date/time is between 12:00 AM and 2:00 PM (Addis Ababa time)
 * @param {string|Date} date - Date object or ISO string
 * @returns {boolean} true if within operating hours
 */
const isWithinOperatingHours = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    // Convert to Addis Ababa time
    const localTime = new Date(d.toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' }));
    const hours = localTime.getHours();
    // Operating window: 00:00 (midnight) to 14:00 (2:00 PM)
    // 14:00 is inclusive – trips at exactly 14:00 are allowed.
    // Trips after 14:00 are rejected.
    return hours >= 0 && hours <= 14;
};

module.exports = {
    formatDate,
    formatCurrency,
    generateOTP,
    generateUUID,
    isValidUUID,
    truncateText,
    hoursBetween,
    minutesBetween,
    generateBookingRef,
    generateTransactionRef,
    generatePaymentRef,
    isPositiveNumber,
    parseNumber,
    capitalize,
    formatPhone,
    maskData,
    isEmpty,
    getEthiopianTime,
    toPercent,
    randomString,
    isWithinOperatingHours,
};