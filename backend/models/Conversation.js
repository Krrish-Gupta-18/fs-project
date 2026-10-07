import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    conversationId: { type: String, unique: true, required: true },
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    name: { type: String, required: true },
    tag: { type: String, default: '' },
    avatar: { type: String, default: '' },
    status: { type: String, default: 'online' },
    lastMessage: { type: String, default: '' },
    timestamp: { type: String, default: 'Just now' },
    unreadCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    membersCount: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
