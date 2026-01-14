import './Skeleton.css';

/**
 * Skeleton Component
 * Loading placeholder with different variants
 */
export default function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
    count = 1,
}) {
    const getDefaultDimensions = () => {
        switch (variant) {
            case 'circle':
                return { width: width || 40, height: height || 40 };
            case 'rect':
                return { width: width || '100%', height: height || 100 };
            case 'text':
            default:
                return { width: width || '100%', height: height || 16 };
        }
    };

    const dimensions = getDefaultDimensions();
    const classes = [
        'skeleton',
        `skeleton-${variant}`,
        className,
    ].filter(Boolean).join(' ');

    const style = {
        width: typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width,
        height: typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height,
    };

    if (count > 1) {
        return (
            <div className="skeleton-group">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={classes}
                        style={{
                            ...style,
                            width: index === count - 1 && variant === 'text' ? '60%' : style.width,
                        }}
                    />
                ))}
            </div>
        );
    }

    return <div className={classes} style={style} />;
}

/**
 * SkeletonCard Component
 * Pre-built skeleton for card layouts
 */
export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <Skeleton variant="rect" height={120} />
            <div className="skeleton-card-content">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" count={2} />
            </div>
        </div>
    );
}

/**
 * SkeletonTable Component
 * Pre-built skeleton for table rows
 */
export function SkeletonTable({ rows = 5, columns = 4 }) {
    return (
        <div className="skeleton-table">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="skeleton-table-row">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            variant="text"
                            width={colIndex === 0 ? '40%' : '80%'}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
