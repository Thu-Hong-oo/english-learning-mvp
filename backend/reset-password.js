
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

// Kết nối database
const mongoUrl = process.env.MONGO_URI ;
console.log('Connecting to MongoDB:', mongoUrl);

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  role: String,
  isEmailVerified: Boolean,
  isActive: Boolean,
  authProvider: String
});

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    const email = 'thuhong12042002@gmail.com';
    const newPassword = '123456';
    
    console.log('🔄 Resetting password for:', email);
    
    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      email: user.email,
      role: user.role,
      currentPasswordHash: user.password
    });
    
    // Hash password mới
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    console.log('🔐 New password hash:', newPasswordHash);
    
    // Cập nhật password
    user.password = newPasswordHash;
    await user.save();
    
    console.log('✅ Password updated successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 New password:', newPassword);
    
    // Test password mới
    const isPasswordValid = await bcrypt.compare(newPassword, newPasswordHash);
    console.log('🧪 Password test result:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

resetPassword();
