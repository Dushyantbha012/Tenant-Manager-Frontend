import './Toast.css';

/**
 * Toast Component
 * Notification with variants: success, error, warning, info
 */
export default function Toast({
    message,
    type = 'info',
    onClose,
    isExiting = false,
}) {
    const icons = {
        success: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        error: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        warning: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        info: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    };

    const classes = [
        'toast',
        `toast-${type}`,
        isExiting && 'toast-exit',
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="alert">
            <span className="toast-icon">{icons[type]}</span>
            <p className="toast-message">{message}</p>
            {onClose && (
                <button
                    type="button"
                    className="toast-close"
                    onClick={onClose}
                    aria-label="Dismiss"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}

/**
 * ToastContainer Component
 * Container for positioning toasts
 */
export function ToastContainer({ children }) {
    return (
        <div className="toast-container" aria-live="polite">
            {children}
        </div>
    );
}
