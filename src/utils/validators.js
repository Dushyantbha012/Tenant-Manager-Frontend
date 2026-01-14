/**
 * Form Validation Utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export function validatePassword(password) {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters' };
    }

    return { isValid: true, message: '' };
}

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export function isValidPhone(phone) {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate required field
 * @param {string} value - Value to check
 * @returns {boolean} Is not empty
 */
export function isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
}

/**
 * Validate minimum length
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @returns {boolean} Meets minimum length
 */
export function minLength(value, min) {
    if (!value) return false;
    return value.length >= min;
}

/**
 * Validate maximum length
 * @param {string} value - Value to check
 * @param {number} max - Maximum length
 * @returns {boolean} Within maximum length
 */
export function maxLength(value, max) {
    if (!value) return true;
    return value.length <= max;
}

/**
 * Validate positive number
 * @param {number|string} value - Value to check
 * @returns {boolean} Is positive number
 */
export function isPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
}

/**
 * Validate form and return errors
 * @param {object} values - Form values
 * @param {object} rules - Validation rules
 * @returns {object} Errors object
 */
export function validateForm(values, rules) {
    const errors = {};

    Object.keys(rules).forEach((field) => {
        const value = values[field];
        const fieldRules = rules[field];

        fieldRules.some((rule) => {
            const error = rule(value, values);
            if (error) {
                errors[field] = error;
                return true; // Stop at first error
            }
            return false;
        });
    });

    return errors;
}

// Pre-built validation rules
export const validators = {
    required: (message = 'This field is required') => (value) => {
        if (!isRequired(value)) return message;
        return null;
    },

    email: (message = 'Please enter a valid email') => (value) => {
        if (value && !isValidEmail(value)) return message;
        return null;
    },

    phone: (message = 'Please enter a valid phone number') => (value) => {
        if (value && !isValidPhone(value)) return message;
        return null;
    },

    minLength: (min, message) => (value) => {
        if (value && !minLength(value, min)) {
            return message || `Must be at least ${min} characters`;
        }
        return null;
    },

    maxLength: (max, message) => (value) => {
        if (!maxLength(value, max)) {
            return message || `Must be at most ${max} characters`;
        }
        return null;
    },

    positive: (message = 'Must be a positive number') => (value) => {
        if (value && !isPositiveNumber(value)) return message;
        return null;
    },

    match: (field, fieldName) => (value, values) => {
        if (value !== values[field]) {
            return `Must match ${fieldName}`;
        }
        return null;
    },
};
