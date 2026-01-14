import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import Button from '../components/common/Button';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <Link to={ROUTES.DASHBOARD}>
                    <Button variant="primary">
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
