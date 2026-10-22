import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from './models/User.js';
import { Conversation } from './models/Conversation.js';
import { Message } from './models/Message.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_chatflow';

// In-memory mapping: userId -> Set of active socket IDs
const onlineUsers = new Map();

/**
 * Validate if a user has access to a specific conversation
 */
export async function canAccessConversation(userId, conversationId) {
  try {
    const conv = await Conversation.findOne({ conversationId });
    if (!conv) return false;

    // Groups or conversations without strict participants are accessible to authenticated users
    if (conv.type === 'group') return true;
    if (!conv.participants || conv.participants.length === 0) return true;

    return conv.participants.includes(userId);
  } catch (err) {
    console.error('[Socket Auth Error]:', err.message);
    return false;
  }
}

/**
 * Returns an array of user IDs who are currently online
 */
export function getOnlineUserIds() {
  return Array.from(onlineUsers.keys());
}

/**
 * Check if a specific user is currently online
 */
export function isUserOnline(userId) {
  const sockets = onlineUsers.get(userId);
  return !!(sockets && sockets.size > 0);
}

/**
 * Initialize Socket.IO with an HTTP server instance
 */
export function initSocketServer(httpServer) {
  const allowedOrigins = process.env.CLIENT_URL
    ? [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173']
    : '*';

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 15000,
  });

  // Authentication Middleware for incoming socket connections
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '') ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Support legacy token format: jwt_token_<userId>_<timestamp>
      if (typeof token === 'string' && token.startsWith('jwt_token_')) {
        const parts = token.split('_');
        let userId = parts.length >= 4 ? `${parts[2]}_${parts[3]}` : 'user_0';
        const user = await User.findOne({ userId }).select('-password');
        socket.user = user
          ? {
              userId: user.userId,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role || 'Member',
            }
          : { userId, name: 'User', email: '', avatar: '', role: 'Member' };
        return next();
      }

      // Standard JWT verification
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId }).select('-password');
        socket.user = {
          userId: user?.userId || decoded.userId,
          name: user?.name || decoded.name || 'User',
          email: user?.email || decoded.email || '',
          avatar: user?.avatar || '',
          role: user?.role || decoded.role || 'Member',
        };
        return next();
      } catch (jwtErr) {
        return next(new Error('Authentication error: Invalid or expired token'));
      }
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.userId;
    const userName = socket.user.name;

    // Track active typing rooms on this socket for cleanup on disconnect
    const activeTypingRooms = new Set();

    // 1. Presence: Add socket to user's set of active sockets
    const userSockets = onlineUsers.get(userId) || new Set();
    const wasOffline = userSockets.size === 0;
    userSockets.add(socket.id);
    onlineUsers.set(userId, userSockets);

    console.log(`[Socket Connected]: ${userName} (${userId}) - socket: ${socket.id} (Total user tabs: ${userSockets.size})`);

    // Join personal user room so notifications and new messages reach this user across any active conversation
    socket.join(`user:${userId}`);

    // If user was offline, mark as online in DB and broadcast presence update
    if (wasOffline) {
      try {
        await User.updateOne({ userId }, { status: 'online' });
      } catch (err) {
        console.error('[Presence DB Error]:', err.message);
      }
      io.emit('presence:update', { userId, status: 'online' });
    }

    // Send current list of online users to the newly connected client
    socket.emit('presence:init', {
      onlineUsers: getOnlineUserIds(),
    });

    // 2. Room Management: Join conversation
    socket.on('conversation:join', async (data, ack) => {
      console.log('[Socket Join Event]:', socket.user?.userId, data);
      try {
        const conversationId = typeof data === 'string' ? data : data?.conversationId;
        if (!conversationId) {
          const errRes = { success: false, error: 'Conversation ID required' };
          socket.emit('conversation:error', errRes);
          if (typeof ack === 'function') ack(errRes);
          return;
        }

        const isAllowed = await canAccessConversation(userId, conversationId);
        if (!isAllowed) {
          const errRes = { success: false, error: 'Access denied to this conversation' };
          socket.emit('conversation:error', errRes);
          if (typeof ack === 'function') ack(errRes);
          return;
        }

        socket.join(conversationId);
        const res = { success: true, conversationId };
        if (typeof ack === 'function') ack(res);
      } catch (err) {
        const errRes = { success: false, error: err.message };
        socket.emit('conversation:error', errRes);
        if (typeof ack === 'function') ack(errRes);
      }
    });

    // 3. Room Management: Leave conversation
    socket.on('conversation:leave', (data, ack) => {
      const conversationId = typeof data === 'string' ? data : data?.conversationId;
      if (conversationId) {
        socket.leave(conversationId);
        // Clear any typing indicator
        if (activeTypingRooms.has(conversationId)) {
          activeTypingRooms.delete(conversationId);
          socket.to(conversationId).emit('typing:update', {
            conversationId,
            userId,
            userName,
            isTyping: false,
          });
        }
      }
      if (typeof ack === 'function') ack({ success: true, conversationId });
    });

    // 4. Real-Time Messaging: Send message
    socket.on('message:send', async (data, ack) => {
      try {
        const { conversationId, text, media, attachment, clientTempId } = data || {};

        if (!conversationId || (!text?.trim() && !media && !attachment)) {
          const errRes = { success: false, error: 'Message content and conversation ID required' };
          socket.emit('message:error', errRes);
          if (typeof ack === 'function') ack(errRes);
          return;
        }

        // Validate payload length
        if (text && text.length > 5000) {
          const errRes = { success: false, error: 'Message exceeds maximum length of 5000 characters' };
          socket.emit('message:error', errRes);
          if (typeof ack === 'function') ack(errRes);
          return;
        }

        // Validate conversation access
        const isAllowed = await canAccessConversation(userId, conversationId);
        if (!isAllowed) {
          const errRes = { success: false, error: 'Unauthorized to post to this conversation' };
          socket.emit('message:error', errRes);
          if (typeof ack === 'function') ack(errRes);
          return;
        }

        // Check idempotency if client specified a messageId
        const customMsgId = data.messageId;
        if (customMsgId) {
          const existing = await Message.findOne({ messageId: customMsgId });
          if (existing) {
            const res = { success: true, message: existing, clientTempId };
            if (typeof ack === 'function') ack(res);
            return;
          }
        }

        const messageId = customMsgId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageDoc = await Message.create({
          messageId,
          conversationId,
          senderId: userId,
          senderName: userName,
          senderAvatar: socket.user.avatar || '',
          text: text ? text.trim() : '',
          timestamp,
          date: 'Today',
          status: 'sent',
          media,
          attachment,
        });

        // Update conversation summary
        const lastMessageText = text ? text.trim() : (media ? 'Sent an image' : 'Sent an attachment');
        await Conversation.findOneAndUpdate(
          { conversationId },
          {
            lastMessage: lastMessageText,
            timestamp,
          }
        );

        const cleanMessage = {
          id: messageDoc.messageId,
          messageId: messageDoc.messageId,
          conversationId: messageDoc.conversationId,
          senderId: messageDoc.senderId,
          senderName: messageDoc.senderName,
          senderAvatar: messageDoc.senderAvatar,
          text: messageDoc.text,
          timestamp: messageDoc.timestamp,
          date: messageDoc.date,
          status: messageDoc.status,
          media: messageDoc.media,
          attachment: messageDoc.attachment,
          reactions: messageDoc.reactions || [],
          createdAt: messageDoc.createdAt,
        };

        // Stop typing indicator if active
        if (activeTypingRooms.has(conversationId)) {
          activeTypingRooms.delete(conversationId);
          socket.to(conversationId).emit('typing:update', {
            conversationId,
            userId,
            userName,
            isTyping: false,
          });
        }

        // Broadcast to conversation room and each participant's personal room
        const conv = await Conversation.findOne({ conversationId });
        const targetRooms = new Set([conversationId]);
        if (conv && Array.isArray(conv.participants)) {
          conv.participants.forEach((pId) => targetRooms.add(`user:${pId}`));
        }

        io.to(Array.from(targetRooms)).emit('message:new', {
          conversationId,
          message: cleanMessage,
          clientTempId,
        });

        // Also acknowledge sender
        const ackRes = {
          success: true,
          message: cleanMessage,
          clientTempId,
        };
        socket.emit('message:sent', ackRes);
        if (typeof ack === 'function') ack(ackRes);
      } catch (err) {
        console.error('[Socket Message Send Error]:', err.message);
        const errRes = { success: false, error: err.message || 'Failed to send message' };
        socket.emit('message:error', errRes);
        if (typeof ack === 'function') ack(errRes);
      }
    });

    // 5. Typing Indicators: start
    socket.on('typing:start', async (data) => {
      try {
        const conversationId = typeof data === 'string' ? data : data?.conversationId;
        if (!conversationId) return;

        const isAllowed = await canAccessConversation(userId, conversationId);
        if (!isAllowed) return;

        activeTypingRooms.add(conversationId);
        socket.to(conversationId).emit('typing:update', {
          conversationId,
          userId,
          userName,
          isTyping: true,
        });
      } catch (err) {
        console.error('[Typing Start Error]:', err.message);
      }
    });

    // 6. Typing Indicators: stop
    socket.on('typing:stop', (data) => {
      try {
        const conversationId = typeof data === 'string' ? data : data?.conversationId;
        if (!conversationId) return;

        activeTypingRooms.delete(conversationId);
        socket.to(conversationId).emit('typing:update', {
          conversationId,
          userId,
          userName,
          isTyping: false,
        });
      } catch (err) {
        console.error('[Typing Stop Error]:', err.message);
      }
    });

    // 7. Message Read Status
    socket.on('message:read', async (data, ack) => {
      try {
        const { conversationId, messageId } = data || {};
        if (!conversationId) return;

        const isAllowed = await canAccessConversation(userId, conversationId);
        if (!isAllowed) return;

        const filter = {
          conversationId,
          senderId: { $ne: userId },
          status: { $ne: 'read' },
        };
        if (messageId) {
          filter.messageId = messageId;
        }

        await Message.updateMany(filter, { $set: { status: 'read' } });

        // Reset conversation unreadCount
        await Conversation.findOneAndUpdate(
          { conversationId },
          { $set: { unreadCount: 0 } }
        );

        // Broadcast status update to other participants in the room
        socket.to(conversationId).emit('message:status', {
          conversationId,
          readerId: userId,
          status: 'read',
          messageId: messageId || null,
        });

        if (typeof ack === 'function') {
          ack({ success: true, conversationId });
        }
      } catch (err) {
        console.error('[Message Read Error]:', err.message);
        if (typeof ack === 'function') {
          ack({ success: false, error: err.message });
        }
      }
    });

    // 8. Disconnect Cleanup
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket Disconnected]: ${userName} (${userId}) - socket: ${socket.id} (reason: ${reason})`);

      // Clean up typing indicators for rooms this socket was in
      for (const conversationId of activeTypingRooms) {
        socket.to(conversationId).emit('typing:update', {
          conversationId,
          userId,
          userName,
          isTyping: false,
        });
      }
      activeTypingRooms.clear();

      // Remove socket from user's active sockets
      const currentSockets = onlineUsers.get(userId);
      if (currentSockets) {
        currentSockets.delete(socket.id);
        if (currentSockets.size === 0) {
          onlineUsers.delete(userId);

          // Mark user as offline in database
          try {
            await User.updateOne({ userId }, { status: 'offline' });
          } catch (err) {
            console.error('[Presence DB Error]:', err.message);
          }

          // Broadcast user is offline to all clients
          io.emit('presence:update', {
            userId,
            status: 'offline',
            lastSeen: new Date().toISOString(),
          });
        }
      }
    });
  });

  return io;
}
