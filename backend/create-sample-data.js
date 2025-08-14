const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createSampleData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create a simple teacher
    const hashedPassword = await bcrypt.hash('password123', 10);
    const teacher = new mongoose.models.User({
      username: 'teacher_sarah',
      email: 'sarah@example.com',
      password: hashedPassword,
      fullName: 'Sarah Johnson',
      role: 'teacher',
      isEmailVerified: true,
      isActive: true
    });
    await teacher.save();
    console.log('👨‍🏫 Created teacher');

    // Create sample courses
    const courses = [
      {
        title: 'TOEIC Complete Preparation Course',
        description: 'Master the TOEIC exam with our comprehensive preparation course.',
        level: 'intermediate',
        category: 'TOEIC',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
        duration: 40,
        lessonsCount: 0,
        isPublished: true,
        tags: ['TOEIC', 'Business English'],
        difficulty: 3,
        rating: 4.5,
        totalStudents: 25,
        price: 89,
        requirements: ['Basic English knowledge'],
        objectives: ['Achieve TOEIC score 700+'],
        status: 'published',
        adminApproval: 'approved',
        adminApprovedAt: new Date(),
        createdBy: teacher._id,
        teacher: teacher._id,
        lessons: []
      },
      {
        title: 'IELTS Academic Writing Masterclass',
        description: 'Excel in IELTS Academic Writing with expert guidance.',
        level: 'advanced',
        category: 'IELTS',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
        duration: 25,
        lessonsCount: 0,
        isPublished: true,
        tags: ['IELTS', 'Academic Writing'],
        difficulty: 4,
        rating: 4.8,
        totalStudents: 18,
        price: 75,
        requirements: ['Upper-intermediate English level'],
        objectives: ['Score 7.0+ in Writing'],
        status: 'published',
        adminApproval: 'approved',
        adminApprovedAt: new Date(),
        createdBy: teacher._id,
        teacher: teacher._id,
        lessons: []
      },
      {
        title: 'Business English Conversation Skills',
        description: 'Develop confident business English communication skills.',
        level: 'intermediate',
        category: 'Business English',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        duration: 30,
        lessonsCount: 0,
        isPublished: true,
        tags: ['Business English', 'Conversation'],
        difficulty: 3,
        rating: 4.2,
        totalStudents: 32,
        price: 65,
        requirements: ['Intermediate English level'],
        objectives: ['Confident business conversations'],
        status: 'published',
        adminApproval: 'approved',
        adminApprovedAt: new Date(),
        createdBy: teacher._id,
        teacher: teacher._id,
        lessons: []
      }
    ];

    for (const courseData of courses) {
      const course = new mongoose.models.Course(courseData);
      await course.save();
      console.log(`📚 Created course: ${course.title}`);
    }

    console.log('🎉 Sample data created successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSampleData();
