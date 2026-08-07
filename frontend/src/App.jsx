import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const InterviewChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Interviewer',
      text: 'Hello. Today we will be building a FastAPI backend. Are you ready to begin?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-[650px] w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm font-sans">
      {/* Minimal Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
          Technical Interview Session
        </h2>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col group">
            <div className="flex items-baseline space-x-3 mb-1">
              <span className={`text-sm font-semibold ${msg.sender === 'Interviewer' ? 'text-gray-900' : 'text-blue-600'}`}>
                {msg.sender}
              </span>
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {msg.timestamp}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white rounded-b-lg">
        <form onSubmit={handleSend} className="relative flex items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent text-sm resize-none min-h-[52px] max-h-[150px]"
            rows="1"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-gray-800 disabled:opacity-30 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-400 text-right pr-1">
          Press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> to send, <kbd className="font-mono bg-gray-100 px-1 rounded">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;