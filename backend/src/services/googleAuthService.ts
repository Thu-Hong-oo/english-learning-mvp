import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth interface
interface GoogleUserInfo {
    sub: string;           // Google user ID
    email: string;         // Email address
    email_verified: boolean; // Email verification status
    name: string;          // Full name
    given_name: string;    // First name
    family_name: string;   // Last name
    picture: string;       // Profile picture URL
}

// Verify Google token
export const verifyGoogleToken = async (idToken: string): Promise<GoogleUserInfo> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google token payload');
        }

        return {
            sub: payload.sub!,
            email: payload.email!,
            email_verified: payload.email_verified!,
            name: payload.name!,
            given_name: payload.given_name!,
            family_name: payload.family_name!,
            picture: payload.picture!
        };
    } catch (error) {
        console.error('Google token verification error:', error);
        throw new Error('Invalid Google token');
    }
};

// Find or create user from Google OAuth
export const findOrCreateGoogleUser = async (googleUserInfo: GoogleUserInfo): Promise<IUser> => {
    try {
        // Check if user exists by Google ID
        let user = await User.findOne({ googleId: googleUserInfo.sub });

        if (!user) {
            // Check if user exists by email
            user = await User.findOne({ email: googleUserInfo.email });

            if (user) {
                // Link existing user to Google account
                user.googleId = googleUserInfo.sub;
                user.authProvider = 'google';
                user.avatar = googleUserInfo.picture;
                user.isEmailVerified = googleUserInfo.email_verified;
                await user.save();
            } else {
                // Create new user from Google OAuth
                user = new User({
                    username: generateUsername(googleUserInfo.email),
                    email: googleUserInfo.email,
                    fullName: googleUserInfo.name,
                    role: 'student',
                    isActive: true,
                    authProvider: 'google',
                    googleId: googleUserInfo.sub,
                    avatar: googleUserInfo.picture,
                    isEmailVerified: googleUserInfo.email_verified,
                    level: 'beginner',
                    points: 0,
                    streak: 0,
                    totalStudyTime: 0,
                    preferredTopics: []
                });

                await user.save();
            }
        } else {
            // Update existing Google user info
            user.email = googleUserInfo.email;
            user.fullName = googleUserInfo.name;
            user.avatar = googleUserInfo.picture;
            user.isEmailVerified = googleUserInfo.email_verified;
            user.lastLogin = new Date();
            await user.save();
        }

        return user;
    } catch (error) {
        console.error('Find or create Google user error:', error);
        throw new Error('Failed to process Google user');
    }
};

// Generate unique username from email
const generateUsername = (email: string): string => {
    const baseUsername = email.split('@')[0];
    const timestamp = Date.now().toString().slice(-4);
    return `${baseUsername}${timestamp}`;
};

// Generate JWT token for Google user
export const generateGoogleAuthToken = (user: IUser): string => {
    return jwt.sign(
        { 
            userId: user._id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );
};

// Google OAuth login/register handler
export const handleGoogleAuth = async (idToken: string) => {
    try {
        // Verify Google token
        const googleUserInfo = await verifyGoogleToken(idToken);

        // Find or create user
        const user = await findOrCreateGoogleUser(googleUserInfo);

        // Generate JWT token
        const token = generateGoogleAuthToken(user);

        return {
            success: true,
            user: user.toJSON(),
            token,
            isNewUser: !user.googleId || user.createdAt.getTime() > Date.now() - 60000 // Created within last minute
        };
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};
