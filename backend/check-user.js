const mongoose = require('mongoose');

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
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastStudyDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkUser() {
  try {
    const email = 'it.hongnguyen523@gmail.com';
    
    console.log('Checking user with email:', email);
    
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('User found:');
      console.log('- ID:', user._id);
      console.log('- Email:', user.email);
      console.log('- Full Name:', user.fullName);
      console.log('- Role:', user.role);
      console.log('- Username:', user.username);
      console.log('- Is Active:', user.isActive);
      console.log('- Created At:', user.createdAt);
    } else {
      console.log('User not found!');
    }
    
    // Kiểm tra tất cả users
    const allUsers = await User.find({});
    console.log('\nAll users in database:');
    allUsers.forEach(u => {
      console.log(`- ${u.email} (${u.role}) - ${u.fullName}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser();
