import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

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

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid email or password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = authService.getGoogleOAuthUrl();
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Illustration */}
                <div className="auth-illustration">
                    <div className="auth-illustration-content">
                        <div className="auth-illustration-icon">
                            <svg viewBox="0 0 64 64" fill="none">
                                <rect x="8" y="20" width="48" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 28h48" stroke="currentColor" strokeWidth="2" />
                                <rect x="14" y="34" width="8" height="8" rx="1" fill="currentColor" opacity="0.3" />
                                <rect x="26" y="34" width="8" height="8" rx="1" fill="currentColor" opacity="0.3" />
                                <rect x="38" y="34" width="8" height="8" rx="1" fill="currentColor" opacity="0.3" />
                                <rect x="14" y="46" width="8" height="4" rx="1" fill="currentColor" opacity="0.2" />
                                <rect x="26" y="46" width="8" height="4" rx="1" fill="currentColor" opacity="0.2" />
                                <path d="M32 8L52 20H12L32 8z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2>Manage Your Properties</h2>
                        <p>Track tenants, collect rent, and manage properties all in one place.</p>
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
                            <h1>Welcome back</h1>
                            <p>Sign in to continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
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
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Enter your password"
                                required
                            />

                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={handleGoogleLogin}
                            icon={
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            }
                        >
                            Continue with Google
                        </Button>

                        <p className="auth-footer">
                            Don't have an account?{' '}
                            <Link to={ROUTES.SIGNUP}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
