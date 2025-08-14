const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import User model
const User = require('./src/models/User');

async function resetPassword(email, newPassword) {
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
      oldPasswordHash: user.password
    });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = newPasswordHash;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log('New password hash:', user.password);

    // Test the new password
    const testResult = await bcrypt.compare(newPassword, user.password);
    console.log('Password test result:', testResult ? '✅ SUCCESS' : '❌ FAILED');

    if (testResult) {
      console.log('\n🎉 Password reset successful!');
      console.log('Email:', email);
      console.log('New password:', newPassword);
      console.log('You can now login with these credentials.');
    }

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Usage: node simple-reset-password.js <email> <newPassword>
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node simple-reset-password.js <email> <newPassword>');
  console.log('Example: node simple-reset-password.js thuhong12042002@gmail.com 123456');
  process.exit(1);
}

const [email, newPassword] = args;
console.log(`🔄 Resetting password for ${email} to: ${newPassword}`);

resetPassword(email, newPassword);
