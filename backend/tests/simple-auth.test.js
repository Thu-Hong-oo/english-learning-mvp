// File test đơn giản - Bạn có thể tự viết
// Không cần TypeScript, chỉ JavaScript thuần

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Tạo app test đơn giản
const app = express();
app.use(express.json());

// Test data đơn giản
const testUser = {
  username: 'testuser',
  email: 'test@email.com',
  password: '123456',
  fullName: 'Test User'
};

// Test 1: Đăng ký user
describe('Test đăng ký', () => {
  it('Đăng ký thành công', async () => {
    // Gọi API đăng ký
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Kiểm tra kết quả
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('Không cho phép email trùng', async () => {
    // Gọi API đăng ký lần 2
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    // Kiểm tra lỗi
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

// Test 2: Đăng nhập
describe('Test đăng nhập', () => {
  it('Đăng nhập thành công', async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('Sai mật khẩu thì đăng nhập thất bại', async () => {
    const wrongPassword = {
      email: testUser.email,
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(wrongPassword);
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

// Test 3: Xem profile
describe('Test xem profile', () => {
  let token;

  beforeAll(async () => {
    // Đăng nhập để lấy token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    token = loginResponse.body.token;
  });

  it('Xem profile thành công khi có token', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(testUser.email);
  });

  it('Không xem được profile khi không có token', async () => {
    const response = await request(app)
      .get('/api/auth/profile');
    
    expect(response.status).toBe(401);
  });
});

// Test 4: Đăng xuất
describe('Test đăng xuất', () => {
  let token;

  beforeAll(async () => {
    // Đăng nhập để lấy token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    token = loginResponse.body.token;
  });

  it('Đăng xuất thành công', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
