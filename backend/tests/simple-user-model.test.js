// Test User model đơn giản
// Không cần TypeScript, chỉ JavaScript thuần

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import User model
const User = require('../src/models/User');

describe('Test User Model', () => {
  // Test 1: Tạo user mới
  it('Tạo user thành công', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@email.com',
      password: '123456',
      fullName: 'Test User',
      role: 'student'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Kiểm tra user đã được lưu
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.fullName).toBe(userData.fullName);
    expect(savedUser.role).toBe(userData.role);
    
    // Kiểm tra password đã được hash
    expect(savedUser.password).not.toBe(userData.password);
  });

  // Test 2: Không cho phép email trùng
  it('Không cho phép email trùng', async () => {
    const user1 = new User({
      username: 'user1',
      email: 'same@email.com',
      password: '123456',
      fullName: 'User 1'
    });

    const user2 = new User({
      username: 'user2',
      email: 'same@email.com', // Email giống nhau
      password: '123456',
      fullName: 'User 2'
    });

    // Lưu user đầu tiên
    await user1.save();

    // User thứ 2 phải bị lỗi
    try {
      await user2.save();
      // Nếu đến đây thì test fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    }
  });

  // Test 3: Kiểm tra password hash
  it('Password được hash khi lưu', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@email.com',
      password: '123456',
      fullName: 'Test User'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Password gốc không được lưu
    expect(savedUser.password).not.toBe(userData.password);
    
    // Password đã được hash (dài hơn 20 ký tự)
    expect(savedUser.password.length).toBeGreaterThan(20);
  });

  // Test 4: So sánh password
  it('So sánh password đúng', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@email.com',
      password: '123456',
      fullName: 'Test User'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // So sánh password đúng
    const isCorrectPassword = await savedUser.comparePassword('123456');
    expect(isCorrectPassword).toBe(true);

    // So sánh password sai
    const isWrongPassword = await savedUser.comparePassword('wrongpassword');
    expect(isWrongPassword).toBe(false);
  });

  // Test 5: Giá trị mặc định
  it('Có giá trị mặc định đúng', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@email.com',
      password: '123456',
      fullName: 'Test User'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Kiểm tra giá trị mặc định
    expect(savedUser.isActive).toBe(true);
    expect(savedUser.role).toBe('student');
    expect(savedUser.level).toBe('beginner');
    expect(savedUser.points).toBe(0);
    expect(savedUser.streak).toBe(0);
    expect(savedUser.totalStudyTime).toBe(0);
    expect(savedUser.preferredTopics).toEqual([]);
    expect(savedUser.authProvider).toBe('local');
  });
});
