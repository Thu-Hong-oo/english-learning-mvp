import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IPost extends Document {
    authorId: mongoose.Types.ObjectId
    title: string
    slug: string
    excerpt?: string
    content: string
    coverImage?: string
    tags: string[]
    category?: string
    status: 'draft' | 'published'
    language: 'en' | 'vi'
    readingTime?: number
    publishedAt?: Date
    views: number
    likes: number
    commentsCnt: number
    createdAt: Date
    updatedAt: Date
}

const postSchema = new Schema<IPost>({
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true, index: true }],
    category: { type: String, trim: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    language: { type: String, enum: ['en', 'vi'], default: 'vi', index: true },
    readingTime: { type: Number, min: 1, default: 3 },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    commentsCnt: { type: Number, default: 0 },
}, { timestamps: true })

// Generate slug from title if not provided
function toSlug(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

postSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = toSlug(this.title)
    }
    next()
})

postSchema.index({ status: 1, publishedAt: -1 })

const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema)

export default Post


