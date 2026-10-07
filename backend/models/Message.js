import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, unique: true, required: true },
    conversationId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, default: '' },
    text: { type: String, default: '' },
    timestamp: { type: String, default: 'Just now' },
    date: { type: String, default: 'Today' },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    media: {
      type: { type: String },
      url: { type: String },
      caption: { type: String },
    },
    attachment: {
      type: { type: String },
      name: { type: String },
      size: { type: String },
      extension: { type: String },
    },
    reactions: [
      {
        emoji: { type: String },
        count: { type: Number },
        users: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
