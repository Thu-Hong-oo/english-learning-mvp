const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/english_learning')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,
  role: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
});

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  coverImage: String,
  tags: [String],
  category: String,
  status: String,
  language: String,
  readingTime: Number,
  publishedAt: Date,
  views: Number,
  likes: Number,
  commentsCnt: Number,
  createdAt: Date,
  updatedAt: Date
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  contentType: String,
  contentId: { type: mongoose.Schema.Types.ObjectId },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isApproved: Boolean,
  isReported: Boolean,
  reportReason: String,
  isEdited: Boolean,
  editedAt: Date,
  isDeleted: Boolean,
  deletedAt: Date,
  language: String,
  translation: String,
  createdAt: Date,
  updatedAt: Date
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Sample data
const samplePosts = [
  {
    title: "10 Bí Quyết Học Tiếng Anh Hiệu Quả Cho Người Mới Bắt Đầu",
    excerpt: "Khám phá những phương pháp học tiếng Anh đã được chứng minh hiệu quả, giúp bạn tiến bộ nhanh chóng trong quá trình học ngôn ngữ.",
    content: `
      <h2>1. Đặt Mục Tiêu Rõ Ràng</h2>
      <p>Trước khi bắt đầu học tiếng Anh, bạn cần xác định rõ mục tiêu của mình. Bạn muốn học để giao tiếp hàng ngày, để đi du lịch, hay để thăng tiến trong công việc?</p>
      
      <h2>2. Học Từ Vựng Theo Chủ Đề</h2>
      <p>Thay vì học từ vựng một cách ngẫu nhiên, hãy nhóm chúng theo chủ đề. Ví dụ: chủ đề gia đình, công việc, du lịch, ẩm thực...</p>
      
      <h2>3. Luyện Nghe Mỗi Ngày</h2>
      <p>Nghe tiếng Anh thường xuyên giúp bạn quen với ngữ điệu và cách phát âm. Bạn có thể nghe podcast, xem phim, hoặc nghe nhạc tiếng Anh.</p>
      
      <h2>4. Nói Tiếng Anh Mỗi Ngày</h2>
      <p>Đừng sợ mắc lỗi khi nói tiếng Anh. Hãy thực hành mỗi ngày, dù chỉ là nói chuyện với chính mình trong gương.</p>
      
      <h2>5. Sử Dụng Công Nghệ</h2>
      <p>Ứng dụng học tiếng Anh, video YouTube, và các nền tảng học trực tuyến có thể giúp bạn học mọi lúc, mọi nơi.</p>
      
      <h2>6. Học Ngữ Pháp Một Cách Tự Nhiên</h2>
      <p>Thay vì học thuộc lòng các quy tắc ngữ pháp, hãy học thông qua việc đọc và nghe tiếng Anh thực tế.</p>
      
      <h2>7. Tạo Môi Trường Tiếng Anh</h2>
      <p>Thay đổi ngôn ngữ điện thoại, máy tính sang tiếng Anh. Điều này giúp bạn tiếp xúc với tiếng Anh mỗi ngày.</p>
      
      <h2>8. Học Cùng Bạn Bè</h2>
      <p>Học cùng người khác giúp bạn có động lực và có cơ hội thực hành giao tiếp.</p>
      
      <h2>9. Kiên Trì Và Nhất Quán</h2>
      <p>Học tiếng Anh là một quá trình dài hạn. Hãy kiên trì và học đều đặn mỗi ngày, dù chỉ 15-30 phút.</p>
      
      <h2>10. Đo Lường Tiến Độ</h2>
      <p>Ghi lại những gì bạn đã học được và đánh giá tiến độ định kỳ. Điều này giúp bạn thấy được sự tiến bộ của mình.</p>
      
      <p><strong>Kết luận:</strong> Học tiếng Anh không khó, chỉ cần bạn có phương pháp đúng và sự kiên trì. Hãy áp dụng những bí quyết trên và bạn sẽ thấy sự tiến bộ rõ rệt!</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    tags: ["học tiếng Anh", "phương pháp", "bí quyết", "người mới bắt đầu"],
    category: "tieng-anh",
    status: "published",
    language: "vi",
    readingTime: 8,
    views: 1250,
    likes: 89,
    commentsCnt: 23
  },
  {
    title: "Cách Phát Âm Tiếng Anh Chuẩn Như Người Bản Xứ",
    excerpt: "Hướng dẫn chi tiết cách phát âm tiếng Anh chuẩn, bao gồm các âm khó và quy tắc nối âm quan trọng.",
    content: `
      <h2>Những Âm Khó Trong Tiếng Anh</h2>
      <p>Tiếng Anh có một số âm mà tiếng Việt không có, điều này khiến người Việt gặp khó khăn khi phát âm.</p>
      
      <h3>1. Âm /θ/ và /ð/ (th)</h3>
      <p>Đây là những âm răng-lưỡi. Để phát âm đúng, hãy đặt đầu lưỡi giữa răng trên và dưới, sau đó thổi hơi ra.</p>
      
      <h3>2. Âm /r/</h3>
      <p>Âm /r/ trong tiếng Anh khác với âm /r/ trong tiếng Việt. Lưỡi không chạm vào vòm miệng.</p>
      
      <h3>3. Âm /l/</h3>
      <p>Âm /l/ có hai cách phát âm: /l/ sáng (light) và /l/ tối (dark).</p>
      
      <h2>Quy Tắc Nối Âm</h2>
      <p>Nối âm là hiện tượng khi hai từ đứng cạnh nhau, âm cuối của từ đầu nối với âm đầu của từ sau.</p>
      
      <h3>Ví dụ:</h3>
      <ul>
        <li>an apple → anapple</li>
        <li>look at → lookat</li>
        <li>get up → getup</li>
      </ul>
      
      <h2>Luyện Tập Phát Âm</h2>
      <p>Để cải thiện phát âm, bạn cần:</p>
      <ol>
        <li>Nghe nhiều tiếng Anh chuẩn</li>
        <li>Ghi âm giọng nói của mình</li>
        <li>So sánh với giọng chuẩn</li>
        <li>Luyện tập thường xuyên</li>
      </ol>
    `,
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["phát âm", "ngữ âm", "nối âm", "luyện tập"],
    category: "tieng-anh",
    status: "published",
    language: "vi",
    readingTime: 6,
    views: 890,
    likes: 67,
    commentsCnt: 18
  },
  {
    title: "Top 5 Ứng Dụng Học Tiếng Anh Tốt Nhất 2024",
    excerpt: "Đánh giá chi tiết các ứng dụng học tiếng Anh phổ biến nhất, giúp bạn chọn được công cụ học tập phù hợp.",
    content: `
      <h2>1. Duolingo</h2>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Miễn phí hoàn toàn</li>
        <li>Giao diện thân thiện, dễ sử dụng</li>
        <li>Phương pháp học game hóa</li>
        <li>Phù hợp cho người mới bắt đầu</li>
      </ul>
      <p><strong>Nhược điểm:</strong></p>
      <ul>
        <li>Nội dung hạn chế cho người học nâng cao</li>
        <li>Ít tập trung vào giao tiếp thực tế</li>
      </ul>
      
      <h2>2. Memrise</h2>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Phương pháp ghi nhớ khoa học</li>
        <li>Video người bản xứ thực tế</li>
        <li>Nhiều khóa học đa dạng</li>
        <li>Hệ thống ôn tập thông minh</li>
      </ul>
      
      <h2>3. Babbel</h2>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Nội dung chất lượng cao</li>
        <li>Phương pháp học thực tế</li>
        <li>Phát âm chuẩn xác</li>
        <li>Phù hợp cho mục đích du lịch, công việc</li>
      </ul>
      
      <h2>4. Rosetta Stone</h2>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Phương pháp học tự nhiên</li>
        <li>Không dịch sang tiếng mẹ đẻ</li>
        <li>Phát âm chuẩn xác</li>
        <li>Nhiều ngôn ngữ khác nhau</li>
      </ul>
      
      <h2>5. Busuu</h2>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Giao tiếp với người bản xứ</li>
        <li>Chứng chỉ được công nhận</li>
        <li>Nội dung theo chuẩn CEFR</li>
        <li>Phản hồi từ cộng đồng</li>
      </ul>
      
      <h2>Kết Luận</h2>
      <p>Mỗi ứng dụng có ưu điểm riêng. Duolingo phù hợp cho người mới bắt đầu, Memrise tốt cho việc ghi nhớ từ vựng, Babbel và Rosetta Stone phù hợp cho việc học nghiêm túc, còn Busuu tốt cho việc giao tiếp thực tế.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["ứng dụng", "công nghệ", "học trực tuyến", "đánh giá"],
    category: "hoc-tap",
    status: "published",
    language: "vi",
    readingTime: 7,
    views: 2100,
    likes: 145,
    commentsCnt: 31
  },
  {
    title: "Làm Thế Nào Để Vượt Qua Nỗi Sợ Nói Tiếng Anh",
    excerpt: "Chia sẻ kinh nghiệm và phương pháp giúp bạn tự tin hơn khi giao tiếp bằng tiếng Anh.",
    content: `
      <h2>Nguyên Nhân Của Nỗi Sợ</h2>
      <p>Nỗi sợ nói tiếng Anh thường xuất phát từ:</p>
      <ul>
        <li>Sợ mắc lỗi và bị cười nhạo</li>
        <li>Thiếu tự tin về khả năng ngôn ngữ</li>
        <li>Áp lực từ môi trường xung quanh</li>
        <li>Kinh nghiệm xấu trong quá khứ</li>
      </ul>
      
      <h2>Phương Pháp Khắc Phục</h2>
      
      <h3>1. Thay Đổi Tư Duy</h3>
      <p>Hãy nhớ rằng mắc lỗi là một phần của quá trình học. Ngay cả người bản xứ cũng mắc lỗi. Mỗi lỗi là một cơ hội để học hỏi.</p>
      
      <h3>2. Bắt Đầu Từ Những Gì Đơn Giản</h3>
      <p>Đừng cố gắng nói những câu phức tạp ngay từ đầu. Hãy bắt đầu với những câu đơn giản, sau đó dần dần nâng cao độ khó.</p>
      
      <h3>3. Luyện Tập Trước Gương</h3>
      <p>Nói tiếng Anh trước gương giúp bạn quen với việc phát âm và biểu cảm khi nói.</p>
      
      <h3>4. Tìm Bạn Học</h3>
      <p>Học cùng người khác giúp bạn cảm thấy thoải mái hơn và có cơ hội thực hành thường xuyên.</p>
      
      <h3>5. Sử Dụng Công Nghệ</h3>
      <p>Các ứng dụng như HelloTalk, Tandem cho phép bạn kết nối với người bản xứ để luyện tập.</p>
      
      <h2>Lời Khuyên Thực Tế</h2>
      <p>Hãy nhớ rằng mục tiêu của giao tiếp là hiểu nhau, không phải nói hoàn hảo. Ngay cả khi bạn nói sai ngữ pháp, người khác vẫn có thể hiểu ý bạn.</p>
      
      <p><strong>Kết luận:</strong> Vượt qua nỗi sợ nói tiếng Anh cần thời gian và sự kiên trì. Hãy bắt đầu từ những bước nhỏ và dần dần xây dựng sự tự tin của mình.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    tags: ["tâm lý", "giao tiếp", "tự tin", "kinh nghiệm"],
    category: "kinh-nghiem",
    status: "published",
    language: "vi",
    readingTime: 6,
    views: 1560,
    likes: 112,
    commentsCnt: 28
  },
  {
    title: "5 Tips Học Từ Vựng Tiếng Anh Hiệu Quả",
    excerpt: "Những mẹo nhỏ nhưng hiệu quả giúp bạn ghi nhớ từ vựng tiếng Anh lâu hơn và sử dụng chính xác hơn.",
    content: `
      <h2>1. Học Từ Vựng Theo Ngữ Cảnh</h2>
      <p>Thay vì học từ vựng riêng lẻ, hãy học chúng trong câu hoặc đoạn văn. Điều này giúp bạn hiểu cách sử dụng từ và ghi nhớ lâu hơn.</p>
      
      <h3>Ví dụ:</h3>
      <p>Thay vì chỉ học từ "run", hãy học:</p>
      <ul>
        <li>I run every morning. (Tôi chạy mỗi sáng)</li>
        <li>The company is running smoothly. (Công ty đang hoạt động trơn tru)</li>
        <li>Time is running out. (Thời gian sắp hết)</li>
      </ul>
      
      <h2>2. Sử Dụng Flashcards</h2>
      <p>Flashcards là công cụ hiệu quả để ôn tập từ vựng. Bạn có thể sử dụng ứng dụng như Anki hoặc tạo flashcards truyền thống.</p>
      
      <h3>Cách sử dụng:</h3>
      <ul>
        <li>Mặt trước: từ tiếng Anh</li>
        <li>Mặt sau: nghĩa tiếng Việt + ví dụ</li>
        <li>Ôn tập theo hệ thống spaced repetition</li>
      </ul>
      
      <h2>3. Liên Kết Với Hình Ảnh</h2>
      <p>Bộ não con người ghi nhớ hình ảnh tốt hơn từ ngữ. Hãy liên kết từ vựng với hình ảnh hoặc hành động cụ thể.</p>
      
      <h2>4. Tạo Các Cụm Từ</h2>
      <p>Học các cụm từ (collocations) thay vì từ đơn lẻ. Ví dụ: "make a decision" thay vì chỉ "decision".</p>
      
      <h3>Một số cụm từ phổ biến:</h3>
      <ul>
        <li>make a mistake (mắc lỗi)</li>
        <li>take a break (nghỉ ngơi)</li>
        <li>have a conversation (có cuộc trò chuyện)</li>
      </ul>
      
      <h2>5. Sử Dụng Từ Vựng Ngay Lập Tức</h2>
      <p>Sau khi học từ mới, hãy cố gắng sử dụng nó trong câu hoặc đoạn văn ngay lập tức. Điều này giúp củng cố trí nhớ.</p>
      
      <h2>Kết Luận</h2>
      <p>Học từ vựng hiệu quả không chỉ là ghi nhớ, mà còn là hiểu cách sử dụng và thực hành thường xuyên. Hãy áp dụng những tips trên và bạn sẽ thấy sự tiến bộ rõ rệt!</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    tags: ["từ vựng", "phương pháp", "ghi nhớ", "tips"],
    category: "tips",
    status: "published",
    language: "vi",
    readingTime: 5,
    views: 980,
    likes: 78,
    commentsCnt: 19
  }
];

