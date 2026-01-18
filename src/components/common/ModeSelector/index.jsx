import { useViewMode, VIEW_MODES } from '../../../context/ViewModeContext';
import './ModeSelector.css';

/**
 * Mode Selector Component
 * Allows users to switch between Owner and Assistant viewing modes
 */
export default function ModeSelector() {
    const { mode, switchMode, owners, selectedOwnerId, selectOwner, isAssistantMode, loading } = useViewMode();

    // Don't render if user has no assistant relationships
    // This check happens after the first owners fetch
    if (!loading && owners.length === 0 && !isAssistantMode) {
        // User is not an assistant to anyone, no need to show mode selector
        return null;
    }

    return (
        <div className="mode-selector">
            <div className="mode-toggle">
                <button
                    className={`mode-btn ${mode === VIEW_MODES.OWNER ? 'active' : ''}`}
                    onClick={() => switchMode(VIEW_MODES.OWNER)}
                    title="View properties you own"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mode-icon">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>Owner</span>
                </button>
                <button
                    className={`mode-btn ${mode === VIEW_MODES.ASSISTANT ? 'active' : ''}`}
                    onClick={() => switchMode(VIEW_MODES.ASSISTANT)}
                    title="View properties you assist"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mode-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Assistant</span>
                </button>
            </div>

            {isAssistantMode && owners.length > 0 && (
                <select
                    className="owner-select"
                    value={selectedOwnerId || ''}
                    onChange={(e) => selectOwner(e.target.value)}
                    title="Filter by owner"
                >
                    <option value="">All Owners</option>
                    {owners.map(owner => (
                        <option key={owner.id} value={owner.id}>
                            {owner.fullName}
                        </option>
                    ))}
                </select>
            )}

            {loading && (
                <div className="mode-loading">
                    <div className="spinner-small"></div>
                </div>
            )}
        </div>
    );
}
