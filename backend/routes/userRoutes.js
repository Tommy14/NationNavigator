import express from 'express';
import { registerUser, loginUser, getMe, addBadgeToUser, getUserBadges} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
// Add a badge to user's collection
router.post('/:username/badges', authMiddleware, addBadgeToUser);

// Get all badges for a user
router.get('/:username/badges', authMiddleware, getUserBadges);

export default router;