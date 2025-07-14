// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { ToastContainer } from './components/common/Toast/Toast';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HistoryProvider } from './contexts/HistoryContext';
import ChatBot from './components/chat/ChatBot';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <HistoryProvider>
          <AppRoutes />
          <ToastContainer />
        </HistoryProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
};

export default App;
