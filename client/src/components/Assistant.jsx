import { useState, useRef, useEffect } from 'react';
import { assistantAPI } from '../api';
import './Assistant.css';

function Assistant({ isOpen, onToggle, onFiltersUpdate }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I can help you find jobs. Try saying "Show remote jobs" or "Frontend roles in Bangalore".' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const { data } = await assistantAPI.chat(userMessage);

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

            // Update filters if provided
            if (data.filters && Object.keys(data.filters).length > 0) {
                onFiltersUpdate(data.filters);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <button
                className="assistant-toggle"
                onClick={onToggle}
                title="AI Assistant"
            >
                🤖
            </button>

            {isOpen && (
                <div className="assistant-panel">
                    <div className="assistant-header">
                        <h3>🤖 AI Job Assistant</h3>
                        <button onClick={onToggle} className="assistant-close">×</button>
                    </div>

                    <div className="assistant-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message message-${msg.role}`}>
                                <div className="message-content">{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message message-assistant">
                                <div className="message-content">
                                    <span className="loading"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="assistant-input">
                        <input
                            type="text"
                            placeholder="Ask me to find jobs..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input"
                        />
                        <button
                            onClick={handleSend}
                            className="btn btn-primary"
                            disabled={!input.trim() || loading}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Assistant;
