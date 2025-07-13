
import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, Send, X, Loader2, RefreshCcw } from 'lucide-react';
import { ChatMessage, ChatBotState } from '../../types';
import { useToast } from '../../hooks/useToast';
import { getAIResponse } from '../../utils/helpers';
import { TOAST_MESSAGES } from '../../utils/toastMessages';
import { showInfoToast } from '../common/Toast/Toast';

const ChatBot: React.FC = () => {
  const [chatState, setChatState] = useState<ChatBotState>({
    isOpen: false,
    messages: [
      {
        id: '1',
        message: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm khoá học phù hợp. Bạn muốn học gì?',
        isUser: false,
        timestamp: new Date()
      }
    ],
    isTyping: false
  });
  
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { showError, showSuccess } = useToast();

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatState.isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [chatState.messages, chatState.isTyping, chatState.isOpen, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatState.isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [chatState.isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      error: undefined
    }));
    
    setInput('');

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getAIResponse(input.trim()),
        isUser: false,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        isTyping: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isTyping: false,
        error: 'Không thể gửi tin nhắn'
      }));
      showError(TOAST_MESSAGES.CHAT_ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setChatState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const restoreChat = () => {
    setIsMinimized(false);
  };

  const clearChat = () => {
    setChatState(prev => ({
      ...prev,
      messages: [
        {
          id: '1',
          message: 'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm khoá học phù hợp. Bạn muốn học gì?',
          isUser: false,
          timestamp: new Date()
        }
      ],
      isTyping: false,
      error: undefined
    }));
    showInfoToast('Đã xóa cuộc trò chuyện');
  };

  const retryLastMessage = () => {
    const lastUserMessage = chatState.messages
      .filter(msg => msg.isUser)
      .pop();
    
    if (lastUserMessage) {
      setInput(lastUserMessage.message);
      inputRef.current?.focus();
    }
  };

  // Floating button when chat is closed
  if (!chatState.isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChat}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Mở trợ lý AI"
        >
          <MessageSquare size={24} />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <Bot size={12} className="text-white" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Trợ lý AI
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-y-4 border-y-transparent"></div>
          </div>
        </button>
      </div>
    );
  }

  // Minimized chat
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">AI đang sẵn sàng</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={restoreChat}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Mở rộng chat"
              >
                <MessageSquare size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
                aria-label="Đóng chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full chat interface
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 sm:w-96 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot size={24} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Tư vấn</h3>
                <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Xóa cuộc trò chuyện"
                title="Xóa cuộc trò chuyện"
              >
                <RefreshCcw size={18} />
              </button>
              <button
                onClick={minimizeChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Thu nhỏ chat"
                title="Thu nhỏ"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Đóng chat"
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-gray-50"
        >
          {chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                {!message.isUser && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg shadow-sm ${
                    message.isUser
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <div className={`text-xs mt-2 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {chatState.isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white p-3 rounded-lg rounded-bl-none border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {chatState.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-700">{chatState.error}</span>
                </div>
                <button
                  onClick={retryLastMessage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={chatState.isTyping}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatState.isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Gửi tin nhắn"
            >
              {chatState.isTyping ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setInput('Tôi muốn học tiếng Anh')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
            >
              Tiếng Anh
            </button>
            <button
              onClick={() => setInput('Khóa học lập trình nào tốt?')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
            >
              Lập trình
            </button>
            <button
              onClick={() => setInput('Tư vấn khóa học marketing')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
            >
              Marketing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;