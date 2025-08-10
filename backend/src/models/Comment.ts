import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    
    // Comment can be on different types of content
    contentType: 'course' | 'lesson' | 'exercise' | 'discussion';
    contentId: mongoose.Types.ObjectId;
    
    // For threaded comments
    parentId?: mongoose.Types.ObjectId;
    replies: mongoose.Types.ObjectId[];
    
    // Engagement metrics
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    
    // Moderation
    isApproved: boolean;
    isReported: boolean;
    reportReason?: string;
    
    // Language learning specific
    language?: 'en' | 'vi'; // comment language
    translation?: string; // if comment is in Vietnamese
    
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    contentType: {
        type: String,
        enum: ['course', 'lesson', 'exercise', 'discussion'],
        required: true
    },
    contentId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reportReason: String,
    language: {
        type: String,
        enum: ['en', 'vi'],
        default: 'en'
    },
    translation: String
}, {
    timestamps: true
});

// Index for better query performance
commentSchema.index({ contentType: 1, contentId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentId: 1 });
commentSchema.index({ isApproved: 1, isReported: 1 });

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
