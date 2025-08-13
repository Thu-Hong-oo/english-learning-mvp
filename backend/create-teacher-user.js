const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Kết nối database
mongoose.connect('mongodb://localhost:27017/english_website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  fullName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  totalStudyTime: { type: Number, default: 0 },
  preferredTopics: [String],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastStudyDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTeacherUser() {
  try {
    const email = 'it.hongnguyen523@gmail.com';
    const password = '123456';
    const fullName = 'Hong Nguyen';
    
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists!');
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      console.log('Full Name:', existingUser.fullName);
      
      // Cập nhật role thành teacher nếu chưa phải
      if (existingUser.role !== 'teacher') {
        await User.findByIdAndUpdate(existingUser._id, { role: 'teacher' });
        console.log('✅ Role đã được cập nhật thành teacher!');
      } else {
        console.log('✅ User đã có role teacher rồi!');
      }
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user teacher
    const teacherUser = new User({
      username: 'hongnguyen',
      email: email,
      password: hashedPassword,
      fullName: fullName,
      role: 'teacher',
      isEmailVerified: true,
      isActive: true,
      authProvider: 'local'
    });

    await teacherUser.save();
    
    console.log('✅ Teacher user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', teacherUser.role);
    console.log('Full Name:', teacherUser.fullName);
    console.log('\nBây giờ bạn có thể đăng nhập với:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('❌ Error creating teacher user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTeacherUser();
