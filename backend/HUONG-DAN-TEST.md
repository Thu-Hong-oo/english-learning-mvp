# 🚀 HƯỚNG DẪN TEST ĐƠN GIẢN

## 📋 **Các file test đã tạo:**

1. **`simple-auth.test.js`** - Test toàn bộ API auth
2. **`simple-setup.js`** - Setup database test  
3. **`simple-user-model.test.js`** - Test User model
4. **`simple-controller.test.js`** - Test controller
5. **`package-simple.json`** - Package để test

## 🎯 **Cách sử dụng:**

### **Bước 1: Cài đặt dependencies**
```bash
cd backend
npm install jest supertest
```

### **Bước 2: Chạy test**
```bash
# Chạy tất cả test
npm test

# Chạy test đơn giản
npm run test:simple

# Chạy test và theo dõi thay đổi
npm run test:watch
```

## 📝 **Cách viết test mới:**

### **1. Test đơn giản:**
```javascript
describe('Tên nhóm test', () => {
  it('Mô tả test case', async () => {
    // Chuẩn bị dữ liệu
    const data = { name: 'test' };
    
    // Thực hiện hành động
    const result = await someFunction(data);
    
    // Kiểm tra kết quả
    expect(result.success).toBe(true);
  });
});
```

### **2. Test API endpoint:**
```javascript
it('Test API endpoint', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({ data: 'test' });
  
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
});
```

### **3. Test database:**
```javascript
it('Test lưu vào database', async () => {
  const user = new User({ name: 'test' });
  const savedUser = await user.save();
  
  expect(savedUser._id).toBeDefined();
  expect(savedUser.name).toBe('test');
});
```

## 🔧 **Các hàm test cơ bản:**

### **Kiểm tra giá trị:**
```javascript
expect(value).toBe(expected);           // So sánh chính xác
expect(value).toEqual(expected);        // So sánh object/array
expect(value).toBeDefined();            // Kiểm tra có tồn tại
expect(value).toBeNull();               // Kiểm tra null
expect(value).toBeUndefined();          // Kiểm tra undefined
expect(value).toBeTruthy();             // Kiểm tra truthy
expect(value).toBeFalsy();              // Kiểm tra falsy
```

### **Kiểm tra số:**
```javascript
expect(value).toBeGreaterThan(10);      // Lớn hơn
expect(value).toBeLessThan(100);        // Nhỏ hơn
expect(value).toBeCloseTo(3.14, 2);     // Gần bằng (số thập phân)
```

### **Kiểm tra string:**
```javascript
expect(value).toMatch(/regex/);         // Kiểm tra regex
expect(value).toContain('text');        // Chứa text
expect(value).toHaveLength(5);          // Độ dài
```

### **Kiểm tra array:**
```javascript
expect(array).toContain(item);          // Chứa item
expect(array).toHaveLength(3);          // Độ dài array
expect(array).toEqual(expect.arrayContaining([1, 2])); // Chứa các item
```

### **Kiểm tra object:**
```javascript
expect(object).toHaveProperty('key');   // Có property
expect(object).toMatchObject({key: 'value'}); // Match object
```

## 🚨 **Xử lý lỗi thường gặp:**

### **1. Test bị fail:**
```javascript
// Kiểm tra console.log để xem lỗi gì
console.log('Response:', response.body);

// Kiểm tra status code
console.log('Status:', response.status);
```

### **2. Database connection error:**
```bash
# Kiểm tra MongoDB có chạy không
mongod --version

# Khởi động MongoDB
mongod
```

### **3. Module not found:**
```bash
# Cài lại dependencies
npm install

# Kiểm tra package.json
cat package.json
```

## 💡 **Tips viết test nhanh:**

1. **Viết test trước khi code** (TDD)
2. **Test 1 chức năng = 1 test case**
3. **Sử dụng `beforeEach` để setup dữ liệu**
4. **Sử dụng `afterEach` để dọn dẹp**
5. **Test happy path trước, error cases sau**

## 📚 **Ví dụ test hoàn chỉnh:**

```javascript
describe('Test User API', () => {
  let testUser;
  
  beforeEach(async () => {
    // Setup trước mỗi test
    testUser = {
      username: 'testuser',
      email: 'test@email.com',
      password: '123456'
    };
  });
  
  afterEach(async () => {
    // Dọn dẹp sau mỗi test
    await User.deleteMany({});
  });
  
  it('Tạo user thành công', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
  
  it('Không tạo được user khi thiếu email', async () => {
    const incompleteUser = { username: 'test' };
    
    const response = await request(app)
      .post('/api/users')
      .send(incompleteUser);
    
    expect(response.status).toBe(400);
  });
});
```

## 🎉 **Kết luận:**

- **Test đơn giản = Dễ hiểu + Dễ sửa**
- **Không cần TypeScript phức tạp**
- **Chỉ test những gì cần thiết**
- **Tập trung vào chức năng core**

**Bạn có thể copy file này và sửa theo nhu cầu!** 🚀
