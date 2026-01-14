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
            // Placeholder routes for Phase 2+
            {
                path: 'properties',
                element: <div style={{ padding: '24px' }}><h2>Properties (Coming in Phase 2)</h2></div>,
            },
            {
                path: 'tenants',
                element: <div style={{ padding: '24px' }}><h2>Tenants (Coming in Phase 3)</h2></div>,
            },
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
