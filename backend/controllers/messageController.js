import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';

// READ messages by conversationId
export async function getMessagesByConversation(req, res) {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// CREATE / send message
export async function createMessage(req, res) {
  try {
    const { conversationId, senderId, senderName, senderAvatar, text, media, attachment } = req.body;

    if (!conversationId || (!text && !media && !attachment)) {
      return res.status(400).json({ error: 'Conversation ID and message content are required.' });
    }

    const messageId = req.body.messageId || `msg_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentUserId = req.user?.userId || req.user?.id || senderId || 'user_0';
    const currentUserName = req.user?.name || senderName || 'User';
    const currentUserAvatar = req.user?.avatar || senderAvatar || '';

    const newMessage = await Message.create({
      messageId,
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      text: text ? text.trim() : '',
      timestamp,
      date: 'Today',
      status: 'sent',
      media,
      attachment,
    });

    // Update conversation lastMessage preview
    await Conversation.findOneAndUpdate(
      { conversationId },
      {
        lastMessage: text ? text.trim() : (media ? 'Sent an image' : 'Sent an attachment'),
        timestamp,
      }
    );

    // Broadcast to Socket.IO clients in conversation room and participants' personal rooms
    const io = req.app.get('io');
    if (io) {
      const conv = await Conversation.findOne({ conversationId });
      const targetRooms = new Set([conversationId]);
      if (conv && Array.isArray(conv.participants)) {
        conv.participants.forEach((pId) => targetRooms.add(`user:${pId}`));
      }

      io.to(Array.from(targetRooms)).emit('message:new', {
        conversationId,
        message: newMessage,
      });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// UPDATE message (edit text, add reaction, update status)
export async function updateMessage(req, res) {
  try {
    const updatedMessage = await Message.findOneAndUpdate(
      { messageId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.json(updatedMessage);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// DELETE message
export async function deleteMessage(req, res) {
  try {
    const deletedMessage = await Message.findOneAndDelete({ messageId: req.params.id });
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    return res.json({ message: 'Message deleted successfully', messageId: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
