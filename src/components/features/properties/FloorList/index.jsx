import { useState } from 'react';
import RoomCard from '../RoomCard';
import Button from '../../../common/Button';
import './FloorList.css';

/**
 * FloorList Component
 * Expandable accordion list of floors with rooms
 */
export default function FloorList({
    floors = [],
    onAddRoom,
    onBulkAddRooms,
    onRoomClick,
    onMoveIn,
    onRecordPayment,
    onViewHistory,
    loading = false,
}) {
    const [expandedFloors, setExpandedFloors] = useState(
        floors.length > 0 ? [floors[0]?.id] : []
    );

    const toggleFloor = (floorId) => {
        setExpandedFloors((prev) =>
            prev.includes(floorId)
                ? prev.filter((id) => id !== floorId)
                : [...prev, floorId]
        );
    };

    const isExpanded = (floorId) => expandedFloors.includes(floorId);

    if (loading) {
        return (
            <div className="floor-list-loading">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="floor-skeleton">
                        <div className="skeleton skeleton-header" />
                    </div>
                ))}
            </div>
        );
    }

    if (floors.length === 0) {
        return (
            <div className="floor-list-empty">
                <p>No floors added yet</p>
            </div>
        );
    }

    return (
        <div className="floor-list">
            {floors.map((floor) => {
                // Sort rooms numerically/naturally to fix ordering (e.g., 1, 2, 10 instead of 1, 10, 2)
                const sortedRooms = [...(floor.rooms || [])].sort((a, b) =>
                    String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true })
                );

                const occupiedCount = sortedRooms.filter((r) => r.isOccupied).length || 0;
                const totalRooms = sortedRooms.length || 0;

                return (
                    <div
                        key={floor.id}
                        className={`floor-item ${isExpanded(floor.id) ? 'floor-expanded' : ''}`}
                    >
                        <button
                            className="floor-header"
                            onClick={() => toggleFloor(floor.id)}
                            aria-expanded={isExpanded(floor.id)}
                        >
                            <div className="floor-header-left">
                                <span className="floor-toggle-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6,9 12,15 18,9" />
                                    </svg>
                                </span>
                                <span className="floor-name">
                                    Floor {floor.floorNumber}
                                    {floor.floorName && ` (${floor.floorName})`}
                                </span>
                            </div>
                            <div className="floor-header-right">
                                <span className="floor-room-count">
                                    {occupiedCount}/{totalRooms} Rooms
                                </span>
                            </div>
                        </button>

                        {isExpanded(floor.id) && (
                            <div className="floor-content">
                                <div className="floor-actions">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onAddRoom?.(floor.id)}
                                        icon={
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        }
                                    >
                                        Add Room
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onBulkAddRooms?.(floor.id)}
                                    >
                                        Bulk Add
                                    </Button>
                                </div>

                                {totalRooms === 0 ? (
                                    <p className="floor-no-rooms">No rooms on this floor</p>
                                ) : (
                                    <div className="floor-rooms-grid">
                                        {sortedRooms.map((room) => (
                                            <RoomCard
                                                key={room.id}
                                                room={room}
                                                onClick={() => onRoomClick?.(room)}
                                                onMoveIn={() => onMoveIn?.(room)}
                                                onRecordPayment={room.isOccupied ? () => onRecordPayment?.(room) : undefined}
                                                onViewHistory={() => onViewHistory?.(room)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

