import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchConversations,
  fetchContacts,
  fetchCurrentUser,
  createConversation as createConvApi,
  logoutUser,
  apiFetch,
} from '../services/api';
import { getSocket, disconnectSocket } from '../services/socket';
import { useDebounce } from './useDebounce';

export function useChatState() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Async API State
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Domain State
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [contacts, setContacts] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('chatflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'groups'
  const [searchQuery, setSearchQuery] = useState('');

  // Remote typing indicator state: { userId, userName } or null
  const [remoteTypingUser, setRemoteTypingUser] = useState(null);

  // UI Drawer & Modal states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // References
  const prevConvIdRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingActiveRef = useRef(false);

  // 1. Debounced search query using custom hook useDebounce
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Check auth and load user profile if needed
  useEffect(() => {
    const token = localStorage.getItem('chatflow_token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!userProfile) {
      fetchCurrentUser().then((u) => {
        if (u) setUserProfile(u);
      });
    }
  }, [navigate, userProfile]);

  // 2. Data Fetching
  const loadData = useCallback(async (shouldFail = false) => {
    const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const [chatData, contactsData] = await Promise.all([
        fetchConversations(shouldFail),
        fetchContacts(),
      ]);

      setConversations(chatData.conversations);
      setMessages(chatData.messages);
      setContacts(contactsData);
    } catch (err) {
      if (err.status === 401) {
        logoutUser();
        navigate('/login');
        return;
      }
      setIsError(true);
      setErrorMessage(err.message || 'Failed to fetch conversations.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

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
    const token = localStorage.getItem('chatflow_token') || sessionStorage.getItem('chatflow_token');
    if (!token) return;

    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  // 3. Socket.IO Real-Time Integration
  useEffect(() => {
    const token = localStorage.getItem('chatflow_token');
    if (!token) return;

    const socket = getSocket(token);
    if (!socket) return;

    // Presence: initial list of online users
    const handlePresenceInit = ({ onlineUsers: ids }) => {
      if (Array.isArray(ids)) {
        setOnlineUserIds(new Set(ids));
      }
    };

    // Presence: user went online or offline
    const handlePresenceUpdate = ({ userId, status }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (status === 'online') {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });

      // Update conversations status
      setConversations((prev) =>
        prev.map((c) => {
          // If direct conversation with this user
          if (c.type === 'direct' && (c.participants?.includes(userId) || c.id === userId || c.email?.includes(userId))) {
            return { ...c, status };
          }
          return c;
        })
      );

      // Update contacts status
      setContacts((prev) =>
        prev.map((contact) => (contact.id === userId ? { ...contact, status } : contact))
      );
    };

    // Real-Time Incoming Message
    const handleNewMessage = ({ conversationId: msgConvId, message, clientTempId }) => {
      const cleanMsg = {
        ...message,
        id: message.messageId || message.id,
      };

      setMessages((prev) => {
        const list = prev[msgConvId] || [];
        // Check if message is already in list (optimistic reconciliation or duplicate prevention)
        const existingIndex = list.findIndex(
          (m) =>
            m.id === cleanMsg.id ||
            m.messageId === cleanMsg.id ||
            (clientTempId && (m.id === clientTempId || m.clientTempId === clientTempId))
        );

        let updatedList;
        if (existingIndex !== -1) {
          updatedList = [...list];
          updatedList[existingIndex] = cleanMsg;
        } else {
          updatedList = [...list, cleanMsg];
        }

        return {
          ...prev,
          [msgConvId]: updatedList,
        };
      });

      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msgConvId
            ? {
                ...c,
                lastMessage: cleanMsg.text || (cleanMsg.media ? 'Sent an image' : 'Sent an attachment'),
                timestamp: cleanMsg.timestamp,
                unreadCount:
                  msgConvId !== activeConversationId && cleanMsg.senderId !== (userProfile?.id || userProfile?.userId)
                    ? (c.unreadCount || 0) + 1
                    : c.unreadCount,
              }
            : c
        )
      );

      // If incoming message is for current active chat and from another user, mark read immediately
      const myId = userProfile?.id || userProfile?.userId;
      if (msgConvId === activeConversationId && cleanMsg.senderId !== myId) {
        socket.emit('message:read', { conversationId: msgConvId, messageId: cleanMsg.id });
      }
    };

    // Typing Update
    const handleTypingUpdate = ({ conversationId: typingConvId, userId, userName, isTyping }) => {
      const myId = userProfile?.id || userProfile?.userId;
      if (typingConvId === activeConversationId && userId !== myId) {
        if (isTyping) {
          setRemoteTypingUser({ userId, userName });
        } else {
          setRemoteTypingUser((current) => (current?.userId === userId ? null : current));
        }
      }
    };

    // Message Status Update (e.g. read receipts)
    const handleMessageStatus = ({ conversationId: statusConvId, readerId, status, messageId }) => {
      setMessages((prev) => {
        const list = prev[statusConvId];
        if (!list) return prev;

        const updated = list.map((m) => {
          if (messageId && m.id !== messageId && m.messageId !== messageId) return m;
          return { ...m, status };
        });

        return {
          ...prev,
          [statusConvId]: updated,
        };
      });
    };

    // Real-Time Incoming Conversation Creation
    const handleNewConversation = ({ conversation: newConv }) => {
      if (!newConv) return;
      const cleanConv = {
        ...newConv,
        id: newConv.conversationId || newConv.id || newConv._id,
      };

      setConversations((prev) => {
        if (prev.some((c) => c.id === cleanConv.id)) return prev;
        return [cleanConv, ...prev];
      });
    };

    socket.on('presence:init', handlePresenceInit);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('message:new', handleNewMessage);
    socket.on('conversation:new', handleNewConversation);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('message:status', handleMessageStatus);

    return () => {
      socket.off('presence:init', handlePresenceInit);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:new', handleNewConversation);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('message:status', handleMessageStatus);
    };
  }, [activeConversationId, userProfile]);

  // 4. Handle Joining / Leaving Conversation Rooms when active conversation changes
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeConversationId) return;

    // Leave previous conversation room
    if (prevConvIdRef.current && prevConvIdRef.current !== activeConversationId) {
      socket.emit('conversation:leave', { conversationId: prevConvIdRef.current });
      setRemoteTypingUser(null);
    }

    // Join current conversation room
    socket.emit('conversation:join', { conversationId: activeConversationId });
    prevConvIdRef.current = activeConversationId;

    // Mark messages in active conversation as read
    socket.emit('message:read', { conversationId: activeConversationId });

    // Clear unread count locally
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConversationId ? { ...c, unreadCount: 0 } : c))
    );

    return () => {
      // Cleanup on unmount or switch
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [activeConversationId]);

  // 5. Typing Indicator Helpers
  const sendTypingStart = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeConversationId) return;

    if (!isTypingActiveRef.current) {
      isTypingActiveRef.current = true;
      socket.emit('typing:start', { conversationId: activeConversationId });
    }

    // Reset auto-stop timer after 1.8s of no typing activity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingActiveRef.current = false;
      socket.emit('typing:stop', { conversationId: activeConversationId });
    }, 1800);
  }, [activeConversationId]);

  const sendTypingStop = useCallback(() => {
    const socket = getSocket();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTypingActiveRef.current && socket && activeConversationId) {
      isTypingActiveRef.current = false;
      socket.emit('typing:stop', { conversationId: activeConversationId });
    }
  }, [activeConversationId]);

  // 6. Send Message with Socket.IO Real-Time & Optimistic UI
  const sendMessage = useCallback(
    async (text, media = null, attachment = null) => {
      if (!text?.trim() && !media && !attachment) return;
      if (!activeConversationId) return;

      sendTypingStop();

      const myId = userProfile?.id || userProfile?.userId || 'user_0';
      const myName = userProfile?.name || 'Alex Morgan';
      const myAvatar = userProfile?.avatar || '';

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const clientTempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const optimisticMsg = {
        id: clientTempId,
        messageId: clientTempId,
        conversationId: activeConversationId,
        senderId: myId,
        senderName: myName,
        senderAvatar: myAvatar,
        text: text ? text.trim() : '',
        timestamp: timeStr,
        date: 'Today',
        status: 'sending',
        clientTempId,
        ...(media && { media }),
        ...(attachment && { attachment }),
      };

      // Optimistically append to local state immediately
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), optimisticMsg],
      }));

      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessage: text ? text.trim() : (media ? 'Sent an image' : 'Sent an attachment'),
                timestamp: timeStr,
              }
            : c
        )
      );

      const socket = getSocket();
      const payload = {
        conversationId: activeConversationId,
        text: text ? text.trim() : '',
        media,
        attachment,
        clientTempId,
      };

      // Try sending via Socket.IO first
      if (socket && socket.connected) {
        socket.emit('message:send', payload, (res) => {
          if (res?.success && res.message) {
            const confirmed = {
              ...res.message,
              id: res.message.messageId || res.message.id,
              status: res.message.status || 'sent',
            };
            setMessages((prev) => ({
              ...prev,
              [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
                m.id === clientTempId ? confirmed : m
              ),
            }));
          }
        });
      } else {
        // Fallback to REST API if socket is temporarily disconnected
        try {
          const res = await apiFetch('/messages', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          const confirmed = {
            ...res,
            id: res.messageId || res.id,
            status: 'sent',
          };
          setMessages((prev) => ({
            ...prev,
            [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
              m.id === clientTempId ? confirmed : m
            ),
          }));
        } catch (err) {
          console.error('[Send Message Error]:', err.message);
          setMessages((prev) => ({
            ...prev,
            [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
              m.id === clientTempId ? { ...m, status: 'error' } : m
            ),
          }));
        }
      }
    },
    [activeConversationId, userProfile, sendTypingStop]
  );

  // 7. Select conversation handler
  const selectConversation = useCallback(
    (id) => {
      sendTypingStop();
      setRemoteTypingUser(null);
      setIsMobileSidebarOpen(false);
      navigate(`/chat/${id}`);
    },
    [navigate, sendTypingStop]
  );

  // 8. Start new conversation
  const startNewConversation = useCallback(
    async (contact) => {
      const myId = userProfile?.id || userProfile?.userId;
      const contactId = contact.id || contact.userId;

      // Check if conversation with contact already exists
      const existing = conversations.find(
        (c) =>
          (c.type === 'direct' && c.participants?.includes(contactId)) ||
          c.name === contact.name
      );

      if (existing) {
        selectConversation(existing.id);
      } else {
        try {
          const newConv = await createConvApi({
            name: contact.name,
            avatar: contact.avatar,
            type: 'direct',
            status: contact.status || 'online',
            participants: [myId, contactId].filter(Boolean),
            bio: contact.role || '',
            email: contact.email || '',
          });

          const cleanConv = {
            ...newConv,
            id: newConv.conversationId || newConv.id || newConv._id,
          };

          setConversations((prev) => {
            if (prev.some((c) => c.id === cleanConv.id)) return prev;
            return [cleanConv, ...prev];
          });
          selectConversation(cleanConv.id);
        } catch (err) {
          console.error('[Create Conv Error]:', err.message);
        }
      }
      setIsNewChatModalOpen(false);
    },
    [conversations, userProfile, selectConversation]
  );

  // 9. Document Title Sync
  useEffect(() => {
    if (activeConversation) {
      if (remoteTypingUser) {
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
  }, [activeConversation, remoteTypingUser]);

  // 10. Filtered Conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const query = debouncedSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        conv.name.toLowerCase().includes(query) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (activeTab === 'unread') return (conv.unreadCount || 0) > 0;
      if (activeTab === 'groups') return conv.type === 'group';
      return true;
    });
  }, [conversations, activeTab, debouncedSearchQuery]);

  // Logout handler
  const logout = useCallback(() => {
    disconnectSocket();
    logoutUser();
    setUserProfile(null);
    navigate('/login');
  }, [navigate]);

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
    setUserProfile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isTyping: !!remoteTypingUser,
    typingText: remoteTypingUser ? `${remoteTypingUser.userName} is typing...` : '',
    sendTypingStart,
    sendTypingStop,
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
    mockContacts: contacts,
    onlineUserIds,
    logout,
  };
}
