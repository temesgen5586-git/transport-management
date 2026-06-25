// src/utils/errorHandlers.js
// Error handling utilities

import toast from 'react-hot-toast';
import { getErrorMessage, isNetworkError, isUnauthorized } from './apiHelpers';

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
    const message = getErrorMessage(error);
    const isNetwork = isNetworkError(error);

    if (isNetwork) {
        toast.error('Network error. Please check your connection.');
        return;
    }

    if (isUnauthorized(error)) {
        toast.error('Your session has expired. Please login again.');
        // Redirect to login can be handled here or in the interceptor
        return;
    }

    toast.error(message || fallbackMessage);
};

/**
 * Handle form validation errors
 */
export const handleFormErrors = (error, setErrors) => {
    const errors = error?.response?.data?.errors || {};
    if (setErrors && typeof setErrors === 'function') {
        setErrors(errors);
    }
    toast.error(error?.response?.data?.message || 'Please check your input and try again.');
};

/**
 * Handle 404 Not Found errors
 */
export const handleNotFound = (error, resource = 'Resource') => {
    if (error?.response?.status === 404) {
        toast.error(`${resource} not found.`);
        return true;
    }
    return false;
};

/**
 * Handle 409 Conflict errors (duplicate entries)
 */
export const handleConflict = (error, message = 'Record already exists') => {
    if (error?.response?.status === 409) {
        toast.error(message);
        return true;
    }
    return false;
};

/**
 * Handle 422 Validation errors
 */
export const handleValidation = (error, setErrors) => {
    if (error?.response?.status === 422) {
        const errors = error?.response?.data?.errors || {};
        if (setErrors && typeof setErrors === 'function') {
            setErrors(errors);
        }
        toast.error('Please fix the validation errors.');
        return true;
    }
    return false;
};

/**
 * Handle 500 Internal Server errors
 */
export const handleServerError = (error) => {
    if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.');
        return true;
    }
    return false;
};

/**
 * Handle all errors with a unified approach
 */
export const handleError = (error, options = {}) => {
    const {
        setErrors = null,
        fallbackMessage = 'Something went wrong',
        resource = 'Resource',
        onUnauthorized = null,
        onNotFound = null,
        onConflict = null,
        onValidation = null,
        onServerError = null,
    } = options;

    if (isNetworkError(error)) {
        toast.error('Network error. Please check your connection.');
        return;
    }

    if (isUnauthorized(error)) {
        toast.error('Your session has expired. Please login again.');
        if (onUnauthorized) onUnauthorized();
        return;
    }

    if (error?.response?.status === 404) {
        toast.error(`${resource} not found.`);
        if (onNotFound) onNotFound();
        return;
    }

    if (error?.response?.status === 409) {
        toast.error('Record already exists.');
        if (onConflict) onConflict();
        return;
    }

    if (error?.response?.status === 422) {
        const errors = error?.response?.data?.errors || {};
        if (setErrors && typeof setErrors === 'function') {
            setErrors(errors);
        }
        toast.error('Please fix the validation errors.');
        if (onValidation) onValidation();
        return;
    }

    if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.');
        if (onServerError) onServerError();
        return;
    }

    toast.error(getErrorMessage(error) || fallbackMessage);
};

/**
 * Safe async wrapper with error handling
 */
export const safeAsync = async (fn, options = {}) => {
    const { fallbackMessage = 'Operation failed', onError = null } = options;
    try {
        return await fn();
    } catch (error) {
        handleApiError(error, fallbackMessage);
        if (onError) onError(error);
        return null;
    }
};

/**
 * Create a safe version of an async function
 */
export const makeSafe = (fn, options = {}) => {
    return async (...args) => {
        return safeAsync(() => fn(...args), options);
    };
};