import { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

/**
 * Dropdown Component
 * Action menu dropdown with trigger
 */
export default function Dropdown({
    trigger,
    items = [],
    placement = 'bottom-end',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`dropdown ${className}`}>
            <div
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {trigger}
            </div>

            {isOpen && (
                <div className={`dropdown-menu dropdown-${placement}`} role="menu">
                    {items.map((item, index) => {
                        if (item.divider) {
                            return <div key={index} className="dropdown-divider" />;
                        }

                        return (
                            <button
                                key={index}
                                className={`dropdown-item ${item.danger ? 'dropdown-item-danger' : ''}`}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                                role="menuitem"
                            >
                                {item.icon && (
                                    <span className="dropdown-item-icon">{item.icon}</span>
                                )}
                                <span className="dropdown-item-label">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/**
 * Default more actions trigger (3 dots)
 */
export function MoreTrigger({ className = '' }) {
    return (
        <button className={`dropdown-more-trigger ${className}`} aria-label="More actions">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
            </svg>
        </button>
    );
}
