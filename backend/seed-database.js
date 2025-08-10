const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    fullName: String,
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 },
    preferredTopics: [String],
    avatar: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    lastStudyDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    category: { type: String, enum: ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing', 'general'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: false },
    tags: [String],
    difficulty: { type: Number, min: 1, max: 5 },
    rating: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    lessonsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Lesson Schema
const lessonSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    order: { type: Number, default: 1 },
    type: { type: String, enum: ['video', 'text', 'quiz', 'interactive'] },
    materials: [String],
    vocabulary: [String],
    grammarPoints: [String],
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: { type: String, enum: ['multiple-choice', 'fill-blank', 'matching', 'true-false', 'essay'] },
    difficulty: { type: Number, min: 1, max: 5 },
    points: { type: Number, default: 10 },
    timeLimit: Number,
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    content: mongoose.Schema.Types.Mixed, // Questions and answers
    blanks: [String],
    matchingPairs: [[String]],
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Comment Schema
const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    contentType: { type: String, enum: ['course', 'lesson', 'exercise'] },
    contentId: { type: mongoose.Schema.Types.ObjectId },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    isReported: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    translation: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Vocabulary Schema
const vocabularySchema = new mongoose.Schema({
    word: String,
    phonetic: String,
    partOfSpeech: String,
    definitions: [String],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    category: String,
    tags: [String],
    audioUrl: String,
    imageUrl: String,
    synonyms: [String],
    antonyms: [String],
    relatedWords: [String],
    difficulty: { type: Number, min: 1, max: 5 },
    frequency: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 },
    aiGenerated: { type: Boolean, default: false },
    aiConfidence: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isApproved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// UserProgress Schema
const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'failed'], default: 'not-started' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    userAnswers: mongoose.Schema.Types.Mixed,
    notes: String,
    feedback: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);

