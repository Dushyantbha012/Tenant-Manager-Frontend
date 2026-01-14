import { formatRelativeTime, formatCurrency } from '../../../utils/formatters';
import './RecentActivity.css';

// Mock activity data for demonstration
const mockActivities = [
    {
        id: 1,
        type: 'payment',
        icon: '💳',
        message: 'Payment received from Rahul Sharma',
        amount: 12000,
        time: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    },
    {
        id: 2,
        type: 'tenant',
        icon: '🏠',
        message: 'New tenant added: Priya Singh',
        detail: 'Room 204',
        time: new Date(Date.now() - 60 * 60000), // 1 hour ago
    },
    {
        id: 3,
        type: 'agreement',
        icon: '📝',
        message: 'Agreement updated for Room 105',
        time: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
    },
    {
        id: 4,
        type: 'moveout',
        icon: '👋',
        message: 'Tenant moved out: Amit Kumar',
        detail: 'Room 108',
        time: new Date(Date.now() - 24 * 60 * 60000), // Yesterday
    },
];

export default function RecentActivity({ activities = mockActivities }) {
    return (
        <div className="recent-activity">
            <div className="recent-activity-header">
                <h3 className="recent-activity-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Recent Activity
                </h3>
                <button className="recent-activity-see-all">See All</button>
            </div>

            <div className="recent-activity-list">
                {activities.length === 0 ? (
                    <div className="recent-activity-empty">
                        <p>No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="activity-item">
                            <span className="activity-icon">{activity.icon}</span>
                            <div className="activity-content">
                                <p className="activity-message">
                                    {activity.message}
                                    {activity.amount && (
                                        <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                                    )}
                                </p>
                                {activity.detail && (
                                    <span className="activity-detail">{activity.detail}</span>
                                )}
                            </div>
                            <span className="activity-time">{formatRelativeTime(activity.time)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
