import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';

/**
 * AppLayout Component
 * Main application shell with sidebar and content area
 * - Desktop: Sidebar always visible
 * - Mobile: Hamburger menu to show/hide sidebar
 */
export default function AppLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    return (
        <div className={`app-layout ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div className="app-overlay" onClick={toggleMobileMenu} />
            )}

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileMenuOpen}
                onCloseMobile={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <main className="app-main">
                {/* Mobile header with menu toggle */}
                <div className="app-mobile-header">
                    <button
                        className="app-mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <span className="app-mobile-logo">TenantMS</span>
                </div>

                {/* Page content */}
                <Outlet />
            </main>
        </div>
    );
}
