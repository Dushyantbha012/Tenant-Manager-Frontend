/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:8080';

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user',
    THEME: 'app_theme',
};

// User Types
export const USER_TYPES = {
    OWNER: 'OWNER',
    ASSISTANT: 'ASSISTANT',
};

// Room Types
export const ROOM_TYPES = {
    SINGLE: 'SINGLE',
    DOUBLE: 'DOUBLE',
    STUDIO: 'STUDIO',
    SUITE: 'SUITE',
};

// Payment Modes
export const PAYMENT_MODES = {
    CASH: 'CASH',
    UPI: 'UPI',
    CARD: 'CARD',
    BANK_TRANSFER: 'BANK_TRANSFER',
    CHEQUE: 'CHEQUE',
};

// Payment Status
export const PAYMENT_STATUS = {
    PAID: 'PAID',
    PARTIAL: 'PARTIAL',
    OVERDUE: 'OVERDUE',
    PENDING: 'PENDING',
};

// Access Levels
export const ACCESS_LEVELS = {
    READ: 'READ',
    WRITE: 'WRITE',
    ADMIN: 'ADMIN',
};

// Routes
export const ROUTES = {
    // Public
    LOGIN: '/login',
    SIGNUP: '/signup',
    OAUTH_REDIRECT: '/oauth2/redirect',

    // Protected
    DASHBOARD: '/',
    PROPERTIES: '/properties',
    PROPERTY_NEW: '/properties/new',
    PROPERTY_DETAIL: '/properties/:id',
    PROPERTY_EDIT: '/properties/:id/edit',
    TENANTS: '/tenants',
    TENANT_NEW: '/tenants/new',
    TENANT_DETAIL: '/tenants/:id',
    TENANT_EDIT: '/tenants/:id/edit',
    PAYMENTS: '/payments',
    PAYMENT_RECORD: '/payments/record',
    PAYMENT_DUE: '/payments/due',
    PROFILE: '/profile',
    USERS: '/users',
    ACCESS_CONTROL: '/users/access',
};

// Sidebar Navigation Items
export const NAV_ITEMS = [
    {
        label: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: 'dashboard',
    },
    {
        label: 'Properties',
        path: ROUTES.PROPERTIES,
        icon: 'building',
    },
    {
        label: 'Tenants',
        path: ROUTES.TENANTS,
        icon: 'users',
    },
    {
        label: 'Payments',
        path: ROUTES.PAYMENTS,
        icon: 'wallet',
        children: [
            { label: 'All Payments', path: ROUTES.PAYMENTS },
            { label: 'Record Payment', path: ROUTES.PAYMENT_RECORD },
            { label: 'Due Report', path: ROUTES.PAYMENT_DUE },
        ],
    },
];

// Toast Duration (ms)
export const TOAST_DURATION = 5000;
