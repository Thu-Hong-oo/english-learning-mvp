const mongoose = require('mongoose');
require('dotenv').config();

async function addTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Add a test course directly to the database
    const testCourse = {
      title: 'Test Course - TOEIC Preparation',
      description: 'This is a test course for TOEIC preparation',
      level: 'intermediate',
      category: 'TOEIC',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      duration: 40,
      lessonsCount: 0,
      isPublished: true,
      tags: ['TOEIC', 'Test'],
      difficulty: 3,
      rating: 4.5,
      totalStudents: 10,
      price: 50,
      requirements: ['Basic English'],
      objectives: ['Learn TOEIC'],
      status: 'published',
      adminApproval: 'approved',
      adminApprovedAt: new Date(),
      createdBy: new mongoose.Types.ObjectId(),
      teacher: new mongoose.Types.ObjectId(),
      lessons: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into courses collection
    const result = await mongoose.connection.db.collection('courses').insertOne(testCourse);
    console.log('Test course added with ID:', result.insertedId);

    // Check if the course was added
    const courses = await mongoose.connection.db.collection('courses').find({}).toArray();
    console.log('Total courses in database:', courses.length);
    
    if (courses.length > 0) {
      console.log('Sample course:', {
        title: courses[0].title,
        status: courses[0].status,
        adminApproval: courses[0].adminApproval
      });
    }

    console.log('Test data added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestData();
