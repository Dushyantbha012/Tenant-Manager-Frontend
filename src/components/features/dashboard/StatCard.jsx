import './StatCard.css';

/**
 * StatCard Component
 * Dashboard stat card with icon, title, value, and optional trend
 */
export default function StatCard({
    title,
    value,
    icon,
    trend,
    trendLabel,
    variant = 'default',
    loading = false,
}) {
    const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

    if (loading) {
        return (
            <div className="stat-card stat-card-loading">
                <div className="stat-card-skeleton stat-card-skeleton-icon" />
                <div className="stat-card-skeleton stat-card-skeleton-title" />
                <div className="stat-card-skeleton stat-card-skeleton-value" />
            </div>
        );
    }

    return (
        <div className={`stat-card stat-card-${variant}`}>
            {icon && <div className="stat-card-icon">{icon}</div>}
            <div className="stat-card-content">
                <p className="stat-card-title">{title}</p>
                <p className="stat-card-value">{value}</p>
                {(trend !== undefined || trendLabel) && (
                    <div className={`stat-card-trend stat-card-trend-${trendDirection}`}>
                        {trend !== undefined && (
                            <>
                                <span className="stat-card-trend-icon">
                                    {trendDirection === 'up' && '↑'}
                                    {trendDirection === 'down' && '↓'}
                                </span>
                                <span className="stat-card-trend-value">
                                    {Math.abs(trend)}%
                                </span>
                            </>
                        )}
                        {trendLabel && <span className="stat-card-trend-label">{trendLabel}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
