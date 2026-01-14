import Badge from '../../../common/Badge';
import './RoomCard.css';

/**
 * RoomCard Component
 * Room status card showing occupancy
 */
export default function RoomCard({
    room,
    onClick,
    onMoveIn,
    compact = false,
}) {
    const {
        roomNumber,
        isOccupied,
        tenant,
        monthlyRent,
        roomType,
    } = room;

    const handleClick = (e) => {
        e.stopPropagation();
        onClick?.();
    };

    const handleMoveIn = (e) => {
        e.stopPropagation();
        onMoveIn?.();
    };

    return (
        <div
            className={`room-card ${isOccupied ? 'room-occupied' : 'room-vacant'} ${compact ? 'room-compact' : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className="room-card-header">
                <span className="room-number">{roomNumber}</span>
                <Badge
                    variant={isOccupied ? 'success' : 'warning'}
                    size="sm"
                >
                    {isOccupied ? 'Occupied' : 'Vacant'}
                </Badge>
            </div>

            {!compact && (
                <div className="room-card-body">
                    {isOccupied ? (
                        <>
                            <p className="room-tenant">{tenant?.fullName || 'Tenant'}</p>
                            <p className="room-rent">₹{monthlyRent?.toLocaleString() || '0'}/mo</p>
                        </>
                    ) : (
                        <>
                            {roomType && <p className="room-type">{roomType}</p>}
                            <button
                                className="room-move-in-btn"
                                onClick={handleMoveIn}
                            >
                                Move In
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
