const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./src/models/User');

async function checkPassword(email, testPassword) {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('✅ User found:', {
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive
    });

    console.log('\n🔐 Password Analysis:');
    console.log('Stored password hash:', user.password);
    console.log('Password hash length:', user.password?.length);
    console.log('Test password:', testPassword);

    // Test 1: Direct bcrypt comparison
    console.log('\n🧪 Test 1: Direct bcrypt comparison');
    try {
      const directResult = await bcrypt.compare(testPassword, user.password);
      console.log('Direct bcrypt result:', directResult);
    } catch (error) {
      console.log('Direct bcrypt error:', error.message);
    }

    // Test 2: User model method
    console.log('\n🧪 Test 2: User model comparePassword method');
    try {
      const modelResult = await user.comparePassword(testPassword);
      console.log('Model method result:', modelResult);
    } catch (error) {
      console.log('Model method error:', error.message);
    }

    // Test 3: Check if password might be double-hashed
    console.log('\n🧪 Test 3: Check for double-hashing');
    try {
      // Try to hash the test password and compare
      const testHash = await bcrypt.hash(testPassword, 10);
      console.log('Test password hash:', testHash);
      
      // Compare test hash with stored hash
      const doubleHashResult = await bcrypt.compare(testHash, user.password);
      console.log('Double hash test result:', doubleHashResult);
      
      // Try comparing stored hash with test hash
      const reverseResult = await bcrypt.compare(user.password, testHash);
      console.log('Reverse comparison result:', reverseResult);
    } catch (error) {
      console.log('Double hash test error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error checking password:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Usage: node check-password.js <email> <testPassword>
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node check-password.js <email> <testPassword>');
  console.log('Example: node check-password.js thuhong12042002@gmail.com 123456');
  process.exit(1);
}

const [email, testPassword] = args;
console.log(`🔍 Checking password for ${email} with test password: ${testPassword}`);

checkPassword(email, testPassword);
