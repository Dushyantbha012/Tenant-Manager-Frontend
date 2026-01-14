import { createContext, useContext, useState, useCallback } from 'react';
import { TOAST_DURATION } from '../utils/constants';
import Toast, { ToastContainer } from '../components/common/Toast';

const ToastContext = createContext(null);

let toastIdCounter = 0;

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    /**
     * Remove a toast by ID
     */
    const removeToast = useCallback((id) => {
        setToasts((prev) =>
            prev.map((toast) =>
                toast.id === id ? { ...toast, isExiting: true } : toast
            )
        );

        // Remove from DOM after animation
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 300);
    }, []);

    /**
     * Show a new toast
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {string} message - Toast message
     * @param {number} duration - Duration in ms (0 for persistent)
     */
    const showToast = useCallback((type, message, duration = TOAST_DURATION) => {
        const id = ++toastIdCounter;

        setToasts((prev) => [...prev, { id, type, message, isExiting: false }]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }

        return id;
    }, [removeToast]);

    // Convenience methods
    const toast = {
        success: (message, duration) => showToast('success', message, duration),
        error: (message, duration) => showToast('error', message, duration),
        warning: (message, duration) => showToast('warning', message, duration),
        info: (message, duration) => showToast('info', message, duration),
    };

    const value = {
        toasts,
        showToast,
        removeToast,
        toast,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer>
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        type={t.type}
                        message={t.message}
                        isExiting={t.isExiting}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

/**
 * Custom hook to use toast context
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastContext;
