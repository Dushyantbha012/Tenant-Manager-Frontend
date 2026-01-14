import './PageContainer.css';

/**
 * PageContainer Component
 * Wrapper for page content with consistent padding
 */
export default function PageContainer({ children, className = '' }) {
    return (
        <div className={`page-container ${className}`}>
            {children}
        </div>
    );
}
