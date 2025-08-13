require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Kết nối database
const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/english_website';
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

async function testLogin() {
  try {
    const email = 'thuhong12042002@gmail.com';
    const password = '123456'; // Password bạn đang dùng để đăng nhập
    
    console.log('Testing login for:', email);
    
    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive
    });
    
    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password check:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    if (isPasswordValid) {
      console.log('🎉 Login should work!');
    } else {
      console.log('❌ Password mismatch. Try different password.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testLogin();