// Sample data
const sampleUsers = [
    {
        username: 'teacher_john',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword123', // In real app, hash this
        fullName: 'John Smith',
        role: 'teacher',
        level: 'advanced',
        points: 1500,
        streak: 7,
        totalStudyTime: 1200,
        preferredTopics: ['grammar', 'business-english'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isActive: true
    },
    {
        username: 'teacher_sarah',
        email: 'sarah@example.com',
        password: '$2b$10$hashedpassword456',
        fullName: 'Sarah Johnson',
        role: 'teacher',
        level: 'advanced',
        points: 1800,
        streak: 12,
        totalStudyTime: 1500,
        preferredTopics: ['vocabulary', 'pronunciation'],
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isActive: true
    },
    {
        username: 'student_mike',
        email: 'mike@example.com',
        password: '$2b$10$hashedpassword789',
        fullName: 'Mike Wilson',
        role: 'student',
        level: 'intermediate',
        points: 450,
        streak: 3,
        totalStudyTime: 300,
        preferredTopics: ['listening', 'speaking'],
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isActive: true
    },
    {
        username: 'student_emma',
        email: 'emma@example.com',
        password: '$2b$10$hashedpassword101',
        fullName: 'Emma Davis',
        role: 'student',
        level: 'beginner',
        points: 120,
        streak: 5,
        totalStudyTime: 180,
        preferredTopics: ['grammar', 'vocabulary'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isActive: true
    }
];

const sampleCourses = [
    {
        title: 'English Grammar Fundamentals',
        description: 'Master the essential grammar rules and structures of English language. Perfect for beginners and intermediate learners.',
        level: 'beginner',
        category: 'grammar',
        tags: ['grammar', 'beginner', 'foundation', 'rules'],
        difficulty: 1,
        rating: 4.5,
        totalStudents: 1250,
        price: 0,
        lessonsCount: 12,
        isPublished: true
    },
    {
        title: 'Advanced Vocabulary Builder',
        description: 'Expand your English vocabulary with advanced words, idioms, and expressions used in professional and academic contexts.',
        level: 'advanced',
        category: 'vocabulary',
        tags: ['vocabulary', 'advanced', 'idioms', 'professional'],
        difficulty: 4,
        rating: 4.8,
        totalStudents: 890,
        price: 29.99,
        lessonsCount: 15,
        isPublished: true
    },
    {
        title: 'Business English Communication',
        description: 'Learn professional English for business meetings, presentations, emails, and negotiations.',
        level: 'intermediate',
        category: 'speaking',
        tags: ['business', 'speaking', 'professional', 'communication'],
        difficulty: 3,
        rating: 4.6,
        totalStudents: 756,
        price: 39.99,
        lessonsCount: 18,
        isPublished: true
    },
    {
        title: 'IELTS Preparation Course',
        description: 'Comprehensive preparation for IELTS exam covering all four skills: reading, writing, listening, and speaking.',
        level: 'advanced',
        category: 'general',
        tags: ['ielts', 'exam', 'preparation', 'academic'],
        difficulty: 5,
        rating: 4.9,
        totalStudents: 2100,
        price: 79.99,
        lessonsCount: 24,
        isPublished: true
    },
    {
        title: 'English Pronunciation Mastery',
        description: 'Improve your English pronunciation with detailed lessons on sounds, stress, intonation, and connected speech.',
        level: 'intermediate',
        category: 'speaking',
        tags: ['pronunciation', 'speaking', 'sounds', 'intonation'],
        difficulty: 3,
        rating: 4.4,
        totalStudents: 634,
        price: 24.99,
        lessonsCount: 14,
        isPublished: true
    },
    {
        title: 'Academic Writing Skills',
        description: 'Develop academic writing skills for essays, research papers, and academic presentations.',
        level: 'advanced',
        category: 'writing',
        tags: ['writing', 'academic', 'essays', 'research'],
        difficulty: 4,
        rating: 4.7,
        totalStudents: 445,
        price: 34.99,
        lessonsCount: 16,
        isPublished: true
    }
];

const sampleLessons = [
    {
        title: 'Introduction to Parts of Speech',
        description: 'Learn about nouns, verbs, adjectives, and other parts of speech in English.',
        content: 'In this lesson, we will explore the fundamental building blocks of English sentences...',
        order: 1,
        type: 'video',
        materials: ['video-lesson.mp4', 'parts-of-speech-chart.pdf'],
        vocabulary: ['noun', 'verb', 'adjective', 'adverb', 'pronoun'],
        grammarPoints: ['parts of speech', 'sentence structure'],
        isPublished: true
    },
    {
        title: 'Present Simple Tense',
        description: 'Master the present simple tense for describing habits, facts, and general truths.',
        content: 'The present simple tense is used to express habits, facts, and general truths...',
        order: 2,
        type: 'interactive',
        materials: ['present-simple-exercises.pdf', 'practice-quiz.html'],
        vocabulary: ['habit', 'fact', 'truth', 'routine'],
        grammarPoints: ['present simple', 'third person singular', 'verb conjugation'],
        isPublished: true
    },
    {
        title: 'Advanced Business Vocabulary',
        description: 'Learn essential business terms and expressions for professional communication.',
        content: 'Business English requires specific vocabulary for various professional situations...',
        order: 1,
        type: 'text',
        materials: ['business-vocab-list.pdf', 'case-studies.pdf'],
        vocabulary: ['stakeholder', 'ROI', 'synergy', 'paradigm', 'leverage'],
        grammarPoints: ['formal language', 'business expressions'],
        isPublished: true
    }
];

const sampleExercises = [
    {
        title: 'Parts of Speech Identification',
        description: 'Identify the part of speech for each word in the given sentences.',
        type: 'multiple-choice',
        difficulty: 1,
        points: 10,
        timeLimit: 300,
        content: {
            questions: [
                {
                    question: 'What part of speech is "quickly" in "She runs quickly"?',
                    options: ['noun', 'verb', 'adjective', 'adverb'],
                    correctAnswer: 3
                },
                {
                    question: 'Identify the verb in "The cat sleeps peacefully."',
                    options: ['cat', 'sleeps', 'peacefully', 'the'],
                    correctAnswer: 1
                }
            ]
        },
        isPublished: true
    },
    {
        title: 'Present Simple Practice',
        description: 'Fill in the blanks with the correct form of verbs in present simple tense.',
        type: 'fill-blank',
        difficulty: 2,
        points: 15,
        timeLimit: 600,
        content: {
            sentences: [
                'She _____ (work) in a hospital.',
                'They _____ (not/like) coffee.',
                'He _____ (study) English every day.'
            ],
            answers: ['works', "don't like", 'studies']
        },
        isPublished: true
    }
];

const sampleVocabulary = [
    {
        word: 'serendipity',
        phonetic: '/ˌserənˈdɪpəti/',
        partOfSpeech: 'noun',
        definitions: ['The occurrence and development of events by chance in a happy or beneficial way'],
        level: 'advanced',
        category: 'literary',
        tags: ['chance', 'fortune', 'discovery'],
        synonyms: ['fortuitousness', 'chance', 'luck'],
        antonyms: ['misfortune', 'bad luck'],
        difficulty: 4,
        frequency: 0.8
    },
    {
        word: 'ubiquitous',
        phonetic: '/juːˈbɪkwɪtəs/',
        partOfSpeech: 'adjective',
        definitions: ['Present, appearing, or found everywhere'],
        level: 'advanced',
        category: 'formal',
        tags: ['everywhere', 'omnipresent', 'widespread'],
        synonyms: ['omnipresent', 'pervasive', 'universal'],
        antonyms: ['rare', 'scarce', 'limited'],
        difficulty: 4,
        frequency: 0.6
    },
    {
        word: 'resilient',
        phonetic: '/rɪˈzɪliənt/',
        partOfSpeech: 'adjective',
        definitions: ['Able to withstand or recover quickly from difficult conditions'],
        level: 'intermediate',
        category: 'character',
        tags: ['strong', 'flexible', 'adaptable'],
        synonyms: ['flexible', 'adaptable', 'tough'],
        antonyms: ['fragile', 'weak', 'rigid'],
        difficulty: 3,
        frequency: 0.7
    }
];

const sampleComments = [
    {
        content: 'This course really helped me understand English grammar better!',
        contentType: 'course',
        likes: 12,
        dislikes: 0,
        isApproved: true
    },
    {
        content: 'Great explanation of the present simple tense. Very clear and easy to follow.',
        contentType: 'lesson',
        likes: 8,
        dislikes: 1,
        isApproved: true
    }
];

// Function to seed database
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lesson.deleteMany({});
        await Exercise.deleteMany({});
        await Comment.deleteMany({});
        await Vocabulary.deleteMany({});
        await UserProgress.deleteMany({});
        console.log('Cleared existing data');

        // Insert users
        const createdUsers = await User.insertMany(sampleUsers);
        console.log(`Created ${createdUsers.length} users`);

        // Get teacher IDs for courses
        const teachers = createdUsers.filter(user => user.role === 'teacher');
        const students = createdUsers.filter(user => user.role === 'student');

        // Update courses with teacher IDs
        const coursesWithTeachers = sampleCourses.map((course, index) => ({
            ...course,
            createdBy: teachers[index % teachers.length]._id
        }));

        // Insert courses
        const createdCourses = await Course.insertMany(coursesWithTeachers);
        console.log(`Created ${createdCourses.length} courses`);

        // Update lessons with course IDs
        const lessonsWithCourses = sampleLessons.map((lesson, index) => ({
            ...lesson,
            courseId: createdCourses[index % createdCourses.length]._id,
            createdBy: teachers[index % teachers.length]._id
        }));

        // Insert lessons
        const createdLessons = await Lesson.insertMany(lessonsWithCourses);
        console.log(`Created ${createdLessons.length} lessons`);

        // Update exercises with lesson IDs
        const exercisesWithLessons = sampleExercises.map((exercise, index) => ({
            ...exercise,
            lessonId: createdLessons[index % createdLessons.length]._id,
            courseId: createdCourses[index % createdCourses.length]._id,
            createdBy: teachers[index % teachers.length]._id
        }));

        // Insert exercises
        const createdExercises = await Exercise.insertMany(exercisesWithLessons);
        console.log(`Created ${createdExercises.length} exercises`);

        // Update lessons with exercise IDs
        for (let i = 0; i < createdLessons.length; i++) {
            const lesson = createdLessons[i];
            const exercises = createdExercises.filter(ex => ex.lessonId.equals(lesson._id));
            await Lesson.findByIdAndUpdate(lesson._id, {
                exercises: exercises.map(ex => ex._id)
            });
        }

        // Update courses with lesson counts
        for (let i = 0; i < createdCourses.length; i++) {
            const course = createdCourses[i];
            const lessonCount = createdLessons.filter(lesson => lesson.courseId.equals(course._id)).length;
            await Course.findByIdAndUpdate(course._id, { lessonsCount: lessonCount });
        }

        // Insert vocabulary
        const vocabularyWithCreator = sampleVocabulary.map(vocab => ({
            ...vocab,
            createdBy: teachers[0]._id
        }));
        const createdVocabulary = await Vocabulary.insertMany(vocabularyWithCreator);
        console.log(`Created ${createdVocabulary.length} vocabulary items`);

        // Insert comments
        const commentsWithUsers = sampleComments.map((comment, index) => ({
            ...comment,
            userId: students[index % students.length]._id,
            contentId: createdCourses[index % createdCourses.length]._id
        }));
        const createdComments = await Comment.insertMany(commentsWithUsers);
        console.log(`Created ${createdComments.length} comments`);

        // Create some user progress
        const progressData = students.map(student => ({
            userId: student._id,
            courseId: createdCourses[0]._id,
            lessonId: createdLessons[0]._id,
            status: 'in-progress',
            progress: Math.floor(Math.random() * 100),
            score: Math.floor(Math.random() * 100),
            maxScore: 100,
            timeSpent: Math.floor(Math.random() * 1800),
            attempts: Math.floor(Math.random() * 3) + 1
        }));

        const createdProgress = await UserProgress.insertMany(progressData);
        console.log(`Created ${createdProgress.length} progress records`);

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Users: ${createdUsers.length}`);
        console.log(`- Courses: ${createdCourses.length}`);
        console.log(`- Lessons: ${createdLessons.length}`);
        console.log(`- Exercises: ${createdExercises.length}`);
        console.log(`- Vocabulary: ${createdVocabulary.length}`);
        console.log(`- Comments: ${createdComments.length}`);
        console.log(`- Progress Records: ${createdProgress.length}`);

        // Display sample data
        console.log('\n📚 Sample Courses:');
        createdCourses.forEach(course => {
            console.log(`- ${course.title} (${course.level} ${course.category}) - $${course.price}`);
        });

        console.log('\n👥 Sample Users:');
        createdUsers.forEach(user => {
            console.log(`- ${user.fullName} (${user.role}) - Level: ${user.level}`);
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the seeding function
seedDatabase();
