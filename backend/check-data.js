const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check courses
    const Course = mongoose.model('Course');
    const courses = await Course.find({});
    console.log(`📚 Total courses: ${courses.length}`);
    
    if (courses.length > 0) {
      console.log('Sample course:', {
        title: courses[0].title,
        status: courses[0].status,
        adminApproval: courses[0].adminApproval
      });
    }

    // Check teachers
    const User = mongoose.model('User');
    const teachers = await User.find({ role: 'teacher' });
    console.log(`👨‍🏫 Total teachers: ${teachers.length}`);

    // Check lessons
    const Lesson = mongoose.model('Lesson');
    const lessons = await Lesson.find({});
    console.log(`📖 Total lessons: ${lessons.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkData();
