// Test Controller đơn giản
// Không cần TypeScript, chỉ JavaScript thuần

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Import controller
const { register, login, getProfile, logout } = require('../src/controllers/authController');

// Tạo app test
const app = express();
app.use(express.json());

// Thêm routes
app.post('/register', register);
app.post('/login', login);
app.get('/profile', getProfile);
app.post('/logout', logout);

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@email.com',
  password: '123456',
  fullName: 'Test User'
};

describe('Test Auth Controller', () => {
  // Test 1: Đăng ký
  describe('POST /register', () => {
    it('Đăng ký thành công', async () => {
      const response = await request(app)
        .post('/register')
        .send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.token).toBeDefined();
    });

    it('Báo lỗi khi thiếu thông tin', async () => {
      const incompleteUser = {
        username: 'testuser',
        // Thiếu email và password
      };

      const response = await request(app)
        .post('/register')
        .send(incompleteUser);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // Test 2: Đăng nhập
  describe('POST /login', () => {
    beforeEach(async () => {
      // Tạo user trước khi test login
      await request(app)
        .post('/register')
        .send(testUser);
    });

    it('Đăng nhập thành công', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await request(app)
        .post('/login')
        .send(loginData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('Đăng nhập thất bại khi sai email', async () => {
      const wrongEmail = {
        email: 'wrong@email.com',
        password: testUser.password
      };

      const response = await request(app)
        .post('/login')
        .send(wrongEmail);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('Đăng nhập thất bại khi sai password', async () => {
      const wrongPassword = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/login')
        .send(wrongPassword);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // Test 3: Xem profile
  describe('GET /profile', () => {
    let token;

    beforeEach(async () => {
      // Tạo user và đăng nhập để lấy token
      await request(app)
        .post('/register')
        .send(testUser);
      
      const loginResponse = await request(app)
        .post('/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      token = loginResponse.body.token;
    });

    it('Xem profile thành công khi có token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('Không xem được profile khi không có token', async () => {
      const response = await request(app)
        .get('/profile');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('Không xem được profile khi token sai', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer wrong-token');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // Test 4: Đăng xuất
  describe('POST /logout', () => {
    let token;

    beforeEach(async () => {
      // Tạo user và đăng nhập để lấy token
      await request(app)
        .post('/register')
        .send(testUser);
      
      const loginResponse = await request(app)
        .post('/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      token = loginResponse.body.token;
    });

    it('Đăng xuất thành công', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('Không đăng xuất được khi không có token', async () => {
      const response = await request(app)
        .post('/logout');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
