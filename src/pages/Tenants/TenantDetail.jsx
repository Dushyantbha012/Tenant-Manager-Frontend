import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import tenantService from '../../services/tenantService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import { formatCurrency, formatPhone, formatDate } from '../../utils/formatters';
import './TenantDetail.css';

/**
 * TenantDetail Page
 * View full tenant profile, agreement, and history
 */
export default function TenantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchTenant();
    }, [id]);

    const fetchTenant = async () => {
        setLoading(true);
        try {
            const data = await tenantService.getTenantById(id);
            setTenant(data);
        } catch (error) {
            console.error('Failed to fetch tenant:', error);
            showToast('error', 'Failed to load tenant details');
            navigate('/tenants');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await tenantService.deleteTenant(id);
            showToast('success', 'Tenant moved out successfully');
            navigate('/tenants');
        } catch (error) {
            console.error('Failed to delete tenant:', error);
            showToast('error', 'Failed to move out tenant');
        } finally {
            setDeleting(false);
            setDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="tenant-detail-page">
                <div className="page-header">
                    <Skeleton width="200px" height="32px" />
                </div>
                <div className="tenant-detail-content">
                    <Skeleton height="200px" />
                    <Skeleton height="400px" style={{ marginTop: '24px' }} />
                </div>
            </div>
        );
    }

    if (!tenant) return null;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'payments', label: 'Payment History' },
        { id: 'documents', label: 'Documents' },
    ];

    return (
        <div className="tenant-detail-page">
            <div className="page-header">
                <div className="page-header-content">
                    <div className="back-link">
                        <Link to="/tenants" className="text-secondary hover:text-primary">
                            ← Back to Tenants
                        </Link>
                    </div>
                    <h1 className="page-title">{tenant.fullName}</h1>
                    <div className="tenant-status-badge">
                        <Badge variant={tenant.status === 'ACTIVE' ? 'success' : 'neutral'}>
                            {tenant.status}
                        </Badge>
                    </div>
                </div>
                <div className="header-actions">
                    <Link to={`/tenants/${id}/edit`}>
                        <Button variant="outline">Edit Profile</Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={() => setDeleteModal(true)}
                    >
                        Move Out
                    </Button>
                </div>
            </div>

            <div className="tenant-profile-card">
                <div className="profile-main">
                    <div className="profile-avatar">
                        {tenant.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h2>{tenant.fullName}</h2>
                        <div className="profile-meta">
                            <span>📧 {tenant.email || 'No email'}</span>
                            <span>📞 {formatPhone(tenant.phone)}</span>
                        </div>
                    </div>
                </div>
                <div className="profile-stats">
                    <div className="stat-item">
                        <label>Property</label>
                        <div className="font-medium">{tenant.propertyName}</div>
                        <div className="text-sm text-secondary">Room {tenant.roomNumber}</div>
                    </div>
                    <div className="stat-item">
                        <label>Monthly Rent</label>
                        <div className="font-medium text-primary price-text">
                            {formatCurrency(tenant.rentAmount)}
                        </div>
                    </div>
                    <div className="stat-item">
                        <label>Lease Start</label>
                        <div className="font-medium">{formatDate(tenant.moveInDate)}</div>
                    </div>
                </div>
            </div>

            <Tabs
                items={tabs}
                active={activeTab}
                onChange={setActiveTab}
                className="tenant-tabs"
            />

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <Card title="Rent Agreement Details">
                            <div className="detail-list">
                                <div className="detail-row">
                                    <span className="detail-label">Monthly Rent</span>
                                    <span className="detail-value">{formatCurrency(tenant.rentAmount)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Security Deposit</span>
                                    <span className="detail-value">{formatCurrency(tenant.securityDeposit)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Payment Due Day</span>
                                    <span className="detail-value">Day {tenant.paymentDueDay || 5} of every month</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Agreement Date</span>
                                    <span className="detail-value">{formatDate(tenant.moveInDate)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Emergency Contact">
                            <div className="detail-list">
                                <div className="detail-row">
                                    <span className="detail-label">Name</span>
                                    <span className="detail-value">{tenant.emergencyContactName || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Phone</span>
                                    <span className="detail-value">{tenant.emergencyContactPhone ? formatPhone(tenant.emergencyContactPhone) : '-'}</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="ID Proof">
                            <div className="detail-list">
                                <div className="detail-row">
                                    <span className="detail-label">Type</span>
                                    <span className="detail-value">{tenant.idProofType || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Number</span>
                                    <span className="detail-value">{tenant.idProofNumber || '-'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <Card>
                        <div className="placeholder-content">
                            <p>Payment history will be available in Phase 4.</p>
                            <Button variant="outline" disabled>Record Payment</Button>
                        </div>
                    </Card>
                )}

                {activeTab === 'documents' && (
                    <Card>
                        <div className="placeholder-content">
                            <p>Document storage will be implemented in future phases.</p>
                        </div>
                    </Card>
                )}
            </div>

            <Modal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Move Out Tenant"
                size="sm"
            >
                <p>
                    Are you sure you want to move out <strong>{tenant.fullName}</strong>?
                    This will remove them from the room and archive their current stay.
                </p>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" loading={deleting} onClick={handleDelete}>Confirm Move Out</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
