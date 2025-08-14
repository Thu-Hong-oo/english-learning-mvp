# Hướng dẫn cấu hình Email Service

## 1. Cấu hình Gmail (Khuyến nghị)

### Bước 1: Bật xác thực 2 yếu tố
1. Đăng nhập vào tài khoản Google
2. Vào "Bảo mật" > "Xác minh 2 bước"
3. Bật xác minh 2 bước

### Bước 2: Tạo mật khẩu ứng dụng
1. Vào "Bảo mật" > "Mật khẩu ứng dụng"
2. Chọn "Ứng dụng khác" > "Tên tùy chỉnh"
3. Đặt tên (ví dụ: "English Website")
4. Copy mật khẩu được tạo ra

### Bước 3: Cập nhật file .env
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000
```

## 2. Cấu hình SMTP khác

Nếu muốn dùng SMTP khác (như Outlook, Yahoo), cập nhật `emailService.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

## 3. Kiểm tra hoạt động

### Test API endpoints:
```bash
# Đăng ký user mới (sẽ tự động gửi email với OTP)
POST /api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}

# Gửi lại email xác nhận với OTP mới
POST /api/auth/send-verification
{
  "email": "test@example.com"
}

# Xác thực email bằng OTP
POST /api/auth/verify-email
{
  "otp": "123456"
}
```

## 4. Xử lý lỗi thường gặp

### Lỗi "Invalid login"
- Kiểm tra mật khẩu ứng dụng đã đúng chưa
- Đảm bảo đã bật xác thực 2 yếu tố

### Lỗi "Rate limit exceeded"
- Gmail giới hạn 500 email/ngày cho tài khoản miễn phí
- Cân nhắc dùng Gmail Business hoặc SMTP khác

### Email không được gửi
- Kiểm tra console log để xem lỗi
- Kiểm tra cấu hình .env
- Kiểm tra kết nối internet

## 5. Bảo mật

- Không commit file .env vào git
- Sử dụng mật khẩu ứng dụng, không dùng mật khẩu chính
- Giới hạn quyền truy cập API
- Sử dụng HTTPS trong production

## 6. Thông tin về OTP

### Đặc điểm OTP:
- **Độ dài**: 6 chữ số
- **Thời gian hết hạn**: 10 phút
- **Định dạng**: Chỉ số (0-9)
- **Bảo mật**: Mỗi OTP chỉ dùng được 1 lần

### Quy trình xác thực:
1. User đăng ký → Nhận email với OTP 6 số
2. User nhập OTP vào form xác thực
3. Backend kiểm tra OTP và thời gian hết hạn
4. Nếu đúng → Xác thực thành công, gửi email chào mừng
5. Nếu sai → Báo lỗi, yêu cầu nhập lại

### Ưu điểm của OTP:
- ✅ An toàn hơn link
- ✅ Không bị email client block
- ✅ Dễ nhập trên mobile
- ✅ Thời gian hết hạn ngắn (10 phút)
- ✅ Mỗi OTP chỉ dùng được 1 lần
