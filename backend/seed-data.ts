import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Import models
import User from './src/models/User';
import Course from './src/models/Course';
import Lesson from './src/models/Lesson';

dotenv.config();

// Sample teachers data
const teachers = [
  {
    username: 'teacher_sarah',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    fullName: 'Sarah Johnson',
    role: 'teacher',
    bio: 'Experienced English teacher with 8 years of teaching experience.',
    expertise: ['TOEIC', 'IELTS', 'Business English'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'teacher_mike',
    email: 'mike.chen@example.com',
    password: 'password123',
    fullName: 'Mike Chen',
    role: 'teacher',
    bio: 'Certified English instructor with expertise in conversation and grammar.',
    expertise: ['Conversation', 'Grammar', 'General English'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    username: 'teacher_emma',
    email: 'emma.wilson@example.com',
    password: 'password123',
    fullName: 'Emma Wilson',
    role: 'teacher',
    bio: 'Specialized in pronunciation and vocabulary building.',
    expertise: ['Pronunciation', 'Vocabulary', 'General English'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

// Sample courses data matching the ICourse interface
const courses = [
  {
    title: 'TOEIC Complete Preparation Course',
    description: 'Master the TOEIC exam with our comprehensive preparation course covering all sections: Listening and Reading. Perfect for professionals and students aiming for high scores.',
    level: 'intermediate' as const,
    category: 'TOEIC' as const,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    duration: 40,
    lessonsCount: 0,
    isPublished: true,
    tags: ['TOEIC', 'Business English', 'Test Preparation'],
    difficulty: 3,
    rating: 4.5,
    totalStudents: 0,
    price: 89,
    requirements: ['Basic English knowledge', 'Intermediate reading skills'],
    objectives: ['Achieve TOEIC score 700+', 'Master business vocabulary', 'Improve listening comprehension']
  },
  {
    title: 'IELTS Academic Writing Masterclass',
    description: 'Excel in IELTS Academic Writing with expert guidance on Task 1 and Task 2. Learn proven strategies and techniques to achieve your target band score.',
    level: 'advanced' as const,
    category: 'IELTS' as const,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
    duration: 25,
    lessonsCount: 0,
    isPublished: true,
    tags: ['IELTS', 'Academic Writing'],
    difficulty: 4,
    rating: 4.8,
    totalStudents: 0,
    price: 75,
    requirements: ['Upper-intermediate English level', 'Basic essay writing skills'],
    objectives: ['Score 7.0+ in Writing', 'Master essay structures', 'Develop critical thinking']
  },
  {
    title: 'Business English Conversation Skills',
    description: 'Develop confident business English communication skills for meetings, presentations, and professional interactions.',
    level: 'intermediate' as const,
    category: 'Business English' as const,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    duration: 30,
    lessonsCount: 0,
    isPublished: true,
    tags: ['Business English', 'Conversation'],
    difficulty: 3,
    rating: 4.2,
    totalStudents: 0,
    price: 65,
    requirements: ['Intermediate English level', 'Basic business knowledge'],
    objectives: ['Confident business conversations', 'Professional vocabulary', 'Meeting participation skills']
  },
  {
    title: 'English Grammar Fundamentals',
    description: 'Master essential English grammar rules and structures through interactive lessons and practice exercises.',
    level: 'beginner' as const,
    category: 'Grammar' as const,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
    duration: 20,
    lessonsCount: 0,
    isPublished: true,
    tags: ['Grammar', 'Fundamentals'],
    difficulty: 2,
    rating: 4.0,
    totalStudents: 0,
    price: 45,
    requirements: ['Basic English knowledge'],
    objectives: ['Understand core grammar rules', 'Improve sentence structure', 'Build confidence in writing']
  },
  {
    title: 'Advanced Vocabulary Builder',
    description: 'Expand your English vocabulary with advanced words, idioms, and expressions for academic and professional success.',
    level: 'advanced' as const,
    category: 'Vocabulary' as const,
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    duration: 35,
    lessonsCount: 0,
    isPublished: true,
    tags: ['Vocabulary', 'Advanced English'],
    difficulty: 4,
    rating: 4.6,
    totalStudents: 0,
    price: 55,
    requirements: ['Upper-intermediate English level'],
    objectives: ['Learn 500+ advanced words', 'Master idioms and expressions', 'Improve communication skills']
  }
];

// Sample lessons data
const lessons = [
  {
    title: 'Introduction to TOEIC Test Format',
    description: 'Overview of TOEIC test structure and preparation strategies',
    content: 'The TOEIC test is designed to measure everyday English skills that people use in the workplace and other real-life settings. This lesson covers the test format, scoring system, and effective preparation strategies.',
    duration: 45,
    type: 'video' as const,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order: 1,
    status: 'published' as const
  },
  {
    title: 'TOEIC Listening Practice - Part 1',
    description: 'Practice listening skills for TOEIC exam Part 1',
    content: 'Improve your listening comprehension with targeted exercises focusing on photographs and descriptions.',
    duration: 60,
    type: 'video' as const,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order: 2,
    status: 'published' as const
  },
  {
    title: 'IELTS Writing Task 1 - Describing Graphs',
    description: 'Learn to describe graphs and charts effectively',
    content: 'Master the skills needed for IELTS Writing Task 1. Learn how to analyze and describe different types of charts, graphs, and diagrams.',
    duration: 90,
    type: 'text' as const,
    order: 1,
    status: 'published' as const
  },
  {
    title: 'Business Meeting Vocabulary',
    description: 'Essential vocabulary for business meetings and discussions',
    content: 'Learn key vocabulary and phrases commonly used in business meetings, including expressions for agreeing, disagreeing, and making suggestions.',
    duration: 50,
    type: 'video' as const,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order: 1,
    status: 'published' as const
  },
  {
    title: 'Present Perfect Tense',
    description: 'Understanding and using the present perfect tense',
    content: 'Learn when and how to use the present perfect tense, including its forms, common time expressions, and differences from other tenses.',
    duration: 40,
    type: 'text' as const,
    order: 1,
    status: 'published' as const
  },
  {
    title: 'Academic Vocabulary - Part 1',
    description: 'Essential academic vocabulary for higher education',
    content: 'Build your academic vocabulary with words commonly used in university settings, research papers, and academic discussions.',
    duration: 55,
    type: 'text' as const,
    order: 1,
    status: 'published' as const
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ role: 'teacher' });
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create teachers
    const createdTeachers = [];
    for (const teacherData of teachers) {
      const hashedPassword = await bcrypt.hash(teacherData.password, 10);
      const teacher = new User({
        ...teacherData,
        password: hashedPassword,
        isEmailVerified: true,
        isActive: true
      });
      const savedTeacher = await teacher.save();
      createdTeachers.push(savedTeacher);
      console.log(`👨‍🏫 Created teacher: ${savedTeacher.fullName}`);
    }

    // Create courses
    const createdCourses = [];
    for (let i = 0; i < courses.length; i++) {
      const courseData = courses[i];
      const teacher = createdTeachers[i % createdTeachers.length];
      
      const course = new Course({
        ...courseData,
        createdBy: teacher._id,
        teacher: teacher._id,
        lessons: [],
        status: 'published' as const,
        adminApproval: 'approved' as const,
        adminApprovedAt: new Date(),
        totalStudents: Math.floor(Math.random() * 100) + 10,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      });
      
      const savedCourse = await course.save();
      createdCourses.push(savedCourse);
      console.log(`📚 Created course: ${savedCourse.title}`);
    }

    // Create lessons
    let lessonIndex = 0;
    for (let i = 0; i < createdCourses.length; i++) {
      const course = createdCourses[i];
      const teacher = createdTeachers[i % createdTeachers.length];
      
      // Add 2-3 lessons per course
      const lessonsPerCourse = Math.floor(Math.random() * 2) + 2;
      const courseLessons = [];
      
      for (let j = 0; j < lessonsPerCourse; j++) {
        const lessonData = lessons[lessonIndex % lessons.length];
        const lesson = new Lesson({
          ...lessonData,
          course: course._id,
          teacher: teacher._id,
          order: j + 1
        });
        
        const savedLesson = await lesson.save();
        courseLessons.push(savedLesson._id);
        lessonIndex++;
        console.log(`📖 Created lesson: ${savedLesson.title}`);
      }
      
      // Update course with lessons
      course.lessons = courseLessons;
      course.lessonsCount = courseLessons.length;
      await course.save();
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log(`👨‍🏫 Teachers: ${createdTeachers.length}`);
    console.log(`📚 Courses: ${createdCourses.length}`);
    console.log(`📖 Lessons: ${lessonIndex}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedData();
