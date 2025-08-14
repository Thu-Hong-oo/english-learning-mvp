const mongoose = require('mongoose');
require('dotenv').config();

async function createCompleteData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas
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
      linkedinUrl: String,
      createdAt: Date,
      lastLogin: Date
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
      teacher: mongoose.Schema.Types.ObjectId,
      lessons: [mongoose.Schema.Types.ObjectId]
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
      thumbnail: String,
      attachments: [{
        name: String,
        url: String
      }]
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
        bio: 'Experienced English teacher with 8+ years of experience in TOEIC and IELTS preparation. Specialized in business English and academic writing.',
        expertise: ['TOEIC', 'IELTS', 'Business English', 'Academic Writing', 'Grammar'],
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
        bio: 'Pronunciation specialist and conversation expert. Helping students develop natural speaking skills and confidence in English communication.',
        expertise: ['Pronunciation', 'Conversation', 'Speaking', 'Listening', 'General English'],
        experienceYears: 6,
        education: 'BA in English Literature, Oxford University',
        certifications: ['CELTA', 'Pronunciation Specialist', 'Conversation Coach'],
        portfolioUrl: 'https://michaelchen-speaking.com',
        linkedinUrl: 'https://linkedin.com/in/michaelchen-speaking'
      },
      {
        username: 'prof_emma',
        email: 'emma.wilson@englishacademy.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        fullName: 'Emma Wilson',
        role: 'teacher',
        isActive: true,
        isEmailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        level: 'advanced',
        bio: 'Grammar expert and vocabulary specialist. Creating engaging lessons that make complex grammar rules easy to understand and remember.',
        expertise: ['Grammar', 'Vocabulary', 'Writing', 'Reading', 'Test Preparation'],
        experienceYears: 7,
        education: 'MA in English Language Teaching, University of London',
        certifications: ['CELTA', 'Grammar Specialist', 'Vocabulary Expert'],
        portfolioUrl: 'https://emmawilson-grammar.com',
        linkedinUrl: 'https://linkedin.com/in/emmawilson-grammar'
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

    // Create comprehensive courses
    const courses = [
      {
        title: 'TOEIC Complete Preparation Course',
        description: 'Master the TOEIC exam with our comprehensive preparation course. Covering all sections: Listening, Reading, Speaking, and Writing. Perfect for business professionals and students aiming for high scores.',
        level: 'intermediate',
        category: 'TOEIC',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
        duration: 40,
        lessonsCount: 0,
        isPublished: true,
        tags: ['TOEIC', 'Business English', 'Test Preparation', 'Listening', 'Reading'],
        difficulty: 3,
        rating: 4.8,
        totalStudents: 156,
        price: 89,
        requirements: ['Intermediate English level (B1)', 'Basic business vocabulary', 'Regular study commitment'],
        objectives: ['Achieve TOEIC score 700+', 'Master business English vocabulary', 'Improve listening comprehension', 'Enhance reading speed and accuracy'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[0]._id,
        createdBy: createdTeachers[0]._id
      },
      {
        title: 'IELTS Academic Writing Masterclass',
        description: 'Excel in IELTS Academic Writing with expert guidance. Learn proven strategies for Task 1 (graphs/charts) and Task 2 (essays). Includes detailed feedback and scoring analysis.',
        level: 'advanced',
        category: 'IELTS',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop',
        duration: 25,
        lessonsCount: 0,
        isPublished: true,
        tags: ['IELTS', 'Academic Writing', 'Essay Writing', 'Graph Description', 'Academic English'],
        difficulty: 4,
        rating: 4.9,
        totalStudents: 89,
        price: 75,
        requirements: ['Upper-intermediate English level (B2)', 'Basic essay writing skills', 'Understanding of academic vocabulary'],
        objectives: ['Score 7.0+ in Writing', 'Master Task 1 graph description', 'Write compelling Task 2 essays', 'Use advanced academic vocabulary'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[0]._id,
        createdBy: createdTeachers[0]._id
      },
      {
        title: 'Business English Conversation Skills',
        description: 'Develop confident business English communication skills. Practice real-world scenarios: meetings, presentations, negotiations, and networking. Build professional vocabulary and cultural awareness.',
        level: 'intermediate',
        category: 'Business English',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        duration: 30,
        lessonsCount: 0,
        isPublished: true,
        tags: ['Business English', 'Conversation', 'Professional Communication', 'Meetings', 'Presentations'],
        difficulty: 3,
        rating: 4.6,
        totalStudents: 203,
        price: 65,
        requirements: ['Intermediate English level (B1)', 'Basic business knowledge', 'Willingness to practice speaking'],
        objectives: ['Confident business conversations', 'Professional meeting participation', 'Effective presentation skills', 'Business networking confidence'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[1]._id,
        createdBy: createdTeachers[1]._id
      },
      {
        title: 'English Pronunciation Mastery',
        description: 'Perfect your English pronunciation with systematic training. Cover all sounds, stress patterns, intonation, and connected speech. Includes audio practice and video demonstrations.',
        level: 'beginner',
        category: 'Pronunciation',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
        duration: 20,
        lessonsCount: 0,
        isPublished: true,
        tags: ['Pronunciation', 'Speaking', 'Phonetics', 'Stress', 'Intonation'],
        difficulty: 2,
        rating: 4.7,
        totalStudents: 178,
        price: 55,
        requirements: ['Basic English knowledge', 'Access to audio equipment', 'Regular practice commitment'],
        objectives: ['Clear pronunciation of all English sounds', 'Correct word and sentence stress', 'Natural intonation patterns', 'Confident speaking'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[1]._id,
        createdBy: createdTeachers[1]._id
      },
      {
        title: 'Advanced Grammar & Vocabulary Builder',
        description: 'Master advanced English grammar and expand your vocabulary. Learn complex structures, idiomatic expressions, and academic language. Perfect for advanced learners and professionals.',
        level: 'advanced',
        category: 'Grammar',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
        duration: 35,
        lessonsCount: 0,
        isPublished: true,
        tags: ['Grammar', 'Vocabulary', 'Advanced English', 'Academic Language', 'Idioms'],
        difficulty: 4,
        rating: 4.5,
        totalStudents: 134,
        price: 70,
        requirements: ['Upper-intermediate English level (B2)', 'Strong grammar foundation', 'Academic or professional goals'],
        objectives: ['Master advanced grammar structures', 'Expand academic vocabulary', 'Use idiomatic expressions', 'Write sophisticated texts'],
        status: 'published',
        adminApproval: 'approved',
        teacher: createdTeachers[2]._id,
        createdBy: createdTeachers[2]._id
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

    // Create comprehensive lessons for each course
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
            thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
            attachments: [
              { name: 'TOEIC Test Format Guide', url: 'https://example.com/pdfs/toeic-format.pdf' },
              { name: 'Time Management Worksheet', url: 'https://example.com/pdfs/time-management.pdf' }
            ]
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
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Photograph Vocabulary List', url: 'https://example.com/pdfs/photo-vocab.pdf' },
              { name: 'Practice Audio Files', url: 'https://example.com/audio/photo-practice.mp3' }
            ]
          },
          {
            title: 'TOEIC Reading Part 5: Incomplete Sentences',
            description: 'Improve your grammar and vocabulary skills for the incomplete sentences section',
            content: 'This lesson covers TOEIC Reading Part 5, focusing on grammar and vocabulary in context. You will practice identifying correct word forms, verb tenses, and collocations to complete sentences accurately.',
            duration: 75,
            type: 'text',
            order: 3,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Grammar Review Guide', url: 'https://example.com/pdfs/grammar-review.pdf' },
              { name: 'Practice Questions', url: 'https://example.com/pdfs/reading-practice.pdf' }
            ]
          },
          {
            title: 'TOEIC Speaking Practice: Express an Opinion',
            description: 'Develop your speaking skills for the opinion-based questions in TOEIC Speaking',
            content: 'Practice expressing opinions clearly and confidently in English. This lesson includes sample questions, response structures, and pronunciation tips to help you excel in the TOEIC Speaking section.',
            duration: 50,
            type: 'audio',
            order: 4,
            status: 'published',
            audioUrl: 'https://example.com/audio/speaking-practice.mp3',
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Speaking Response Templates', url: 'https://example.com/pdfs/speaking-templates.pdf', type: 'pdf' },
              { name: 'Pronunciation Guide', url: 'https://example.com/pdfs/pronunciation-guide.pdf', type: 'pdf' }
            ]
          }
        ]
      },
      // IELTS Course Lessons
      {
        courseIndex: 1,
        lessons: [
          {
            title: 'IELTS Writing Task 1: Describing Graphs and Charts',
            description: 'Learn to describe data visualizations effectively with proper structure and vocabulary',
            content: 'Master the art of describing graphs, charts, and diagrams in IELTS Writing Task 1. Learn essential vocabulary, sentence structures, and organizational patterns to achieve high scores.',
            duration: 90,
            type: 'video',
            order: 1,
            status: 'published',
            videoUrl: 'https://example.com/videos/ielts-task1-graphs.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Task 1 Vocabulary Bank', url: 'https://example.com/pdfs/task1-vocab.pdf', type: 'pdf' },
              { name: 'Sample Responses', url: 'https://example.com/pdfs/task1-samples.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'IELTS Writing Task 2: Argumentative Essays',
            description: 'Develop strong argumentative writing skills with clear structure and persuasive techniques',
            content: 'Learn to write compelling argumentative essays for IELTS Writing Task 2. This lesson covers essay structure, argument development, counter-arguments, and language for expressing opinions.',
            duration: 120,
            type: 'text',
            order: 2,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Essay Structure Template', url: 'https://example.com/pdfs/essay-structure.pdf', type: 'pdf' },
              { name: 'Argumentative Phrases', url: 'https://example.com/pdfs/argument-phrases.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'IELTS Writing Assessment and Feedback',
            description: 'Understand how your writing is assessed and receive personalized feedback',
            content: 'Learn about the IELTS writing assessment criteria and how to improve your scores. This lesson includes sample assessments and personalized feedback strategies.',
            duration: 60,
            type: 'video',
            order: 3,
            status: 'published',
            videoUrl: 'https://example.com/videos/ielts-assessment.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Assessment Criteria', url: 'https://example.com/pdfs/assessment-criteria.pdf', type: 'pdf' },
              { name: 'Self-Assessment Checklist', url: 'https://example.com/pdfs/self-assessment.pdf', type: 'pdf' }
            ]
          }
        ]
      },
      // Business English Course Lessons
      {
        courseIndex: 2,
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
            thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Meeting Vocabulary List', url: 'https://example.com/pdfs/meeting-vocab.pdf', type: 'pdf' },
              { name: 'Meeting Role-Play Scripts', url: 'https://example.com/pdfs/meeting-scripts.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'Professional Email Writing',
            description: 'Write clear, professional emails that get results in business communication',
            content: 'Master the art of writing professional business emails. Learn proper formatting, tone, and structure for various business situations including inquiries, complaints, and follow-ups.',
            duration: 65,
            type: 'text',
            order: 2,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Email Templates', url: 'https://example.com/pdfs/email-templates.pdf', type: 'pdf' },
              { name: 'Business Email Etiquette', url: 'https://example.com/pdfs/email-etiquette.pdf', type: 'pdf' }
            ]
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
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Presentation Structure Guide', url: 'https://example.com/pdfs/presentation-structure.pdf', type: 'pdf' },
              { name: 'Visual Aid Tips', url: 'https://example.com/pdfs/visual-aids.pdf', type: 'pdf' }
            ]
          }
        ]
      },
      // Pronunciation Course Lessons
      {
        courseIndex: 3,
        lessons: [
          {
            title: 'English Vowel Sounds Mastery',
            description: 'Learn to pronounce all English vowel sounds correctly with practice exercises',
            content: 'Master the 20+ vowel sounds in English through systematic practice. This lesson includes audio examples, mouth positioning guides, and exercises to perfect your vowel pronunciation.',
            duration: 40,
            type: 'video',
            order: 1,
            status: 'published',
            videoUrl: 'https://example.com/videos/vowel-sounds.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Vowel Sound Chart', url: 'https://example.com/pdfs/vowel-chart.pdf', type: 'pdf' },
              { name: 'Practice Audio Files', url: 'https://example.com/audio/vowel-practice.mp3', type: 'audio' }
            ]
          },
          {
            title: 'Word Stress and Sentence Intonation',
            description: 'Understand and practice correct word stress and natural sentence intonation',
            content: 'Learn the rules of word stress and sentence intonation in English. Practice with audio examples and exercises to develop natural-sounding speech patterns.',
            duration: 55,
            type: 'audio',
            order: 2,
            status: 'published',
            audioUrl: 'https://example.com/audio/stress-intonation.mp3',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Stress Rules Guide', url: 'https://example.com/pdfs/stress-rules.pdf', type: 'pdf' },
              { name: 'Intonation Patterns', url: 'https://example.com/pdfs/intonation-patterns.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'Connected Speech and Linking',
            description: 'Master natural speech patterns and sound linking for fluent English',
            content: 'Learn how sounds connect and change in natural, fluent English speech. Practice linking, assimilation, and elision to sound more natural and improve listening comprehension.',
            duration: 45,
            type: 'video',
            order: 3,
            status: 'published',
            videoUrl: 'https://example.com/videos/connected-speech.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Connected Speech Guide', url: 'https://example.com/pdfs/connected-speech.pdf', type: 'pdf' },
              { name: 'Practice Exercises', url: 'https://example.com/pdfs/linking-exercises.pdf', type: 'pdf' }
            ]
          }
        ]
      },
      // Grammar Course Lessons
      {
        courseIndex: 4,
        lessons: [
          {
            title: 'Advanced Verb Tenses and Aspects',
            description: 'Master complex verb forms including perfect, continuous, and perfect continuous tenses',
            content: 'Explore advanced verb tenses and aspects in English. Learn to use perfect, continuous, and perfect continuous forms accurately in various contexts and time frames.',
            duration: 90,
            type: 'text',
            order: 1,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Verb Tense Chart', url: 'https://example.com/pdfs/verb-tenses.pdf', type: 'pdf' },
              { name: 'Practice Exercises', url: 'https://example.com/pdfs/tense-exercises.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'Complex Sentence Structures',
            description: 'Learn to create sophisticated sentences with multiple clauses and advanced connectors',
            content: 'Master complex sentence structures including compound, complex, and compound-complex sentences. Learn to use advanced connectors and create varied, sophisticated writing.',
            duration: 75,
            type: 'video',
            order: 2,
            status: 'published',
            videoUrl: 'https://example.com/videos/complex-sentences.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Sentence Structure Guide', url: 'https://example.com/pdfs/sentence-structure.pdf', type: 'pdf' },
              { name: 'Connector Vocabulary', url: 'https://example.com/pdfs/connectors.pdf', type: 'pdf' }
            ]
          },
          {
            title: 'Academic Vocabulary and Collocations',
            description: 'Expand your academic vocabulary and learn natural word combinations',
            content: 'Build your academic vocabulary with focus on collocations, phrasal verbs, and academic expressions. Learn to use words naturally and appropriately in formal contexts.',
            duration: 60,
            type: 'text',
            order: 3,
            status: 'published',
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
            attachments: [
              { name: 'Academic Word List', url: 'https://example.com/pdfs/academic-words.pdf', type: 'pdf' },
              { name: 'Collocation Dictionary', url: 'https://example.com/pdfs/collocations.pdf', type: 'pdf' }
            ]
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

createCompleteData();