const sampleComments = [
  {
    content: "Bài viết rất hữu ích! Tôi đã áp dụng phương pháp học từ vựng theo ngữ cảnh và thấy hiệu quả rõ rệt.",
    contentType: "post",
    language: "vi"
  },
  {
    content: "Cảm ơn tác giả đã chia sẻ những kinh nghiệm quý báu. Tôi sẽ thử áp dụng những tips này.",
    contentType: "post",
    language: "vi"
  },
  {
    content: "Tôi cũng gặp vấn đề tương tự khi học tiếng Anh. Bài viết này đã giúp tôi hiểu rõ hơn về cách khắc phục.",
    contentType: "post",
    language: "vi"
  },
  {
    content: "Rất thích cách trình bày rõ ràng và dễ hiểu. Mong tác giả sẽ chia sẻ thêm nhiều bài viết tương tự.",
    contentType: "post",
    language: "vi"
  },
  {
    content: "Tôi đã thử áp dụng và thấy tiến bộ rõ rệt. Cảm ơn vì đã chia sẻ những phương pháp hiệu quả này!",
    contentType: "post",
    language: "vi"
  }
];

async function createSampleData() {
  try {
    console.log('🚀 Bắt đầu tạo dữ liệu mẫu...');

    // Tìm user teacher để làm author
    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log('❌ Không tìm thấy user teacher. Hãy tạo user teacher trước.');
      return;
    }

    console.log(`✅ Tìm thấy teacher: ${teacher.fullName || teacher.username}`);

    // Tạo posts
    console.log('📝 Đang tạo posts...');
    const createdPosts = [];
    
    for (const postData of samplePosts) {
      const post = await Post.create({
        ...postData,
        authorId: teacher._id,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      createdPosts.push(post);
      console.log(`✅ Đã tạo post: ${post.title}`);
    }

    // Tạo comments cho mỗi post
    console.log('💬 Đang tạo comments...');
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      const commentData = sampleComments[i % sampleComments.length];
      
      const comment = await Comment.create({
        ...commentData,
        user: teacher._id,
        contentId: post._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Cập nhật comment count cho post
      await Post.findByIdAndUpdate(post._id, { $inc: { commentsCnt: 1 } });
      
      console.log(`✅ Đã tạo comment cho post: ${post.title}`);
    }

    console.log('🎉 Hoàn thành tạo dữ liệu mẫu!');
    console.log(`📊 Đã tạo ${createdPosts.length} posts và ${createdPosts.length} comments`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
}

// Chạy script
createSampleData();
