import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OAuthRedirect from './pages/auth/OAuthRedirect';

// Protected Pages
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Property Pages
import PropertyList from './pages/Properties/PropertyList';
import PropertyDetail from './pages/Properties/PropertyDetail';
import PropertyForm from './pages/Properties/PropertyForm';

// Tenant Pages
import TenantList from './pages/Tenants/TenantList';
import TenantDetail from './pages/Tenants/TenantDetail';
import TenantForm from './pages/Tenants/TenantForm';

// Routes
import { ROUTES } from './utils/constants';

const router = createBrowserRouter([
    // Public routes
    {
        path: ROUTES.LOGIN,
        element: <Login />,
    },
    {
        path: ROUTES.SIGNUP,
        element: <Signup />,
    },
    {
        path: ROUTES.OAUTH_REDIRECT,
        element: <OAuthRedirect />,
    },

    // Protected routes with app layout
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            // Property routes
            {
                path: 'properties',
                element: <PropertyList />,
            },
            {
                path: 'properties/new',
                element: <PropertyForm />,
            },
            {
                path: 'properties/:id',
                element: <PropertyDetail />,
            },
            {
                path: 'properties/:id/edit',
                element: <PropertyForm />,
            },
            // Tenant routes
            {
                path: 'tenants',
                element: <TenantList />,
            },
            {
                path: 'tenants/new',
                element: <TenantForm />,
            },
            {
                path: 'tenants/:id',
                element: <TenantDetail />,
            },
            {
                path: 'tenants/:id/edit',
                element: <TenantForm />,
            },
            // Placeholder routes for Future Phases
            {
                path: 'payments',
                element: <div style={{ padding: '24px' }}><h2>Payments (Coming in Phase 4)</h2></div>,
            },
            {
                path: 'profile',
                element: <div style={{ padding: '24px' }}><h2>Profile (Coming in Phase 5)</h2></div>,
            },
        ],
    },

    // 404 Not Found
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;
