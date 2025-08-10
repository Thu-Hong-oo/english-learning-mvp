import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'general';
    thumbnail?: string;
    duration: number; // in minutes
    lessonsCount: number;
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    tags: string[];
    difficulty: number; // 1-5 scale
    rating: number;
    totalStudents: number;
    price: number; // 0 for free courses
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
        enum: ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing', 'general'],
        required: true
    },
    thumbnail: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        required: true,
        min: 1
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
    }
}, {
    timestamps: true
});

// Index for better query performance
courseSchema.index({ category: 1, level: 1, isPublished: 1 });
courseSchema.index({ createdBy: 1 });
courseSchema.index({ tags: 1 });

const Course = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
