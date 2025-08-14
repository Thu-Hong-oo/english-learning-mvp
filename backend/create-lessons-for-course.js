const mongoose = require('mongoose');
require('dotenv').config();

// Import models
require('./models-index');

async function createLessonsForCourse() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Course ID from the URL
    const courseId = '689d804279d4b3e420b66e80';
    
    // Check if course exists
    const course = await mongoose.models.Course.findById(courseId);
    if (!course) {
      console.log('❌ Course not found with ID:', courseId);
      return;
    }

    console.log(`📚 Found course: ${course.title}`);
    console.log(`👨‍🏫 Teacher ID: ${course.teacher}`);

    // Check if teacher exists
    const teacher = await mongoose.models.User.findById(course.teacher);
    if (!teacher) {
      console.log('❌ Teacher not found');
      return;
    }

    console.log(`👨‍🏫 Teacher: ${teacher.fullName}`);

    // Check if lessons already exist for this course
    const existingLessons = await mongoose.models.Lesson.find({ course: courseId });
    if (existingLessons.length > 0) {
      console.log(`⚠️  Course already has ${existingLessons.length} lessons:`);
      existingLessons.forEach((lesson, index) => {
        console.log(`   ${index + 1}. ${lesson.title} (${lesson.status})`);
      });
      
      // Ask if user wants to continue
      console.log('\n💡 Do you want to create additional lessons? (y/n)');
      // For now, we'll continue
    }

    // Create sample lessons
    const lessons = [
      {
        title: 'Học từ vựng cơ bản',
        description: 'Học các từ vựng cơ bản và cách sử dụng',
        content: 'Trong bài học này, chúng ta sẽ học các từ vựng cơ bản và cách sử dụng chúng trong câu. Đây là nền tảng quan trọng để bạn có thể giao tiếp hiệu quả.',
        duration: 30,
        type: 'video',
        order: 1,
        course: courseId,
        teacher: course.teacher,
        status: 'published', // Published for students to see
        videoUrl: 'https://example.com/vocabulary-lesson.mp4'
      },
      {
        title: 'Luyện tập ngữ pháp',
        description: 'Thực hành ngữ pháp cơ bản',
        content: 'Bài học này sẽ giúp bạn luyện tập ngữ pháp cơ bản thông qua các bài tập thực hành. Chúng ta sẽ tập trung vào các cấu trúc câu cơ bản.',
        duration: 25,
        type: 'text',
        order: 2,
        course: courseId,
        teacher: course.teacher,
        status: 'published', // Published for students to see
      },
      {
        title: 'Kỹ năng nghe hiểu',
        description: 'Phát triển kỹ năng nghe hiểu tiếng Anh',
        content: 'Trong bài học này, chúng ta sẽ tập trung vào việc phát triển kỹ năng nghe hiểu. Bạn sẽ được luyện tập với các đoạn audio khác nhau.',
        duration: 35,
        type: 'audio',
        order: 3,
        course: courseId,
        teacher: course.teacher,
        status: 'published', // Published for students to see
        audioUrl: 'https://example.com/listening-lesson.mp3'
      },
      {
        title: 'Bài kiểm tra cuối khóa',
        description: 'Kiểm tra kiến thức đã học',
        content: 'Đây là bài kiểm tra cuối khóa để đánh giá kiến thức bạn đã học được. Hãy làm bài kiểm tra một cách nghiêm túc.',
        duration: 45,
        type: 'quiz',
        order: 4,
        course: courseId,
        teacher: course.teacher,
        status: 'draft', // Draft - only teacher can see
      }
    ];

    console.log('\n📖 Creating lessons...');
    
    for (const lessonData of lessons) {
      const lesson = new mongoose.models.Lesson(lessonData);
      await lesson.save();
      console.log(`✅ Created lesson: ${lesson.title} (Status: ${lesson.status})`);
    }

    // Update course lessons count
    const publishedLessonsCount = lessons.filter(l => l.status === 'published').length;
    await mongoose.models.Course.findByIdAndUpdate(courseId, {
      lessonsCount: publishedLessonsCount
    });

    console.log(`\n🎉 Successfully created ${lessons.length} lessons!`);
    console.log(`📊 Published lessons: ${publishedLessonsCount}`);
    console.log(`📊 Draft lessons: ${lessons.length - publishedLessonsCount}`);
    console.log(`\n💡 Now students should be able to see ${publishedLessonsCount} published lessons!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createLessonsForCourse();
