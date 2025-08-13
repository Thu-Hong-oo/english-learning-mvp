import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IInstructorApplication extends Document {
    userId?: mongoose.Types.ObjectId
    email?: string
    fullName: string
    phone?: string
    dateOfBirth?: Date
    bio?: string
    expertise?: string[]
    experienceYears?: number
    education?: string
    certifications?: string[]
    portfolioUrl?: string
    linkedinUrl?: string
    teachingExperience?: string
    preferredSubjects?: string[]
    availability?: string
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
    phone: { type: String, trim: true },
    dateOfBirth: { type: Date },
    bio: { type: String, default: '' },
    expertise: [{ type: String, trim: true }],
    experienceYears: { type: Number, min: 0, default: 0 },
    education: { type: String, trim: true },
    certifications: [{ type: String, trim: true }],
    portfolioUrl: { type: String, default: '' },
    linkedinUrl: { type: String, trim: true },
    teachingExperience: { type: String, default: '' },
    preferredSubjects: [{ type: String, trim: true }],
    availability: { type: String, default: '' },
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


