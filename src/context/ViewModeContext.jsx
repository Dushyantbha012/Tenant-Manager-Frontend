import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import api from '../services/api';

const ViewModeContext = createContext(null);

export const VIEW_MODES = {
    OWNER: 'owner',
    ASSISTANT: 'assistant',
};

/**
 * View Mode Provider Component
 * Manages the owner/assistant viewing mode state
 */
export function ViewModeProvider({ children }) {
    const [mode, setMode] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || VIEW_MODES.OWNER
    );
    const [selectedOwnerId, setSelectedOwnerId] = useState(() => {
        const stored = localStorage.getItem('selected_owner_id');
        return stored ? Number(stored) : null;
    });
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch owners when switching to assistant mode
    useEffect(() => {
        if (mode === VIEW_MODES.ASSISTANT) {
            fetchOwners();
        }
    }, [mode]);

    const fetchOwners = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/users/owners');
            setOwners(response.data);
        } catch (error) {
            console.error('Failed to fetch owners', error);
            setOwners([]);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        localStorage.setItem(STORAGE_KEYS.VIEW_MODE, newMode);
        if (newMode === VIEW_MODES.OWNER) {
            setSelectedOwnerId(null);
            localStorage.removeItem('selected_owner_id');
        }
    }, []);

    const selectOwner = useCallback((ownerId) => {
        const id = ownerId ? Number(ownerId) : null;
        setSelectedOwnerId(id);
        if (id) {
            localStorage.setItem('selected_owner_id', String(id));
        } else {
            localStorage.removeItem('selected_owner_id');
        }
    }, []);

    const value = {
        mode,
        selectedOwnerId,
        owners,
        loading,
        switchMode,
        selectOwner,
        isOwnerMode: mode === VIEW_MODES.OWNER,
        isAssistantMode: mode === VIEW_MODES.ASSISTANT,
    };

    return (
        <ViewModeContext.Provider value={value}>
            {children}
        </ViewModeContext.Provider>
    );
}

/**
 * Custom hook to use view mode context
 */
export function useViewMode() {
    const context = useContext(ViewModeContext);
    if (!context) {
        throw new Error('useViewMode must be used within a ViewModeProvider');
    }
    return context;
}

export default ViewModeContext;
