# Hướng dẫn Deploy Frontend

## 1. Cấu hình Environment Variables

### Development (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

### Production (.env.production)
```env
VITE_API_URL=https://your-domain.com/api
```

## 2. Build Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build sẽ tạo thư mục dist/ chứa các file static
```

## 3. Deploy lên Server

### Option 1: Nginx + Static Files
```bash
# Copy thư mục dist/ lên server
scp -r dist/ user@your-server:/var/www/html/

# Cấu hình Nginx
sudo nano /etc/nginx/sites-available/your-site

# Nội dung cấu hình:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (nếu backend cùng domain)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Netlify
```bash
# Build và drag thư mục dist/ lên Netlify
# Hoặc connect với Git repository
```

## 4. Cấu hình CORS (Backend)

Đảm bảo backend cho phép domain của frontend:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://your-domain.com', // Production
  ],
  credentials: true
}));
```

## 5. Kiểm tra sau khi Deploy

1. **Frontend hoạt động**: Truy cập domain chính
2. **API calls**: Kiểm tra console browser có lỗi CORS không
3. **Authentication**: Test đăng nhập/đăng ký
4. **Email verification**: Test gửi và xác thực email

## 6. Troubleshooting

### Lỗi CORS
- Kiểm tra cấu hình CORS ở backend
- Đảm bảo domain frontend được cho phép

### API không hoạt động
- Kiểm tra `VITE_API_URL` trong environment
- Kiểm tra backend có chạy không
- Kiểm tra firewall/security groups

### Build lỗi
- Xóa `node_modules/` và `package-lock.json`
- Chạy `npm install` lại
- Kiểm tra TypeScript errors

