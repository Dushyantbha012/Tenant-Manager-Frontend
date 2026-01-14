import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import Badge from '../../common/Badge';
import './PendingAlerts.css';

export default function PendingAlerts({ dueCount = 0, dueAmount = 0, expiringCount = 0 }) {
    return (
        <div className="pending-alerts">
            <h3 className="pending-alerts-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                Pending Actions
            </h3>

            <div className="pending-alerts-list">
                {/* Due Rent Alert */}
                {dueCount > 0 && (
                    <div className="pending-alert pending-alert-warning">
                        <div className="pending-alert-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="pending-alert-content">
                            <div className="pending-alert-header">
                                <span className="pending-alert-label">{dueCount} tenants have dues</span>
                                <Badge variant="warning" size="sm">{formatCurrency(dueAmount)} pending</Badge>
                            </div>
                            <Link to={ROUTES.PAYMENT_DUE} className="pending-alert-action">
                                View Report →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Expiring Agreements Alert */}
                {expiringCount > 0 && (
                    <div className="pending-alert pending-alert-info">
                        <div className="pending-alert-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div className="pending-alert-content">
                            <div className="pending-alert-header">
                                <span className="pending-alert-label">{expiringCount} agreements expiring</span>
                                <Badge variant="info" size="sm">This month</Badge>
                            </div>
                            <Link to={ROUTES.TENANTS} className="pending-alert-action">
                                Review →
                            </Link>
                        </div>
                    </div>
                )}

                {/* No pending alerts */}
                {dueCount === 0 && expiringCount === 0 && (
                    <div className="pending-alert-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <p>All caught up! No pending actions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
