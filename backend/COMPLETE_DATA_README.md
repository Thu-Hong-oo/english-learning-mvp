# 🎓 Tạo Dữ Liệu Mẫu Đầy Đủ cho Hệ Thống Học Tiếng Anh

## 📋 Mô tả

Script `create-complete-data.js` tạo ra một hệ thống dữ liệu mẫu hoàn chỉnh bao gồm:

- **3 Giảng viên chuyên nghiệp** với thông tin đầy đủ
- **5 Khóa học chất lượng cao** thuộc các chuyên ngành khác nhau
- **18 Bài học chi tiết** với video, audio, và tài liệu đính kèm

## 👨‍🏫 Giảng Viên

### 1. Sarah Johnson
- **Chuyên môn:** TOEIC, IELTS, Business English, Academic Writing
- **Kinh nghiệm:** 8+ năm
- **Học vị:** MA Applied Linguistics, University of Cambridge
- **Chứng chỉ:** CELTA, DELTA, TOEIC Trainer, IELTS Examiner

### 2. Michael Chen
- **Chuyên môn:** Pronunciation, Conversation, Speaking, Listening
- **Kinh nghiệm:** 6+ năm
- **Học vị:** BA English Literature, Oxford University
- **Chứng chỉ:** CELTA, Pronunciation Specialist, Conversation Coach

### 3. Emma Wilson
- **Chuyên môn:** Grammar, Vocabulary, Writing, Reading
- **Kinh nghiệm:** 7+ năm
- **Học vị:** MA English Language Teaching, University of London
- **Chứng chỉ:** CELTA, Grammar Specialist, Vocabulary Expert

## 📚 Khóa Học

### 1. TOEIC Complete Preparation Course
- **Cấp độ:** Intermediate
- **Thời lượng:** 40 giờ
- **Giá:** $89
- **Bài học:** 4 bài (Video, Text, Audio)
- **Nội dung:** Chuẩn bị toàn diện cho kỳ thi TOEIC

### 2. IELTS Academic Writing Masterclass
- **Cấp độ:** Advanced
- **Thời lượng:** 25 giờ
- **Giá:** $75
- **Bài học:** 3 bài (Video, Text)
- **Nội dung:** Luyện viết IELTS Academic chuyên sâu

### 3. Business English Conversation Skills
- **Cấp độ:** Intermediate
- **Thời lượng:** 30 giờ
- **Giá:** $65
- **Bài học:** 3 bài (Video, Text, Audio)
- **Nội dung:** Kỹ năng giao tiếp tiếng Anh thương mại

### 4. English Pronunciation Mastery
- **Cấp độ:** Beginner
- **Thời lượng:** 20 giờ
- **Giá:** $55
- **Bài học:** 3 bài (Video, Audio)
- **Nội dung:** Luyện phát âm tiếng Anh hoàn hảo

### 5. Advanced Grammar & Vocabulary Builder
- **Cấp độ:** Advanced
- **Thời lượng:** 35 giờ
- **Giá:** $70
- **Bài học:** 3 bài (Text, Video)
- **Nội dung:** Ngữ pháp và từ vựng nâng cao

## 📖 Bài Học

### Loại Bài Học:
- **Video:** Hướng dẫn trực quan, demo thực tế
- **Text:** Nội dung văn bản chi tiết, bài tập
- **Audio:** Luyện nghe, phát âm, giao tiếp

### Tài Liệu Đính Kèm:
- **PDF:** Hướng dẫn, bài tập, mẫu
- **Audio:** File luyện tập
- **Video:** Demo, hướng dẫn

## 🚀 Cách Sử Dụng

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình môi trường
```bash
cp env.example .env
# Chỉnh sửa MONGO_URI trong file .env
```

### 3. Chạy script tạo dữ liệu
```bash
node create-complete-data.js
```

### 4. Kiểm tra kết quả
Script sẽ hiển thị:
- Số lượng giảng viên, khóa học, bài học đã tạo
- Chi tiết từng khóa học
- Thông báo thành công

## 📊 Kết Quả Mong Đợi

Sau khi chạy script thành công:

```
🎉 Data creation completed successfully!
📊 Summary:
   👨‍🏫 Teachers created: 3
   📚 Courses created: 5
   📖 Lessons created: 18

📚 Course details:
   1. TOEIC Complete Preparation Course
      Level: intermediate
      Category: TOEIC
      Price: $89
      Lessons: 4
      Rating: 4.8/5
      Students: 156
      ---
   [các khóa học khác...]
```

## 🔐 Thông Tin Đăng Nhập

### Giảng Viên:
- **Sarah Johnson:** `sarah.johnson@englishacademy.com` / `password123`
- **Michael Chen:** `michael.chen@englishacademy.com` / `password123`
- **Emma Wilson:** `emma.wilson@englishacademy.com` / `password123`

## 🎯 Tính Năng Đặc Biệt

### 1. Hình Ảnh Chất Lượng Cao
- Sử dụng Unsplash images
- Kích thước tối ưu cho web
- Hình ảnh chuyên nghiệp, liên quan

### 2. Nội Dung Đa Dạng
- Video hướng dẫn
- Audio luyện tập
- Văn bản chi tiết
- Tài liệu PDF

### 3. Thông Tin Chuẩn
- Mô tả chi tiết
- Yêu cầu đầu vào
- Mục tiêu học tập
- Tags phân loại

### 4. Cấu Trúc Logic
- Bài học sắp xếp theo thứ tự
- Độ khó tăng dần
- Liên kết giữa các bài học

## 🆘 Xử Lý Lỗi

### Lỗi thường gặp:
1. **Kết nối MongoDB:** Kiểm tra MONGO_URI trong .env
2. **Quyền ghi:** Đảm bảo có quyền tạo collection
3. **Dữ liệu trùng:** Script sẽ ghi đè nếu có dữ liệu cũ

### Debug:
- Kiểm tra console logs
- Xem thông báo lỗi chi tiết
- Kiểm tra kết nối database

## 📝 Lưu Ý

- Script sẽ tạo dữ liệu mới, có thể ghi đè dữ liệu cũ
- Tất cả bài học đều ở trạng thái "published"
- Hình ảnh sử dụng Unsplash (có thể thay đổi URL)
- Tài liệu đính kèm là ví dụ (cần thay thế bằng file thực tế)

## 🎉 Kết Luận

Script này tạo ra một hệ thống dữ liệu mẫu hoàn chỉnh, chuyên nghiệp, sẵn sàng để demo và phát triển. Tất cả dữ liệu đều có chất lượng cao và phù hợp với mục đích giáo dục.
