import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import Button from '../../common/Button';
import './QuickActions.css';

const actions = [
    {
        label: 'Add Tenant',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
        ),
        path: ROUTES.TENANT_NEW,
        color: 'primary',
    },
    {
        label: 'Record Payment',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
        ),
        path: ROUTES.PAYMENT_RECORD,
        color: 'success',
    },
    {
        label: 'Add Property',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <line x1="9" y1="9" x2="9" y2="9.01" />
                <line x1="9" y1="12" x2="9" y2="12.01" />
                <line x1="9" y1="15" x2="9" y2="15.01" />
            </svg>
        ),
        path: ROUTES.PROPERTY_NEW,
        color: 'info',
    },
];

export default function QuickActions() {
    return (
        <div className="quick-actions">
            <h3 className="quick-actions-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Quick Actions
            </h3>
            <div className="quick-actions-list">
                {actions.map((action) => (
                    <Link key={action.label} to={action.path} className="quick-action-link">
                        <Button
                            variant="outline"
                            fullWidth
                            icon={action.icon}
                            className={`quick-action-btn quick-action-${action.color}`}
                        >
                            {action.label}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
