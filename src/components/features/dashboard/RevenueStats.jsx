import React from 'react';

const RevenueStats = ({ summary }) => {
    const { totalRentExpected = 0, totalRentCollected = 0 } = summary || {};

    const percentage = totalRentExpected > 0
        ? Math.round((totalRentCollected / totalRentExpected) * 100)
        : 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Rent Expected Card */}
            <div className="bg-surface rounded-xl shadow-sm p-6 border border-border">
                <h3 className="text-text-secondary text-sm font-medium mb-2">Rent Expected (Current Month)</h3>
                <p className="text-2xl font-bold text-text-primary mb-2">{formatCurrency(totalRentExpected)}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-indigo-400 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-text-secondary mt-2">Total projected revenue</p>
            </div>

            {/* Rent Collected Card */}
            <div className="bg-surface rounded-xl shadow-sm p-6 border border-border">
                <h3 className="text-text-secondary text-sm font-medium mb-2">Rent Collected</h3>
                <div className="flex items-end justify-between mb-2">
                    <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalRentCollected)}</p>
                    <span className={`text-sm font-bold ${percentage >= 80 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {percentage}% Collected
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className={`h-2.5 rounded-full ${percentage >= 80 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                    {formatCurrency(totalRentExpected - totalRentCollected)} remaining
                </p>
            </div>
        </div>
    );
};

export default RevenueStats;
