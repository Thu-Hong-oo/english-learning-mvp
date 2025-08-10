// API Base URL - có thể thay đổi khi deploy

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints
const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    VERIFY_EMAIL: '/api/auth/verify-email',
    SEND_VERIFICATION: '/api/auth/send-verification',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/update-profile',
  },
  COURSES: {
    LIST: '/api/courses',
    DETAIL: '/api/courses/:id',
    ENROLL: '/api/courses/:id/enroll',
  },
} as const;

// HTTP Methods
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  user?: any;
  code?: string;
  authUrl?: string; // For Google OAuth
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface VerifyEmailRequest {
  otp: string;
}

export interface SendVerificationRequest {
  email: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Helper method to get full URL
  private getFullUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = this.getFullUrl(endpoint);
      const config: RequestInit = {
        headers: this.getAuthHeaders(),
        ...options,
      };

      console.log('API Request:', { url, method: config.method, body: config.body });
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async register(data: RegisterRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async sendVerification(data: SendVerificationRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.SEND_VERIFICATION, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async resendVerification(data: SendVerificationRequest): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  // Google OAuth Methods
  async getGoogleAuthUrl(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.GOOGLE, {
      method: HTTP_METHODS.GET,
    });
  }

  async handleGoogleAuth(code: string): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.AUTH.GOOGLE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({ code }),
    });
  }

  // User Methods
  async getUserProfile(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.USER.PROFILE, {
      method: HTTP_METHODS.GET,
    });
  }

  async updateUserProfile(data: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.USER.UPDATE_PROFILE, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  // Course Methods
  async getCourses(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.COURSES.LIST, {
      method: HTTP_METHODS.GET,
    });
  }

  async getCourseDetail(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COURSES.DETAIL.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async enrollCourse(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COURSES.ENROLL.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
    });
  }

  // Utility Methods
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    this.removeAuthToken();
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  }
}

// Create and export singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Types are already exported above with their definitions
