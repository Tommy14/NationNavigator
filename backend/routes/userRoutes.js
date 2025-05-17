import express from 'express';
import { registerUser, loginUser, getMe, addBadgeToUser, getUserBadges, addToFavourites, getFavourites, removeFromFavourites, checkIfFavourite} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
// Add a badge to user's collection
router.post('/:username/badges', authMiddleware, addBadgeToUser);

// Get all badges for a user
router.get('/:username/badges', authMiddleware, getUserBadges);

// add favourite country
router.post('/favourites', authMiddleware, addToFavourites);

// get favourite countries
router.get('/favourites', authMiddleware, getFavourites);

// remove favourite country
router.delete('/favourites/:countryCode', authMiddleware, removeFromFavourites);

// check if country is favourite
router.get('/favourites/:countryCode', authMiddleware, checkIfFavourite);

export default router;