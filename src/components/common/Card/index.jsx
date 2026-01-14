import './Card.css';

/**
 * Card Component
 * Content container with optional title and actions
 */
export default function Card({
    children,
    title,
    subtitle,
    actions,
    padding = 'md',
    shadow = true,
    hoverable = false,
    className = '',
    ...props
}) {
    const classes = [
        'card',
        `card-padding-${padding}`,
        shadow && 'card-shadow',
        hoverable && 'card-hoverable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {(title || actions) && (
                <div className="card-header">
                    <div className="card-header-content">
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {actions && <div className="card-actions">{actions}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}
