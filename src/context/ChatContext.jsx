import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { currentUser as initialUser, mockConversations, mockMessages } from '../data/mockData';

// 1. Create the global ChatContext
export const ChatContext = createContext(null);

/**
 * createChatStore
 * Centralized store implementation using a subscription pattern.
 * Holds state in memory without using useState or useReducer.
 */
function getInitialUser() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('chatflow_current_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
  }
  return initialUser;
}

function createChatStore() {
  let state = {
    currentUser: getInitialUser(),
    conversations: mockConversations,
    selectedChat: mockConversations[0],
    allMessages: mockMessages,
    messages: mockMessages[mockConversations[0]?.id] || [],
    isTyping: false,
  };

  const listeners = new Set();

  const getSnapshot = () => state;

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (updater) => {
    state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
    notify();
  };

  return {
    getSnapshot,
    subscribe,
    setState,
    getState: () => state,
  };
}

/**
 * ChatProvider Component
 * Manages global state using:
 * - useContext (to share state across the tree)
 * - useRef (to hold store instance and timers without causing unwanted renders)
 * - useEffect (for lifecycle management and timer cleanup)
 * - useSyncExternalStore (React's standard subscription hook for ref stores)
 * - Custom hooks (useChatContext)
 *
 * Strictly NO useState and NO useReducer used.
 */
export function ChatProvider({ children }) {
  // Store instance held in useRef to persist across renders
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createChatStore();
  }
  const store = storeRef.current;

  // Timers for simulated contact replies held in useRef
  const replyTimerRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Lifecycle timer cleanup using useEffect
  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  /**
   * Action: sendMessage
   * Appends new message to the useRef store and triggers simulated reply.
   */
  const sendMessage = useCallback((text, media = null, attachment = null) => {
    if (!text?.trim() && !media && !attachment) return;

    const currentState = store.getState();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentState.currentUser?.id || 'user_0',
      senderName: currentState.currentUser?.name || 'Alex Morgan',
      senderAvatar: currentState.currentUser?.avatar || '',
      text: text.trim(),
      timestamp: timeStr,
      date: 'Today',
      status: 'sent',
      ...(media && { media }),
      ...(attachment && { attachment }),
    };

    const chatId = currentState.selectedChat?.id || 'conv_1';

    // Update store state via setState
    store.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      allMessages: {
        ...prev.allMessages,
        [chatId]: [...(prev.allMessages[chatId] || []), newMsg],
      },
      conversations: prev.conversations.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: text.trim() || (media ? 'Sent an image' : 'Sent an attachment'),
              timestamp: timeStr,
            }
          : c
      ),
    }));

    // Simulated contact auto-reply
    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      store.setState((prev) => ({ ...prev, isTyping: true }));
    }, 400);

    replyTimerRef.current = setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sampleReplies = [
        "Got it! Thanks for reaching out.",
        "That makes sense. I'll review it right away!",
        "Awesome! The ref-based store state update is working smoothly.",
        "Looks great to me. Let's move forward!",
      ];
      const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

      const autoMsg = {
        id: `reply_${Date.now()}`,
        senderId: chatId,
        senderName: store.getState().selectedChat?.name || 'Contact',
        senderAvatar: store.getState().selectedChat?.avatar || '',
        text: randomReply,
        timestamp: replyTime,
        date: 'Today',
        status: 'delivered',
      };

      store.setState((prev) => ({
        ...prev,
        isTyping: false,
        messages: prev.selectedChat?.id === chatId ? [...prev.messages, autoMsg] : prev.messages,
        allMessages: {
          ...prev.allMessages,
          [chatId]: [...(prev.allMessages[chatId] || []), autoMsg],
        },
        conversations: prev.conversations.map((c) =>
          c.id === chatId
            ? {
                ...c,
                lastMessage: randomReply,
                timestamp: replyTime,
              }
            : c
        ),
      }));
    }, 1500);
  }, [store]);

  /**
   * Action: deleteMessage
   * Filters out the message from the useRef store.
   */
  const deleteMessage = useCallback((id) => {
    const currentState = store.getState();
    const chatId = currentState.selectedChat?.id || 'conv_1';

    store.setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== id),
      allMessages: {
        ...prev.allMessages,
        [chatId]: (prev.allMessages[chatId] || []).filter((msg) => msg.id !== id),
      },
    }));
  }, [store]);

  /**
   * Action: clearChat
   * Clears all messages in current conversation.
   */
  const clearChat = useCallback(() => {
    const currentState = store.getState();
    const chatId = currentState.selectedChat?.id || 'conv_1';

    store.setState((prev) => ({
      ...prev,
      messages: [],
      allMessages: {
        ...prev.allMessages,
        [chatId]: [],
      },
    }));
  }, [store]);

  /**
   * Action: selectConversation
   * Switches active conversation and synchronizes its messages.
   */
  const selectConversation = useCallback((convOrId) => {
    const currentState = store.getState();
    const target = typeof convOrId === 'string'
      ? currentState.conversations.find((c) => c.id === convOrId)
      : convOrId;

    if (target) {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      store.setState((prev) => ({
        ...prev,
        selectedChat: target,
        messages: prev.allMessages[target.id] || [],
        isTyping: false,
        conversations: prev.conversations.map((c) =>
          c.id === target.id ? { ...c, unreadCount: 0 } : c
        ),
      }));
    }
  }, [store]);

  /**
   * Action: setCurrentUser
   */
  const setCurrentUser = useCallback((user) => {
    if (typeof window !== 'undefined' && user) {
      try {
        localStorage.setItem('chatflow_current_user', JSON.stringify(user));
      } catch (e) {
        // ignore
      }
    }
    store.setState((prev) => ({ ...prev, currentUser: user }));
  }, [store]);

  /**
   * Action: setSelectedChat
   */
  const setSelectedChat = useCallback((chat) => {
    selectConversation(chat);
  }, [selectConversation]);

  /**
   * Action: setConversations
   */
  const setConversations = useCallback((conversations) => {
    store.setState((prev) => ({
      ...prev,
      conversations: typeof conversations === 'function' ? conversations(prev.conversations) : conversations,
    }));
  }, [store]);

  // Subscribe to the store to receive latest state snapshots
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

  // Context value exposed to all consumer components
  const contextValue = {
    // State properties
    messages: state.messages,
    currentUser: state.currentUser,
    selectedChat: state.selectedChat,
    conversations: state.conversations,
    isTyping: state.isTyping,

    // Store object and actions
    store,
    sendMessage,
    deleteMessage,
    clearChat,
    setCurrentUser,
    setSelectedChat,
    selectConversation,
    setConversations,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Custom hook: useChatContext
 * Custom hook to access ChatContext with validation.
 */
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
