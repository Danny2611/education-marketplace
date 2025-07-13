import { Product } from './product';

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatBotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  error?: string;
}

export interface UseChatReturn {
  chatState: ChatBotState;
  sendMessage: (message: string) => Promise<void>;
  toggleChat: () => void;
  clearChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  relatedProducts?: Product[];
}
