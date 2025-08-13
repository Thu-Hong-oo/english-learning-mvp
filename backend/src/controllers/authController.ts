import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendVerificationEmail } from '../services/emailService';
import googleAuthService from '../services/googleAuthService';

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

        // Generate email verification OTP
        const verificationOTP = user.generateEmailVerificationOTP();
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.username, verificationOTP);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Continue with registration even if email fails
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user: user.toJSON(),
                token,
                emailVerificationSent: true
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

        // Check if email is verified
        if (!user.isEmailVerified) {
            res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in. Check your inbox or request a new verification email.',
                code: 'EMAIL_NOT_VERIFIED'
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

        // Generate verification OTP
        const verificationOTP = user.generateEmailVerificationOTP();
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.username, verificationOTP);

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

// Verify email with OTP
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp } = req.body;

        if (!otp) {
            res.status(400).json({
                success: false,
                message: 'OTP is required'
            });
            return;
        }

        const user = await User.findOne({
            emailVerificationOTP: otp,
            emailVerificationOTPExpires: { $gt: new Date() }
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
            return;
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationOTP = undefined;
        user.emailVerificationOTPExpires = undefined;
        await user.save();

        // Send welcome email
        // await sendWelcomeEmail(user.email, user.username); // This line was removed from imports, so it's removed here.

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

        // Check if previous OTP is still valid
        if (user.emailVerificationOTPExpires && user.emailVerificationOTPExpires > new Date()) {
            res.status(400).json({
                success: false,
                message: 'Please wait before requesting another verification email'
            });
            return;
        }

        // Generate new verification OTP
        const verificationOTP = user.generateEmailVerificationOTP();
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.username, verificationOTP);

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

// Google OAuth - Redirect to Google
export const googleAuth = async (req: Request, res: Response) => {
  try {
    // Bỏ qua test connection để tránh lỗi 404
    // const isConnected = await googleAuthService.testConnection();
    // if (!isConnected) {
    //   return res.status(503).json({ 
    //     success: false, 
    //     message: 'Google OAuth service is currently unavailable. Please try again later.' 
    //   });
    // }
    
    const authUrl = googleAuthService.getAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

// Google OAuth - Callback từ Google
export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    
    // Xử lý code parameter - có thể là string, array, hoặc ParsedQs object
    let authCode: string | undefined;
    
    if (Array.isArray(code)) {
      authCode = typeof code[0] === 'string' ? code[0] : undefined;
    } else if (typeof code === 'string') {
      authCode = code;
    } else if (code && typeof code === 'object') {
      // Nếu code là ParsedQs object, lấy giá trị đầu tiên
      const codeValues = Object.values(code);
      const firstValue = codeValues[0];
      if (Array.isArray(firstValue)) {
        authCode = typeof firstValue[0] === 'string' ? firstValue[0] : undefined;
      } else {
        authCode = typeof firstValue === 'string' ? firstValue : undefined;
      }
    }
    
    console.log('Google OAuth callback received with code:', typeof authCode === 'string' ? authCode.substring(0, 20) + '...' : 'undefined');
    
    if (!authCode || typeof authCode !== 'string') {
      console.error('Missing or invalid authorization code');
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code is required' 
      });
    }

    // Bỏ qua test connection để tránh lỗi 404
    // const isConnected = await googleAuthService.testConnection();
    // if (!isConnected) {
    //   console.error('Google OAuth service unavailable during callback');
    //   const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-error?` +
    //                    `error=${encodeURIComponent('Google OAuth service is currently unavailable')}`;
    //   return res.redirect(errorUrl);
    // }

    console.log('Processing Google OAuth with code...');
    
    // Xử lý Google OAuth
    const result = await googleAuthService.handleGoogleAuth(authCode);
    
    console.log('Google OAuth processing successful, user:', result.user.email);
    
    // Chỉ lấy các field cần thiết từ user object
    const userData = {
      _id: result.user._id,
      username: result.user.username,
      email: result.user.email,
      fullName: result.user.fullName,
      avatar: result.user.avatar,
      isEmailVerified: result.user.isEmailVerified,
      role: result.user.role,
      level: result.user.level,
      isActive: result.user.isActive,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
      lastLogin: result.user.lastLogin,
      lastStudyDate: result.user.lastStudyDate,
    };
    
    // Redirect về frontend với token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-success?` +
                       `token=${encodeURIComponent(result.token)}&` +
                       `isNewUser=${result.isNewUser}&` +
                       `user=${encodeURIComponent(JSON.stringify(userData))}`;
    
    console.log('Redirecting to frontend:', redirectUrl.substring(0, 100) + '...');
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Google authentication failed';
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google-error?` +
                     `error=${encodeURIComponent(errorMessage)}`;
    res.redirect(errorUrl);
  }
};

// Google OAuth - API endpoint (không redirect)
export const googleAuthAPI = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code is required' 
      });
    }

    // Xử lý Google OAuth
    const result = await googleAuthService.handleGoogleAuth(code);
    
    res.json({
      success: true,
      message: result.isNewUser ? 'User registered successfully' : 'User logged in successfully',
      data: {
        user: result.user,
        token: result.token,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    console.error('Google auth API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Google authentication failed' 
    });
  }
};
