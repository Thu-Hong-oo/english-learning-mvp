import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

// Định nghĩa kiểu dữ liệu cho User
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu dữ liệu cho Auth State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Trạng thái ban đầu
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token'), // Lấy token từ localStorage nếu có
};

// Async thunk cho đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      
      // Debug: Log response để xem format
      console.log('API Response:', response);
      
      // Kiểm tra response.success trước
      if (response.success) {
        // Backend trả về data.user và data.token
        const user = response.data?.user || response.user;
        const token = response.data?.token || response.token;
        
        // Nếu có token, lưu vào localStorage
        if (token) {
          localStorage.setItem('token', token);
        }
        
        // Nếu có user, lưu vào localStorage
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Trả về data cần thiết
        return {
          user: user || null,
          token: token || null,
        };
      } else {
        // Nếu không success, trả về error message
        return rejectWithValue(response.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi đăng nhập');
    }
  }
);

// Async thunk cho đăng ký
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { username: string; email: string; password: string; fullName: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        return response.message;
      } else {
        return rejectWithValue(response.message || 'Đăng ký thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi đăng ký');
    }
  }
);

// Async thunk cho xác thực email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyEmail({ otp });
      
      if (response.success) {
        return response.message;
      } else {
        return rejectWithValue(response.message || 'Xác thực email thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi xác thực email');
    }
  }
);

// Async thunk cho gửi lại OTP
export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiService.sendVerification({ email });
      
      if (response.success) {
        return response.message;
      } else {
        return rejectWithValue(response.message || 'Gửi lại OTP thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi gửi lại OTP');
    }
  }
);

// Async thunk cho lấy thông tin user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserProfile();
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Không thể lấy thông tin user');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi lấy thông tin user');
    }
  }
);

// Tạo auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action đăng xuất (sync)
    logout: (state) => {
      // Xóa thông tin khỏi state
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      
      // Xóa thông tin khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Xóa token khỏi apiService
      apiService.removeAuthToken();
    },

    // Action xóa lỗi
    clearError: (state) => {
      state.error = null;
    },

    // Action set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action khởi tạo auth từ localStorage (khi app khởi động)
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          
          // Set token cho apiService
          apiService.setAuthToken(token);
        } catch (error) {
          // Nếu parse JSON lỗi, xóa dữ liệu cũ
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý loginUser async actions
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý registerUser async actions
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý verifyEmail async actions
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý resendOTP async actions
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý fetchUserProfile async actions
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { logout, clearError, setLoading, initializeAuth } = authSlice.actions;

// Export selectors (để lấy state từ component)
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;

// Export reducer
export default authSlice.reducer;
