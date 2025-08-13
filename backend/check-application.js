const mongoose = require('mongoose');

// Kết nối database
mongoose.connect('mongodb://localhost:27017/english_website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Định nghĩa InstructorApplication schema
const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  email: { type: String, trim: true, index: true },
  fullName: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  expertise: [{ type: String, trim: true }],
  experienceYears: { type: Number, min: 0, default: 0 },
  portfolioUrl: { type: String, default: '' },
  attachments: [{ name: { type: String }, url: { type: String } }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  reviewNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const InstructorApplication = mongoose.model('InstructorApplication', applicationSchema);

async function checkApplication() {
  try {
    const email = 'it.hongnguyen523@gmail.com';
    
    console.log('Checking application with email:', email);
    
    const application = await InstructorApplication.findOne({ email });
    
    if (application) {
      console.log('Application found:');
      console.log('- ID:', application._id);
      console.log('- Email:', application.email);
      console.log('- Full Name:', application.fullName);
      console.log('- Status:', application.status);
      console.log('- User ID:', application.userId);
      console.log('- Created At:', application.createdAt);
      console.log('- Reviewed At:', application.reviewedAt);
      console.log('- Review Notes:', application.reviewNotes);
    } else {
      console.log('Application not found!');
    }
    
    // Kiểm tra tất cả applications
    const allApplications = await InstructorApplication.find({});
    console.log('\nAll applications in database:');
    allApplications.forEach(app => {
      console.log(`- ${app.email} (${app.status}) - ${app.fullName}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkApplication();
