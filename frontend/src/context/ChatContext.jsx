import React, { createContext, useContext } from 'react';
import { useChatState } from '../hooks/useChatState';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chatState = useChatState();

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

export { ChatContext };
