

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

// Định nghĩa User schema trực tiếp trong script
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  fullName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  authProvider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
  avatar: String,
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

async function createAdminUser() {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const adminEmail = 'adminExample@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminEmail);
      console.log('Password: admin123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Tạo user admin
    const adminUser = new User({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Administrator',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
      authProvider: 'local'
    });

    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
