import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // Optional for OAuth users
    fullName: string;
    role: 'student' | 'teacher' | 'admin';
    isActive: boolean;
    
    // OAuth fields
    authProvider: 'local' | 'google' | 'facebook';
    googleId?: string;
    facebookId?: string;
    avatar?: string;
    
    // Email verification
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    emailVerificationOTP?: string;
    emailVerificationOTPExpires?: Date;
    
    // Password reset
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    
    // Learning profile
    level: 'beginner' | 'intermediate' | 'advanced';
    points: number;
    streak: number; // consecutive days of learning
    totalStudyTime: number; // in minutes
    preferredTopics: string[];
    
    // Timestamps
    createdAt: Date;
    lastLogin: Date;
    lastStudyDate: Date;
    
    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateEmailVerificationToken(): string;
    generateEmailVerificationOTP(): string;
    generatePasswordResetToken(): string;
    toJSON(): any;
}

// User schema
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        },
        minlength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // OAuth fields
    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    googleId: String,
    facebookId: String,
    avatar: String,
    
    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerificationOTP: String,
    emailVerificationOTPExpires: Date,
    
    // Password reset
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Learning profile
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    points: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    totalStudyTime: {
        type: Number,
        default: 0
    },
    preferredTopics: [{
        type: String,
        enum: ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing']
    }],
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    lastStudyDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ emailVerificationOTP: 1 });
userSchema.index({ passwordResetToken: 1 });

// Hash password before saving (only for local auth)
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.authProvider !== 'local') return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function(): string {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.emailVerificationToken = token;
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};

// Generate email verification OTP
userSchema.methods.generateEmailVerificationOTP = function(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    this.emailVerificationOTP = otp;
    this.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return otp;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function(): string {
    const token = require('crypto').randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    return token;
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpires;
    delete user.emailVerificationOTP;
    delete user.emailVerificationOTPExpires;
    delete user.passwordResetToken;
    delete user.passwordResetExpires;
    return user;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
