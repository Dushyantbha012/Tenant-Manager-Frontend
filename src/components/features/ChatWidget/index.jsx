import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../../../services/chatbotService';
import './ChatWidget.css';

/**
 * ChatWidget Component
 * Floating chat interface for the AI chatbot
 */
export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Quick action suggestions
    const quickActions = [
        'Show my properties',
        'Who hasn\'t paid?',
        'Dashboard summary',
        'Help',
    ];

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = async (messageText = inputValue) => {
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage || isLoading) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: trimmedMessage }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendMessage(trimmedMessage, sessionId);

            // Store session ID for context
            if (response.sessionId) {
                setSessionId(response.sessionId);
            }

            // Add bot response
            setMessages(prev => [...prev, {
                type: 'bot',
                text: response.message || response.response || 'I received your message.',
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: 'Sorry, I encountered an error. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleQuickAction = (action) => {
        handleSend(action);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66" />
                        </svg>
                    </div>
                    <div className="chat-header-info">
                        <h3 className="chat-header-title">TenantBot</h3>
                        <span className="chat-header-status">Online</span>
                    </div>
                    <button
                        className="chat-close-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chat"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <h3>Welcome! 👋</h3>
                            <p>I can help you manage properties, tenants, and payments. Try asking me something!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.type}`}>
                            {msg.text}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-typing">
                            <span className="chat-typing-dot" />
                            <span className="chat-typing-dot" />
                            <span className="chat-typing-dot" />
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length === 0 && (
                    <div className="chat-quick-actions">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="chat-quick-action"
                                onClick={() => handleQuickAction(action)}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="chat-input-container">
                    <div className="chat-input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button
                            className="chat-send-btn"
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Send message"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
