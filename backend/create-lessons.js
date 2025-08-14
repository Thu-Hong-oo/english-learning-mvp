const mongoose = require('mongoose');
require('dotenv').config();

async function createLessons() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the first teacher
    const teacher = await mongoose.models.User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log('❌ No teacher found. Please create a teacher first.');
      return;
    }

    // Get the first course
    const course = await mongoose.models.Course.findOne({ teacher: teacher._id });
    if (!course) {
      console.log('❌ No course found. Please create a course first.');
      return;
    }

    console.log(`📚 Creating lessons for course: ${course.title}`);

    // Create sample lessons
    const lessons = [
      {
        title: 'Giới thiệu khóa học',
        description: 'Tổng quan về khóa học và cách học hiệu quả',
        content: 'Chào mừng bạn đến với khóa học! Trong bài học này, chúng ta sẽ tìm hiểu về cấu trúc khóa học và cách học hiệu quả nhất.',
        duration: 15,
        type: 'video',
        order: 1,
        course: course._id,
        teacher: teacher._id,
        status: 'published', // Published for students to see
        videoUrl: 'https://example.com/intro-video.mp4'
      },
      {
        title: 'Bài học cơ bản 1',
        description: 'Học từ vựng cơ bản',
        content: 'Trong bài học này, chúng ta sẽ học các từ vựng cơ bản và cách sử dụng chúng trong câu.',
        duration: 30,
        type: 'text',
        order: 2,
        course: course._id,
        teacher: teacher._id,
        status: 'published', // Published for students to see
      },
      {
        title: 'Bài học cơ bản 2',
        description: 'Luyện tập ngữ pháp',
        content: 'Bài học này sẽ giúp bạn luyện tập ngữ pháp cơ bản thông qua các bài tập thực hành.',
        duration: 25,
        type: 'quiz',
        order: 3,
        course: course._id,
        teacher: teacher._id,
        status: 'draft', // Draft - only teacher can see
      },
      {
        title: 'Bài học nâng cao',
        description: 'Kỹ năng giao tiếp nâng cao',
        content: 'Trong bài học này, chúng ta sẽ học các kỹ năng giao tiếp nâng cao và cách áp dụng vào thực tế.',
        duration: 45,
        type: 'audio',
        order: 4,
        course: course._id,
        teacher: teacher._id,
        status: 'published', // Published for students to see
        audioUrl: 'https://example.com/advanced-lesson.mp3'
      }
    ];

    for (const lessonData of lessons) {
      const lesson = new mongoose.models.Lesson(lessonData);
      await lesson.save();
      console.log(`📖 Created lesson: ${lesson.title} (Status: ${lesson.status})`);
    }

    // Update course lessons count
    const publishedLessonsCount = lessons.filter(l => l.status === 'published').length;
    await mongoose.models.Course.findByIdAndUpdate(course._id, {
      lessonsCount: publishedLessonsCount
    });

    console.log(`🎉 Created ${lessons.length} lessons successfully!`);
    console.log(`📊 Published lessons: ${publishedLessonsCount}`);
    console.log(`📊 Draft lessons: ${lessons.length - publishedLessonsCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createLessons();
