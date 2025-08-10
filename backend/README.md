# English Learning Website - Backend API

## Mô tả
Backend API cho ứng dụng học tiếng Anh với các tính năng:
- Đăng ký/Đăng nhập người dùng
- Quản lý khóa học và bài học
- Hệ thống bài tập đa dạng
- Theo dõi tiến độ học tập
- Tương tác người dùng (bình luận, đánh giá)
- Quản lý từ vựng
- Tích hợp AI (tùy chọn)

## Công nghệ sử dụng
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT
- **Language**: TypeScript
- **Validation**: Joi (có thể thêm)
- **Testing**: Jest (có thể thêm)

## Cấu trúc Database

### 1. User Model
- Thông tin cơ bản: username, email, password, fullName
- Vai trò: student, teacher, admin
- Hồ sơ học tập: level, points, streak, totalStudyTime
- Chủ đề ưa thích: preferredTopics

### 2. Course Model
- Thông tin khóa học: title, description, level, category
- Metadata: duration, lessonsCount, difficulty, rating
- Hỗ trợ miễn phí và trả phí

### 3. Lesson Model
- Nội dung bài học: title, content, materials
- Hỗ trợ đa phương tiện: video, audio, documents, images
- Từ vựng và điểm ngữ pháp
- Liên kết với bài tập

### 4. Exercise Model
- Nhiều loại bài tập: multiple-choice, fill-blank, matching, etc.
- Hỗ trợ audio và hình ảnh
- Điểm số và thời gian giới hạn

### 5. UserProgress Model
- Theo dõi tiến độ: status, progress, score
- Thống kê thời gian học tập
- Lưu trữ câu trả lời của người dùng

### 6. Comment Model
- Bình luận đa dạng: course, lesson, exercise, discussion
- Hỗ trợ bình luận đa cấp (threaded)
- Tích hợp ngôn ngữ (tiếng Anh/Việt)

### 7. Vocabulary Model
- Quản lý từ vựng chi tiết: definitions, examples, translations
- Hỗ trợ audio và hình ảnh
- Tích hợp AI để tạo nội dung

## Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 2: Cấu hình môi trường
```bash
# Copy file môi trường
cp env.example .env

# Chỉnh sửa các biến môi trường trong .env
```

### Bước 3: Cấu hình MongoDB
- Cài đặt MongoDB local hoặc sử dụng MongoDB Atlas
- Cập nhật `MONGO_URL` trong file `.env`

### Bước 4: Build và chạy
```bash
# Build TypeScript
npm run build

# Chạy production
npm start

# Chạy development với nodemon
npm run dev

# Watch mode cho TypeScript
npm run watch
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký người dùng
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile
- `POST /api/auth/logout` - Đăng xuất

### Courses
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới (teacher/admin)
- `PUT /api/courses/:id` - Cập nhật khóa học
- `DELETE /api/courses/:id` - Xóa khóa học

### Lessons
- `GET /api/courses/:courseId/lessons` - Lấy danh sách bài học
- `GET /api/lessons/:id` - Lấy chi tiết bài học
- `POST /api/lessons` - Tạo bài học mới
- `PUT /api/lessons/:id` - Cập nhật bài học

### Exercises
- `GET /api/lessons/:lessonId/exercises` - Lấy danh sách bài tập
- `GET /api/exercises/:id` - Lấy chi tiết bài tập
- `POST /api/exercises/:id/submit` - Nộp bài tập
- `GET /api/exercises/:id/results` - Xem kết quả

### Progress
- `GET /api/progress` - Lấy tiến độ học tập
- `POST /api/progress/update` - Cập nhật tiến độ
- `GET /api/progress/analytics` - Thống kê học tập

### Comments
- `GET /api/comments/:contentType/:contentId` - Lấy bình luận
- `POST /api/comments` - Tạo bình luận mới
- `PUT /api/comments/:id` - Cập nhật bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

### Vocabulary
- `GET /api/vocabulary` - Lấy danh sách từ vựng
- `GET /api/vocabulary/:word` - Lấy chi tiết từ vựng
- `POST /api/vocabulary` - Tạo từ vựng mới
- `GET /api/vocabulary/ai/generate` - Tạo từ vựng bằng AI

## Middleware

### Authentication
- `authenticateToken` - Xác thực JWT token
- `authorizeRole` - Phân quyền theo vai trò

### Validation
- Request validation cho tất cả endpoints
- Sanitization input data

### Rate Limiting
- Giới hạn số request để tránh spam
- Cấu hình theo IP và user

## Tích hợp AI (Tùy chọn)

### OpenAI Integration
- Tạo bài tập tự động
- Sửa lỗi ngữ pháp
- Tạo nội dung từ vựng
- Chatbot hỗ trợ học tập

### Cấu hình AI
```bash
# Thêm vào .env
OPENAI_API_KEY=your-api-key
AI_ENABLED=true
```

## Upload Files

### Cloudinary Integration
- Hỗ trợ upload ảnh, audio, video
- Tự động optimize và resize
- CDN cho performance tốt

### Cấu hình Cloudinary
```bash
# Thêm vào .env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Testing

### Chạy tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- Đảm bảo tất cả biến môi trường được set
- Sử dụng strong JWT secret
- Cấu hình MongoDB connection string

### Monitoring
- Log rotation
- Error tracking
- Performance monitoring
- Health checks

## Contributing

### Code Style
- Sử dụng TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Pull request workflow

### Database Migrations
- Sử dụng Mongoose migrations
- Backup trước khi thay đổi schema
- Version control cho database changes

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Kiểm tra connection string và network
2. **JWT Error**: Kiểm tra JWT_SECRET và token format
3. **CORS Error**: Cấu hình CORS cho frontend domain
4. **File Upload Error**: Kiểm tra Cloudinary credentials

### Logs
```bash
# Development logs
npm run dev

# Production logs
npm start > app.log 2>&1
```

## License
MIT License
