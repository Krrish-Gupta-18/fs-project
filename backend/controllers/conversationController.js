import { Conversation } from '../models/Conversation.js';

// READ all conversations
export async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    return res.json(conversations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// READ single conversation
export async function getConversationById(req, res) {
  try {
    const conversation = await Conversation.findOne({ conversationId: req.params.id });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    return res.json(conversation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// CREATE new conversation
export async function createConversation(req, res) {
  try {
    const { name, type, avatar, status, bio, email } = req.body;
    const conversationId = req.body.conversationId || `conv_${Date.now()}`;

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
    });

    return res.status(201).json(newConversation);
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
