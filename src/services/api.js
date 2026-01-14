import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Axios instance with base configuration
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

/**
 * Request interceptor - Add auth token to requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 401:
                    // Unauthorized - Clear token and redirect to login
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);

                    // Only redirect if not already on auth pages
                    if (!window.location.pathname.includes('/login') &&
                        !window.location.pathname.includes('/signup')) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden - User doesn't have access
                    console.error('Access denied');
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;

                case 422:
                    // Validation errors - these will be handled by the component
                    break;

                case 500:
                    // Server error
                    console.error('Server error');
                    break;

                default:
                    console.error('An error occurred');
            }
        } else if (error.request) {
            // Network error
            console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
);

export default api;
