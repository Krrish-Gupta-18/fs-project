import { Router } from 'express';
import {
  getMessagesByConversation,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all message routes
router.use(protect);

router.get('/:conversationId', getMessagesByConversation);
router.post('/', createMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;
