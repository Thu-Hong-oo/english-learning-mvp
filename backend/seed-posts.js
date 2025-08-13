const mongoose = require('mongoose');
const Post = require('./src/models/Post');
const User = require('./src/models/User');
require('dotenv').config();

const samplePosts = [
  {
    title: 'Cách học tiếng Anh hiệu quả cho người mới bắt đầu',
    slug: 'cach-hoc-tieng-anh-hieu-qua-cho-nguoi-moi-bat-dau',
    excerpt: 'Hướng dẫn chi tiết các phương pháp học tiếng Anh hiệu quả dành cho người mới bắt đầu.',
    content: `
      <h2>1. Xây dựng nền tảng vững chắc</h2>
      <p>Để học tiếng Anh hiệu quả, bạn cần xây dựng một nền tảng vững chắc từ những kiến thức cơ bản nhất.</p>
      
      <h2>2. Luyện tập hàng ngày</h2>
      <p>Việc luyện tập hàng ngày là chìa khóa để thành công trong việc học ngoại ngữ.</p>
      
      <h2>3. Sử dụng công nghệ</h2>
      <p>Leverage các ứng dụng và công cụ học tập hiện đại để tối ưu hóa quá trình học.</p>
    `,
    tags: ['học tiếng Anh', 'phương pháp', 'người mới bắt đầu'],
    category: 'Phương pháp học',
    language: 'vi',
    readingTime: 5,
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    views: 1250,
    likes: 89,
    commentsCnt: 12
  },
  {
    title: 'Top 10 ứng dụng học tiếng Anh tốt nhất 2024',
    slug: 'top-10-ung-dung-hoc-tieng-anh-tot-nhat-2024',
    excerpt: 'Danh sách các ứng dụng học tiếng Anh được đánh giá cao nhất trong năm 2024.',
    content: `
      <h2>1. Duolingo</h2>
      <p>Ứng dụng học ngôn ngữ phổ biến với phương pháp gamification.</p>
      
      <h2>2. Memrise</h2>
      <p>Chú trọng vào việc ghi nhớ từ vựng thông qua các kỹ thuật memory.</p>
      
      <h2>3. Babbel</h2>
      <p>Phương pháp học tập có cấu trúc rõ ràng và bài bản.</p>
    `,
    tags: ['ứng dụng', 'công nghệ', 'học tập'],
    category: 'Công nghệ',
    language: 'vi',
    readingTime: 8,
    status: 'published',
    publishedAt: new Date('2024-01-20'),
    views: 2100,
    likes: 156,
    commentsCnt: 23
  },
  {
    title: 'Làm thế nào để cải thiện kỹ năng nghe tiếng Anh',
    slug: 'lam-the-nao-de-cai-thien-ky-nang-nghe-tieng-anh',
    excerpt: 'Các bí quyết và phương pháp giúp bạn cải thiện kỹ năng nghe tiếng Anh một cách hiệu quả.',
    content: `
      <h2>1. Nghe thường xuyên</h2>
      <p>Dành ít nhất 30 phút mỗi ngày để nghe tiếng Anh.</p>
      
      <h2>2. Bắt đầu với nội dung đơn giản</h2>
      <p>Chọn những bài nghe phù hợp với trình độ hiện tại.</p>
      
      <h2>3. Luyện tập với podcast</h2>
      <p>Podcast là công cụ tuyệt vời để luyện kỹ năng nghe.</p>
    `,
    tags: ['kỹ năng nghe', 'luyện tập', 'podcast'],
    category: 'Kỹ năng',
    language: 'vi',
    readingTime: 6,
    status: 'published',
    publishedAt: new Date('2024-01-25'),
    views: 890,
    likes: 67,
    commentsCnt: 8
  }
];

async function seedPosts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get first admin user as author
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert sample posts
    const postsWithAuthor = samplePosts.map(post => ({
      ...post,
      authorId: adminUser._id
    }));

    await Post.insertMany(postsWithAuthor);
    console.log('Sample posts seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding posts:', error);
    mongoose.connection.close();
  }
}

seedPosts();
