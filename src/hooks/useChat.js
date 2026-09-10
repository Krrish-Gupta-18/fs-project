import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { mockContacts } from '../data/mockData';
import { ChatContext } from '../context/ChatContext';

/**
 * useChat Hook
 * Bridges routing and UI state with the global ChatContext (Experiment No. 3).
 * Components can use either this hook or `useContext(ChatContext)` directly.
 */
export function useChat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Consume the global state from ChatContext (Experiment No. 3)
  const chatContext = useContext(ChatContext);

  const {
    messages: contextMessages = [],
    currentUser,
    selectedChat: contextSelectedChat,
    conversations: contextConversations = [],
    isTyping: contextIsTyping = false,
    sendMessage: contextSendMessage,
    deleteMessage: contextDeleteMessage,
    clearChat: contextClearChat,
    selectConversation: contextSelectConversation,
    setConversations: contextSetConversations,
  } = chatContext || {};

  // UI state for search and filtering
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'groups'
  const [searchQuery, setSearchQuery] = useState('');

  // UI Drawer & Modal states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Status flags
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Debounced search query using custom hook useDebounce
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const conversations = contextConversations;
  const activeConversation = contextSelectedChat || conversations[0] || null;
  const activeMessages = contextMessages;
  const userProfile = currentUser;
  const isTyping = contextIsTyping;

  // Synchronize route URL param with ChatContext
  useEffect(() => {
    if (conversationId && contextSelectConversation && contextSelectedChat?.id !== conversationId) {
      contextSelectConversation(conversationId);
    }
  }, [conversationId, contextSelectConversation, contextSelectedChat]);

  // Navigate to default conversation on initial load if route parameter is missing
  useEffect(() => {
    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  // Document Title Sync
  useEffect(() => {
    if (activeConversation) {
      if (isTyping) {
        document.title = `ChatFlow (Typing...) - ${activeConversation.name}`;
      } else {
        document.title = `ChatFlow - ${activeConversation.name}`;
      }
    } else {
      document.title = 'ChatFlow - Real-Time Messaging';
    }

    return () => {
      document.title = 'ChatFlow';
    };
  }, [activeConversation, isTyping]);

  // Memoized Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const query = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        conv.name.toLowerCase().includes(query) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (activeTab === 'unread') return conv.unreadCount > 0;
      if (activeTab === 'groups') return conv.type === 'group';
      return true;
    });
  }, [conversations, activeTab, debouncedSearchQuery]);

  // Select conversation handler
  const selectConversation = useCallback(
    (id) => {
      if (contextSelectConversation) {
        contextSelectConversation(id);
      }
      setIsMobileSidebarOpen(false);
      navigate(`/chat/${id}`);
    },
    [contextSelectConversation, navigate]
  );

  // Send message action dispatcher
  const sendMessage = useCallback(
    (text, media = null, attachment = null) => {
      if (contextSendMessage) {
        contextSendMessage(text, media, attachment);
      }
    },
    [contextSendMessage]
  );

  // Start new conversation handler
  const startNewConversation = useCallback(
    (contact) => {
      const existing = conversations.find((c) => c.name === contact.name);
      if (existing) {
        selectConversation(existing.id);
      } else {
        const newConvId = `conv_${Date.now()}`;
        const newConv = {
          id: newConvId,
          type: 'direct',
          name: contact.name,
          avatar: contact.avatar,
          status: contact.status || 'online',
          lastMessage: 'Started a new conversation',
          timestamp: 'Just now',
          unreadCount: 0,
          bio: contact.role || 'ChatFlow Contact',
        };

        if (contextSetConversations) {
          contextSetConversations((prev) => [newConv, ...prev]);
        }
        selectConversation(newConvId);
      }
      setIsNewChatModalOpen(false);
    },
    [conversations, contextSetConversations, selectConversation]
  );

  return {
    isLoading,
    isError,
    errorMessage,
    refetchData: () => {},
    conversations: filteredConversations,
    allConversations: conversations,
    activeConversation,
    activeMessages,
    userProfile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isTyping,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isInfoPanelOpen,
    setIsInfoPanelOpen,
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    lightboxImage,
    setLightboxImage,
    selectConversation,
    sendMessage,
    deleteMessage: contextDeleteMessage,
    clearChat: contextClearChat,
    startNewConversation,
    mockContacts,
  };
}
