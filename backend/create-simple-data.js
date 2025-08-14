const mongoose = require('mongoose');
require('dotenv').config();

async function createSimpleData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Define simple schemas
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      fullName: String,
      role: String,
      isActive: Boolean,
      isEmailVerified: Boolean,
      avatar: String,
      level: String,
      bio: String,
      expertise: [String],
      experienceYears: Number,
      education: String,
      certifications: [String],
      portfolioUrl: String,
      linkedinUrl: String
    }, { strict: false });

    const courseSchema = new mongoose.Schema({
      title: String,
      description: String,
      level: String,
      category: String,
      thumbnail: String,
      duration: Number,
      lessonsCount: Number,
      isPublished: Boolean,
      tags: [String],
      difficulty: Number,
      rating: Number,
      totalStudents: Number,
      price: Number,
      requirements: [String],
      objectives: [String],
      status: String,
      adminApproval: String,
      createdBy: mongoose.Schema.Types.ObjectId,
      teacher: mongoose.Schema.Types.ObjectId
    }, { strict: false });

    const lessonSchema = new mongoose.Schema({
      title: String,
      description: String,
      content: String,
      duration: Number,
      type: String,
      order: Number,
      course: mongoose.Schema.Types.ObjectId,
      teacher: mongoose.Schema.Types.ObjectId,
      status: String,
      videoUrl: String,
      audioUrl: String,
      thumbnail: String
    }, { strict: false });

    // Register models
    const User = mongoose.model('User', userSchema);
    const Course = mongoose.model('Course', courseSchema);
    const Lesson = mongoose.model('Lesson', lessonSchema);

    console.log('✅ Models registered successfully');

    // Create sample teachers
    const teachers = [
      {
        username: 'prof_sarah',
        email: 'sarah.johnson@englishacademy.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
        fullName: 'Sarah Johnson',
        role: 'teacher',
        isActive: true,
        isEmailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: 'advanced',
        bio: 'Experienced English teacher with 8+ years of experience in TOEIC and IELTS preparation.',
        expertise: ['TOEIC', 'IELTS', 'Business English', 'Academic Writing'],
        experienceYears: 8,
        education: 'MA in Applied Linguistics, University of Cambridge',
        certifications: ['CELTA', 'DELTA', 'TOEIC Trainer', 'IELTS Examiner'],
        portfolioUrl: 'https://sarahjohnson-english.com',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson-english'
      },
      {
        username: 'prof_michael',
        email: 'michael.chen@englishacademy.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        fullName: 'Michael Chen',
        role: 'teacher',
        isActive: true,
        isEmailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        level: 'advanced',
        bio: 'Pronunciation specialist and conversation expert.',
        expertise: ['Pronunciation', 'Conversation', 'Speaking', 'Listening'],
        experienceYears: 6,
        education: 'BA in English Literature, Oxford University',
        certifications: ['CELTA', 'Pronunciation Specialist'],
        portfolioUrl: 'https://michaelchen-speaking.com',
        linkedinUrl: 'https://linkedin.com/in/michaelchen-speaking'
      }
    ];

    console.log('👨‍🏫 Creating teachers...');
    const createdTeachers = [];
    for (const teacherData of teachers) {
      const teacher = new User(teacherData);
      await teacher.save();
      createdTeachers.push(teacher);
      console.log(`✅ Created teacher: ${teacher.fullName}`);
    }

    // Create courses
    const courses = [
      {
        title: 'TOEIC Complete Preparation Course',
        description: 'Master the TOEIC exam with our comprehensive preparation course. Covering all sections: Listening, Reading, Speaking, and Writing.',
        level: 'intermediate',
        category: 'TOEIC',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
        duration: 40,
        lessonsCount: 0,
        isPublished: true,
        tags: ['TOEIC', 'Business English', 'Test Preparation'],
        difficulty: 3,
        rating: 4.8,
        totalStudents: 156,
        price: 89,
        requirements: ['Intermediate English level (B1)', 'Basic business vocabulary'],
        objectives: ['Achieve TOEIC score 700+', 'Master business English vocabulary'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[0]._id,
        createdBy: createdTeachers[0]._id
      },
      {
        title: 'Business English Conversation Skills',
        description: 'Develop confident business English communication skills. Practice real-world scenarios: meetings, presentations, and networking.',
        level: 'intermediate',
        category: 'Business English',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        duration: 30,
        lessonsCount: 0,
        isPublished: true,
        tags: ['Business English', 'Conversation', 'Professional Communication'],
        difficulty: 3,
        rating: 4.6,
        totalStudents: 203,
        price: 65,
        requirements: ['Intermediate English level (B1)', 'Basic business knowledge'],
        objectives: ['Confident business conversations', 'Professional meeting participation'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[1]._id,
        createdBy: createdTeachers[1]._id
      }
    ];

    console.log('\n📚 Creating courses...');
    const createdCourses = [];
    for (const courseData of courses) {
      const course = new Course(courseData);
      await course.save();
      createdCourses.push(course);
      console.log(`✅ Created course: ${course.title}`);
    }

    // Create lessons
    const lessonsData = [
      // TOEIC Course Lessons
      {
        courseIndex: 0,
        lessons: [
          {
            title: 'Introduction to TOEIC Test Format',
            description: 'Understanding the TOEIC test structure, scoring system, and time management strategies',
            content: 'Welcome to the TOEIC Complete Preparation Course! In this lesson, we will explore the TOEIC test format, understand how it is scored, and learn essential time management strategies to maximize your performance.',
            duration: 45,
            type: 'video',
            order: 1,
            status: 'published',
            videoUrl: 'https://example.com/videos/toeic-intro.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop'
          },
          {
            title: 'TOEIC Listening Part 1: Photographs',
            description: 'Master the photograph description questions with proven strategies and practice exercises',
            content: 'In this lesson, we focus on TOEIC Listening Part 1, which tests your ability to understand descriptions of photographs. You will learn key vocabulary, common question types, and effective listening strategies.',
            duration: 60,
            type: 'video',
            order: 2,
            status: 'published',
            videoUrl: 'https://example.com/videos/toeic-listening-photos.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
          },
          {
            title: 'TOEIC Reading Part 5: Incomplete Sentences',
            description: 'Improve your grammar and vocabulary skills for the incomplete sentences section',
            content: 'This lesson covers TOEIC Reading Part 5, focusing on grammar and vocabulary in context. You will practice identifying correct word forms, verb tenses, and collocations to complete sentences accurately.',
            duration: 75,
            type: 'text',
            order: 3,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop'
          }
        ]
      },
      // Business English Course Lessons
      {
        courseIndex: 1,
        lessons: [
          {
            title: 'Business Meeting Vocabulary and Phrases',
            description: 'Master essential vocabulary and expressions for effective business meetings',
            content: 'Learn the key vocabulary and phrases needed to participate confidently in business meetings. This lesson covers meeting types, agenda items, and common expressions used in professional settings.',
            duration: 50,
            type: 'video',
            order: 1,
            status: 'published',
            videoUrl: 'https://example.com/videos/business-meetings.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop'
          },
          {
            title: 'Professional Email Writing',
            description: 'Write clear, professional emails that get results in business communication',
            content: 'Master the art of writing professional business emails. Learn proper formatting, tone, and structure for various business situations including inquiries, complaints, and follow-ups.',
            duration: 65,
            type: 'text',
            order: 2,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop'
          },
          {
            title: 'Business Presentation Skills',
            description: 'Deliver compelling business presentations with confidence and impact',
            content: 'Develop your business presentation skills from planning to delivery. Learn how to structure presentations, use visual aids effectively, and handle questions professionally.',
            duration: 80,
            type: 'audio',
            order: 3,
            status: 'published',
            audioUrl: 'https://example.com/audio/presentation-skills.mp3',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
          }
        ]
      }
    ];

    console.log('\n📖 Creating lessons for each course...');
    let totalLessons = 0;
    
    for (const courseLessons of lessonsData) {
      const course = createdCourses[courseLessons.courseIndex];
      console.log(`\n📚 Creating lessons for: ${course.title}`);
      
      for (const lessonData of courseLessons.lessons) {
        const lesson = new Lesson({
          ...lessonData,
          course: course._id,
          teacher: course.teacher
        });
        
        await lesson.save();
        totalLessons++;
        console.log(`  ✅ Created lesson: ${lesson.title}`);
      }
      
      // Update course lessons count
      const publishedLessonsCount = courseLessons.lessons.filter(l => l.status === 'published').length;
      await Course.findByIdAndUpdate(course._id, {
        lessonsCount: publishedLessonsCount
      });
      
      console.log(`  📊 Updated course with ${publishedLessonsCount} published lessons`);
    }

    console.log('\n🎉 Data creation completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👨‍🏫 Teachers created: ${createdTeachers.length}`);
    console.log(`   📚 Courses created: ${createdCourses.length}`);
    console.log(`   📖 Lessons created: ${totalLessons}`);
    
    console.log('\n📚 Course details:');
    createdCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title}`);
      console.log(`      Level: ${course.level}`);
      console.log(`      Category: ${course.category}`);
      console.log(`      Price: $${course.price}`);
      console.log(`      Lessons: ${course.lessonsCount}`);
      console.log(`      Rating: ${course.rating}/5`);
      console.log(`      Students: ${course.totalStudents}`);
      console.log('      ---');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createSimpleData();
