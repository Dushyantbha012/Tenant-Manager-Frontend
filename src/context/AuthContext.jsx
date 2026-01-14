import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    // Load user from storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user');
            }
        }
        setLoading(false);
    }, [token]);

    /**
     * Login with email and password
     */
    const login = useCallback(async (email, password) => {
        const response = await authService.login({ email, password });
        const { token: newToken, id, email: userEmail, fullName, userType } = response.data;

        const userData = { id, email: userEmail, fullName, userType };

        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);

        return userData;
    }, []);

    /**
     * Login with OAuth token (from redirect)
     */
    const loginWithToken = useCallback(async (oauthToken) => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, oauthToken);
        setToken(oauthToken);

        // Fetch user profile with the new token
        try {
            const response = await authService.getProfile();
            const userData = response.data;

            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (error) {
            // If profile fetch fails, clear token
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            setToken(null);
            throw error;
        }
    }, []);

    /**
     * Signup new user
     */
    const signup = useCallback(async (data) => {
        const response = await authService.signup(data);
        return response.data;
    }, []);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (e) {
            // Ignore logout API errors
        }

        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        setToken(null);
        setUser(null);
    }, []);

    /**
     * Update user profile
     */
    const updateProfile = useCallback(async (data) => {
        const response = await authService.updateProfile(data);
        const updatedUser = { ...user, ...response.data };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        setUser(updatedUser);

        return updatedUser;
    }, [user]);

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        loginWithToken,
        signup,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
