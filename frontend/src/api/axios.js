import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor – add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor – handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login (if in browser)
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            toast.error('Your session has expired. Please login again.');
        }
        // Handle 403 Forbidden
        else if (error.response?.status === 403) {
            toast.error('You do not have permission to perform this action.');
        }
        // Handle 404 Not Found
        else if (error.response?.status === 404) {
            // Don't show toast for 404, let individual handlers manage it
        }
        // Handle 500 Internal Server Error
        else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        }
        // Handle network errors
        else if (error.code === 'ERR_NETWORK') {
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

export default api;