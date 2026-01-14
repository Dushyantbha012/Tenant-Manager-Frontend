import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import rentService from '../../services/rentService';
import propertyService from '../../services/propertyService';
import useToast from '../../hooks/useToast';
import { formatDate, formatCurrency } from '../../utils/formatters';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

export default function PaymentList() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize dates to current date
    const [searchDate, setSearchDate] = useState({
        start: getTodayDate(),
        end: getTodayDate()
    });

    // Property and room filter state
    const [properties, setProperties] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');

    useEffect(() => {
        fetchProperties();
        fetchPayments();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await propertyService.getAll();
            setProperties(response.data);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };

    const fetchRoomsForProperty = async (propertyId) => {
        if (!propertyId) {
            setRooms([]);
            return;
        }
        try {
            const response = await propertyService.getRooms(propertyId);
            setRooms(response.data);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            setRooms([]);
        }
    };

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await rentService.searchPayments(
                searchDate.start,
                searchDate.end,
                selectedPropertyId || null,
                selectedRoomId || null
            );
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

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        setSelectedPropertyId(propertyId);
        setSelectedRoomId(''); // Reset room when property changes
        fetchRoomsForProperty(propertyId);
    };

    const handleRoomChange = (e) => {
        setSelectedRoomId(e.target.value);
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
                    <div className="filter-group">
                        <label>Property</label>
                        <select
                            className="form-select"
                            value={selectedPropertyId}
                            onChange={handlePropertyChange}
                        >
                            <option value="">All Properties</option>
                            {properties.map(property => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Room</label>
                        <select
                            className="form-select"
                            value={selectedRoomId}
                            onChange={handleRoomChange}
                            disabled={!selectedPropertyId}
                        >
                            <option value="">All Rooms</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.roomNumber}
                                </option>
                            ))}
                        </select>
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
                    flex-wrap: wrap;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .filter-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                }
                .form-select {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 0.375rem;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 0.875rem;
                    min-width: 150px;
                    cursor: pointer;
                }
                .form-select:disabled {
                    background-color: var(--bg-secondary);
                    cursor: not-allowed;
                    opacity: 0.6;
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
