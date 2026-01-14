import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import rentService from '../../services/rentService';
import useToast from '../../hooks/useToast';
import { formatDate, formatCurrency } from '../../utils/formatters';

export default function PaymentList() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState({
        start: '',
        end: ''
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await rentService.searchPayments(searchDate.start, searchDate.end);
            setPayments(response.data);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            showToast('error', 'Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPayments();
    };

    const columns = [
        {
            header: 'Tenant',
            accessor: (row) => row.tenantName,
        },
        {
            header: 'Property',
            accessor: (row) => `${row.propertyName} - ${row.roomNumber}`,
        },
        {
            header: 'Amount',
            accessor: (row) => formatCurrency(row.amountPaid),
            className: 'text-right'
        },
        {
            header: 'Payment Date',
            accessor: (row) => formatDate(row.paymentDate),
        },
        {
            header: 'For Month',
            accessor: (row) => formatDate(row.paymentForMonth, 'MMMM yyyy'),
        },
        {
            header: 'Mode',
            accessor: 'paymentMode',
            render: (row) => (
                <span className={`badge badge-neutral`}>
                    {row.paymentMode}
                </span>
            )
        }
    ];

    return (
        <PageContainer>
            <div className="page-header">
                <div>
                    <h1>Payments</h1>
                    <p className="text-secondary">Track and manage rent payments</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate('/payments/record')}
                >
                    + Record Payment
                </Button>
            </div>

            <div className="card filters-card mb-4">
                <form onSubmit={handleSearch} className="filters-form">
                    <div className="filter-group">
                        <label>From Date</label>
                        <Input
                            type="date"
                            value={searchDate.start}
                            onChange={(e) => setSearchDate(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="filter-group">
                        <label>To Date</label>
                        <Input
                            type="date"
                            value={searchDate.end}
                            onChange={(e) => setSearchDate(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                    <div className="filter-actions">
                        <Button type="submit" variant="secondary">Filter</Button>
                    </div>
                </form>
            </div>

            <div className="card">
                <Table
                    columns={columns}
                    data={payments}
                    loading={loading}
                    emptyMessage="No payments found for the selected period"
                    keyField="id"
                />
            </div>

            <style jsx>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .filters-form {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-end;
                    padding: 1rem;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .filter-actions {
                    padding-bottom: 2px;
                }
                .mb-4 {
                    margin-bottom: 1rem;
                }
            `}</style>
        </PageContainer>
    );
}
