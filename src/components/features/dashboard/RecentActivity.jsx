import React from 'react';
import { CreditCard, UserPlus, FileText, UserMinus, ArrowRight } from 'lucide-react';

const RecentlyActivityItem = ({ activity }) => {
    const { type, title, subtitle, time, status } = activity;

    const getIcon = () => {
        switch (type) {
            case 'PAYMENT': return <CreditCard className="w-5 h-5 text-success" />;
            case 'MOVE_IN': return <UserPlus className="w-5 h-5 text-info" />; // info usually blue
            case 'AGREEMENT': return <FileText className="w-5 h-5 text-warning" />;
            case 'MOVE_OUT': return <UserMinus className="w-5 h-5 text-danger" />;
            default: return <FileText className="w-5 h-5 text-text-secondary" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'PAYMENT': return 'bg-emerald-50';
            case 'MOVE_IN': return 'bg-blue-50';
            case 'AGREEMENT': return 'bg-amber-50';
            case 'MOVE_OUT': return 'bg-red-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg ${getBgColor()} shrink-0`}>
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{title}</p>
                {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
            </div>
            <div className="text-right shrink-0">
                <p className="text-xs text-text-secondary">{time}</p>
            </div>
        </div>
    );
};

const RecentActivity = ({ activities }) => {
    return (
        <div className="bg-surface rounded-xl shadow-sm border border-border h-full flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
                <button className="text-primary text-sm font-medium hover:text-primary-hover flex items-center gap-1">
                    See All <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-auto max-h-[350px]">
                {activities && activities.length > 0 ? (
                    <div className="flex flex-col">
                        {activities.map((activity) => (
                            <RecentlyActivityItem key={activity.id} activity={activity} />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-text-secondary">
                        No recent activity.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
