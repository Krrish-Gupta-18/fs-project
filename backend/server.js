import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocketServer } from './socket.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

import { User } from './models/User.js';
import { seedDatabase } from './controllers/seedController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
await connectDB();

// Ensure initial seed data exists if database is empty
try {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[Seed Info]: Empty database detected. Populating initial seed data...');
    await seedDatabase();
  }
} catch (err) {
  console.warn('[Seed Warning]: Could not check/seed database:', err.message);
}

// Middlewares
app.use(cors());
app.use(express.json());

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/seed', seedRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ChatFlow Real-Time Mongoose REST API & Socket.IO Backend',
    timestamp: new Date().toISOString(),
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = initSocketServer(server);
app.set('io', io);

// Start Server
server.listen(PORT, () => {
  console.log(`[Server Running]: ChatFlow Real-Time Backend live at http://localhost:${PORT}`);
});

export { app, server, io };
