import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchConversations } from '../services/mockApi';
import { useDebounce } from './useDebounce';
import { currentUser as initialUser, mockContacts } from '../data/mockData';

export function useChat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Async API State
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Domain State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [userProfile, setUserProfile] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'groups'
  const [searchQuery, setSearchQuery] = useState('');

  // Typing indicator state
  const [isTyping, setIsTyping] = useState(false);

  // UI Drawer & Modal states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Timer reference for cleaning up simulated reply timeouts
  const replyTimerRef = useRef(null);
  const typingTimerRef = useRef(null);

  // 1. Debounced search query using custom hook useDebounce
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 2. Data Fetching Simulation using useEffect
  const loadData = useCallback(async (shouldFail = false) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const data = await fetchConversations(shouldFail);
      setConversations(data.conversations);
      setMessages(data.messages);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.message || 'Failed to fetch conversations.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Active conversation selection logic
  const activeConversationId = conversationId || (conversations[0]?.id || null);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;
  }, [conversations, activeConversationId]);

  const activeMessages = useMemo(() => {
    return messages[activeConversationId] || [];
  }, [messages, activeConversationId]);

  // Navigate to default conversation on initial load if route parameter missing
  useEffect(() => {
    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  // 3. Document Title Sync using useEffect
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

  // 4. Memoized Filtered Conversations using useMemo
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const query = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        conv.name.toLowerCase().includes(query) ||
        conv.lastMessage.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (activeTab === 'unread') return conv.unreadCount > 0;
      if (activeTab === 'groups') return conv.type === 'group';
      return true;
    });
  }, [conversations, activeTab, debouncedSearchQuery]);

  // Select conversation handler
  const selectConversation = useCallback(
    (id) => {
      // Clear pending response timers when switching chats
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      setIsTyping(false);

      // Clear unread badge
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
      );
      setIsMobileSidebarOpen(false);
      navigate(`/chat/${id}`);
    },
    [navigate]
  );

  // 5. Send message with useCallback and simulated typing & response queue
  const sendMessage = useCallback(
    (text, media = null, attachment = null) => {
      if (!text.trim() && !media && !attachment) return;
      if (!activeConversationId) return;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newMsg = {
        id: `msg_${Date.now()}`,
        senderId: userProfile.id,
        senderName: userProfile.name,
        senderAvatar: userProfile.avatar,
        text: text.trim(),
        timestamp: timeStr,
        date: 'Today',
        status: 'sent',
        ...(media && { media }),
        ...(attachment && { attachment }),
      };

      // Append new message to local state immediately
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
      }));

      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessage: text.trim() || (media ? 'Sent an image' : 'Sent an attachment'),
                timestamp: timeStr,
              }
            : c
        )
      );

      // Clear previous pending timers if any
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      // Trigger "Typing..." indicator after 400ms delay
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(true);
      }, 400);

      // Trigger simulated reply after 1.6 seconds
      replyTimerRef.current = setTimeout(() => {
        setIsTyping(false);

        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sampleReplies = [
          "Got it! Thanks for reaching out.",
          "That makes sense. I'll test it right away!",
          "Sounds good to me. Let's catch up on this shortly.",
          "Awesome! Working on the frontend update now.",
        ];
        const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

        const autoMsg = {
          id: `reply_${Date.now()}`,
          senderId: activeConversationId,
          senderName: activeConversation?.name || 'Contact',
          senderAvatar: activeConversation?.avatar || '',
          text: randomReply,
          timestamp: replyTime,
          date: 'Today',
          status: 'delivered',
        };

        setMessages((prev) => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), autoMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  timestamp: replyTime,
                }
              : c
          )
        );
      }, 1600);
    },
    [activeConversationId, activeConversation, userProfile]
  );

  // Clean up timer timeouts on unmount
  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  // Start new conversation
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

        setConversations((prev) => [newConv, ...prev]);
        setMessages((prev) => ({
          ...prev,
          [newConvId]: [
            {
              id: `welcome_${Date.now()}`,
              senderId: 'system',
              text: `You connected with ${contact.name}. Say hello! 👋`,
              timestamp: 'Just now',
              date: 'Today',
            },
          ],
        }));
        selectConversation(newConvId);
      }
      setIsNewChatModalOpen(false);
    },
    [conversations, selectConversation]
  );

  return {
    isLoading,
    isError,
    errorMessage,
    refetchData: loadData,
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
    startNewConversation,
    mockContacts,
  };
}
