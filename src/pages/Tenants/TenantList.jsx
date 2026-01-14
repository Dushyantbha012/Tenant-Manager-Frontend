import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import tenantService from '../../services/tenantService';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, formatPhone } from '../../utils/formatters';
import './TenantList.css';

/**
 * TenantList Page
 * Manage tenants with search, filter and list view
 */
export default function TenantList() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('all');

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tenantsRes, propertiesRes] = await Promise.all([
                tenantService.getAllTenants(),
                propertyService.getAll()
            ]);
            setTenants(tenantsRes || []);
            setProperties(propertiesRes.data || []); // propertyService uses standard response wrapper
        } catch (error) {
            console.error('Failed to load data:', error);
            showToast('error', 'Failed to load tenants');
        } finally {
            setLoading(false);
        }
    };

    // Filter tenants
    const getFilteredTenants = () => {
        let filtered = tenants;

        // Property filter
        if (selectedProperty !== 'all') {
            filtered = filtered.filter(t => t.propertyId === parseInt(selectedProperty));
        }

        // Search filter (handled by API usually, but doing client-side for now based on getAll)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.fullName?.toLowerCase().includes(query) ||
                t.phone?.includes(query) ||
                t.email?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleRowClick = (tenant) => {
        navigate(`/tenants/${tenant.id}`);
    };

    const columns = [
        {
            header: 'Tenant Name',
            accessor: 'fullName',
            render: (row) => (
                <div className="tenant-cell-profile">
                    <div className="tenant-avatar">
                        {row.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="tenant-name">{row.fullName}</div>
                        <div className="tenant-meta">Move-in: {new Date(row.moveInDate).toLocaleDateString()}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Property / Room',
            accessor: (row) => (
                <div>
                    <div className="font-medium">{row.propertyName || 'Unknown Property'}</div>
                    <div className="text-sm text-secondary">Room {row.roomNumber}</div>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: 'phone',
            render: (row) => (
                <div>
                    <div>{formatPhone(row.phone)}</div>
                    <div className="text-sm text-secondary">{row.email || '-'}</div>
                </div>
            )
        },
        {
            header: 'Rent',
            accessor: 'monthlyRent',
            render: (row) => (
                <span className="font-medium">{formatCurrency(row.rentAmount)}</span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <Badge variant={row.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {row.status || 'ACTIVE'}
                </Badge>
            )
        }
    ];

    const filteredTenants = getFilteredTenants();

    return (
        <div className="tenant-list-page">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Tenants</h1>
                    <p className="page-subtitle">Manage your active tenants and move-ins</p>
                </div>
                <Link to="/tenants/new">
                    <Button
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        }
                    >
                        Add Tenant
                    </Button>
                </Link>
            </div>

            <div className="tenant-toolbar">
                <SearchInput
                    placeholder="Search by name, phone..."
                    value={searchQuery}
                    onSearch={handleSearch}
                    className="tenant-search"
                />

                <div className="tenant-filters">
                    <select
                        className="filter-select"
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                    >
                        <option value="all">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="tenant-content">
                {!loading && filteredTenants.length === 0 && !searchQuery && selectedProperty === 'all' ? (
                    <EmptyState
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        }
                        title="No tenants yet"
                        description="Add your first tenant to start tracking rent."
                        action={
                            <Link to="/tenants/new">
                                <Button>Add Tenant</Button>
                            </Link>
                        }
                    />
                ) : (
                    <Table
                        columns={columns}
                        data={filteredTenants}
                        loading={loading}
                        onRowClick={handleRowClick}
                        emptyMessage="No tenants match your search."
                    />
                )}
            </div>
        </div>
    );
}
