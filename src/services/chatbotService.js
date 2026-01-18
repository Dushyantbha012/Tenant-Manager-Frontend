import api from './api';

/**
 * Chatbot Service
 * Handles communication with the chatbot backend API
 */

/**
 * Send a message to the chatbot and get a response
 * @param {string} message - The user's message
 * @param {string} sessionId - Optional session ID for context
 * @returns {Promise<Object>} - The chatbot response
 */
export const sendMessage = async (message, sessionId = null) => {
    const payload = { message };
    if (sessionId) {
        payload.sessionId = sessionId;
    }

    const response = await api.post('/api/chat/message', payload);
    return response.data;
};

/**
 * Get chat session info
 * @returns {Promise<Object>} - Session information
 */
export const getSession = async () => {
    const response = await api.get('/api/chat/session');
    return response.data;
};

export default {
    sendMessage,
    getSession,
};
