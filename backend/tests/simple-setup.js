// File setup đơn giản cho test
// Không cần TypeScript, chỉ JavaScript thuần

const mongoose = require('mongoose');

// Kết nối database test
beforeAll(async () => {
  try {
    // Kết nối database test
    await mongoose.connect('mongodb://localhost:27017/english_website_test');
    console.log('✅ Kết nối database test thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
    throw error;
  }
});

// Dọn dẹp database sau mỗi test
afterEach(async () => {
  // Xóa tất cả collections
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  console.log('🧹 Đã dọn dẹp database');
});

// Đóng kết nối database sau khi test xong
afterAll(async () => {
  await mongoose.connection.close();
  console.log('🔌 Đã đóng kết nối database');
});

// Tắt console.log để test không bị rối
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
