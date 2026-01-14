import './EmptyState.css';

/**
 * EmptyState Component
 * Display when no data available
 */
export default function EmptyState({
    icon,
    title = 'No data found',
    description,
    action,
    size = 'md',
    className = '',
}) {
    const defaultIcon = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );

    return (
        <div className={`empty-state empty-state-${size} ${className}`}>
            <div className="empty-state-icon">
                {icon || defaultIcon}
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}
        </div>
    );
}
