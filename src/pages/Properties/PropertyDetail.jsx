import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import propertyService from '../../services/propertyService';
import floorService from '../../services/floorService';
import roomService from '../../services/roomService';
import tenantService from '../../services/tenantService';
import Button from '../../components/common/Button';
import Tabs, { TabPanel } from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Input from '../../components/common/Input';
import FloorList from '../../components/features/properties/FloorList';
import Dropdown, { MoreTrigger } from '../../components/common/Dropdown';
import Skeleton from '../../components/common/Skeleton';
import './PropertyDetail.css';

/**
 * PropertyDetail Page
 * Property view with tabs for floors, tenants, etc.
 */
export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [property, setProperty] = useState(null);
    const [floors, setFloors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('floors');

    // Modal states
    const [floorModal, setFloorModal] = useState({ open: false, floorId: null });
    const [roomModal, setRoomModal] = useState({ open: false, floorId: null });
    const [bulkFloorModal, setBulkFloorModal] = useState(false);
    const [bulkRoomModal, setBulkRoomModal] = useState({ open: false, floorId: null });

    // Form states
    const [floorForm, setFloorForm] = useState({ floorNumber: '', floorName: '' });
    const [roomForm, setRoomForm] = useState({ roomNumber: '', roomType: 'SINGLE' });
    const [bulkFloorForm, setBulkFloorForm] = useState({ startFloor: 1, endFloor: 5 });
    const [bulkRoomForm, setBulkRoomForm] = useState({ prefix: '', startNum: 1, endNum: 10 });
    const [submitting, setSubmitting] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchPropertyData();
    }, [id]);

    const fetchPropertyData = async () => {
        try {
            setLoading(true);
            const [propertyRes, floorsRes] = await Promise.all([
                propertyService.getById(id),
                floorService.getByPropertyId(id),
            ]);
            setProperty(propertyRes.data);

            // Fetch rooms for each floor
            const floorsWithRooms = await Promise.all(
                (floorsRes.data || []).map(async (floor) => {
                    try {
                        const roomsRes = await roomService.getByFloorId(floor.id);
                        return { ...floor, rooms: roomsRes.data || [] };
                    } catch {
                        return { ...floor, rooms: [] };
                    }
                })
            );
            setFloors(floorsWithRooms);
        } catch (error) {
            console.error('Failed to fetch property:', error);
            showToast('error', 'Failed to load property');
        } finally {
            setLoading(false);
        }
    };

    // Add floor
    const handleAddFloor = async () => {
        if (!floorForm.floorNumber) {
            showToast('error', 'Floor number is required');
            return;
        }

        try {
            setSubmitting(true);
            await floorService.create(id, {
                floorNumber: parseInt(floorForm.floorNumber),
                floorName: floorForm.floorName || null,
            });
            showToast('success', 'Floor added successfully');
            setFloorModal({ open: false, floorId: null });
            setFloorForm({ floorNumber: '', floorName: '' });
            fetchPropertyData();
        } catch (error) {
            console.error('Failed to add floor:', error);
            showToast('error', 'Failed to add floor');
        } finally {
            setSubmitting(false);
        }
    };

    // Bulk add floors
    const handleBulkAddFloors = async () => {
        const { startFloor, endFloor } = bulkFloorForm;
        if (startFloor > endFloor) {
            showToast('error', 'Start floor must be less than end floor');
            return;
        }

        try {
            setSubmitting(true);
            const floors = [];
            for (let i = startFloor; i <= endFloor; i++) {
                floors.push({ floorNumber: i });
            }
            await floorService.bulkCreate({ propertyId: parseInt(id), floors });
            showToast('success', `Added ${floors.length} floors`);
            setBulkFloorModal(false);
            setBulkFloorForm({ startFloor: 1, endFloor: 5 });
            fetchPropertyData();
        } catch (error) {
            console.error('Failed to bulk add floors:', error);
            showToast('error', 'Failed to add floors');
        } finally {
            setSubmitting(false);
        }
    };

    // Add room
    const handleAddRoom = async () => {
        if (!roomForm.roomNumber) {
            showToast('error', 'Room number is required');
            return;
        }

        try {
            setSubmitting(true);
            await roomService.create(roomModal.floorId, roomForm);
            showToast('success', 'Room added successfully');
            setRoomModal({ open: false, floorId: null });
            setRoomForm({ roomNumber: '', roomType: 'SINGLE' });
            fetchPropertyData();
        } catch (error) {
            console.error('Failed to add room:', error);
            showToast('error', 'Failed to add room');
        } finally {
            setSubmitting(false);
        }
    };

    // Bulk add rooms
    const handleBulkAddRooms = async () => {
        const { prefix, startNum, endNum } = bulkRoomForm;
        if (startNum > endNum) {
            showToast('error', 'Start number must be less than end number');
            return;
        }

        try {
            setSubmitting(true);
            const rooms = [];
            for (let i = startNum; i <= endNum; i++) {
                rooms.push({ roomNumber: `${prefix}${i}`, roomType: 'SINGLE' });
            }
            await roomService.bulkCreate({ floorId: bulkRoomModal.floorId, rooms });
            showToast('success', `Added ${rooms.length} rooms`);
            setBulkRoomModal({ open: false, floorId: null });
            setBulkRoomForm({ prefix: '', startNum: 1, endNum: 10 });
            fetchPropertyData();
        } catch (error) {
            console.error('Failed to bulk add rooms:', error);
            showToast('error', 'Failed to add rooms');
        } finally {
            setSubmitting(false);
        }
    };

    const tabItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'floors', label: 'Floors & Rooms', badge: floors.length },
        { id: 'tenants', label: 'Tenants' },
        { id: 'payments', label: 'Payments' },
    ];

    const dropdownItems = [
        {
            label: 'Edit Property',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            ),
            onClick: () => navigate(`/properties/${id}/edit`),
        },
    ];

    if (loading) {
        return (
            <div className="property-detail-page">
                <div className="property-detail-loading">
                    <Skeleton height="200px" />
                    <Skeleton height="400px" />
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="property-detail-page">
                <p>Property not found</p>
            </div>
        );
    }

    const totalRooms = floors.reduce((sum, f) => sum + (f.rooms?.length || 0), 0);
    const occupiedRooms = floors.reduce(
        (sum, f) => sum + (f.rooms?.filter((r) => r.isOccupied)?.length || 0),
        0
    );

    return (
        <div className="property-detail-page">
            {/* Back Link */}
            <Link to="/properties" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12,19 5,12 12,5" />
                </svg>
                Back to Properties
            </Link>

            {/* Hero Section */}
            <div className="property-hero">
                <div className="property-hero-content">
                    <div className="property-hero-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9,22 9,12 15,12 15,22" />
                        </svg>
                    </div>
                    <div className="property-hero-info">
                        <h1 className="property-name">{property.name}</h1>
                        <p className="property-address">
                            📍 {property.address}, {property.city}, {property.state} - {property.postalCode}
                        </p>
                    </div>
                    <Dropdown trigger={<MoreTrigger />} items={dropdownItems} />
                </div>

                <div className="property-stats">
                    <div className="property-stat-card">
                        <span className="stat-value">{floors.length}</span>
                        <span className="stat-label">Floors</span>
                    </div>
                    <div className="property-stat-card">
                        <span className="stat-value">{totalRooms}</span>
                        <span className="stat-label">Total Rooms</span>
                    </div>
                    <div className="property-stat-card">
                        <Badge variant="success" size="lg">{occupiedRooms}</Badge>
                        <span className="stat-label">Occupied</span>
                    </div>
                    <div className="property-stat-card">
                        <Badge variant="warning" size="lg">{totalRooms - occupiedRooms}</Badge>
                        <span className="stat-label">Vacant</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs items={tabItems} activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Panels */}
            <TabPanel active={activeTab === 'overview'}>
                <div className="overview-content">
                    <h3>Property Details</h3>
                    <div className="details-grid">
                        <div><strong>Address:</strong> {property.address}</div>
                        <div><strong>City:</strong> {property.city}</div>
                        <div><strong>State:</strong> {property.state}</div>
                        <div><strong>Postal Code:</strong> {property.postalCode}</div>
                        <div><strong>Country:</strong> {property.country || 'India'}</div>
                    </div>
                </div>
            </TabPanel>

            <TabPanel active={activeTab === 'floors'}>
                <div className="floors-header">
                    <h3>Floors & Rooms</h3>
                    <div className="floors-actions">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFloorModal({ open: true, floorId: null })}
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            }
                        >
                            Add Floor
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBulkFloorModal(true)}
                        >
                            Bulk Add Floors
                        </Button>
                    </div>
                </div>

                <FloorList
                    floors={floors}
                    onAddRoom={(floorId) => setRoomModal({ open: true, floorId })}
                    onBulkAddRooms={(floorId) => setBulkRoomModal({ open: true, floorId })}
                    onRoomClick={async (room) => {
                        if (room.isOccupied) {
                            try {
                                const tenant = await tenantService.getTenantByRoom(room.id);
                                if (tenant) {
                                    navigate(`/tenants/${tenant.id}`);
                                }
                            } catch (error) {
                                console.error('Failed to get tenant for room:', error);
                                showToast('error', 'Failed to find tenant details');
                            }
                        }
                    }}
                    onMoveIn={(room) => navigate(`/tenants/new?roomId=${room.id}`)}
                />
            </TabPanel>

            <TabPanel active={activeTab === 'tenants'}>
                <div className="coming-soon">
                    <p>Tenant list coming in Phase 3</p>
                </div>
            </TabPanel>

            <TabPanel active={activeTab === 'payments'}>
                <div className="coming-soon">
                    <p>Payment history coming in Phase 4</p>
                </div>
            </TabPanel>

            {/* Add Floor Modal */}
            <Modal
                open={floorModal.open}
                onClose={() => setFloorModal({ open: false, floorId: null })}
                title="Add Floor"
                size="sm"
            >
                <div className="form-group">
                    <Input
                        label="Floor Number"
                        type="number"
                        value={floorForm.floorNumber}
                        onChange={(e) => setFloorForm({ ...floorForm, floorNumber: e.target.value })}
                        placeholder="e.g., 1"
                        required
                    />
                </div>
                <div className="form-group">
                    <Input
                        label="Floor Name (Optional)"
                        value={floorForm.floorName}
                        onChange={(e) => setFloorForm({ ...floorForm, floorName: e.target.value })}
                        placeholder="e.g., Ground Floor"
                    />
                </div>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setFloorModal({ open: false, floorId: null })}>
                        Cancel
                    </Button>
                    <Button loading={submitting} onClick={handleAddFloor}>
                        Add Floor
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Bulk Add Floors Modal */}
            <Modal
                open={bulkFloorModal}
                onClose={() => setBulkFloorModal(false)}
                title="Bulk Add Floors"
                size="sm"
            >
                <div className="form-row">
                    <div className="form-group">
                        <Input
                            label="Start Floor"
                            type="number"
                            value={bulkFloorForm.startFloor}
                            onChange={(e) => setBulkFloorForm({ ...bulkFloorForm, startFloor: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="End Floor"
                            type="number"
                            value={bulkFloorForm.endFloor}
                            onChange={(e) => setBulkFloorForm({ ...bulkFloorForm, endFloor: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
                <p className="form-hint">
                    This will create {Math.max(0, bulkFloorForm.endFloor - bulkFloorForm.startFloor + 1)} floors.
                </p>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setBulkFloorModal(false)}>
                        Cancel
                    </Button>
                    <Button loading={submitting} onClick={handleBulkAddFloors}>
                        Add Floors
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Add Room Modal */}
            <Modal
                open={roomModal.open}
                onClose={() => setRoomModal({ open: false, floorId: null })}
                title="Add Room"
                size="sm"
            >
                <div className="form-group">
                    <Input
                        label="Room Number"
                        value={roomForm.roomNumber}
                        onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                        placeholder="e.g., 101"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="input-label">Room Type</label>
                    <select
                        className="select-input"
                        value={roomForm.roomType}
                        onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                    >
                        <option value="SINGLE">Single</option>
                        <option value="DOUBLE">Double</option>
                        <option value="STUDIO">Studio</option>
                        <option value="SUITE">Suite</option>
                    </select>
                </div>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setRoomModal({ open: false, floorId: null })}>
                        Cancel
                    </Button>
                    <Button loading={submitting} onClick={handleAddRoom}>
                        Add Room
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Bulk Add Rooms Modal */}
            <Modal
                open={bulkRoomModal.open}
                onClose={() => setBulkRoomModal({ open: false, floorId: null })}
                title="Bulk Add Rooms"
                size="sm"
            >
                <div className="form-group">
                    <Input
                        label="Room Prefix (Optional)"
                        value={bulkRoomForm.prefix}
                        onChange={(e) => setBulkRoomForm({ ...bulkRoomForm, prefix: e.target.value })}
                        placeholder="e.g., A-"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <Input
                            label="Start Number"
                            type="number"
                            value={bulkRoomForm.startNum}
                            onChange={(e) => setBulkRoomForm({ ...bulkRoomForm, startNum: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="form-group">
                        <Input
                            label="End Number"
                            type="number"
                            value={bulkRoomForm.endNum}
                            onChange={(e) => setBulkRoomForm({ ...bulkRoomForm, endNum: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
                <p className="form-hint">
                    This will create rooms: {bulkRoomForm.prefix}{bulkRoomForm.startNum} to {bulkRoomForm.prefix}{bulkRoomForm.endNum}
                </p>
                <ModalFooter>
                    <Button variant="ghost" onClick={() => setBulkRoomModal({ open: false, floorId: null })}>
                        Cancel
                    </Button>
                    <Button loading={submitting} onClick={handleBulkAddRooms}>
                        Add Rooms
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
