import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: 'student' | 'teacher' | 'admin';
    isActive: boolean;
    // Learning profile
    level: 'beginner' | 'intermediate' | 'advanced';
    points: number;
    streak: number; // consecutive days of learning
    totalStudyTime: number; // in minutes
    preferredTopics: string[];
    avatar?: string;
    // Timestamps
    createdAt: Date;
    lastLogin: Date;
    lastStudyDate: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
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
        required: true,
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
    avatar: {
        type: String,
        default: null
    },
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

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
