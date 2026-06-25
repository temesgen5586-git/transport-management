// src/utils/storage.js
// Local storage helpers

/**
 * Set an item in localStorage
 */
export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
};

/**
 * Get an item from localStorage
 */
export const getItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
};

/**
 * Remove an item from localStorage
 */
export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
    }
};

/**
 * Clear all items from localStorage (with optional exclusions)
 */
export const clearStorage = (excludeKeys = []) => {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (!excludeKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

/**
 * Check if an item exists in localStorage
 */
export const hasItem = (key) => {
    try {
        return localStorage.getItem(key) !== null;
    } catch (error) {
        return false;
    }
};

/**
 * Get all localStorage keys
 */
export const getAllKeys = () => {
    try {
        return Object.keys(localStorage);
    } catch (error) {
        return [];
    }
};

/**
 * Get all items from localStorage as an object
 */
export const getAllItems = () => {
    try {
        const items = {};
        Object.keys(localStorage).forEach(key => {
            items[key] = getItem(key);
        });
        return items;
    } catch (error) {
        return {};
    }
};

/**
 * Set a session item
 */
export const setSessionItem = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to sessionStorage (${key}):`, error);
    }
};

/**
 * Get a session item
 */
export const getSessionItem = (key, defaultValue = null) => {
    try {
        const item = sessionStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        return defaultValue;
    }
};

/**
 * Remove a session item
 */
export const removeSessionItem = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from sessionStorage (${key}):`, error);
    }
};

/**
 * Clear all sessionStorage
 */
export const clearSession = () => {
    try {
        sessionStorage.clear();
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
};

// Auth specific helpers
export const storage = {
    // Auth token
    getToken: () => getItem('token'),
    setToken: (token) => setItem('token', token),
    removeToken: () => removeItem('token'),

    // User data
    getUser: () => getItem('user'),
    setUser: (user) => setItem('user', user),
    removeUser: () => removeItem('user'),

    // Theme
    getTheme: () => getItem('theme', 'light'),
    setTheme: (theme) => setItem('theme', theme),

    // Clear all auth data
    clearAuth: () => {
        removeItem('token');
        removeItem('user');
        removeItem('refreshToken');
    },

    // Clear all data
    clearAll: () => {
        clearStorage(['theme']);
    },
};

export default storage;