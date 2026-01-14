import { useState, useEffect } from 'react';
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
    const [summary, setSummary] = useState({ totalDue: 0, totalTenants: 0, overdueCount: 0 });

    useEffect(() => {
        fetchDueReport();
    }, [selectedMonth]);

    const fetchDueReport = async () => {
        try {
            setLoading(true);
            const response = await rentService.getDueReport(selectedMonth + '-01');
            setDues(response.data.tenants || []);
            setSummary(response.data.summary || { totalDue: 0, totalTenants: 0, overdueCount: 0 });
        } catch (error) {
            console.error('Failed to fetch due report:', error);
            showToast('error', 'Failed to load due report');
        } finally {
            setLoading(false);
        }
    };

    const handlePayClick = (tenant) => {
        // Navigate to record payment with pre-filled state (if implemented via state passing)
        // For now, we just go to the page, user selects tenant
        // Ideally, we could pass state: navigate('/payments/record', { state: { tenantId: tenant.id } });
        navigate('/payments/record');
    };

    const columns = [
        {
            header: 'Tenant',
            accessor: 'tenantName',
            render: (row) => (
                <div className="tenant-cell">
                    <span className="font-bold">{row.tenantName}</span>
                    <span className="text-secondary text-sm">{row.phone}</span>
                </div>
            )
        },
        {
            header: 'Property / Room',
            accessor: (row) => `${row.propertyName} / ${row.roomNumber}`,
        },
        {
            header: 'Due Amount',
            accessor: (row) => formatCurrency(row.dueAmount),
            className: 'text-danger font-bold text-right'
        },
        {
            header: 'Days Overdue',
            accessor: 'daysOverdue',
            render: (row) => (
                <span className={`badge ${row.daysOverdue > 15 ? 'badge-danger' : 'badge-warning'}`}>
                    {row.daysOverdue} days
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handlePayClick(row)}>Pay</Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${row.phone}`)}>📞</Button>
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
