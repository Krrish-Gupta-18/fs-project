import { Router } from 'express';
import { seedDatabase } from '../controllers/seedController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, adminOnly, seedDatabase);

export default router;
