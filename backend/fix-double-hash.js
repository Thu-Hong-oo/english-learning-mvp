const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./src/models/User');

async function fixDoubleHash(email, plainPassword) {
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
      currentPasswordHash: user.password
    });

    // Test if current password works
    console.log('\n🧪 Testing current password...');
    const currentPasswordWorks = await bcrypt.compare(plainPassword, user.password);
    console.log('Current password works:', currentPasswordWorks);

    if (currentPasswordWorks) {
      console.log('✅ Password is already working correctly!');
      return;
    }

    // Test if it's double-hashed
    console.log('\n🔍 Testing for double-hash...');
    const testHash = await bcrypt.hash(plainPassword, 10);
    const isDoubleHashed = await bcrypt.compare(testHash, user.password);
    console.log('Is double-hashed:', isDoubleHashed);

    if (isDoubleHashed) {
      console.log('🔄 Fixing double-hashed password...');
      
      // Hash the plain password once (correctly)
      const correctHash = await bcrypt.hash(plainPassword, 10);
      
      // Update user password
      user.password = correctHash;
      await user.save();
      
      console.log('✅ Password fixed successfully!');
      console.log('New password hash:', user.password);
      
      // Test the fixed password
      const testFixedPassword = await bcrypt.compare(plainPassword, user.password);
      console.log('Fixed password test result:', testFixedPassword);
      
    } else {
      console.log('❓ Password issue is not double-hashing. Manual investigation needed.');
    }

  } catch (error) {
    console.error('❌ Error fixing password:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Usage: node fix-double-hash.js <email> <plainPassword>
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node fix-double-hash.js <email> <plainPassword>');
  console.log('Example: node fix-double-hash.js thuhong12042002@gmail.com 123456');
  process.exit(1);
}

const [email, plainPassword] = args;
console.log(`🔧 Fixing password for ${email} with plain password: ${plainPassword}`);

fixDoubleHash(email, plainPassword);
