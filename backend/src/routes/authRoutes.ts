import { Router } from 'express';
import { 
    register, 
    login, 
    getProfile, 
    logout, 
    sendVerification, 
    verifyEmail, 
    resendVerification 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Email verification routes
router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);

export default router;
