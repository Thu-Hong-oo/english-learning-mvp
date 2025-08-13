import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IInstructorApplication extends Document {
    userId?: mongoose.Types.ObjectId
    email?: string
    fullName: string
    bio?: string
    expertise?: string[]
    experienceYears?: number
    portfolioUrl?: string
    attachments?: { name: string; url: string }[]
    status: 'pending' | 'approved' | 'rejected'
    reviewedBy?: mongoose.Types.ObjectId
    reviewedAt?: Date
    reviewNotes?: string
    createdAt: Date
    updatedAt: Date
}

const instructorApplicationSchema = new Schema<IInstructorApplication>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    email: { type: String, trim: true, index: true },
    fullName: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    expertise: [{ type: String, trim: true }],
    experienceYears: { type: Number, min: 0, default: 0 },
    portfolioUrl: { type: String, default: '' },
    attachments: [{ name: { type: String }, url: { type: String } }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNotes: { type: String },
}, { timestamps: true })

instructorApplicationSchema.index({ userId: 1, status: 1 })
instructorApplicationSchema.index({ email: 1, status: 1 })

const InstructorApplication: Model<IInstructorApplication> = mongoose.model<IInstructorApplication>('InstructorApplication', instructorApplicationSchema)

export default InstructorApplication


