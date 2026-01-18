import api from './api';

const assistantService = {
    // === Property Level (Permissions) ===

    /**
     * Get assistants with access to a property
     * @param {number} propertyId
     */
    getPropertyAssistants: (propertyId) => {
        return api.get(`/api/properties/${propertyId}/assistants`);
    },

    /**
     * Grant property access to an assistant
     * @param {number} propertyId
     * @param {string} email
     * @param {Array<string>} permissions
     */
    grantAccess: (propertyId, email, permissions) => {
        return api.post(`/api/properties/${propertyId}/assistants`, { email, permissions });
    },

    /**
     * Update assistant permissions for a property
     * @param {number} propertyId
     * @param {number} userId
     * @param {Array<string>} permissions
     */
    updatePermissions: (propertyId, userId, permissions) => {
        return api.put(`/api/properties/${propertyId}/assistants/${userId}`, { permissions });
    },

    /**
     * Revoke property access
     * @param {number} propertyId
     * @param {number} userId
     */
    revokeAccess: (propertyId, userId) => {
        return api.delete(`/api/properties/${propertyId}/assistants/${userId}`);
    },

    // === User Level (My Assistants) ===

    /**
     * Get all assistants linked to the user
     */
    getMyAssistants: () => {
        return api.get('/api/users/assistants');
    },

    /**
     * Add a user as an assistant
     * @param {string} email
     */
    addAssistant: (email) => {
        return api.post('/api/users/assistants', { email });
    },

    /**
     * Remove a user from assistants list
     * @param {number} assistantId
     */
    removeAssistant: (assistantId) => {
        return api.delete(`/api/users/assistants/${assistantId}`);
    },
};

export default assistantService;
