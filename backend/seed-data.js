const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models using require - use the compiled JS files
const User = require('./dist/models/User').default;
const Course = require('./dist/models/Course').default;
const Lesson = require('./dist/models/Lesson').default;

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
  }
];

// Sample courses data
const courses = [
  {
    title: 'TOEIC Complete Preparation Course',
    description: 'Master the TOEIC exam with our comprehensive preparation course.',
    category: 'TOEIC',
    level: 'intermediate',
    duration: 40,
    price: 89,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    tags: ['TOEIC', 'Business English', 'Test Preparation'],
    requirements: ['Basic English knowledge'],
    objectives: ['Achieve TOEIC score 700+', 'Master business vocabulary']
  },
  {
    title: 'IELTS Academic Writing Masterclass',
    description: 'Excel in IELTS Academic Writing with expert guidance.',
    category: 'IELTS',
    level: 'advanced',
    duration: 25,
    price: 75,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
    tags: ['IELTS', 'Academic Writing'],
    requirements: ['Upper-intermediate English level'],
    objectives: ['Score 7.0+ in Writing', 'Master essay structures']
  },
  {
    title: 'Business English Conversation Skills',
    description: 'Develop confident business English communication skills.',
    category: 'Business English',
    level: 'intermediate',
    duration: 30,
    price: 65,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    tags: ['Business English', 'Conversation'],
    requirements: ['Intermediate English level'],
    objectives: ['Confident business conversations', 'Professional vocabulary']
  }
];

// Sample lessons data
const lessons = [
  {
    title: 'Introduction to TOEIC Test Format',
    description: 'Overview of TOEIC test structure and preparation strategies',
    content: 'The TOEIC test is designed to measure everyday English skills.',
    duration: 45,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    title: 'TOEIC Listening Practice',
    description: 'Practice listening skills for TOEIC exam',
    content: 'Improve your listening comprehension with targeted exercises.',
    duration: 60,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    title: 'IELTS Writing Task 1',
    description: 'Learn to describe graphs and charts',
    content: 'Master the skills needed for IELTS Writing Task 1.',
    duration: 90,
    type: 'text'
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
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
        teacher: teacher._id,
        createdBy: teacher._id,
        lessons: [],
        status: 'published',
        adminApproval: 'approved',
        adminApprovedAt: new Date(),
        lessonsCount: 0,
        totalStudents: Math.floor(Math.random() * 100) + 10,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        difficulty: Math.floor(Math.random() * 3) + 2
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
          order: j + 1,
          status: 'published'
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
