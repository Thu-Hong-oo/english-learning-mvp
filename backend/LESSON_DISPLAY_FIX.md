# 🔧 Khắc phục vấn đề hiển thị bài học

## 🚨 Vấn đề
Bên giảng viên có thể thấy bài học nhưng bên học viên lại không thấy gì.

## 🔍 Nguyên nhân
1. **Không có bài học nào trong database** - Script tạo dữ liệu mẫu chỉ tạo khóa học, không tạo bài học
2. **Trạng thái bài học** - Bài học có thể ở trạng thái "draft" (bản nháp) thay vì "published" (đã xuất bản)
3. **API endpoint** - Học viên chỉ có thể thấy bài học có trạng thái "published"

## 🛠️ Cách khắc phục

### Bước 1: Kiểm tra database
```bash
cd backend
node check-lessons-simple.js
```

### Bước 2: Tạo bài học mẫu
```bash
cd backend
node create-lessons-simple.js
```

### Bước 3: Kiểm tra lại
```bash
cd backend
node check-lessons-simple.js
```

## 📚 Cấu trúc bài học

### Trạng thái bài học:
- **`published`** - Học viên có thể thấy và học
- **`draft`** - Chỉ giảng viên mới thấy được

### Loại bài học:
- **`video`** - Bài học video
- **`text`** - Bài học văn bản
- **`quiz`** - Bài kiểm tra
- **`audio`** - Bài học âm thanh

## 🔐 Phân quyền

### Giảng viên:
- Có thể thấy tất cả bài học (published + draft)
- Có thể thay đổi trạng thái bài học
- Có thể tạo, sửa, xóa bài học

### Học viên:
- Chỉ thấy bài học có trạng thái "published"
- Không thể thấy bài học "draft"
- Không thể thay đổi trạng thái bài học

## 🚀 API Endpoints

### Lấy bài học cho giảng viên:
```
GET /api/lessons/course/:courseId
Authorization: Bearer <token>
Role: teacher
```

### Lấy bài học cho học viên:
```
GET /api/lessons/course/:courseId/public
Role: student (không cần token)
```

## 📝 Debug

Đã thêm console.log vào `CoursePage.tsx` để debug:
- Kiểm tra role của user
- Kiểm tra response từ API
- Kiểm tra mảng bài học cuối cùng

## ✅ Kết quả mong đợi

Sau khi chạy script tạo bài học:
1. Giảng viên sẽ thấy 4 bài học (3 published + 1 draft)
2. Học viên sẽ thấy 3 bài học (chỉ những bài published)
3. Trang khóa học sẽ hiển thị danh sách bài học thay vì thông báo "Chưa có bài học"

## 🆘 Nếu vẫn không hoạt động

1. Kiểm tra console browser để xem log debug
2. Kiểm tra Network tab để xem API calls
3. Kiểm tra backend logs
4. Đảm bảo database có dữ liệu bài học
5. Đảm bảo bài học có trạng thái "published"
