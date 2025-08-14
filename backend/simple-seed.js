const mongoose = require('mongoose');
require('dotenv').config();

// Simple function to add sample courses
async function addSampleCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create a simple course document
    const courseData = {
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
      createdBy: new mongoose.Types.ObjectId(),
      teacher: new mongoose.Types.ObjectId(),
      lessons: []
    };

    // Insert directly into the courses collection
    const result = await mongoose.connection.db.collection('courses').insertOne(courseData);
    console.log('Course added with ID:', result.insertedId);

    // Add a second course
    const courseData2 = {
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
      createdBy: new mongoose.Types.ObjectId(),
      teacher: new mongoose.Types.ObjectId(),
      lessons: []
    };

    const result2 = await mongoose.connection.db.collection('courses').insertOne(courseData2);
    console.log('Second course added with ID:', result2.insertedId);

    console.log('Sample courses added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addSampleCourses();
