import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockConversations, mockMessages, currentUser as initialUser, mockContacts } from '../data/mockData';

export function useChat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [userProfile, setUserProfile] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'groups', 'pinned'
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Active conversation object
  const activeConversationId = conversationId || (conversations[0]?.id || 'conv_1');

  // Selected active conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || conversations[0];
  }, [conversations, activeConversationId]);

  // Selected conversation messages
  const activeMessages = useMemo(() => {
    return messages[activeConversationId] || [];
  }, [messages, activeConversationId]);

  // Redirect to first conversation if /chat route without id
  useEffect(() => {
    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  // Filtered conversations based on tab and search query
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch =
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'unread') return conv.unreadCount > 0;
      if (activeTab === 'groups') return conv.type === 'group';
      if (activeTab === 'pinned') return conv.isPinned;
      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  // Select conversation
  const selectConversation = (id) => {
    // Clear unread count when opening conversation
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
    setIsMobileSidebarOpen(false);
    navigate(`/chat/${id}`);
  };

  // Send message
  const sendMessage = (text, media = null, attachment = null) => {
    if (!text.trim() && !media && !attachment) return;

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

    // Update messages
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    // Update conversation last message & timestamp
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

    // Simulate auto-reply from contact after 1.5 seconds if direct chat
    if (activeConversation?.type === 'direct') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replies = [
          "Got it! Thanks for sending that over.",
          "Awesome, I'm reviewing it right now. Looks really clean!",
          "That sounds good to me. Let's touch base again shortly.",
          "Perfect! I will make a quick note of this.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const autoMsg = {
          id: `msg_reply_${Date.now()}`,
          senderId: activeConversation.id,
          senderName: activeConversation.name,
          senderAvatar: activeConversation.avatar,
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
      }, 1500);
    }
  };

  // Toggle emoji reaction
  const toggleReaction = (messageId, emoji) => {
    setMessages((prev) => {
      const convMsgs = prev[activeConversationId] || [];
      const updated = convMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions || [];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

        let newReactions;
        if (existingIdx > -1) {
          const existing = reactions[existingIdx];
          const userHasReacted = existing.users.includes(userProfile.id);

          if (userHasReacted) {
            // Remove user reaction
            const newUsers = existing.users.filter((u) => u !== userProfile.id);
            if (newUsers.length === 0) {
              newReactions = reactions.filter((_, idx) => idx !== existingIdx);
            } else {
              newReactions = [...reactions];
              newReactions[existingIdx] = {
                ...existing,
                count: existing.count - 1,
                users: newUsers,
              };
            }
          } else {
            // Add user to reaction
            newReactions = [...reactions];
            newReactions[existingIdx] = {
              ...existing,
              count: existing.count + 1,
              users: [...existing.users, userProfile.id],
            };
          }
        } else {
          // Add new emoji reaction
          newReactions = [...reactions, { emoji, count: 1, users: [userProfile.id] }];
        }

        return { ...msg, reactions: newReactions };
      });

      return { ...prev, [activeConversationId]: updated };
    });
  };

  // Start new conversation
  const startNewConversation = (contact) => {
    const existing = conversations.find((c) => c.name === contact.name);
    if (existing) {
      selectConversation(existing.id);
    } else {
      const newConvId = `conv_${Date.now()}`;
      const newConv = {
        id: newConvId,
        type: 'direct',
        name: contact.name,
        tag: `@${contact.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: contact.avatar,
        status: contact.status || 'online',
        lastMessage: 'Started a new conversation',
        timestamp: 'Just now',
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        bio: contact.role || 'ChatFlow User',
      };

      setConversations((prev) => [newConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConvId]: [
          {
            id: `msg_welcome_${Date.now()}`,
            senderId: 'system',
            text: `You connected with ${contact.name}. Send a message to get started! 👋`,
            timestamp: 'Just now',
            date: 'Today',
            status: 'read',
          },
        ],
      }));
      selectConversation(newConvId);
    }
    setIsNewChatModalOpen(false);
  };

  // Toggle Pinned status
  const togglePin = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Toggle Mute status
  const toggleMute = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  // Update user status
  const updateUserStatus = (newStatus) => {
    setUserProfile((prev) => ({ ...prev, status: newStatus }));
  };

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    activeConversation,
    activeMessages,
    userProfile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
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
    toggleReaction,
    startNewConversation,
    togglePin,
    toggleMute,
    updateUserStatus,
    mockContacts,
  };
}
