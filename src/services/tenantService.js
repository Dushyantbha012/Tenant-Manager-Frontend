import api from './api';

const tenantService = {
    // Get all tenants with optional filters
    getAllTenants: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.query) queryParams.append('query', filters.query);
        if (filters.propertyId) queryParams.append('propertyId', filters.propertyId);

        // If searching, use search endpoint, otherwise list
        const endpoint = filters.query ? '/api/tenants/search' : '/api/tenants';
        const response = await api.get(`${endpoint}?${queryParams.toString()}`);
        return response.data;
    },

    // Get tenant by ID
    getTenantById: async (id) => {
        const response = await api.get(`/api/tenants/${id}`);
        return response.data;
    },

    // Create new tenant (Move-in)
    createTenant: async (data) => {
        const response = await api.post('/api/tenants', data);
        return response.data;
    },

    // Update tenant
    updateTenant: async (id, data) => {
        const response = await api.put(`/api/tenants/${id}`, data);
        return response.data;
    },

    // Move out tenant (Delete)
    deleteTenant: async (id) => {
        const response = await api.delete(`/api/tenants/${id}`);
        return response.data;
    },

    // Update rent agreement
    updateAgreement: async (id, data) => {
        const response = await api.put(`/api/tenants/${id}/agreement`, data);
        return response.data;
    },

    // Get active tenant for a room
    getTenantByRoom: async (roomId) => {
        const response = await api.get(`/api/rooms/${roomId}/tenant`);
        return response.data;
    }
};

export default tenantService;
