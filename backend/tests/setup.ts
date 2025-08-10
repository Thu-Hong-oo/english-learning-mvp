import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env if exists
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-only';

// Set test database URI
const testDbUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/english_website_test';
process.env.MONGODB_URI = testDbUri;

// Global test setup
beforeAll(async () => {
  // Connect to test database
  try {
    await mongoose.connect(testDbUri);
    console.log('Connected to test database:', testDbUri);
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

// Clean up database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
