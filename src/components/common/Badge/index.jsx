import './Badge.css';

/**
 * Badge Component
 * Status indicator with variants: success, warning, danger, info, neutral
 */
export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    className = '',
}) {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        dot && 'badge-dot',
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {dot && <span className="badge-dot-indicator" />}
            {children}
        </span>
    );
}
