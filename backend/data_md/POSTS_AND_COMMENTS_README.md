# Hệ Thống Posts và Comments - English Learning Website

## Tổng Quan
Hệ thống posts và comments đã được xây dựng hoàn chỉnh cho cả backend và frontend, cho phép người dùng tạo, đọc, chỉnh sửa bài viết và tương tác thông qua bình luận.

## Tính Năng

### Posts (Bài Viết)
- ✅ Tạo bài viết mới với rich content
- ✅ Chỉnh sửa bài viết
- ✅ Xóa bài viết
- ✅ Xuất bản/bản nháp
- ✅ Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)
- ✅ Hệ thống tags và categories
- ✅ Ảnh bìa và excerpt
- ✅ Tính toán thời gian đọc
- ✅ Thống kê lượt xem, like, comment

### Comments (Bình Luận)
- ✅ Thêm bình luận mới
- ✅ Phản hồi bình luận (nested comments)
- ✅ Chỉnh sửa bình luận
- ✅ Xóa bình luận (soft delete)
- ✅ Like/Dislike bình luận
- ✅ Báo cáo bình luận không phù hợp
- ✅ Hỗ trợ đa ngôn ngữ

## Cấu Trúc Backend

### Models
- **Post**: `backend/src/models/Post.ts`
- **Comment**: `backend/src/models/Comment.ts`

### Controllers
- **PostController**: `backend/src/controllers/postController.ts`
- **CommentController**: `backend/src/controllers/commentController.ts`

### Routes
- **PostRoutes**: `backend/src/routes/postRoutes.ts`
- **CommentRoutes**: `backend/src/routes/commentRoutes.ts`

### API Endpoints

#### Posts
```
GET    /api/posts                    - Lấy danh sách bài viết
GET    /api/posts/:id               - Lấy chi tiết bài viết theo ID
GET    /api/posts/slug/:slug       - Lấy bài viết theo slug
POST   /api/posts                   - Tạo bài viết mới
PUT    /api/posts/:id               - Cập nhật bài viết
DELETE /api/posts/:id               - Xóa bài viết
```

#### Comments
```
GET    /api/comments                 - Lấy danh sách bình luận
POST   /api/comments                 - Tạo bình luận mới
PUT    /api/comments/:id             - Cập nhật bình luận
DELETE /api/comments/:id             - Xóa bình luận
POST   /api/comments/:id/like        - Like/Unlike bình luận
POST   /api/comments/:id/dislike     - Dislike/Undislike bình luận
POST   /api/comments/:id/report      - Báo cáo bình luận
```

## Cấu Trúc Frontend

### Components
- **PostForm**: `frontend/src/components/PostForm.tsx` - Form tạo/chỉnh sửa bài viết
- **PostDetail**: `frontend/src/components/PostDetail.tsx` - Hiển thị chi tiết bài viết
- **CommentSection**: `frontend/src/components/CommentSection.tsx` - Quản lý bình luận

### Pages
- **BlogPage**: `frontend/src/pages/BlogPage.tsx` - Trang danh sách bài viết
- **PostForm**: Tích hợp vào routes để tạo/chỉnh sửa

### Routes
```
/blog                    - Danh sách bài viết
/blog/create            - Tạo bài viết mới (teacher/admin)
/blog/edit/:id          - Chỉnh sửa bài viết (teacher/admin)
/blog/:slug             - Xem chi tiết bài viết
```

## Cách Sử Dụng

### 1. Tạo Dữ Liệu Mẫu
```bash
cd backend
node create-sample-posts.js
```

### 2. Khởi Chạy Backend
```bash
cd backend
npm run dev
```

### 3. Khởi Chạy Frontend
```bash
cd frontend
npm run dev
```

### 4. Sử Dụng Hệ Thống

#### Cho Teachers/Admins:
1. Truy cập `/blog`
2. Nhấn nút "Tạo bài viết"
3. Điền thông tin bài viết
4. Chọn trạng thái (draft/published)
5. Lưu bài viết

#### Cho Tất Cả Người Dùng:
1. Xem danh sách bài viết tại `/blog`
2. Đọc chi tiết bài viết
3. Thêm bình luận
4. Like/Dislike bình luận
5. Phản hồi bình luận khác

## Tính Năng Nâng Cao

### SEO
- Tự động tạo slug từ tiêu đề
- Meta tags và descriptions
- URL thân thiện

### Bảo Mật
- Xác thực người dùng cho các thao tác nhạy cảm
- Phân quyền theo role (teacher/admin/student)
- Soft delete cho comments

### Performance
- Pagination cho posts và comments
- Indexing cho database queries
- Lazy loading cho comments

## Tùy Chỉnh

### Thêm Categories Mới
Chỉnh sửa trong `PostForm.tsx`:
```typescript
const categories = [
  'tieng-anh',
  'hoc-tap', 
  'kinh-nghiem',
  'tips',
  'khac',
  'category-moi' // Thêm category mới
];
```

### Thay Đổi Giao Diện
- Sửa CSS classes trong các components
- Thay đổi layout trong `PostDetail.tsx`
- Tùy chỉnh form fields trong `PostForm.tsx`

### Thêm Tính Năng Mới
- Like/Unlike posts
- Bookmark posts
- Share posts
- Related posts
- Search và filter nâng cao

## Troubleshooting

### Lỗi Thường Gặp

1. **"Post not found"**
   - Kiểm tra slug trong URL
   - Đảm bảo post có status "published"

2. **"Unauthorized"**
   - Kiểm tra đăng nhập
   - Kiểm tra role permissions

3. **Comments không hiển thị**
   - Kiểm tra contentType và contentId
   - Đảm bảo comment có isApproved = true

### Debug
- Kiểm tra console logs
- Kiểm tra Network tab trong DevTools
- Kiểm tra MongoDB collections

## Tương Lai

### Tính Năng Dự Kiến
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload và management
- [ ] Email notifications
- [ ] Social sharing
- [ ] Analytics và reporting
- [ ] Moderation tools
- [ ] Spam protection

### Tối Ưu Hóa
- [ ] Caching
- [ ] CDN cho images
- [ ] Search engine optimization
- [ ] Mobile optimization
- [ ] Performance monitoring

## Liên Hệ
Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue hoặc liên hệ team development.
