import { User } from '../models/User.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { initialUsers, initialConversations, initialMessages } from '../utils/seedData.js';
import { connectDB } from '../config/db.js';

export async function seedDatabase(req, res) {
  try {
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    await User.insertMany(initialUsers);
    await Conversation.insertMany(initialConversations);
    await Message.insertMany(initialMessages);

    const summary = {
      usersCount: initialUsers.length,
      conversationsCount: initialConversations.length,
      messagesCount: initialMessages.length,
      message: 'Database seeded successfully with initial ChatFlow data!',
    };

    if (res) {
      return res.json(summary);
    }
    return summary;
  } catch (error) {
    if (res) {
      return res.status(500).json({ error: error.message });
    }
    throw error;
  }
}

export async function runStandaloneSeed() {
  await connectDB();
  const summary = await seedDatabase();
  console.log('[Seed Success]:', summary);
  process.exit(0);
}
