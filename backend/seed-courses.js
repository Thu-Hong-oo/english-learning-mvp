const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Course Schema (simplified for seeding)
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    category: {
        type: String,
        enum: ['grammar', 'vocabulary', 'listening', 'speaking', 'reading', 'writing', 'general']
    },
    thumbnail: String,
    duration: Number,
    lessonsCount: Number,
    isPublished: Boolean,
    createdBy: mongoose.Types.ObjectId,
    teacher: mongoose.Types.ObjectId,
    lessons: [mongoose.Types.ObjectId],
    tags: [String],
    difficulty: Number,
    rating: Number,
    totalStudents: Number,
    price: Number,
    requirements: [String],
    objectives: [String],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived']
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

// Sample course data
const sampleCourses = [
    {
        title: "English Grammar Fundamentals",
        description: "Master the basics of English grammar with comprehensive lessons covering parts of speech, sentence structure, and common grammar rules. Perfect for beginners who want to build a solid foundation.",
        level: "beginner",
        category: "grammar",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        duration: 480, // 8 hours
        lessonsCount: 12,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["grammar", "beginner", "fundamentals", "english"],
        difficulty: 1,
        rating: 4.5,
        totalStudents: 1250,
        price: 0,
        requirements: ["Basic English knowledge", "Willingness to learn"],
        objectives: ["Understand basic grammar rules", "Construct simple sentences", "Identify parts of speech"],
        status: "published"
    },
    {
        title: "Advanced Vocabulary Builder",
        description: "Expand your English vocabulary with advanced words, idioms, and expressions. Learn context usage and improve your communication skills significantly.",
        level: "advanced",
        category: "vocabulary",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        duration: 600, // 10 hours
        lessonsCount: 15,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["vocabulary", "advanced", "idioms", "communication"],
        difficulty: 4,
        rating: 4.8,
        totalStudents: 890,
        price: 29.99,
        requirements: ["Intermediate English level", "Basic vocabulary foundation"],
        objectives: ["Master 500+ advanced words", "Use idioms correctly", "Improve writing skills"],
        status: "published"
    },
    {
        title: "Business English Communication",
        description: "Learn professional English for the workplace. Cover business writing, presentations, meetings, and professional correspondence.",
        level: "intermediate",
        category: "speaking",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        duration: 360, // 6 hours
        lessonsCount: 10,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["business", "professional", "communication", "workplace"],
        difficulty: 3,
        rating: 4.6,
        totalStudents: 2100,
        price: 49.99,
        requirements: ["Intermediate English", "Business interest"],
        objectives: ["Write professional emails", "Conduct business meetings", "Give presentations"],
        status: "published"
    },
    {
        title: "IELTS Preparation Course",
        description: "Comprehensive preparation for the IELTS exam covering all four skills: Reading, Writing, Listening, and Speaking with practice tests and strategies.",
        level: "advanced",
        category: "general",
        thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=400&h=300&fit=crop",
        duration: 900, // 15 hours
        lessonsCount: 20,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["ielts", "exam", "preparation", "academic"],
        difficulty: 5,
        rating: 4.9,
        totalStudents: 3400,
        price: 79.99,
        requirements: ["Upper-intermediate English", "IELTS exam goal"],
        objectives: ["Achieve target IELTS score", "Master exam strategies", "Practice all skills"],
        status: "published"
    },
    {
        title: "English Pronunciation Mastery",
        description: "Perfect your English pronunciation with phonetics, stress patterns, and intonation. Includes audio exercises and practice materials.",
        level: "intermediate",
        category: "speaking",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        duration: 300, // 5 hours
        lessonsCount: 8,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["pronunciation", "phonetics", "speaking", "accent"],
        difficulty: 3,
        rating: 4.4,
        totalStudents: 1560,
        price: 19.99,
        requirements: ["Basic English speaking", "Access to audio equipment"],
        objectives: ["Improve pronunciation", "Understand phonetics", "Reduce accent"],
        status: "published"
    },
    {
        title: "Creative Writing in English",
        description: "Develop your creative writing skills in English. Learn storytelling, character development, and narrative techniques.",
        level: "intermediate",
        category: "writing",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
        duration: 420, // 7 hours
        lessonsCount: 14,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["writing", "creative", "storytelling", "narrative"],
        difficulty: 3,
        rating: 4.3,
        totalStudents: 980,
        price: 34.99,
        requirements: ["Intermediate English", "Creative interest"],
        objectives: ["Write creative stories", "Develop characters", "Master narrative structure"],
        status: "published"
    },
    {
        title: "English Listening Comprehension",
        description: "Improve your listening skills with various accents, speeds, and contexts. Includes comprehension exercises and note-taking techniques.",
        level: "beginner",
        category: "listening",
        thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=300&fit=crop",
        duration: 240, // 4 hours
        lessonsCount: 9,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["listening", "comprehension", "accents", "note-taking"],
        difficulty: 2,
        rating: 4.2,
        totalStudents: 2100,
        price: 0,
        requirements: ["Basic English", "Good hearing"],
        objectives: ["Improve listening skills", "Understand different accents", "Take effective notes"],
        status: "published"
    },
    {
        title: "Academic Reading Strategies",
        description: "Learn effective strategies for reading academic texts, research papers, and complex materials in English.",
        level: "advanced",
        category: "reading",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        duration: 540, // 9 hours
        lessonsCount: 16,
        isPublished: true,
        createdBy: new mongoose.Types.ObjectId(),
        teacher: new mongoose.Types.ObjectId(),
        lessons: [],
        tags: ["reading", "academic", "research", "strategies"],
        difficulty: 4,
        rating: 4.7,
        totalStudents: 1200,
        price: 59.99,
        requirements: ["Advanced English", "Academic background"],
        objectives: ["Read academic texts", "Apply reading strategies", "Analyze complex materials"],
        status: "published"
    }
];

// Function to seed courses
async function seedCourses() {
    try {
        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Insert sample courses
        const insertedCourses = await Course.insertMany(sampleCourses);
        console.log(`Successfully inserted ${insertedCourses.length} courses`);

        // Display created courses
        console.log('\nCreated courses:');
        insertedCourses.forEach(course => {
            console.log(`- ${course.title} (${course.level} ${course.category})`);
        });

        console.log('\nSeeding completed successfully!');
    } catch (error) {
        console.error('Error seeding courses:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding function
seedCourses();
