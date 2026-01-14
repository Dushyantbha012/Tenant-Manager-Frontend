import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES, USER_TYPES } from '../../utils/constants';
import { isValidEmail, isValidPhone, validatePassword } from '../../utils/validators';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: USER_TYPES.OWNER,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.phone && !isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await signup({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                userType: formData.userType,
            });
            toast.success('Account created successfully! Please sign in.');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create account';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Illustration */}
                <div className="auth-illustration">
                    <div className="auth-illustration-content">
                        <div className="auth-illustration-icon">
                            <svg viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 56c0-11.046 8.954-20 20-20s20 8.954 20 20" stroke="currentColor" strokeWidth="2" />
                                <path d="M44 16l8 8M52 16l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2>Join TenantMS</h2>
                        <p>Create your account and start managing properties like a pro.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <div className="auth-logo">
                                <svg viewBox="0 0 32 32" fill="currentColor">
                                    <path d="M16 2L3 10v12l13 8 13-8V10L16 2zm0 4l9 5.5v9L16 26l-9-5.5v-9L16 6z" />
                                    <path d="M16 10l5 3v6l-5 3-5-3v-6l5-3z" />
                                </svg>
                                <span>TenantMS</span>
                            </div>
                            <h1>Create your account</h1>
                            <p>Get started with free property management</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <Input
                                label="Full Name"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={errors.fullName}
                                placeholder="John Doe"
                                required
                                prefix={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                required
                                prefix={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Phone (Optional)"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                placeholder="9876543210"
                                prefix={
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Minimum 6 characters"
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                placeholder="Confirm your password"
                                required
                            />

                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                            >
                                Create Account
                            </Button>
                        </form>

                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to={ROUTES.LOGIN}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
