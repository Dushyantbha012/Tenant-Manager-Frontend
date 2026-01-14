import { Link } from 'react-router-dom';
import Badge from '../../../common/Badge';
import Dropdown, { MoreTrigger } from '../../../common/Dropdown';
import './PropertyCard.css';

/**
 * PropertyCard Component
 * Card for property grid view
 */
export default function PropertyCard({
    property,
    onEdit,
    onDelete,
}) {
    const {
        id,
        name,
        address,
        city,
        state,
        totalFloors = 0,
        occupiedRooms = 0,
        vacantRooms = 0,
        totalRooms = 0,
    } = property;

    const occupancyRate = totalRooms > 0
        ? Math.round((occupiedRooms / totalRooms) * 100)
        : 0;

    const dropdownItems = [
        {
            label: 'Edit Property',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            ),
            onClick: () => onEdit?.(property),
        },
        { divider: true },
        {
            label: 'Delete Property',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
            ),
            danger: true,
            onClick: () => onDelete?.(property),
        },
    ];

    return (
        <div className="property-card">
            <div className="property-card-header">
                <div className="property-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                </div>
                <Dropdown trigger={<MoreTrigger />} items={dropdownItems} />
            </div>

            <Link to={`/properties/${id}`} className="property-card-content">
                <h3 className="property-card-name">{name}</h3>
                <p className="property-card-address">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {address}, {city}, {state}
                </p>

                <div className="property-card-stats">
                    <div className="property-stat">
                        <span className="property-stat-icon">🏢</span>
                        <span className="property-stat-value">{totalFloors}</span>
                        <span className="property-stat-label">Floors</span>
                    </div>
                    <div className="property-stat">
                        <Badge variant="success" size="sm">
                            {occupiedRooms}
                        </Badge>
                        <span className="property-stat-label">Occupied</span>
                    </div>
                    <div className="property-stat">
                        <Badge variant="warning" size="sm">
                            {vacantRooms}
                        </Badge>
                        <span className="property-stat-label">Vacant</span>
                    </div>
                </div>

                <div className="property-card-occupancy">
                    <div className="occupancy-header">
                        <span>Occupancy</span>
                        <span className="occupancy-rate">{occupancyRate}%</span>
                    </div>
                    <div className="occupancy-bar">
                        <div
                            className="occupancy-fill"
                            style={{ width: `${occupancyRate}%` }}
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}
