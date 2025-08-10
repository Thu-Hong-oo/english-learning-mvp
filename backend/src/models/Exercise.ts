import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
    title: string;
    description: string;
    type: 'multiple-choice' | 'fill-blank' | 'matching' | 'true-false' | 'writing' | 'speaking' | 'listening';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit?: number; // in seconds
    lesson: mongoose.Types.ObjectId; // Reference to Lesson
    order: number; // exercise order within lesson
    
    // Questions array for multiple questions
    questions: Array<{
        question: string;
        options?: string[]; // for multiple choice
        correctAnswer: string | string[];
        explanation?: string;
        points?: number;
        audioUrl?: string;
        imageUrl?: string;
    }>;
    
    // For fill-in-the-blank exercises
    blanks?: Array<{
        position: number;
        correctAnswer: string;
        alternatives?: string[];
    }>;
    
    // For matching exercises
    matchingPairs?: Array<{
        left: string;
        right: string;
    }>;
    
    passingScore: number; // percentage to pass (default 70)
    isPublished: boolean;
    teacher: mongoose.Types.ObjectId; // Reference to User (teacher)
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'fill-blank', 'matching', 'true-false', 'writing', 'speaking', 'listening'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 1
    },
    timeLimit: {
        type: Number,
        min: 0
    },
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [String], // for multiple choice
        correctAnswer: {
            type: Schema.Types.Mixed, // can be string or array
            required: true
        },
        explanation: String,
        points: {
            type: Number,
            default: 1
        },
        audioUrl: String,
        imageUrl: String
    }],
    blanks: [{
        position: {
            type: Number,
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        alternatives: [String]
    }],
    matchingPairs: [{
        left: {
            type: String,
            required: true
        },
        right: {
            type: String,
            required: true
        }
    }],
    passingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Index for better query performance
exerciseSchema.index({ lesson: 1, order: 1 });
exerciseSchema.index({ lesson: 1, type: 1 });
exerciseSchema.index({ teacher: 1 });
exerciseSchema.index({ status: 1 });

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;
