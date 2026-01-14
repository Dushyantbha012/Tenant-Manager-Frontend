import api from './api';

/**
 * Floor Service
 * API calls for floor management
 */
const floorService = {
    /**
     * Get all floors for a property
     * @param {number} propertyId - Property ID
     * @returns {Promise} Floors array
     */
    getByPropertyId: (propertyId) => api.get(`/api/properties/${propertyId}/floors`),

    /**
     * Get floor by ID
     * @param {number} floorId - Floor ID
     * @returns {Promise} Floor object
     */
    getById: (floorId) => api.get(`/api/floors/${floorId}`),

    /**
     * Add a floor to a property
     * @param {number} propertyId - Property ID
     * @param {Object} data - Floor data (floorNumber, floorName)
     * @returns {Promise} Created floor
     */
    create: (propertyId, data) => api.post(`/api/properties/${propertyId}/floors`, data),

    /**
     * Update floor
     * @param {number} id - Floor ID
     * @param {Object} data - Updated floor data
     * @returns {Promise} Updated floor
     */
    update: (id, data) => api.put(`/api/floors/${id}`, data),

    /**
     * Delete floor (soft delete)
     * @param {number} id - Floor ID
     * @returns {Promise} Deletion result
     */
    delete: (id) => api.delete(`/api/floors/${id}`),

    /**
     * Bulk create multiple floors
     * @param {Object} data - { propertyId, floors: [{ floorNumber, floorName }, ...] }
     * @returns {Promise} Created floors array
     */
    bulkCreate: (data) => api.post('/api/floors/bulk', data),
};

export default floorService;
