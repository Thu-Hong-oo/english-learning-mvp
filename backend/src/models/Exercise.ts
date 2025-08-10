import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
    title: string;
    description: string;
    type: 'multiple-choice' | 'fill-blank' | 'matching' | 'true-false' | 'writing' | 'speaking' | 'listening';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit?: number; // in seconds
    lessonId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    
    // Exercise content based on type
    content: {
        question: string;
        options?: string[]; // for multiple choice
        correctAnswer: string | string[];
        explanation?: string;
        audioUrl?: string;
        imageUrl?: string;
    };
    
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
    
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
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
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    content: {
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
        audioUrl: String,
        imageUrl: String
    },
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
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
exerciseSchema.index({ lessonId: 1, type: 1 });
exerciseSchema.index({ courseId: 1, difficulty: 1 });
exerciseSchema.index({ createdBy: 1 });

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;
