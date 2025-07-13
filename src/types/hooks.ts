import { ChatBotState } from "./chat";
import { Product, ProductFilters } from "./product";

export interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  getSuggestions: () => Promise<void>;
}

export interface UseChatReturn {
  chatState: ChatBotState;
  sendMessage: (message: string) => Promise<void>;
  toggleChat: () => void;
  clearChat: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null> ;
}
