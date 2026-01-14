import { useState, useEffect, useRef } from 'react';
import './SearchInput.css';

/**
 * SearchInput Component
 * Search input with debounced onChange
 */
export default function SearchInput({
    value: controlledValue,
    onChange,
    onSearch,
    placeholder = 'Search...',
    debounceMs = 300,
    showClear = true,
    loading = false,
    className = '',
    ...props
}) {
    const [internalValue, setInternalValue] = useState(controlledValue || '');
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);

    // Sync with controlled value
    useEffect(() => {
        if (controlledValue !== undefined) {
            setInternalValue(controlledValue);
        }
    }, [controlledValue]);

    // Handle input change with debounce
    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);

        // Debounced search callback
        if (onSearch) {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
                onSearch(newValue);
            }, debounceMs);
        }
    };

    // Clear input
    const handleClear = () => {
        setInternalValue('');
        onChange?.('');
        onSearch?.('');
        inputRef.current?.focus();
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return (
        <div className={`search-input-wrapper ${className}`}>
            <span className="search-input-icon">
                {loading ? (
                    <svg className="search-spinner" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                )}
            </span>
            <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={internalValue}
                onChange={handleChange}
                {...props}
            />
            {showClear && internalValue && (
                <button
                    type="button"
                    className="search-clear"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
