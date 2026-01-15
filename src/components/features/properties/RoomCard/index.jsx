import Badge from '../../../common/Badge';
import './RoomCard.css';

/**
 * RoomCard Component
 * Room status card showing occupancy with payment and history actions
 * Colors: grey = vacant, green = paid, red = due
 */
export default function RoomCard({
    room,
    onClick,
    onMoveIn,
    onRecordPayment,
    onViewHistory,
    compact = false,
}) {
    const {
        roomNumber,
        isOccupied,
        tenantName,      // From new /rooms/info endpoint
        dueAmount,       // From new /rooms/info endpoint
        roomType,
        paymentStatus = 'vacant', // 'vacant', 'paid', or 'due'
    } = room;

    // Determine the CSS class based on payment status
    const getStatusClass = () => {
        if (!isOccupied) return 'room-vacant';
        return paymentStatus === 'due' ? 'room-due' : 'room-paid';
    };

    // Determine badge variant based on payment status
    const getBadgeVariant = () => {
        if (!isOccupied) return 'neutral'; // Grey for vacant
        return paymentStatus === 'due' ? 'danger' : 'success';
    };

    const getBadgeText = () => {
        if (!isOccupied) return 'Vacant';
        return paymentStatus === 'due' ? 'Occupied' : 'Occupied';
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onClick?.();
    };

    const handleMoveIn = (e) => {
        e.stopPropagation();
        onMoveIn?.();
    };

    const handleRecordPayment = (e) => {
        e.stopPropagation();
        onRecordPayment?.();
    };

    const handleViewHistory = (e) => {
        e.stopPropagation();
        onViewHistory?.();
    };

    return (
        <div
            className={`room-card ${getStatusClass()} ${compact ? 'room-compact' : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className="room-card-header">
                <span className="room-number">{roomNumber}</span>
                <Badge
                    variant={getBadgeVariant()}
                    size="sm"
                >
                    {getBadgeText()}
                </Badge>
            </div>

            {!compact && (
                <div className="room-card-body">
                    {isOccupied ? (
                        <>
                            <p className="room-tenant">{tenantName || 'Tenant'}</p>
                            <p className={`room-rent ${dueAmount > 0 ? 'has-due' : ''}`}>
                                {dueAmount > 0 ? `₹${dueAmount?.toLocaleString()} due` : 'Paid ✓'}
                            </p>
                            <div className="room-actions">
                                {onRecordPayment && (
                                    <button
                                        className="room-action-btn room-pay-btn"
                                        onClick={handleRecordPayment}
                                        title="Record Payment"
                                    >
                                        💰 Pay
                                    </button>
                                )}
                                {onViewHistory && (
                                    <button
                                        className="room-action-btn room-history-btn"
                                        onClick={handleViewHistory}
                                        title="View Tenant History"
                                    >
                                        📋 History
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {roomType && <p className="room-type">{roomType}</p>}
                            <div className="room-actions">
                                <button
                                    className="room-move-in-btn"
                                    onClick={handleMoveIn}
                                >
                                    Move In
                                </button>
                                {onViewHistory && (
                                    <button
                                        className="room-action-btn room-history-btn"
                                        onClick={handleViewHistory}
                                        title="View Tenant History"
                                    >
                                        📋
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
