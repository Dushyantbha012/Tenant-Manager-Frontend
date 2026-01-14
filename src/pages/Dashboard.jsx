import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/features/dashboard/StatCard';
import QuickActions from '../components/features/dashboard/QuickActions';
import PendingAlerts from '../components/features/dashboard/PendingAlerts';
import RecentActivity from '../components/features/dashboard/RecentActivity';
import './Dashboard.css';

// Mock dashboard data for demonstration
const mockDashboardData = {
    totalProperties: 5,
    totalRooms: 48,
    occupiedRooms: 42,
    vacantRooms: 6,
    totalTenants: 42,
    totalRentExpected: 485000,
    totalRentCollected: 392000,
    occupancyRate: 87.5,
    dueCount: 5,
    dueAmount: 93000,
    expiringAgreements: 3,
};

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulate API call
        const fetchDashboard = async () => {
            try {
                // In production, call: dashboardService.getSummary()
                await new Promise((resolve) => setTimeout(resolve, 800));
                setData(mockDashboardData);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const collectionRate = data
        ? ((data.totalRentCollected / data.totalRentExpected) * 100).toFixed(1)
        : 0;

    return (
        <>
            <Header
                title={`Welcome, ${user?.fullName?.split(' ')[0] || 'User'}!`}
                subtitle={new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            />

            <PageContainer>
                {/* Stats Grid */}
                <div className="dashboard-stats">
                    <StatCard
                        title="Total Properties"
                        value={loading ? '...' : data?.totalProperties}
                        loading={loading}
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 21h18" />
                                <path d="M5 21V7l8-4v18" />
                                <path d="M19 21V11l-6-4" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Rooms"
                        value={loading ? '...' : data?.totalRooms}
                        loading={loading}
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Occupied Rooms"
                        value={loading ? '...' : data?.occupiedRooms}
                        loading={loading}
                        variant="success"
                        trendLabel={loading ? '' : formatPercentage(data?.occupancyRate)}
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Vacant Rooms"
                        value={loading ? '...' : data?.vacantRooms}
                        loading={loading}
                        variant="warning"
                        trendLabel={loading ? '' : formatPercentage(100 - (data?.occupancyRate || 0))}
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        }
                    />
                </div>

                {/* Revenue Stats */}
                <div className="dashboard-revenue">
                    <div className="revenue-card">
                        <div className="revenue-header">
                            <div className="revenue-icon revenue-icon-expected">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                </svg>
                            </div>
                            <div className="revenue-info">
                                <span className="revenue-label">Rent Expected (This Month)</span>
                                <span className="revenue-value">
                                    {loading ? '...' : formatCurrency(data?.totalRentExpected)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="revenue-card">
                        <div className="revenue-header">
                            <div className="revenue-icon revenue-icon-collected">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <div className="revenue-info">
                                <span className="revenue-label">Rent Collected</span>
                                <span className="revenue-value">
                                    {loading ? '...' : formatCurrency(data?.totalRentCollected)}
                                </span>
                            </div>
                        </div>
                        {!loading && data && (
                            <div className="revenue-progress">
                                <div
                                    className="revenue-progress-bar"
                                    style={{ width: `${collectionRate}%` }}
                                />
                                <span className="revenue-progress-label">{collectionRate}% collected</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Grid: Quick Actions, Alerts, Activity */}
                <div className="dashboard-bottom">
                    <div className="dashboard-sidebar">
                        <QuickActions />
                        <PendingAlerts
                            dueCount={data?.dueCount || 0}
                            dueAmount={data?.dueAmount || 0}
                            expiringCount={data?.expiringAgreements || 0}
                        />
                    </div>
                    <div className="dashboard-main">
                        <RecentActivity />
                    </div>
                </div>
            </PageContainer>
        </>
    );
}
