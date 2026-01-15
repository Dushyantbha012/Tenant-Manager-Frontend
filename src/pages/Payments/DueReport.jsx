import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import rentService from '../../services/rentService';
import useToast from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';

export default function DueReport() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [dues, setDues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    useEffect(() => {
        fetchDueReport();
    }, [selectedMonth]);

    const fetchDueReport = async () => {
        try {
            setLoading(true);
            const response = await rentService.getDueReport(selectedMonth + '-01');
            // API returns array of DueRentDto directly
            const dueData = response.data || [];
            // Filter to only include tenants with actual dues (dueAmount > 0)
            const tenantsWithDues = dueData.filter(item => item.dueAmount > 0);
            setDues(tenantsWithDues);
        } catch (error) {
            console.error('Failed to fetch due report:', error);
            showToast('error', 'Failed to load due report');
        } finally {
            setLoading(false);
        }
    };

    // Calculate summary from the dues data
    const summary = useMemo(() => {
        const totalDue = dues.reduce((sum, item) => sum + (item.dueAmount || 0), 0);
        const totalTenants = dues.length;
        // Calculate days overdue based on current date vs payment due day
        const today = new Date();
        const overdueCount = dues.filter(item => {
            // A due is considered critical if it's more than 15 days past due
            // Since we only have month data, estimate based on current day of month
            const dayOfMonth = today.getDate();
            return dayOfMonth > 15 && item.dueAmount > 0;
        }).length;

        return { totalDue, totalTenants, overdueCount };
    }, [dues]);

    const handlePayClick = (tenant) => {
        navigate('/payments/record', { state: { tenantId: tenant.tenantId } });
    };

    const columns = [
        {
            header: 'Tenant',
            accessor: 'tenantName',
            render: (row) => (
                <div className="tenant-cell">
                    <span className="font-bold">{row.tenantName}</span>
                    <span className="text-secondary text-sm">{row.propertyName}</span>
                </div>
            )
        },
        {
            header: 'Room',
            accessor: 'roomNumber',
            render: (row) => `Room ${row.roomNumber}`
        },
        {
            header: 'Expected',
            accessor: 'expectedAmount',
            render: (row) => formatCurrency(row.expectedAmount),
            className: 'text-right'
        },
        {
            header: 'Paid',
            accessor: 'paidAmount',
            render: (row) => formatCurrency(row.paidAmount),
            className: 'text-right'
        },
        {
            header: 'Due Amount',
            accessor: 'dueAmount',
            render: (row) => formatCurrency(row.dueAmount),
            className: 'text-danger font-bold text-right'
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handlePayClick(row)}>Pay</Button>
                </div>
            )
        }
    ];

    return (
        <PageContainer>
            <div className="page-header">
                <div>
                    <h1>Due Rent Report</h1>
                    <p className="text-secondary">Track pending rent collections</p>
                </div>
                <div className="month-selector">
                    <Input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>
            </div>

            <div className="summary-cards">
                <div className="stat-card">
                    <h3>Total Due</h3>
                    <p className="stat-value text-danger">{formatCurrency(summary.totalDue)}</p>
                </div>
                <div className="stat-card">
                    <h3>Tenants with Dues</h3>
                    <p className="stat-value">{summary.totalTenants}</p>
                </div>
                <div className="stat-card">
                    <h3>Critical Overdue (&gt;15d)</h3>
                    <p className="stat-value">{summary.overdueCount}</p>
                </div>
            </div>

            <div className="card mt-4">
                <Table
                    columns={columns}
                    data={dues}
                    loading={loading}
                    emptyMessage="Great! No pending dues for this month."
                    keyField="tenantId"
                />
            </div>

            <style jsx>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .summary-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .stat-card {
                    background: var(--surface);
                    padding: 1.5rem;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border);
                }
                .stat-card h3 {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .text-danger {
                    color: var(--danger);
                }
                .tenant-cell {
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
        </PageContainer>
    );
}
