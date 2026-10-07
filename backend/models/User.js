import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tag: { type: String, default: '' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    status: { type: String, enum: ['online', 'away', 'offline'], default: 'online' },
    customStatus: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    role: {
      type: String,
      enum: ['Admin', 'Moderator', 'Member'],
      default: 'Member',
    },
    joinedDate: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
