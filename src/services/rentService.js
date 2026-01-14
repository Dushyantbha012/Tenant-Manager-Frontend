import api from './api';

const rentService = {
    // Payment methods
    recordPayment: (tenantId, paymentData) => {
        return api.post(`/api/rent/payments/tenant/${tenantId}`, paymentData);
    },

    getTenantPaymentHistory: (tenantId) => {
        return api.get(`/api/rent/payments/tenant/${tenantId}`);
    },

    getMonthlyPayments: (month) => {
        return api.get(`/api/rent/payments/month/${month}`);
    },

    searchPayments: (startDate, endDate, propertyId = null, roomId = null) => {
        const params = { startDate, endDate };
        if (propertyId) params.propertyId = propertyId;
        if (roomId) params.roomId = roomId;
        return api.get('/api/rent/payments/search', { params });
    },

    bulkRecordPayments: (paymentsData) => {
        return api.post('/api/rent/payments/bulk', paymentsData);
    },

    // Due rent methods
    getTenantDue: (tenantId, month) => {
        return api.get(`/api/rent/due/${tenantId}`, {
            params: { month }
        });
    },

    getDueReport: (month) => {
        return api.get('/api/rent/due/report', {
            params: { month }
        });
    },

    // Summary methods
    getPropertyRentSummary: (propertyId) => {
        return api.get(`/api/rent/summary/property/${propertyId}`);
    },

    // Agreement methods
    getTenantAgreement: (tenantId) => {
        return api.get(`/api/rent/agreements/${tenantId}`);
    }
};

export default rentService;
