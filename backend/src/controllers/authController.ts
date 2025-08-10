import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/emailService';

// Extend Request interface to include user
interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, fullName, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
            return;
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: role || 'student'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.json({
            success: true,
            data: {
                user: user.toJSON()
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Logout user (client-side token removal)
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Send email verification
export const sendVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (user.isEmailVerified) {
            res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
            return;
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.username, verificationToken);

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Send verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
            return;
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.username);

        res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Resend verification email
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        if (user.isEmailVerified) {
            res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
            return;
        }

        // Check if previous token is still valid
        if (user.emailVerificationExpires && user.emailVerificationExpires > new Date()) {
            res.status(400).json({
                success: false,
                message: 'Please wait before requesting another verification email'
            });
            return;
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.username, verificationToken);

        res.json({
            success: true,
            message: 'Verification email resent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
