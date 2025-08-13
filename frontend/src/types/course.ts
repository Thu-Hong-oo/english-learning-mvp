export interface Course {
  _id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'TOEIC' | 'IELTS' | 'TOEFL' | 'Cambridge' | 'Business English' | 'General English' | 'Conversation' | 'Grammar' | 'Vocabulary' | 'Pronunciation';
  thumbnail?: string;
  duration: number;
  lessonsCount: number;
  isPublished: boolean;
  createdBy: string;
  teacher: string;
  lessons: string[];
  tags: string[];
  difficulty: number;
  rating: number;
  totalStudents: number;
  enrolledStudents: number;
  price: number;
  requirements?: string[];
  objectives?: string[];
  status: 'draft' | 'published' | 'archived';
  adminApproval: 'pending' | 'approved' | 'rejected';
  adminApprovedBy?: string;
  adminApprovedAt?: string;
  adminRejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
