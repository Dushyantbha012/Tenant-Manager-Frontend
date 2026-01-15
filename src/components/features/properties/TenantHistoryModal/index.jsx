import { useState, useEffect, useMemo } from 'react';
import Modal, { ModalFooter } from '../../../common/Modal';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import Skeleton from '../../../common/Skeleton';
import SearchInput from '../../../common/SearchInput';
import tenantService from '../../../../services/tenantService';
import { formatDate, formatCurrency } from '../../../../utils/formatters';
import './TenantHistoryModal.css';

/**
 * TenantHistoryModal Component
 * Displays tenant history for a room with search functionality
 */
export default function TenantHistoryModal({ open, onClose, room }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (open && room?.id) {
            fetchHistory();
            setSearchQuery(''); // Reset search when modal opens
        }
    }, [open, room?.id]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await tenantService.getTenantHistoryByRoom(room.id);
            setHistory(data || []);
        } catch (error) {
            console.error('Failed to fetch tenant history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter history based on search query
    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;

        const query = searchQuery.toLowerCase();
        return history.filter(tenant =>
            tenant.fullName?.toLowerCase().includes(query) ||
            tenant.phone?.includes(query)
        );
    }, [history, searchQuery]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Tenant History - Room ${room?.roomNumber || ''}`}
            size="md"
        >
            <div className="tenant-history-content">
                {/* Search Input */}
                {!loading && history.length > 0 && (
                    <div className="tenant-history-search">
                        <SearchInput
                            placeholder="Search by tenant name or phone..."
                            value={searchQuery}
                            onSearch={setSearchQuery}
                        />
                    </div>
                )}

                {loading ? (
                    <div className="tenant-history-loading">
                        <Skeleton height="60px" />
                        <Skeleton height="60px" />
                        <Skeleton height="60px" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="tenant-history-empty">
                        <p>No tenant history for this room yet.</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="tenant-history-empty">
                        <p>No tenants match your search.</p>
                    </div>
                ) : (
                    <div className="tenant-history-list">
                        {filteredHistory.map((tenant) => (
                            <div
                                key={tenant.id}
                                className={`tenant-history-item ${tenant.status === 'ACTIVE' ? 'active' : ''}`}
                            >
                                <div className="tenant-history-main">
                                    <div className="tenant-history-name">
                                        <span className="tenant-avatar">
                                            {tenant.fullName?.charAt(0).toUpperCase()}
                                        </span>
                                        <div>
                                            <strong>{tenant.fullName}</strong>
                                            <Badge
                                                variant={tenant.status === 'ACTIVE' ? 'success' : 'neutral'}
                                                size="sm"
                                            >
                                                {tenant.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="tenant-history-rent">
                                        {formatCurrency(tenant.rentAmount)}
                                        <span className="per-month">/month</span>
                                    </div>
                                </div>
                                <div className="tenant-history-dates">
                                    <span>
                                        <strong>Move-in:</strong> {formatDate(tenant.moveInDate)}
                                    </span>
                                    {tenant.moveOutDate && (
                                        <span>
                                            <strong>Move-out:</strong> {formatDate(tenant.moveOutDate)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}
