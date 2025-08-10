import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';

// Định nghĩa kiểu dữ liệu cho User Profile
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu dữ liệu cho User Settings
export interface UserSettings {
  language: 'vi' | 'en';
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
  };
}

// Định nghĩa kiểu dữ liệu cho User State
interface UserState {
  profile: UserProfile | null;
  settings: UserSettings;
  loading: boolean;
  error: string | null;
  isProfileComplete: boolean;
}

// Trạng thái ban đầu
const initialState: UserState = {
  profile: null,
  settings: {
    language: 'vi',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
  },
  loading: false,
  error: null,
  isProfileComplete: false,
};

// Async thunk cho cập nhật profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserProfile(profileData);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Cập nhật profile thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi cập nhật profile');
    }
  }
);

// Async thunk cho upload avatar
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Gọi API upload (cần implement trong apiService)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.data.avatarUrl;
      } else {
        return rejectWithValue(data.message || 'Upload avatar thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Có lỗi xảy ra khi upload avatar');
    }
  }
);

// Async thunk cho lấy user settings
export const fetchUserSettings = createAsyncThunk(
  'user/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      // Giả lập API call (có thể implement sau)
      const settings = localStorage.getItem('userSettings');
      
      if (settings) {
        return JSON.parse(settings);
      } else {
        // Trả về settings mặc định
        return initialState.settings;
      }
    } catch (error: any) {
      return rejectWithValue('Không thể lấy user settings');
    }
  }
);

// Async thunk cho cập nhật user settings
export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings: Partial<UserSettings>, { rejectWithValue }) => {
    try {
      // Giả lập API call (có thể implement sau)
      const currentSettings = localStorage.getItem('userSettings');
      const updatedSettings = {
        ...(currentSettings ? JSON.parse(currentSettings) : initialState.settings),
        ...settings,
      };
      
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    } catch (error: any) {
      return rejectWithValue('Không thể cập nhật user settings');
    }
  }
);

// Tạo user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action set profile
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isProfileComplete = !!action.payload.fullName && !!action.payload.email;
    },

    // Action clear profile
    clearProfile: (state) => {
      state.profile = null;
      state.isProfileComplete = false;
    },

    // Action set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action clear error
    clearError: (state) => {
      state.error = null;
    },

    // Action update settings locally (không gọi API)
    updateSettingsLocally: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    // Action khởi tạo user data từ localStorage
    initializeUserData: (state) => {
      const userStr = localStorage.getItem('user');
      const settingsStr = localStorage.getItem('userSettings');
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          state.profile = user;
          state.isProfileComplete = !!user.fullName && !!user.email;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
      
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          state.settings = { ...state.settings, ...settings };
        } catch (error) {
          console.error('Error parsing settings from localStorage:', error);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý updateUserProfile async actions
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileComplete = !!action.payload.fullName && !!action.payload.email;
        state.error = null;
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý uploadAvatar async actions
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý fetchUserSettings async actions
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xử lý updateUserSettings async actions
      .addCase(updateUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  setProfile, 
  clearProfile, 
  setLoading, 
  clearError, 
  updateSettingsLocally,
  initializeUserData 
} = userSlice.actions;

// Export selectors
export const selectUserProfile = (state: { user: UserState }) => state.user.profile;
export const selectUserSettings = (state: { user: UserState }) => state.user.settings;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectIsProfileComplete = (state: { user: UserState }) => state.user.isProfileComplete;

// Export reducer
export default userSlice.reducer;
