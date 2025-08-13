import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson extends Document {
  title: string
  description: string
  content: string
  duration: number // in minutes
  type: 'video' | 'text' | 'quiz' | 'audio'
  order: number
  course: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  status: 'draft' | 'published'
  videoUrl?: string
  audioUrl?: string
  attachments?: { name: string; url: string }[]
  createdAt: Date
  updatedAt: Date
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
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'audio'],
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  videoUrl: {
    type: String,
    default: null
  },
  audioUrl: {
    type: String,
    default: null
  },
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, {
  timestamps: true
})

// Indexes
lessonSchema.index({ course: 1, order: 1 })
lessonSchema.index({ teacher: 1 })
lessonSchema.index({ status: 1 })

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema)

export default Lesson
