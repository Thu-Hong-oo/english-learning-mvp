# 🚀 Deployment Guide - English Learning Website

## 📋 Chuẩn Bị Trước Khi Deploy

### 1. **Database Setup**
- Tạo MongoDB Atlas cluster (miễn phí)
- Lấy connection string
- Tạo database `english_learning`

### 2. **Google OAuth Setup**
- Tạo Google Cloud Project
- Enable Google+ API
- Tạo OAuth 2.0 credentials
- Cập nhật redirect URIs cho production

### 3. **Environment Variables**
Cập nhật các file `.env` với thông tin production:

#### Backend (.env)
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/english_learning
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-url.com
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=English Learning Website
VITE_APP_VERSION=1.0.0
```

## 🌐 Deploy Frontend (Vercel - Khuyến nghị)

### Bước 1: Chuẩn bị
```bash
cd frontend
npm run build
```

### Bước 2: Deploy với Vercel
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login và deploy
vercel login
vercel

# Hoặc deploy production
vercel --prod
```

### Bước 3: Cấu hình Environment Variables
1. Vào Vercel Dashboard
2. Chọn project
3. Settings > Environment Variables
4. Thêm:
   - `VITE_API_URL`: URL của backend

### Bước 4: Cấu hình Custom Domain (Tùy chọn)
1. Settings > Domains
2. Thêm custom domain
3. Cấu hình DNS

## 🔧 Deploy Backend (Railway - Khuyến nghị)

### Bước 1: Chuẩn bị
```bash
cd backend
# Đảm bảo package.json có script start
```

### Bước 2: Deploy với Railway
1. Truy cập [railway.app](https://railway.app)
2. Login với GitHub
3. New Project > Deploy from GitHub repo
4. Chọn repository
5. Railway sẽ auto-detect Node.js app

### Bước 3: Cấu hình Environment Variables
1. Variables tab
2. Thêm tất cả environment variables từ `.env`

### Bước 4: Cấu hình Database
1. Add > Database > MongoDB
2. Railway sẽ tạo MongoDB instance
3. Copy connection string vào `MONGO_URI`

## 🗄️ Database Setup (MongoDB Atlas)

### Bước 1: Tạo Cluster
1. Truy cập [mongodb.com/atlas](https://mongodb.com/atlas)
2. Tạo free cluster
3. Chọn cloud provider và region

### Bước 2: Cấu hình Network Access
1. Network Access > Add IP Address
2. Allow Access from Anywhere (0.0.0.0/0)

### Bước 3: Tạo Database User
1. Database Access > Add New Database User
2. Username/Password authentication
3. Lưu credentials

### Bước 4: Lấy Connection String
1. Clusters > Connect
2. Connect your application
3. Copy connection string
4. Thay `<password>` bằng password thực

## 🔐 Google OAuth Setup

### Bước 1: Google Cloud Console
1. Truy cập [console.cloud.google.com](https://console.cloud.google.com)
2. Tạo project mới
3. Enable Google+ API

### Bước 2: Tạo OAuth Credentials
1. APIs & Services > Credentials
2. Create Credentials > OAuth 2.0 Client IDs
3. Application type: Web application
4. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-backend-url.com/api/auth/google/callback`

### Bước 3: Cấu hình
1. Copy Client ID và Client Secret
2. Thêm vào environment variables

## 📊 Monitoring & Analytics

### 1. **Vercel Analytics** (Frontend)
- Tự động có sẵn với Vercel
- Page views, performance metrics

### 2. **Railway Metrics** (Backend)
- CPU, Memory usage
- Request logs
- Error tracking

### 3. **MongoDB Atlas** (Database)
- Performance insights
- Query analytics
- Storage metrics

## 🔧 Troubleshooting

### Lỗi Thường Gặp

#### 1. **CORS Error**
```javascript
// Kiểm tra CORS configuration trong backend
app.use(cors({
  origin: ['https://your-frontend-url.com'],
  credentials: true
}));
```

#### 2. **Database Connection Error**
- Kiểm tra MongoDB connection string
- Đảm bảo IP whitelist
- Kiểm tra database user permissions

#### 3. **Environment Variables**
- Đảm bảo tất cả variables được set
- Kiểm tra naming convention
- Restart app sau khi thay đổi

#### 4. **Build Errors**
```bash
# Clean và rebuild
rm -rf node_modules
npm install
npm run build
```

## 🚀 Performance Optimization

### Frontend
1. **Code Splitting**
2. **Lazy Loading**
3. **Image Optimization**
4. **Caching Strategies**

### Backend
1. **Database Indexing**
2. **Query Optimization**
3. **Caching (Redis)**
4. **Rate Limiting**

## 📈 Scaling

### Khi Traffic Tăng
1. **Database**: MongoDB Atlas M10+ cluster
2. **Backend**: Railway Pro plan
3. **Frontend**: Vercel Pro plan
4. **CDN**: Cloudflare
5. **Caching**: Redis Cloud

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] JWT secret strong
- [ ] CORS properly configured
- [ ] Input validation
- [ ] Rate limiting
- [ ] Database access restricted
- [ ] Regular security updates

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong platform dashboard
2. Xem troubleshooting section
3. Tạo issue trên GitHub
4. Liên hệ support của platform

---

**Happy Deploying! 🎉**
