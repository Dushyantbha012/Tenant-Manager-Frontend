import { useState, useEffect } from 'react';
import Modal, { ModalFooter } from '../../../common/Modal';
import Button from '../../../common/Button';
import Input from '../../../common/Input';
import { PROPERTY_PERMISSIONS } from '../../../../utils/constants';
import './AssistantModal.css';

const PERMISSION_LABELS = {
    [PROPERTY_PERMISSIONS.VIEW_PROPERTY]: 'View Property Details',
    [PROPERTY_PERMISSIONS.MANAGE_ROOMS]: 'Manage Floors & Rooms',
    [PROPERTY_PERMISSIONS.MANAGE_TENANTS]: 'Manage Tenants',
    [PROPERTY_PERMISSIONS.MANAGE_PAYMENTS]: 'Record & Manage Payments',
    [PROPERTY_PERMISSIONS.VIEW_FINANCIALS]: 'View Financial Reports',
    [PROPERTY_PERMISSIONS.MANAGE_SETTINGS]: 'Manage Settings',
};

export default function AssistantModal({ open, onClose, onSave, loading, assistant = null }) {
    const [myAssistants, setMyAssistants] = useState([]);
    const [selectedAssistantId, setSelectedAssistantId] = useState('');
    const [email, setEmail] = useState('');
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (open) {
            if (assistant) {
                setEmail(assistant.email);
                setPermissions(assistant.permissions || []);
            } else {
                setEmail('');
                setSelectedAssistantId('');
                setPermissions([]);
                fetchMyAssistants();
            }
        }
    }, [open, assistant]);

    const fetchMyAssistants = async () => {
        try {
            const { default: assistantService } = await import('../../../../services/assistantService');
            const response = await assistantService.getMyAssistants();
            setMyAssistants(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssistantSelect = (e) => {
        const id = e.target.value;
        setSelectedAssistantId(id);
        const selected = myAssistants.find(a => a.id.toString() === id);
        if (selected) {
            setEmail(selected.email);
        }
    };

    const handlePermissionToggle = (perm) => {
        setPermissions(prev => {
            if (prev.includes(perm)) {
                return prev.filter(p => p !== perm);
            }
            return [...prev, perm];
        });
    };

    const handleSubmit = () => {
        onSave({
            email,
            permissions
        });
    };

    const isEdit = !!assistant;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? 'Edit Permissions' : 'Grant Access'}
            size="md"
        >
            <div className="assistant-modal-content">
                {!isEdit && (
                    <div className="form-group">
                        <label className="input-label">Select Assistant</label>
                        <select
                            className="form-input"
                            value={selectedAssistantId}
                            onChange={handleAssistantSelect}
                        >
                            <option value="">-- Select an Assistant --</option>
                            {myAssistants.map(a => (
                                <option key={a.id} value={a.id}>{a.fullName} ({a.email})</option>
                            ))}
                        </select>
                        <p className="form-hint" style={{ marginTop: '8px' }}>
                            Only assistants added to your account are shown here.
                            Go to Access Control to add new assistants.
                        </p>
                    </div>
                )}
                {isEdit && (
                    <div className="form-group">
                        <label className="input-label">Assistant</label>
                        <div className="assistant-info-display">
                            <span className="assistant-name">{assistant.fullName}</span>
                            <span className="assistant-email">({assistant.email})</span>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label className="input-label">Permissions</label>
                    <div className="permissions-grid">
                        {Object.values(PROPERTY_PERMISSIONS).map(perm => (
                            <label key={perm} className="permission-checkbox">
                                <input
                                    type="checkbox"
                                    checked={permissions.includes(perm)}
                                    onChange={() => handlePermissionToggle(perm)}
                                />
                                <span className="permission-label">{PERMISSION_LABELS[perm]}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button loading={loading} onClick={handleSubmit}>
                    {isEdit ? 'Update Permissions' : 'Add Assistant'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
