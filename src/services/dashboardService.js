import api from './api';

export const dashboardService = {
    // Get overall dashboard summary
    getSummary: async () => {
        try {
            const response = await api.get('/api/dashboard/summary');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get property-specific summary
    getPropertySummary: async (propertyId) => {
        try {
            const response = await api.get(`/api/dashboard/summary/property/${propertyId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get rent collection trends
    getRentTrends: async (months = 6) => {
        try {
            const response = await api.get('/api/dashboard/analytics/rent', { params: { months } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get occupancy trends
    getOccupancyTrends: async (months = 6) => {
        try {
            const response = await api.get('/api/dashboard/analytics/occupancy', { params: { months } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Mocked for now as per missing API in docs, but required by UI plan
    getRecentActivity: async () => {
        // Return mock data for development until API is ready
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        type: 'PAYMENT',
                        title: 'Payment received from Rahul Sharma',
                        subtitle: '₹12,000',
                        time: '2 min ago',
                        status: 'success'
                    },
                    {
                        id: 2,
                        type: 'MOVE_IN',
                        title: 'New tenant added: Priya Singh',
                        subtitle: 'Room 204',
                        time: '1 hr ago',
                        status: 'info'
                    },
                    {
                        id: 3,
                        type: 'AGREEMENT',
                        title: 'Agreement updated for Room 105',
                        subtitle: '',
                        time: '3 hrs ago',
                        status: 'warning'
                    },
                    {
                        id: 4,
                        type: 'MOVE_OUT',
                        title: 'Tenant moved out: Amit Kumar',
                        subtitle: 'Room 108',
                        time: 'Yesterday',
                        status: 'danger'
                    }
                ]);
            }, 500);
        });
    }
};
