import { Router } from 'express';
import { register, login, getContacts } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/contacts', protect, getContacts);

export default router;
