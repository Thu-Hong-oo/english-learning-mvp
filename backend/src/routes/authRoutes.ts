import express from 'express';
import { 
    register, 
    login, 
    verifyEmail, 
    resendVerification, 
    googleAuth, 
    googleCallback, 
    googleAuthAPI,
    getProfile,
    logout
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendVerification);

// Google OAuth routes
router.get('/google', googleAuth); // Lấy Google auth URL
router.get('/google/callback', googleCallback); // Callback từ Google (redirect)
router.post('/google', googleAuthAPI); // API endpoint (không redirect)

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

export default router;
