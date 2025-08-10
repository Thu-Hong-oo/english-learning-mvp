import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
    title: string;
    description: string;
    content: string;
    course: mongoose.Types.ObjectId; // Reference to Course
    order: number; // lesson order within course
    duration: number; // in minutes
    type: 'video' | 'text' | 'interactive' | 'quiz';
    thumbnail?: string;
    videoUrl?: string;
    materials: {
        videoUrl?: string;
        audioUrl?: string;
        documents?: string[];
        images?: string[];
    };
    vocabulary: Array<{
        word: string;
        definition: string;
        example: string;
        translation?: string;
    }>;
    grammarPoints: string[];
    exercises: mongoose.Types.ObjectId[];
    isPublished: boolean;
    teacher: mongoose.Types.ObjectId; // Reference to User (teacher)
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
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
    content: {
        type: String,
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        required: true,
        min: 1
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    type: {
        type: String,
        enum: ['video', 'text', 'interactive', 'quiz'],
        required: true
    },
    thumbnail: {
        type: String,
        default: null
    },
    videoUrl: {
        type: String,
        default: null
    },
    materials: {
        videoUrl: String,
        audioUrl: String,
        documents: [String],
        images: [String]
    },
    vocabulary: [{
        word: {
            type: String,
            required: true,
            trim: true
        },
        definition: {
            type: String,
            required: true
        },
        example: {
            type: String,
            required: true
        },
        translation: String
    }],
    grammarPoints: [{
        type: String,
        trim: true
    }],
    exercises: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }],
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
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ course: 1, isPublished: 1 });
lessonSchema.index({ teacher: 1 });
lessonSchema.index({ status: 1 });

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

export default Lesson;
