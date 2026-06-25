// src/utils/apiHelpers.js
// API response helpers

/**
 * Extract data from API response
 */
export const extractData = (response) => {
    if (response?.data?.data) {
        return response.data.data;
    }
    if (response?.data) {
        return response.data;
    }
    return response;
};

/**
 * Extract pagination from API response
 */
export const extractPagination = (response) => {
    if (response?.data?.pagination) {
        return response.data.pagination;
    }
    return null;
};

/**
 * Check if API response is successful
 */
export const isSuccess = (response) => {
    return response?.data?.success !== false;
};

/**
 * Get error message from API error
 */
export const getErrorMessage = (error) => {
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

/**
 * Get status code from API error
 */
export const getErrorStatus = (error) => {
    return error?.response?.status || 500;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
    return error?.code === 'ERR_NETWORK' || !error?.response;
};

/**
 * Check if error is a 401 Unauthorized
 */
export const isUnauthorized = (error) => {
    return error?.response?.status === 401;
};

/**
 * Check if error is a 403 Forbidden
 */
export const isForbidden = (error) => {
    return error?.response?.status === 403;
};

/**
 * Check if error is a 404 Not Found
 */
export const isNotFound = (error) => {
    return error?.response?.status === 404;
};

/**
 * Check if error is a 409 Conflict
 */
export const isConflict = (error) => {
    return error?.response?.status === 409;
};

/**
 * Check if error is a 422 Validation Error
 */
export const isValidationError = (error) => {
    return error?.response?.status === 422;
};

/**
 * Create a success response object
 */
export const createSuccessResponse = (data, message = null) => {
    return {
        success: true,
        data,
        message,
    };
};

/**
 * Create an error response object
 */
export const createErrorResponse = (error, message = null) => {
    return {
        success: false,
        error: error || message,
        message: message || error,
    };
};

/**
 * Extract validation errors from API response
 */
export const extractValidationErrors = (error) => {
    if (error?.response?.data?.errors) {
        return error.response.data.errors;
    }
    if (error?.response?.data?.error) {
        return { general: error.response.data.error };
    }
    return {};
};

/**
 * Format API query parameters
 */
export const buildQueryParams = (params) => {
    const filtered = Object.entries(params || {})
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return new URLSearchParams(filtered).toString();
};