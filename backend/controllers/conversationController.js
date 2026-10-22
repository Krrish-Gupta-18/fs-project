import { Conversation } from '../models/Conversation.js';
import { User } from '../models/User.js';

// Helper to format direct conversation for requesting user
async function enrichConversationForUser(conv, currentUserId) {
  if (conv.type === 'direct' && Array.isArray(conv.participants) && currentUserId) {
    const otherUserId = conv.participants.find((p) => p !== currentUserId);
    if (otherUserId) {
      const otherUser = await User.findOne({ userId: otherUserId }).select('name avatar status bio email role');
      if (otherUser) {
        return {
          ...conv,
          name: otherUser.name,
          avatar: otherUser.avatar || conv.avatar,
          status: otherUser.status || conv.status,
          bio: otherUser.bio || conv.bio,
          email: otherUser.email || conv.email,
        };
      }
    }
  }
  return conv;
}

// READ all conversations
export async function getConversations(req, res) {
  try {
    const currentUserId = req.user?.userId || req.user?.id;
    let query = {};
    if (currentUserId) {
      query = {
        $or: [
          { participants: currentUserId },
          { participants: { $exists: false } },
          { participants: { $size: 0 } },
          { type: 'group' },
        ],
      };
    }
    const conversations = await Conversation.find(query).sort({ updatedAt: -1 }).lean();

    const enriched = await Promise.all(
      conversations.map((c) => enrichConversationForUser(c, currentUserId))
    );

    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// READ single conversation
export async function getConversationById(req, res) {
  try {
    const currentUserId = req.user?.userId || req.user?.id;
    const conversation = await Conversation.findOne({ conversationId: req.params.id }).lean();
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const enriched = await enrichConversationForUser(conversation, currentUserId);
    return res.json(enriched);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// CREATE new conversation
export async function createConversation(req, res) {
  try {
    const { name, type, avatar, status, bio, email, participants } = req.body;
    const conversationId = req.body.conversationId || `conv_${Date.now()}`;
    const currentUserId = req.user?.userId || req.user?.id;

    let memberList = Array.isArray(participants) ? [...participants] : [];
    if (currentUserId && !memberList.includes(currentUserId)) {
      memberList.push(currentUserId);
    }

    // For direct chats between 2 users, prevent duplicate conversations
    if ((type === 'direct' || !type) && memberList.length === 2) {
      const existing = await Conversation.findOne({
        type: 'direct',
        participants: { $all: memberList, $size: 2 },
      }).lean();

      if (existing) {
        const enrichedExisting = await enrichConversationForUser(existing, currentUserId);
        return res.status(200).json(enrichedExisting);
      }
    }

    const newConversation = await Conversation.create({
      conversationId,
      name,
      type: type || 'direct',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: status || 'online',
      lastMessage: 'Started a new conversation',
      timestamp: 'Just now',
      unreadCount: 0,
      bio: bio || '',
      email: email || '',
      participants: memberList,
      membersCount: memberList.length || 2,
    });

    const convJson = newConversation.toObject();

    // Broadcast new conversation to all participants via personal user rooms
    const io = req.app.get('io');
    if (io) {
      for (const memberId of memberList) {
        const enrichedForMember = await enrichConversationForUser(convJson, memberId);
        io.to(`user:${memberId}`).emit('conversation:new', {
          conversation: enrichedForMember,
        });
      }
    }

    const enrichedResult = await enrichConversationForUser(convJson, currentUserId);
    return res.status(201).json(enrichedResult);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// UPDATE conversation
export async function updateConversation(req, res) {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { conversationId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    return res.json(updatedConversation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// DELETE conversation
export async function deleteConversation(req, res) {
  try {
    const deletedConversation = await Conversation.findOneAndDelete({ conversationId: req.params.id });
    if (!deletedConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    return res.json({ message: 'Conversation deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
