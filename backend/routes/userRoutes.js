import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, adminOnly, adminOrModerator } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all user routes
router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', adminOnly, createUser);
router.put('/:id', adminOrModerator, updateUser);
router.delete('/:id', adminOnly, deleteUser);

export default router;
