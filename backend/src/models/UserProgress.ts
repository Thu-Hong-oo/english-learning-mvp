import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    lessonId?: mongoose.Types.ObjectId;
    exerciseId?: mongoose.Types.ObjectId;
    
    // Progress tracking
    status: 'not-started' | 'in-progress' | 'completed' | 'failed';
    progress: number; // percentage 0-100
    score?: number; // for exercises
    maxScore?: number; // for exercises
    
    // Time tracking
    timeSpent: number; // in seconds
    startTime?: Date;
    completedAt?: Date;
    
    // Exercise attempts
    attempts: number;
    lastAttemptAt?: Date;
    
    // User answers (for review purposes)
    userAnswers?: Array<{
        questionId: string;
        answer: string | string[];
        isCorrect: boolean;
        timeSpent: number;
    }>;
    
    // Notes and feedback
    notes?: string;
    feedback?: string;
    
    createdAt: Date;
    updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed', 'failed'],
        default: 'not-started'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    score: {
        type: Number,
        min: 0
    },
    maxScore: {
        type: Number,
        min: 0
    },
    timeSpent: {
        type: Number,
        default: 0,
        min: 0
    },
    startTime: Date,
    completedAt: Date,
    attempts: {
        type: Number,
        default: 0,
        min: 0
    },
    lastAttemptAt: Date,
    userAnswers: [{
        questionId: {
            type: String,
            required: true
        },
        answer: {
            type: Schema.Types.Mixed, // can be string or array
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        timeSpent: {
            type: Number,
            min: 0
        }
    }],
    notes: String,
    feedback: String
}, {
    timestamps: true
});

// Index for better query performance
userProgressSchema.index({ userId: 1, courseId: 1 });
userProgressSchema.index({ userId: 1, lessonId: 1 });
userProgressSchema.index({ userId: 1, exerciseId: 1 });
userProgressSchema.index({ status: 1, userId: 1 });

const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);

export default UserProgress;
