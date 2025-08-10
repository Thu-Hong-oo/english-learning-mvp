import mongoose, { Document, Schema } from 'mongoose';

export interface IVocabulary extends Document {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    definitions: Array<{
        meaning: string;
        example: string;
        translation?: string;
    }>;
    
    // Learning metadata
    level: 'beginner' | 'intermediate' | 'advanced';
    category: 'grammar' | 'vocabulary' | 'idiom' | 'phrasal-verb';
    tags: string[];
    
    // Audio and visual
    audioUrl?: string;
    imageUrl?: string;
    
    // Related words
    synonyms: string[];
    antonyms: string[];
    relatedWords: string[];
    
    // Usage statistics
    difficulty: number; // 1-5 scale
    frequency: number; // how common the word is
    usageCount: number; // how many times used in exercises
    
    // AI integration
    aiGenerated: boolean;
    aiConfidence?: number;
    
    createdBy: mongoose.Types.ObjectId;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const vocabularySchema = new Schema<IVocabulary>({
    word: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phonetic: {
        type: String,
        required: true
    },
    partOfSpeech: {
        type: String,
        required: true,
        trim: true
    },
    definitions: [{
        meaning: {
            type: String,
            required: true
        },
        example: {
            type: String,
            required: true
        },
        translation: String
    }],
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    category: {
        type: String,
        enum: ['grammar', 'vocabulary', 'idiom', 'phrasal-verb'],
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    audioUrl: String,
    imageUrl: String,
    synonyms: [{
        type: String,
        trim: true
    }],
    antonyms: [{
        type: String,
        trim: true
    }],
    relatedWords: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    frequency: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    usageCount: {
        type: Number,
        default: 0,
        min: 0
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    aiConfidence: {
        type: Number,
        min: 0,
        max: 1
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
vocabularySchema.index({ word: 1 });
vocabularySchema.index({ level: 1, category: 1 });
vocabularySchema.index({ tags: 1 });
vocabularySchema.index({ difficulty: 1, frequency: 1 });
vocabularySchema.index({ createdBy: 1, isApproved: 1 });

const Vocabulary = mongoose.model<IVocabulary>('Vocabulary', vocabularySchema);

export default Vocabulary;
