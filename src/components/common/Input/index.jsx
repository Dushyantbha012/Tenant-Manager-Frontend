import { useState } from 'react';
import './Input.css';

/**
 * Input Component
 * Supports text, password, email, number, etc.
 * Features: labels, error messages, prefix/suffix icons, visibility toggle for password
 */
export default function Input({
    label,
    error,
    type = 'text',
    id,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    prefix,
    suffix,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name;
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const containerClasses = [
        'input-container',
        error && 'input-error',
        disabled && 'input-disabled',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-wrapper">
                {prefix && <span className="input-prefix">{prefix}</span>}
                <input
                    type={inputType}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className="input-field"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
                {suffix && !isPassword && <span className="input-suffix">{suffix}</span>}
            </div>
            {error && (
                <p id={`${inputId}-error`} className="input-error-message">
                    {error}
                </p>
            )}
        </div>
    );
}
