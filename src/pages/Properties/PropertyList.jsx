import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import propertyService from '../../services/propertyService';
import Button from '../../components/common/Button';
import SearchInput from '../../components/common/SearchInput';
import PropertyCard from '../../components/features/properties/PropertyCard';
import EmptyState from '../../components/common/EmptyState';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import './PropertyList.css';

/**
 * PropertyList Page
 * Display all properties with search and grid/list view
 */
export default function PropertyList() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [deleteModal, setDeleteModal] = useState({ open: false, property: null });
    const [deleting, setDeleting] = useState(false);

    // Fetch properties
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await propertyService.getAll();
            setProperties(response.data || []);
            setFilteredProperties(response.data || []);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            showToast('error', 'Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    // Filter properties by search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredProperties(properties);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = properties.filter(
            (p) =>
                p.name?.toLowerCase().includes(lowerQuery) ||
                p.address?.toLowerCase().includes(lowerQuery) ||
                p.city?.toLowerCase().includes(lowerQuery)
        );
        setFilteredProperties(filtered);
    };

    // Navigate to edit
    const handleEdit = (property) => {
        navigate(`/properties/${property.id}/edit`);
    };

    // Open delete confirmation
    const handleDeleteClick = (property) => {
        setDeleteModal({ open: true, property });
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteModal.property) return;

        try {
            setDeleting(true);
            await propertyService.delete(deleteModal.property.id);
            showToast('success', 'Property deleted successfully');
            setDeleteModal({ open: false, property: null });
            fetchProperties();
        } catch (error) {
            console.error('Failed to delete property:', error);
            showToast('error', 'Failed to delete property');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="property-list-page">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Properties</h1>
                    <p className="page-subtitle">
                        Manage your properties, floors, and rooms
                    </p>
                </div>
                <Link to="/properties/new">
                    <Button
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        }
                    >
                        Add Property
                    </Button>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="property-toolbar">
                <SearchInput
                    placeholder="Search properties..."
                    value={searchQuery}
                    onSearch={handleSearch}
                    className="property-search"
                />
                <div className="view-toggle">
                    <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="property-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="property-skeleton">
                            <Skeleton height="200px" />
                        </div>
                    ))}
                </div>
            ) : filteredProperties.length === 0 ? (
                <EmptyState
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9,22 9,12 15,12 15,22" />
                        </svg>
                    }
                    title={searchQuery ? 'No properties found' : 'No properties yet'}
                    description={
                        searchQuery
                            ? 'Try a different search term'
                            : 'Get started by adding your first property'
                    }
                    action={
                        !searchQuery && (
                            <Link to="/properties/new">
                                <Button>Add Your First Property</Button>
                            </Link>
                        )
                    }
                />
            ) : (
                <div className={`property-${viewMode}`}>
                    {filteredProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                open={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, property: null })}
                title="Delete Property"
                size="sm"
            >
                <p>
                    Are you sure you want to delete <strong>{deleteModal.property?.name}</strong>?
                    This action cannot be undone.
                </p>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setDeleteModal({ open: false, property: null })}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        loading={deleting}
                        onClick={handleConfirmDelete}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
