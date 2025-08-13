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
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || '';

    // Validate required environment variables
    if (!this.clientId) {
      console.error('GOOGLE_CLIENT_ID is not set in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
      throw new Error('GOOGLE_CLIENT_ID is required');
    }
    if (!this.clientSecret) {
      console.error('GOOGLE_CLIENT_SECRET is not set in environment variables');
      throw new Error('GOOGLE_CLIENT_SECRET is required');
    }
    if (!this.redirectUri) {
      console.error('GOOGLE_REDIRECT_URI is not set in environment variables');
      throw new Error('GOOGLE_REDIRECT_URI is required');
    }

    console.log('GoogleAuthService initialized with:', {
      clientId: this.clientId.substring(0, 20) + '...',
      redirectUri: this.redirectUri
    });
  }

  // Test method để kiểm tra kết nối
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Google OAuth connection...');
      
      // Test basic connectivity - sử dụng endpoint đơn giản hơn
      const response = await axios.get('https://www.googleapis.com/discovery/v1/apis', {
        timeout: 5000,
      });
      
      console.log('Google OAuth endpoint is reachable');
      return true;
    } catch (error: any) {
      console.error('Google OAuth connection test failed:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      });
      // Không throw error, chỉ return false để không block quá trình
      return false;
    }
  }

  // Lấy Google auth URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Lấy tokens từ Google
  async getTokens(code: string): Promise<GoogleTokens> {
    try {
      console.log('Requesting Google tokens with code:', code.substring(0, 20) + '...');
      
      // Sử dụng URLSearchParams để encode form data đúng cách
      const formData = new URLSearchParams();
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      formData.append('code', code);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', this.redirectUri);
      
      const response = await axios.post('https://oauth2.googleapis.com/token', formData, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Retry logic
        validateStatus: (status) => status < 500,
      });

      console.log('Google tokens response received');
      
      return {
        access_token: response.data.access_token,
        id_token: response.data.id_token,
      };
    } catch (error: any) {
      console.error('Error getting Google tokens:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Retry logic for network errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        console.log('Network error detected, retrying...');
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const formData = new URLSearchParams();
          formData.append('client_id', this.clientId);
          formData.append('client_secret', this.clientSecret);
          formData.append('code', code);
          formData.append('grant_type', 'authorization_code');
          formData.append('redirect_uri', this.redirectUri);
          
          const retryResponse = await axios.post('https://oauth2.googleapis.com/token', formData, {
            timeout: 15000, // 15 seconds timeout for retry
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          
          console.log('Google tokens retry successful');
          return {
            access_token: retryResponse.data.access_token,
            id_token: retryResponse.data.id_token,
          };
        } catch (retryError: any) {
          console.error('Retry failed:', retryError.message);
          throw new Error(`Failed to get Google tokens after retry: ${retryError.message}`);
        }
      }
      
      throw new Error(`Failed to get Google tokens: ${error.message}`);
    }
  }

  // Lấy thông tin user từ Google
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      console.log('Requesting Google user info...');
      
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000, // 10 seconds timeout
      });

      console.log('Google user info received');
      return response.data;
    } catch (error: any) {
      console.error('Error getting Google user info:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Retry logic for network errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        console.log('Network error detected, retrying user info...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          const retryResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 15000,
          });
          
          console.log('Google user info retry successful');
          return retryResponse.data;
        } catch (retryError: any) {
          console.error('User info retry failed:', retryError.message);
          throw new Error(`Failed to get Google user info after retry: ${retryError.message}`);
        }
      }
      
      throw new Error(`Failed to get Google user info: ${error.message}`);
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
        const username = await this.generateUsername(googleUserInfo.email, googleUserInfo.name);
        
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

        try {
          await user.save();
          isNewUser = true;
          console.log(`Created new user via Google OAuth: ${user.email}`);
        } catch (saveError: any) {
          // Nếu vẫn bị duplicate key, thử tạo username khác
          if (saveError.code === 11000) {
            console.log('Duplicate username detected, generating new username...');
            const newUsername = await this.generateUsername(googleUserInfo.email, googleUserInfo.name);
            user.username = newUsername;
            await user.save();
            isNewUser = true;
            console.log(`Created new user via Google OAuth with new username: ${user.email}`);
          } else {
            throw saveError;
          }
        }
      } else {
        // 5. Cập nhật thông tin user hiện tại
        user.lastLogin = new Date();
        user.avatar = googleUserInfo.picture; // Cập nhật avatar mới nhất
        await user.save();
        console.log(`User logged in via Google OAuth: ${user.email}`);
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
  private async generateUsername(email: string, name: string): Promise<string> {
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
      
      // Kiểm tra username có tồn tại trong database không
      if (testUsername.length >= 3 && testUsername.length <= 20) {
        const existingUser = await User.findOne({ username: testUsername });
        if (!existingUser) {
          return testUsername;
        }
      }
      counter++;
    }
    
    // Fallback với timestamp
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
