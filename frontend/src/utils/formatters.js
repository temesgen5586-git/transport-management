// src/utils/formatters.js
// Display formatters for currency, dates, etc.

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
 * Format a date to a relative time string (e.g., "2 hours ago")
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
 * Format a number with commas
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a percentage
 */
export const formatPercent = (value, decimals = 1) => {
    return `${(parseFloat(value) || 0).toFixed(decimals)}%`;
};

/**
 * Format a duration in minutes to hours and minutes
 */
export const formatDuration = (minutes) => {
    const mins = parseInt(minutes) || 0;
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format a distance in kilometers
 */
export const formatDistance = (km) => {
    return `${parseFloat(km || 0).toFixed(1)} km`;
};

/**
 * Format a file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Mask sensitive data (e.g., email, phone)
 */
export const maskData = (value, type = 'email') => {
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
    if (type === 'card') {
        return '****' + value.slice(-4);
    }
    if (type === 'national_id') {
        if (value.length <= 4) return '***' + value.slice(-2);
        return '***' + value.slice(-4);
    }
    return value;
};

/**
 * Get status badge class based on status and type
 */
export const getStatusBadgeClass = (status, type = 'default') => {
    const classes = {
        trip: {
            scheduled: 'badge-info',
            boarding: 'badge-warning',
            departed: 'badge-warning',
            en_route: 'badge-warning',
            emergency: 'badge-danger',
            completed: 'badge-success',
            cancelled: 'badge-gray',
        },
        booking: {
            confirmed: 'badge-success',
            checked_in: 'badge-info',
            cancelled: 'badge-danger',
            no_show: 'badge-gray',
            completed: 'badge-success',
        },
        payment: {
            pending: 'badge-warning',
            paid: 'badge-success',
            refunded: 'badge-info',
            failed: 'badge-danger',
        },
        penalty: {
            overcapacity: 'badge-danger',
            delay: 'badge-warning',
            traffic_violation: 'badge-info',
        },
        freight: {
            pending: 'badge-warning',
            assigned: 'badge-info',
            in_transit: 'badge-info',
            delivered: 'badge-success',
            customs_hold: 'badge-danger',
        },
        default: {
            active: 'badge-success',
            inactive: 'badge-gray',
            pending: 'badge-warning',
            completed: 'badge-success',
            cancelled: 'badge-danger',
        },
    };

    const statusMap = classes[type] || classes.default;
    return statusMap[status] || 'badge-gray';
};