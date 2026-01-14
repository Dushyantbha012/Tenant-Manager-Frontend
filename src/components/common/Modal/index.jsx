import { useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal Component
 * Dialog overlay with backdrop
 */
export default function Modal({
    children,
    open = false,
    onClose,
    title,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    className = '',
}) {
    const modalRef = useRef(null);

    // Handle escape key
    useEffect(() => {
        if (!open || !closeOnEscape) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    if (!open) return null;

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div
                ref={modalRef}
                className={`modal modal-${size} ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
                        {showCloseButton && (
                            <button
                                className="modal-close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Modal Footer helper component
export function ModalFooter({ children, className = '' }) {
    return (
        <div className={`modal-footer ${className}`}>
            {children}
        </div>
    );
}
