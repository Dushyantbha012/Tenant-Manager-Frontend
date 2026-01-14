import api from './api';

/**
 * Authentication Service
 */
const authService = {
    /**
     * Register a new user
     * @param {object} data - Signup data { email, password, fullName, phone?, userType? }
     * @returns {Promise} API response
     */
    signup: (data) => api.post('/api/auth/signup', data),

    /**
     * Login user
     * @param {object} data - Login data { email, password }
     * @returns {Promise} API response with JWT token
     */
    login: (data) => api.post('/api/auth/login', data),

    /**
     * Logout user
     * @returns {Promise} API response
     */
    logout: () => api.post('/api/auth/logout'),

    /**
     * Get Google OAuth URL
     * @returns {string} OAuth authorization URL
     */
    getGoogleOAuthUrl: () => `${api.defaults.baseURL}/oauth2/authorization/google`,

    /**
     * Get current user profile
     * @returns {Promise} API response with user data
     */
    getProfile: () => api.get('/api/users/me'),

    /**
     * Update user profile
     * @param {object} data - Profile data { fullName?, phone? }
     * @returns {Promise} API response
     */
    updateProfile: (data) => api.put('/api/users/me', data),

    /**
     * Change password
     * @param {object} data - Password data { currentPassword, newPassword }
     * @returns {Promise} API response
     */
    changePassword: (data) => api.put('/api/users/me/password', data),
};

export default authService;
