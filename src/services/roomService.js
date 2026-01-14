import api from './api';

/**
 * Room Service
 * API calls for room management
 */
const roomService = {
    /**
     * Get all rooms on a floor
     * @param {number} floorId - Floor ID
     * @returns {Promise} Rooms array
     */
    getByFloorId: (floorId) => api.get(`/api/floors/${floorId}/rooms`),

    /**
     * Get available rooms on a floor
     * @param {number} floorId - Floor ID
     * @returns {Promise} Available rooms array
     */
    getAvailable: (floorId) => api.get(`/api/floors/${floorId}/rooms/available`),

    /**
     * Get room by ID
     * @param {number} roomId - Room ID
     * @returns {Promise} Room object
     */
    getById: (roomId) => api.get(`/api/rooms/${roomId}`),

    /**
     * Add a room to a floor
     * @param {number} floorId - Floor ID
     * @param {Object} data - Room data (roomNumber, roomType, sizeSqft)
     * @returns {Promise} Created room
     */
    create: (floorId, data) => api.post(`/api/floors/${floorId}/rooms`, data),

    /**
     * Update room
     * @param {number} id - Room ID
     * @param {Object} data - Updated room data
     * @returns {Promise} Updated room
     */
    update: (id, data) => api.put(`/api/rooms/${id}`, data),

    /**
     * Delete room (soft delete)
     * @param {number} id - Room ID
     * @returns {Promise} Deletion result
     */
    delete: (id) => api.delete(`/api/rooms/${id}`),

    /**
     * Get all vacant rooms
     * @returns {Promise} Vacant rooms array
     */
    getVacant: () => api.get('/api/rooms/vacant'),

    /**
     * Bulk create multiple rooms
     * @param {Object} data - { floorId, rooms: [{ roomNumber, roomType, sizeSqft }, ...] }
     * @returns {Promise} Created rooms array
     */
    bulkCreate: (data) => api.post('/api/rooms/bulk', data),
};

export default roomService;
