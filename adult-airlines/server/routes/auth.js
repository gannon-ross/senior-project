import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const { protect } = authMiddleware;

// Register a new user
router.post('/register', authController.register);

// Verify email
router.post('/verify-email', authController.verifyEmail);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', protect, authController.getCurrentUser);

export default router;
