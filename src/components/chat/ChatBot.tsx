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
        message:
          'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm khoá học phù hợp. Bạn muốn học gì?',
        isUser: false,
        timestamp: new Date(),
      },
    ],
    isTyping: false,
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
        block: 'end',
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
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      error: undefined,
    }));

    setInput('');

    try {
      // Simulate AI thinking time
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000),
      );

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getAIResponse(input.trim()),
        isUser: false,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        isTyping: false,
      }));
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        isTyping: false,
        error: 'Không thể gửi tin nhắn',
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
    setChatState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
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
    setChatState((prev) => ({
      ...prev,
      messages: [
        {
          id: '1',
          message:
            'Xin chào! Tôi là trợ lý AI. Tôi có thể giúp bạn tìm khoá học phù hợp. Bạn muốn học gì?',
          isUser: false,
          timestamp: new Date(),
        },
      ],
      isTyping: false,
      error: undefined,
    }));
    showInfoToast('Đã xóa cuộc trò chuyện');
  };

  const retryLastMessage = () => {
    const lastUserMessage = chatState.messages
      .filter((msg) => msg.isUser)
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
          className="group relative rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Mở trợ lý AI"
        >
          <MessageSquare size={24} />
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <Bot size={12} className="text-white" />
          </div>

          {/* Tooltip */}
          <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2 transform whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Trợ lý AI
            <div className="absolute left-full top-1/2 h-0 w-0 -translate-y-1/2 transform border-y-4 border-l-4 border-y-transparent border-l-gray-800"></div>
          </div>
        </button>
      </div>
    );
  }

  // Minimized chat
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="min-w-[200px] rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">
                AI đang sẵn sàng
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={restoreChat}
                className="rounded p-1 hover:bg-gray-100"
                aria-label="Mở rộng chat"
              >
                <MessageSquare size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
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
      <div className="flex max-h-[600px] w-80 flex-col rounded-lg border border-gray-200 bg-white shadow-2xl sm:w-96">
        {/* Header */}
        <div className="rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot size={24} />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Tư vấn</h3>
                <p className="text-xs text-blue-100">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label="Xóa cuộc trò chuyện"
                title="Xóa cuộc trò chuyện"
              >
                <RefreshCcw size={18} />
              </button>
              <button
                onClick={minimizeChat}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label="Thu nhỏ chat"
                title="Thu nhỏ"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={toggleChat}
                className="rounded-full p-2 transition-colors hover:bg-white/10"
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
          className="max-h-[400px] min-h-[300px] flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4"
        >
          {chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-2 ${message.isUser ? 'flex-row-reverse' : ''}`}
              >
                {!message.isUser && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 shadow-sm ${
                    message.isUser
                      ? 'rounded-br-none bg-blue-500 text-white'
                      : 'rounded-bl-none border border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.message}
                  </p>
                  <div
                    className={`mt-2 text-xs ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
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
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="rounded-lg rounded-bl-none border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      AI đang suy nghĩ...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {chatState.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-700">
                    {chatState.error}
                  </span>
                </div>
                <button
                  onClick={retryLastMessage}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="rounded-b-lg border-t border-gray-200 bg-white p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={chatState.isTyping}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatState.isTyping}
              className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2 text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput('Tôi muốn học tiếng Anh')}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200"
            >
              Tiếng Anh
            </button>
            <button
              onClick={() => setInput('Khóa học lập trình nào tốt?')}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200"
            >
              Lập trình
            </button>
            <button
              onClick={() => setInput('Tư vấn khóa học marketing')}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200"
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
