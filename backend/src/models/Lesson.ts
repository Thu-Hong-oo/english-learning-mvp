import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
    title: string;
    description: string;
    content: string;
    courseId: mongoose.Types.ObjectId;
    order: number; // lesson order within course
    duration: number; // in minutes
    type: 'video' | 'text' | 'interactive' | 'quiz';
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
    createdBy: mongoose.Types.ObjectId;
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
    courseId: {
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
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better query performance
lessonSchema.index({ courseId: 1, order: 1 });
lessonSchema.index({ courseId: 1, isPublished: 1 });
lessonSchema.index({ createdBy: 1 });

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);

export default Lesson;
