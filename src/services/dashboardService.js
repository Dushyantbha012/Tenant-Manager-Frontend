import api from './api';

/**
 * Dashboard Service
 */
const dashboardService = {
    /**
     * Get overall dashboard summary
     * @returns {Promise} API response with dashboard stats
     */
    getSummary: () => api.get('/api/dashboard/summary'),

    /**
     * Get property-specific summary
     * @param {number} propertyId - Property ID
     * @returns {Promise} API response with property stats
     */
    getPropertySummary: (propertyId) =>
        api.get(`/api/dashboard/summary/property/${propertyId}`),

    /**
     * Get rent collection trends
     * @param {number} months - Number of months (default: 6)
     * @returns {Promise} API response with trend data
     */
    getRentTrends: (months = 6) =>
        api.get('/api/dashboard/analytics/rent', { params: { months } }),

    /**
     * Get occupancy trends
     * @param {number} months - Number of months (default: 6)
     * @returns {Promise} API response with trend data
     */
    getOccupancyTrends: (months = 6) =>
        api.get('/api/dashboard/analytics/occupancy', { params: { months } }),
};

export default dashboardService;
