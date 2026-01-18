import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import propertyService from '../../services/propertyService';
import AssistantList from '../../components/features/properties/Assistants/AssistantList';
import GlobalAssistantList from '../../components/features/properties/Assistants/GlobalAssistantList';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';
import './AccessControl.css';

export default function AccessControl() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProperty, setExpandedProperty] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await propertyService.getAll();
            // Only show properties owned by the current user
            const ownedProperties = (response.data || []).filter(p => p.owner?.id === user?.id);
            setProperties(ownedProperties);

            // Automatically expand the first property if available
            if (ownedProperties.length > 0) {
                setExpandedProperty(ownedProperties[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProperty = (id) => {
        if (expandedProperty === id) {
            setExpandedProperty(null);
        } else {
            setExpandedProperty(id);
        }
    };

    if (loading) {
        return (
            <div className="access-control-page">
                <Skeleton height="60px" style={{ marginBottom: '20px' }} />
                <Skeleton height="100px" count={3} style={{ marginBottom: '16px' }} />
            </div>
        );
    }

    return (
        <div className="access-control-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Access Control</h1>
                    <p className="page-subtitle">Manage assistants and their permissions for your properties.</p>
                </div>
            </div>

            <GlobalAssistantList />

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>Property Permissions</h3>

            {properties.length === 0 ? (
                <div className="empty-state">
                    <h3>No Properties Found</h3>
                    <p>You need to create a property before you can add assistants.</p>
                    <Button onClick={() => navigate('/properties/new')}>Create Property</Button>
                </div>
            ) : (
                <div className="properties-list">
                    {properties.map(property => (
                        <div key={property.id} className="access-property-card">
                            <div
                                className={`access-property-header ${expandedProperty === property.id ? 'active' : ''}`}
                                onClick={() => toggleProperty(property.id)}
                            >
                                <div className="property-info">
                                    <h3>{property.name}</h3>
                                    <span className="property-location">{property.city}, {property.state}</span>
                                </div>
                                <div className="expand-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        style={{ transform: expandedProperty === property.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {expandedProperty === property.id && (
                                <div className="access-property-content">
                                    <AssistantList propertyId={property.id} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
