import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { NAV_ITEMS, ROUTES } from '../../../utils/constants';
import './Sidebar.css';

// Icon components
const icons = {
    dashboard: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
    ),
    building: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
    ),
    wallet: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
            <path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
};

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const handleNavClick = () => {
        // Close mobile menu when navigating
        if (onCloseMobile) onCloseMobile();
    };

    return (
        <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <svg viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 2L3 10v12l13 8 13-8V10L16 2zm0 4l9 5.5v9L16 26l-9-5.5v-9L16 6z" />
                        <path d="M16 10l5 3v6l-5 3-5-3v-6l5-3z" />
                    </svg>
                    <span className="sidebar-logo-text">TenantMS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.path} className="sidebar-menu-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive && (!item.children || item.children.every(child => location.pathname !== child.path)) ? 'sidebar-link-active' : ''}`
                                }
                                end={item.path === '/' && !item.children}
                                onClick={handleNavClick}
                            >
                                <span className="sidebar-icon">{icons[item.icon]}</span>
                                <span className="sidebar-label">{item.label}</span>
                            </NavLink>
                            {item.children && (
                                <ul className="sidebar-submenu">
                                    {item.children.map((child) => (
                                        <li key={child.path}>
                                            <NavLink
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    `sidebar-sublink ${isActive ? 'sidebar-sublink-active' : ''}`
                                                }
                                                onClick={handleNavClick}
                                                end
                                            >
                                                {child.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Section */}
            <div className="sidebar-footer">
                <NavLink
                    to={ROUTES.PROFILE}
                    className={({ isActive }) =>
                        `sidebar-user ${isActive ? 'sidebar-user-active' : ''}`
                    }
                    onClick={handleNavClick}
                >
                    <div className="sidebar-avatar">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="sidebar-user-info">
                        <span className="sidebar-user-name">{user?.fullName || 'User'}</span>
                        <span className="sidebar-user-type">{user?.userType || 'Owner'}</span>
                    </div>
                </NavLink>
                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                    title="Logout"
                >
                    {icons.logout}
                </button>
            </div>
        </aside>
    );
}
