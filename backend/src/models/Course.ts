import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: 'TOEIC' | 'IELTS' | 'TOEFL' | 'Cambridge' | 'Business English' | 'General English' | 'Conversation' | 'Grammar' | 'Vocabulary' | 'Pronunciation';
    thumbnail?: string;
    duration: number; // in hours
    lessonsCount: number;
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId; // Reference to User (teacher)
    lessons: mongoose.Types.ObjectId[]; // Reference to Lesson documents
    tags: string[];
    difficulty: number; // 1-5 scale
    rating: number;
    totalStudents: number;
    price: number; // 0 for free courses
    requirements?: string[];
    objectives?: string[];
    status: 'draft' | 'published' | 'archived';
    adminApproval: 'pending' | 'approved' | 'rejected';
    adminApprovedBy?: mongoose.Types.ObjectId | null;
    adminApprovedAt?: Date | null;
    adminRejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    category: {
        type: String,
        enum: ['TOEIC', 'IELTS', 'TOEFL', 'Cambridge', 'Business English', 'General English', 'Conversation', 'Grammar', 'Vocabulary', 'Pronunciation'],
        required: true
    },
    thumbnail: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    lessonsCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    requirements: [{
        type: String,
        trim: true
    }],
    objectives: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    adminApproval: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminApprovedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    adminApprovedAt: {
        type: Date,
        default: null
    },
    adminRejectionReason: {
        type: String,
        maxlength: 500,
        default: null
    }
}, {
    timestamps: true
});

// Index for better query performance
courseSchema.index({ category: 1, level: 1, isPublished: 1 });
courseSchema.index({ createdBy: 1 });
courseSchema.index({ teacher: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ status: 1 });

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
