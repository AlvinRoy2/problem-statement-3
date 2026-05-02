import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../utils/apiService';

/**
 * Chatbot Component
 * Features: AI Typing indicator, Suggested chips, Voice recognition, Accessibility.
 */
export default function Chatbot({ location, progressStep, updateStep }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "👋 Hi! I'm your Election Buddy. How can I help you navigate the voting process today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    
    const chatMessagesRef = useRef(null);
    const recognitionRef = useRef(null);

    // Dynamic suggestions based on progress
    useEffect(() => {
        const suggestionsMap = {
            0: ["Am I registered to vote?", "Registration deadline?", "I'm already registered"],
            1: ["Who's on my ballot?", "Where to find research?", "Finished my research"],
            2: ["Vote by mail info?", "Early voting locations?", "Decided how to vote"],
            3: ["What ID do I need?", "Where's my polling place?", "I voted!"]
        };
        setSuggestions(suggestionsMap[progressStep] || []);
    }, [progressStep]);

    // Auto-scroll to bottom with fallback for test environments
    useEffect(() => {
        if (chatMessagesRef.current) {
            if (typeof chatMessagesRef.current.scrollTo === 'function') {
                chatMessagesRef.current.scrollTo({
                    top: chatMessagesRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
            }
        }
    }, [messages, isTyping]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                handleSend(transcript);
            };
            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const handleSend = async (text) => {
        const msgToSend = typeof text === 'string' ? text : inputValue;
        if (!msgToSend || !msgToSend.trim()) return;
        
        setInputValue('');
        setMessages(prev => [...prev, { text: msgToSend, sender: 'user' }]);
        setIsTyping(true);
        
        try {
            const contextData = { location, progressStep, hasRegistered: progressStep > 0 };
            const response = await sendChatMessage(msgToSend, contextData, progressStep);
            
            // Artificial delay for better UX
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { text: response.reply, sender: 'bot' }]);
                
                if (response.action === 'UPDATE_STEP') {
                    updateStep(parseInt(response.next_step));
                }
            }, 800);
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again.", sender: 'bot' }]);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleVoiceClick = () => {
        if (isListening) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
    };

    return (
        <section className="chat-buddy-container" id="chatBuddy" aria-label="Election Assistant Chat">
            <div className={`chat-window glass-panel ${isOpen ? '' : 'hidden'}`} role="region" aria-live="polite">
                <div className="chat-header">
                    <div className="avatar" aria-hidden="true" style={{ fontSize: '1.2rem' }}>🤖</div>
                    <div>
                        <h4 style={{ margin: 0 }}>Election Buddy</h4>
                        <small style={{ color: 'var(--success)', fontWeight: 600 }}>● Online & Ready</small>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">&times;</button>
                </div>

                <div className="chat-messages" ref={chatMessagesRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`msg ${msg.sender} ${i === messages.length - 1 ? 'last' : ''}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing bot">
                            <span></span><span></span><span></span>
                        </div>
                    )}
                </div>
                
                <div className="chat-suggestions" aria-label="Suggested Questions">
                    {suggestions.map((q, i) => (
                        <button key={i} className="suggestion-btn" onClick={() => handleSend(q)}>
                            {q}
                        </button>
                    ))}
                </div>

                <div className="chat-input-area">
                    {recognitionRef.current && (
                        <button 
                            className={`voice-btn ${isListening ? 'pulse-voice' : ''}`} 
                            onClick={handleVoiceClick}
                            aria-label="Use Microphone" 
                            title="Speech to text"
                        >🎤</button>
                    )}
                    <input 
                        id="chatInput"
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about deadlines..." 
                        aria-label="Chat input field"
                    />
                    <button className="send-btn" onClick={() => handleSend()} aria-label="Send message">➤</button>
                </div>
            </div>

            <button 
                className="chat-toggle" 
                onClick={toggleChat} 
                aria-label="Open Election Chatbot" 
                aria-expanded={isOpen}
            >
                <span className="icon" aria-hidden="true">{isOpen ? '×' : '💬'}</span>
                {!isOpen && <span className="pulse" aria-hidden="true"></span>}
            </button>
        </section>
    );
}
