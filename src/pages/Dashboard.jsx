import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard, Home, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Header from '../components/layout/Header';
import StatsGrid from '../components/features/dashboard/StatsGrid';
import RevenueStats from '../components/features/dashboard/RevenueStats';
import RevenueChart from '../components/features/dashboard/RevenueChart';
import OccupancyChart from '../components/features/dashboard/OccupancyChart';
import RecentActivity from '../components/features/dashboard/RecentActivity';
import { dashboardService } from '../services/dashboardService';
import useToast from '../hooks/useToast';

const QuickActionButton = ({ icon: Icon, label, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow w-full text-left group"
    >
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
            <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <span className="font-medium text-text-primary">{label}</span>
        <ChevronRight className="w-4 h-4 text-text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
);

const AlertItem = ({ message, type, action }) => (
    <div className="flex items-start gap-3 p-3 bg-opacity-50 rounded-lg border border-dashed border-gray-300">
        <AlertTriangle className={`w-5 h-5 shrink-0 ${type === 'danger' ? 'text-danger' : 'text-warning'}`} />
        <div>
            <p className="text-sm text-text-primary font-medium">{message}</p>
            {action && (
                <button className="text-xs text-primary font-medium hover:underline mt-1">
                    {action}
                </button>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    // const { user } = useAuth(); // If needed for "Hello, Name"
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [rentTrends, setRentTrends] = useState([]);
    const [occupancyTrends, setOccupancyTrends] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Parallel fetching
                const [summaryData, rentData, occupancyData, activityData] = await Promise.all([
                    dashboardService.getSummary(),
                    dashboardService.getRentTrends(),
                    dashboardService.getOccupancyTrends(),
                    dashboardService.getRecentActivity()
                ]);

                setSummary(summaryData);
                setRentTrends(rentData);
                setOccupancyTrends(occupancyData);
                setActivities(activityData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                showToast('error', 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [showToast]);

    const handleQuickAction = (action) => {
        switch (action) {
            case 'add-tenant': navigate('/tenants/new'); break;
            case 'record-payment': navigate('/payments/record'); break;
            case 'add-property': navigate('/properties/new'); break;
            default: break;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Reusing existing implementations would likely include Layout wrapper, 
          but as per instructions I am building the page content. 
          Assuming App.jsx handles the main Layout (Sidebar/Header) or I wrap it here.
          Since I see 'components/layout/Header', I'll use PageContainer.
      */}
            <Header />
            <PageContainer>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-text-secondary">Overview of your properties and performance</p>
                </div>

                {/* 1. Stats Grid */}
                <StatsGrid stats={summary} />

                {/* 2. Revenue High-Level Stats */}
                <RevenueStats summary={summary} />

                {/* 3. Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 h-96">
                        <RevenueChart data={rentTrends} />
                    </div>
                    <div className="h-96">
                        <OccupancyChart data={occupancyTrends} />
                    </div>
                </div>

                {/* 4. Quick Actions & Alerts & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions & Alerts Column */}
                    <div className="flex flex-col gap-6">
                        {/* Quick Actions */}
                        <div className="bg-surface rounded-xl shadow-sm p-6 border border-border">
                            <h3 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <QuickActionButton
                                    icon={Plus}
                                    label="Add New Tenant"
                                    onClick={() => handleQuickAction('add-tenant')}
                                    colorClass="bg-blue-500 text-blue-500"
                                />
                                <QuickActionButton
                                    icon={CreditCard}
                                    label="Record Payment"
                                    onClick={() => handleQuickAction('record-payment')}
                                    colorClass="bg-emerald-500 text-emerald-500"
                                />
                                <QuickActionButton
                                    icon={Home}
                                    label="Add Property"
                                    onClick={() => handleQuickAction('add-property')}
                                    colorClass="bg-indigo-500 text-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Pending Alerts */}
                        <div className="bg-surface rounded-xl shadow-sm p-6 border border-border flex-1">
                            <h3 className="text-lg font-bold text-text-primary mb-4">Pending Actions</h3>
                            <div className="space-y-4">
                                {/* Mock Alerts - In real app, derived from API */}
                                <AlertItem
                                    message="5 tenants have pending dues totaling ₹93,000"
                                    type="warning"
                                    action="View Due Report →"
                                />
                                <AlertItem
                                    message="3 agreements expiring this month"
                                    type="warning"
                                    action="Review Agreements →"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Column (Span 2) */}
                    <div className="lg:col-span-2 h-full">
                        <RecentActivity activities={activities} />
                    </div>
                </div>
            </PageContainer>
        </div>
    );
};

export default Dashboard;
