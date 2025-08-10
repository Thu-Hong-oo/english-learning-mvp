import axios from 'axios';
import User from '../models/User';
import jwt from 'jsonwebtoken';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface GoogleTokens {
  access_token: string;
  id_token: string;
}

class GoogleAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
  }

  // Tạo URL để user authorize Google
  getAuthUrl(): string {
    const scope = 'openid email profile';
    const state = Math.random().toString(36).substring(7);
    
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
           `client_id=${this.clientId}&` +
           `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
           `scope=${encodeURIComponent(scope)}&` +
           `response_type=code&` +
           `state=${state}`;
  }

  // Exchange authorization code cho access token
  async getTokens(code: string): Promise<GoogleTokens> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      });

      return {
        access_token: response.data.access_token,
        id_token: response.data.id_token,
      };
    } catch (error) {
      console.error('Error getting Google tokens:', error);
      throw new Error('Failed to get Google tokens');
    }
  }

  // Lấy thông tin user từ Google
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting Google user info:', error);
      throw new Error('Failed to get Google user info');
    }
  }

  // Xử lý đăng nhập/đăng ký bằng Google
  async handleGoogleAuth(code: string): Promise<{ user: any; token: string; isNewUser: boolean }> {
    try {
      // 1. Lấy tokens từ Google
      const tokens = await this.getTokens(code);
      
      // 2. Lấy thông tin user từ Google
      const googleUserInfo = await this.getUserInfo(tokens.access_token);
      
      // 3. Kiểm tra user đã tồn tại chưa
      let user = await User.findOne({ email: googleUserInfo.email });
      let isNewUser = false;

      if (!user) {
        // 4. Tạo user mới nếu chưa tồn tại
        const username = this.generateUsername(googleUserInfo.email, googleUserInfo.name);
        
        user = new User({
          username: username,
          email: googleUserInfo.email,
          fullName: googleUserInfo.name,
          password: this.generateRandomPassword(), // Tạo password ngẫu nhiên
          role: 'student', // Mặc định là student
          level: 'beginner',
          avatar: googleUserInfo.picture,
          isActive: true,
          lastLogin: new Date(),
          lastStudyDate: new Date(),
        });

        await user.save();
        isNewUser = true;
        console.log(`Created new user via Google OAuth: ${user.email}`);
      } else {
        // 5. Cập nhật thông tin user hiện tại
        user.lastLogin = new Date();
        user.avatar = googleUserInfo.picture; // Cập nhật avatar mới nhất
        await user.save();
        console.log(` User logged in via Google OAuth: ${user.email}`);
      }

      // 6. Tạo JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return { user, token, isNewUser };
    } catch (error) {
      console.error('Error handling Google auth:', error);
      throw new Error('Google authentication failed');
    }
  }

  // Tạo username từ email và tên
  private generateUsername(email: string, name: string): string {
    const baseName = name.toLowerCase().replace(/\s+/g, '');
    const emailPrefix = email.split('@')[0];
    
    // Thử username từ tên trước
    let username = baseName;
    let counter = 1;
    
    // Nếu username quá ngắn, dùng email prefix
    if (username.length < 3) {
      username = emailPrefix;
    }
    
    // Thêm số nếu cần thiết
    while (counter < 100) {
      const testUsername = counter === 1 ? username : `${username}${counter}`;
      // Kiểm tra username có tồn tại không (có thể bỏ qua trong seed script)
      if (testUsername.length >= 3 && testUsername.length <= 20) {
        return testUsername;
      }
      counter++;
    }
    
    // Fallback
    return `user_${Date.now()}`;
  }

  // Tạo password ngẫu nhiên cho Google users
  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export default new GoogleAuthService();
