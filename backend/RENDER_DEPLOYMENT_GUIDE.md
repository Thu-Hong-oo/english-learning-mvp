# 🚀 Hướng Dẫn Deploy Backend lên Render

## 📋 **Chuẩn Bị Trước Khi Deploy**

### **1. Đảm bảo code đã sẵn sàng**
```bash
# Kiểm tra build locally
cd backend
npm install
npm run build
npm start
```

### **2. Push code lên GitHub**
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## 🌐 **Bước 1: Tạo Render Account**

1. **Truy cập [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up với GitHub account**
4. **Verify email address**

## 🔧 **Bước 2: Deploy Backend Service**

### **2.1 Tạo Web Service**
1. **Click "New +" > "Web Service"**
2. **Connect GitHub repository**
3. **Chọn repository của bạn**

### **2.2 Cấu hình Service**
```yaml
# Basic Settings
Name: english-learning-backend
Environment: Node
Region: Frankfurt (EU) # Chọn gần bạn nhất
Branch: main
Root Directory: backend

# Build & Deploy
Build Command: npm install && npm run build
Start Command: npm start
```

### **2.3 Chọn Plan**
- **Plan**: Free
- **Instance Type**: Free
- **Auto-Deploy**: Yes

## 🗄️ **Bước 3: Setup Database (Miễn phí)**

### **3.1 Tạo PostgreSQL Database**
1. **Click "New +" > "PostgreSQL"**
2. **Name**: `english-learning-db`
3. **Plan**: Free
4. **Region**: Giống với backend service

### **3.2 Lấy Connection String**
1. **Vào database service**
2. **Connections tab**
3. **Copy "External Database URL"**

## ⚙️ **Bước 4: Cấu hình Environment Variables**

### **4.1 Vào Backend Service**
1. **Environment tab**
2. **Add Environment Variable**

### **4.2 Thêm các variables:**
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/english_learning
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-netlify-url.netlify.app
```

**Lưu ý:**
- `MONGO_URI`: Sử dụng MongoDB Atlas (miễn phí)
- `JWT_SECRET`: Tạo key mạnh, ít nhất 32 ký tự
- `FRONTEND_URL`: URL của frontend trên Netlify

## 🔐 **Bước 5: Setup MongoDB Atlas (Miễn phí)**

### **5.1 Tạo MongoDB Atlas Account**
1. **Truy cập [mongodb.com/atlas](https://mongodb.com/atlas)**
2. **Sign up free account**
3. **Tạo free cluster**

### **5.2 Cấu hình Cluster**
1. **Cloud Provider**: AWS
2. **Region**: Frankfurt (eu-central-1)
3. **Cluster Tier**: M0 (Free)
4. **Cluster Name**: `english-learning`

### **5.3 Tạo Database User**
1. **Database Access > Add New Database User**
2. **Username**: `english_user`
3. **Password**: Tạo password mạnh
4. **Database User Privileges**: Atlas admin

### **5.4 Cấu hình Network Access**
1. **Network Access > Add IP Address**
2. **IP Address**: `0.0.0.0/0` (Allow from anywhere)

### **5.5 Lấy Connection String**
1. **Clusters > Connect**
2. **Connect your application**
3. **Copy connection string**
4. **Thay `<password>` bằng password thực**

## 🔑 **Bước 6: Setup Google OAuth**

### **6.1 Google Cloud Console**
1. **Truy cập [console.cloud.google.com](https://console.cloud.google.com)**
2. **Tạo project mới**
3. **Enable Google+ API**

### **6.2 Tạo OAuth Credentials**
1. **APIs & Services > Credentials**
2. **Create Credentials > OAuth 2.0 Client IDs**
3. **Application type**: Web application
4. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-render-url.onrender.com/api/auth/google/callback`

### **6.3 Copy Credentials**
1. **Copy Client ID**
2. **Copy Client Secret**
3. **Thêm vào Render Environment Variables**

## 🚀 **Bước 7: Deploy và Test**

### **7.1 Deploy Service**
1. **Click "Create Web Service"**
2. **Đợi build và deploy hoàn tất**
3. **Copy URL service (ví dụ: `https://english-learning-backend.onrender.com`)**

### **7.2 Test API Endpoints**
```bash
# Health check
curl https://your-service-url.onrender.com/

# Test auth endpoint
curl https://your-service-url.onrender.com/api/auth/health
```

## 🔄 **Bước 8: Setup Auto-Deploy**

### **8.1 GitHub Integration**
1. **Render sẽ tự động deploy khi push code**
2. **Mỗi commit sẽ trigger build mới**
3. **Có thể rollback về version cũ**

### **8.2 Environment Variables**
- **Render sẽ tự động restart service khi thay đổi env vars**
- **Không cần manual restart**

## 📊 **Bước 9: Monitoring**

### **9.1 Logs**
1. **Logs tab trong Render dashboard**
2. **Real-time logs**
3. **Download logs nếu cần**

### **9.2 Metrics**
1. **Metrics tab**
2. **CPU, Memory usage**
3. **Response time**

## 🚨 **Troubleshooting**

### **Build Failed**
```bash
# Kiểm tra:
1. Node.js version (18+)
2. Build command đúng
3. Dependencies trong package.json
4. TypeScript compilation
```

### **Service không start**
```bash
# Kiểm tra:
1. Start command đúng
2. Port configuration
3. Environment variables
4. Database connection
```

### **Database Connection Failed**
```bash
# Kiểm tra:
1. MongoDB connection string
2. Network access (IP whitelist)
3. Database user credentials
4. Cluster status
```

## ✅ **Kiểm Tra Cuối**

### **Checklist:**
- [ ] Backend service đã deploy thành công
- [ ] Database connection thành công
- [ ] Environment variables đã set
- [ ] API endpoints hoạt động
- [ ] Google OAuth hoạt động
- [ ] Auto-deploy hoạt động

## 🔗 **URLs cần cập nhật**

### **Frontend Environment Variables:**
```env
VITE_API_URL=https://your-service-url.onrender.com
```

### **Google OAuth Redirect URIs:**
```
https://your-service-url.onrender.com/api/auth/google/callback
```

## 🎯 **Next Steps**

1. **Test tất cả API endpoints**
2. **Setup frontend với backend URL mới**
3. **Test Google OAuth flow**
4. **Monitor performance**
5. **Setup CI/CD với GitHub Actions**

---

**Happy Deploying! 🚀**
