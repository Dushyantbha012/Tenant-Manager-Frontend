import api from './api';

/**
 * Property Service
 * API calls for property management
 */
const propertyService = {
    /**
     * Get all properties for authenticated user
     * @param {string} mode - View mode: 'owner', 'assistant', or 'all' (default)
     * @param {number|null} ownerId - Optional owner ID to filter by (for assistant mode)
     * @returns {Promise} Properties array
     */
    getAll: (mode = 'all', ownerId = null) => {
        const params = { mode };
        if (ownerId) params.ownerId = ownerId;
        return api.get('/api/properties', { params });
    },

    /**
     * Get property by ID
     * @param {number} id - Property ID
     * @returns {Promise} Property object
     */
    getById: (id) => api.get(`/api/properties/${id}`),

    /**
     * Create a new property
     * @param {Object} data - Property data (name, address, city, state, postalCode, country, totalFloors)
     * @returns {Promise} Created property
     */
    create: (data) => api.post('/api/properties', data),

    /**
     * Update property
     * @param {number} id - Property ID
     * @param {Object} data - Updated property data
     * @returns {Promise} Updated property
     */
    update: (id, data) => api.put(`/api/properties/${id}`, data),

    /**
     * Delete property (soft delete)
     * @param {number} id - Property ID
     * @returns {Promise} Deletion result
     */
    delete: (id) => api.delete(`/api/properties/${id}`),

    /**
     * Get all rooms in a property
     * @param {number} propertyId - Property ID
     * @returns {Promise} Rooms array
     */
    getRooms: (propertyId) => api.get(`/api/properties/${propertyId}/rooms`),

    /**
     * Get all tenants in a property
     * @param {number} propertyId - Property ID
     * @returns {Promise} Tenants array
     */
    getTenants: (propertyId) => api.get(`/api/properties/${propertyId}/tenants`),
};

export default propertyService;
