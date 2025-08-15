# 🚀 CI/CD Pipeline - Backend

## 📋 **Tổng Quan**

Hệ thống CI/CD này sẽ tự động:
- ✅ Chạy tests và linting
- ✅ Build project
- ✅ Deploy lên platform đã chọn
- ✅ Thông báo kết quả

## 🔧 **Cài Đặt GitHub Secrets**

### **1. Render Secrets**
```bash
# Vào GitHub Repository > Settings > Secrets and variables > Actions
# Thêm các secrets sau:

RENDER_SERVICE_ID=your-render-service-id
RENDER_API_KEY=your-render-api-key
```

**Cách lấy Render API Key:**
1. Vào [render.com](https://render.com)
2. Account Settings > API Keys
3. Generate new API key

**Cách lấy Service ID:**
1. Vào service của bạn trên Render
2. Copy Service ID từ URL

### **2. Railway Secrets**
```bash
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE=your-railway-service-name
```

**Cách lấy Railway Token:**
1. Vào [railway.app](https://railway.app)
2. Account Settings > Tokens
3. Generate new token

### **3. Heroku Secrets (Nếu dùng)**
```bash
HEROKU_API_KEY=your-heroku-api-key
HEROKU_APP_NAME=your-heroku-app-name
HEROKU_EMAIL=your-heroku-email
```

**Cách lấy Heroku API Key:**
1. Vào [heroku.com](https://heroku.com)
2. Account Settings > API Key
3. Copy API Key

### **4. Docker Secrets (Nếu dùng Docker)**
```bash
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

## 🚀 **Cách Hoạt Động**

### **Workflow Trigger:**
- **Push to main**: Deploy production
- **Push to develop**: Deploy staging
- **Pull Request**: Chỉ chạy tests

### **Pipeline Steps:**
1. **Quality Check**
   - Install dependencies
   - Run linting
   - Run tests
   - Build project
   - Upload artifacts

2. **Deploy**
   - **main branch**: Deploy to Render (Production)
   - **develop branch**: Deploy to Railway (Staging)

3. **Notify**
   - Thông báo kết quả deployment

## 📁 **File Cấu Hình**

### **1. GitHub Actions Workflows:**
- `.github/workflows/ci-cd.yml` - Workflow chính
- `.github/workflows/deploy-render.yml` - Deploy Render
- `.github/workflows/deploy-railway.yml` - Deploy Railway
- `.github/workflows/deploy-heroku.yml` - Deploy Heroku
- `.github/workflows/docker-deploy.yml` - Docker build/deploy

### **2. Platform Configs:**
- `render.yaml` - Cấu hình Render
- `railway.json` - Cấu hình Railway
- `Procfile` - Cấu hình Heroku
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Local development

## 🔄 **Branch Strategy**

### **Main Branch (Production)**
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
# ... làm việc ...
git push origin feature/new-feature
# Tạo Pull Request
# Merge vào main → Auto deploy production
```

### **Develop Branch (Staging)**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# ... làm việc ...
git push origin feature/new-feature
# Tạo Pull Request
# Merge vào develop → Auto deploy staging
```

## 🧪 **Testing Strategy**

### **Pre-deploy Tests:**
- ✅ Unit tests
- ✅ Integration tests
- ✅ Linting
- ✅ Build verification

### **Post-deploy Tests:**
- ✅ Health check
- ✅ API endpoint tests
- ✅ Database connection
- ✅ Environment variables

## 📊 **Monitoring & Alerts**

### **Success Metrics:**
- Build time
- Test coverage
- Deployment success rate
- Response time

### **Failure Alerts:**
- Build failures
- Test failures
- Deployment failures
- Health check failures

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Build Failed**
```bash
# Kiểm tra logs trong GitHub Actions
# Kiểm tra Node.js version
# Kiểm tra dependencies
```

#### **2. Deploy Failed**
```bash
# Kiểm tra secrets
# Kiểm tra platform configuration
# Kiểm tra environment variables
```

#### **3. Tests Failed**
```bash
# Chạy tests locally
# Kiểm tra test configuration
# Kiểm tra test data
```

## 🔧 **Customization**

### **Thêm Platform mới:**
1. Tạo workflow file mới
2. Cấu hình secrets
3. Thêm vào main workflow

### **Thay đổi deployment logic:**
1. Sửa workflow files
2. Test locally với act
3. Push và monitor

## 📚 **Best Practices**

### **1. Security**
- ✅ Không commit secrets
- ✅ Sử dụng GitHub Secrets
- ✅ Rotate API keys regularly

### **2. Reliability**
- ✅ Rollback strategy
- ✅ Health checks
- ✅ Monitoring

### **3. Performance**
- ✅ Cache dependencies
- ✅ Parallel jobs
- ✅ Optimize build time

## 🎯 **Next Steps**

1. **Setup GitHub Secrets**
2. **Choose deployment platform**
3. **Test workflow locally**
4. **Monitor first deployment**
5. **Optimize pipeline**

---

**Happy CI/CD! 🚀**
