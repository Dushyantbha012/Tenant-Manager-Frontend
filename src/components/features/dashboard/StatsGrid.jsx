import React from 'react';
import { Building, DoorOpen, Users, UserCheck } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }) => {
    return (
        <div className="bg-surface rounded-xl shadow-sm p-6 border border-border">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
                    {subtext && (
                        <p className={`text-xs mt-1 font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-text-secondary'}`}>
                            {subtext}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );
};

const StatsGrid = ({ stats }) => {
    // Default values if stats are loading or missing
    const {
        totalProperties = 0,
        totalRooms = 0,
        occupiedRooms = 0,
        vacantRooms = 0,
        occupancyRate = 0
    } = stats || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
                title="Total Properties"
                value={totalProperties}
                icon={Building}
                colorClass="bg-blue-500 text-blue-500"
            />
            <StatCard
                title="Total Rooms"
                value={totalRooms}
                subtext={`${occupiedRooms + vacantRooms} total capacity`}
                icon={DoorOpen}
                colorClass="bg-indigo-500 text-indigo-500"
            />
            <StatCard
                title="Occupied Rooms"
                value={occupiedRooms}
                subtext={`${occupancyRate}% Occupancy`}
                icon={Users}
                colorClass="bg-emerald-500 text-emerald-500"
                trend="up"
            />
            <StatCard
                title="Vacant Rooms"
                value={vacantRooms}
                subtext={`${100 - occupancyRate}% Availablity`}
                icon={UserCheck}
                colorClass="bg-amber-500 text-amber-500"
            />
        </div>
    );
};

export default StatsGrid;
