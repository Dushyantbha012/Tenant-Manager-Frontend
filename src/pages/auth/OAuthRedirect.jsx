import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import './Auth.css';

export default function OAuthRedirect() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const { toast } = useToast();
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError('Authentication failed. Please try again.');
            toast.error('Authentication failed');
            setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            return;
        }

        if (!token) {
            setError('No authentication token received.');
            toast.error('No token received');
            setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            return;
        }

        // Process the token
        const processToken = async () => {
            try {
                await loginWithToken(token);
                toast.success('Welcome! You are now signed in.');
                navigate('/', { replace: true });
            } catch (err) {
                setError('Failed to authenticate. Please try again.');
                toast.error('Authentication failed');
                setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            }
        };

        processToken();
    }, [searchParams, loginWithToken, navigate, toast]);

    return (
        <div className="auth-page">
            <div className="auth-redirect">
                {error ? (
                    <>
                        <div className="auth-redirect-icon auth-redirect-error">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <h2>Authentication Failed</h2>
                        <p>{error}</p>
                        <p className="auth-redirect-hint">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="auth-redirect-icon">
                            <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2>Completing Sign In</h2>
                        <p>Please wait while we authenticate your account...</p>
                    </>
                )}
            </div>
        </div>
    );
}
