import { Router } from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
} from '../controllers/conversationController.js';
import { protect, adminOrModerator } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all conversation routes
router.use(protect);

router.get('/', getConversations);
router.get('/:id', getConversationById);
router.post('/', createConversation);
router.put('/:id', updateConversation);
router.delete('/:id', adminOrModerator, deleteConversation);

export default router;
