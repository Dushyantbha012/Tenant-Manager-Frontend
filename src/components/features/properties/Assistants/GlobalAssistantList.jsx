import { useState, useEffect } from 'react';
import Table from '../../../common/Table';
import Button from '../../../common/Button';
import Badge from '../../../common/Badge';
import Dropdown, { MoreTrigger } from '../../../common/Dropdown';
import assistantService from '../../../../services/assistantService';
import { useToast } from '../../../../context/ToastContext';
import Input from '../../../common/Input';
import Modal from '../../../common/Modal';

export default function GlobalAssistantList() {
    const { showToast } = useToast();
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add Assistant Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);

    const fetchAssistants = async () => {
        setLoading(true);
        try {
            const response = await assistantService.getMyAssistants();
            setAssistants(response.data || []);
        } catch (error) {
            console.error('Failed to fetch assistants:', error);
            showToast('error', 'Failed to load assistants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!email) return;

        setAdding(true);
        try {
            await assistantService.addAssistant(email);
            showToast('success', 'Assistant added successfully');
            setModalOpen(false);
            setEmail('');
            fetchAssistants();
        } catch (error) {
            console.error('Failed to add assistant:', error);
            const msg = error.response?.data?.message || 'Failed to add assistant';
            showToast('error', msg);
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (assistant) => {
        if (!window.confirm(`Are you sure you want to remove ${assistant.fullName} from your assistants? This will revoke their access to ALL your properties.`)) return;

        try {
            await assistantService.removeAssistant(assistant.id);
            showToast('success', 'Assistant removed successfully');
            fetchAssistants();
        } catch (error) {
            console.error('Failed to remove assistant:', error);
            showToast('error', 'Failed to remove assistant');
        }
    };

    return (
        <div style={{ padding: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>My Assistants</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        People you have added to help manage your properties.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                    Add New Assistant
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
                        header: 'Added On',
                        accessor: 'createdAt',
                        render: (row) => new Date(row.createdAt).toLocaleDateString()
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
                        header: 'Actions',
                        render: (row) => (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-danger"
                                onClick={() => handleRemove(row)}
                            >
                                Remove
                            </Button>
                        )
                    }
                ]}
                data={assistants}
                loading={loading}
                emptyMessage="You haven't added any assistants yet."
            />

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Add Assistant"
            >
                <form onSubmit={handleAdd}>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        Enter the email address of the user you want to add as an assistant.
                        They must already be registered in the system.
                    </p>
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="assistant@example.com"
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                        <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={adding}>
                            Add Assistant
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
