import { useState, useEffect } from 'react';
import Table from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import Dropdown, { MoreTrigger } from '../../../common/Dropdown';
import assistantService from '../../../../services/assistantService';
import { useToast } from '../../../../context/ToastContext';
import AssistantModal from './AssistantModal';
import { PROPERTY_PERMISSIONS } from '../../../../utils/constants';

// Helper to format permissions for display
const formatPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No Permissions';
    // If all permissions
    if (permissions.length === Object.keys(PROPERTY_PERMISSIONS).length) return 'Full Access';

    return `${permissions.length} Permission${permissions.length > 1 ? 's' : ''}`;
};

export default function AssistantList({ propertyId }) {
    const { showToast } = useToast();
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [modal, setModal] = useState({ open: false, assistant: null });
    const [saving, setSaving] = useState(false);

    const fetchAssistants = async () => {
        setLoading(true);
        try {
            const response = await assistantService.getPropertyAssistants(propertyId);
            setAssistants(response.data || []);
        } catch (error) {
            console.error('Failed to fetch assistants:', error);
            showToast('error', 'Failed to load assistants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            fetchAssistants();
        }
    }, [propertyId]);

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (modal.assistant) {
                // Update permissions
                await assistantService.updatePermissions(propertyId, modal.assistant.userId, data.permissions);
                showToast('success', 'Permissions updated successfully');
            } else {
                // Add assistant access
                await assistantService.grantAccess(propertyId, data.email, data.permissions);
                showToast('success', 'Access granted successfully');
            }
            setModal({ open: false, assistant: null });
            fetchAssistants();
        } catch (error) {
            console.error('Failed to save assistant:', error);
            const msg = error.response?.data?.message || 'Failed to save assistant';
            showToast('error', msg);
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async (assistant) => {
        if (!window.confirm(`Are you sure you want to remove ${assistant.fullName} as an assistant?`)) return;

        try {
            await assistantService.revokeAccess(propertyId, assistant.userId);
            showToast('success', 'Access revoked successfully');
            fetchAssistants();
        } catch (error) {
            console.error('Failed to remove assistant:', error);
            showToast('error', 'Failed to remove assistant');
        }
    };

    return (
        <div className="assistants-list-container">
            <div className="section-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Assistants</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Manage users who can access and help manage this property.
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setModal({ open: true, assistant: null })}
                >
                    Add Assistant
                </Button>
            </div>

            <Table
                columns={[
                    {
                        header: 'Name',
                        accessor: 'fullName',
                        render: (row) => (
                            <div>
                                <div style={{ fontWeight: 500 }}>{row.fullName}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.email}</div>
                            </div>
                        )
                    },
                    {
                        header: 'Status',
                        accessor: 'isActive',
                        render: (row) => (
                            <Badge variant={row.isActive ? 'success' : 'neutral'}>
                                {row.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        )
                    },
                    {
                        header: 'Permissions',
                        accessor: 'permissions',
                        render: (row) => (
                            <Badge variant="primary">
                                {formatPermissions(row.permissions)}
                            </Badge>
                        )
                    },
                    {
                        header: 'Actions',
                        render: (row) => (
                            <Dropdown
                                trigger={<MoreTrigger />}
                                items={[
                                    {
                                        label: 'Edit Permissions',
                                        icon: '✏️',
                                        onClick: () => setModal({ open: true, assistant: row })
                                    },
                                    {
                                        label: 'Remove Access',
                                        icon: '🗑️',
                                        variant: 'danger',
                                        onClick: () => handleRemove(row)
                                    }
                                ]}
                            />
                        )
                    }
                ]}
                data={assistants}
                loading={loading}
                emptyMessage="No assistants added yet."
            />

            <AssistantModal
                open={modal.open}
                onClose={() => setModal({ open: false, assistant: null })}
                onSave={handleSave}
                loading={saving}
                assistant={modal.assistant}
            />
        </div>
    );
}
