import './Tabs.css';

/**
 * Tabs Component
 * Tabbed navigation with active state management
 */
export default function Tabs({
    items = [],
    activeTab,
    onChange,
    variant = 'default',
    fullWidth = false,
    className = '',
}) {
    const classes = [
        'tabs',
        `tabs-${variant}`,
        fullWidth && 'tabs-full-width',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="tablist">
            {items.map((item) => (
                <button
                    key={item.id}
                    role="tab"
                    aria-selected={activeTab === item.id}
                    className={`tab ${activeTab === item.id ? 'tab-active' : ''}`}
                    onClick={() => onChange?.(item.id)}
                    disabled={item.disabled}
                >
                    {item.icon && <span className="tab-icon">{item.icon}</span>}
                    <span className="tab-label">{item.label}</span>
                    {item.badge && (
                        <span className="tab-badge">{item.badge}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

/**
 * TabPanel Component
 * Content container for tab panels
 */
export function TabPanel({ children, active, className = '' }) {
    if (!active) return null;

    return (
        <div
            role="tabpanel"
            className={`tab-panel ${className}`}
        >
            {children}
        </div>
    );
}
