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
    CREATE: '/api/courses',
    UPDATE: '/api/courses/:id',
  },
  POSTS: {
    LIST: '/api/posts',
    DETAIL: '/api/posts/:id',
    CREATE: '/api/posts',
    UPDATE: '/api/posts/:id',
    DELETE: '/api/posts/:id',
  },
  COMMENTS: {
    LIST: '/api/comments',
    CREATE: '/api/comments',
    UPDATE: '/api/comments/:id',
    DELETE: '/api/comments/:id',
    LIKE: '/api/comments/:id/like',
    DISLIKE: '/api/comments/:id/dislike',
    REPORT: '/api/comments/:id/report',
  },
  LESSONS: {
    LIST: '/api/lessons',
    BY_COURSE: '/api/lessons/course/:courseId',
    BY_COURSE_PUBLIC: '/api/lessons/course/:courseId/public',
    BY_TEACHER: '/api/lessons/teacher',
    DETAIL: '/api/lessons/:id',
    CREATE: '/api/lessons',
    UPDATE: '/api/lessons/:id',
    DELETE: '/api/lessons/:id',
    TOGGLE_STATUS: '/api/lessons/:id/toggle-status',
  },
  INSTRUCTOR: {
    APPLY: '/api/instructor/apply',
    APPLICATIONS: '/api/instructor/applications',
    APPROVE: '/api/instructor/applications/:id/approve',
    REJECT: '/api/instructor/applications/:id/reject',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    COURSES: '/api/admin/courses',
    APPLICATIONS: '/api/admin/applications',
    APPROVE_COURSE: '/api/admin/courses/:id/approve',
    REJECT_COURSE: '/api/admin/courses/:id/reject',
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

  async createCourse(data: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.COURSES.CREATE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  // Posts Methods
  async getPosts(params?: { status?: string; category?: string; search?: string }): Promise<ApiResponse> {
    let endpoint = API_ENDPOINTS.POSTS.LIST;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append('status', params.status);
      if (params.category) searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`;
      }
    }
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async getPostDetail(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.POSTS.DETAIL.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async getPostBySlug(slug: string): Promise<ApiResponse> {
    return this.request(`/api/posts/slug/${slug}`, {
      method: HTTP_METHODS.GET,
    });
  }

  // Post Methods
  async createPost(data: any): Promise<ApiResponse> {
    return this.request('/api/posts', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: any): Promise<ApiResponse> {
    return this.request(`/api/posts/${id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string): Promise<ApiResponse> {
    return this.request(`/api/posts/${id}`, {
      method: HTTP_METHODS.DELETE,
    });
  }

  // Comments Methods
  async getComments(contentType: string, contentId: string): Promise<ApiResponse> {
    return this.request(`/api/comments?contentType=${contentType}&contentId=${contentId}`, {
      method: HTTP_METHODS.GET,
    });
  }

  async createComment(contentType: string, contentId: string, data: any): Promise<ApiResponse> {
    return this.request('/api/comments', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify({
        ...data,
        contentType,
        contentId
      }),
    });
  }

  async updateComment(id: string, data: any): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COMMENTS.UPDATE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  async deleteComment(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COMMENTS.DELETE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.DELETE,
    });
  }

  async likeComment(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COMMENTS.LIKE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
    });
  }

  async dislikeComment(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COMMENTS.DISLIKE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
    });
  }

  async reportComment(id: string, data: { reason: string }): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.COMMENTS.REPORT.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  // Lesson Methods
  async getLessons(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.LESSONS.LIST, {
      method: HTTP_METHODS.GET,
    });
  }

  async getLessonsByCourse(courseId: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.BY_COURSE.replace(':courseId', courseId);
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async getLessonsByCoursePublic(courseId: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.BY_COURSE_PUBLIC.replace(':courseId', courseId);
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async getLessonsByTeacher(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.LESSONS.BY_TEACHER, {
      method: HTTP_METHODS.GET,
    });
  }

  async getLessonDetail(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.DETAIL.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.GET,
    });
  }

  async createLesson(data: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.LESSONS.CREATE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async updateLesson(id: string, data: any): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.UPDATE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  async deleteLesson(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.DELETE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.DELETE,
    });
  }

  async toggleLessonStatus(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.LESSONS.TOGGLE_STATUS.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Instructor Methods
  async applyInstructor(data: any): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.INSTRUCTOR.APPLY, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async getInstructorApplications(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.INSTRUCTOR.APPLICATIONS, {
      method: HTTP_METHODS.GET,
    });
  }

  async approveInstructorApplication(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.INSTRUCTOR.APPROVE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
    });
  }

  async rejectInstructorApplication(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.INSTRUCTOR.REJECT.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Admin Methods
  async getAdminUsers(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.ADMIN.USERS, {
      method: HTTP_METHODS.GET,
    });
  }

  async getAdminCourses(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.ADMIN.COURSES, {
      method: HTTP_METHODS.GET,
    });
  }

  async getAdminApplications(): Promise<ApiResponse> {
    return this.request(API_ENDPOINTS.ADMIN.APPLICATIONS, {
      method: HTTP_METHODS.GET,
    });
  }

  async approveCourse(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.ADMIN.APPROVE_COURSE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
    });
  }

  async rejectCourse(id: string): Promise<ApiResponse> {
    const endpoint = API_ENDPOINTS.ADMIN.REJECT_COURSE.replace(':id', id);
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
    });
  }

  // Generic methods for admin endpoints
  async getAdminInstructorApplications(): Promise<ApiResponse> {
    return this.request('/api/admin/instructor-applications', {
      method: HTTP_METHODS.GET,
    });
  }

  async getAdminAllCourses(): Promise<ApiResponse> {
    return this.request('/api/courses/admin/all', {
      method: HTTP_METHODS.GET,
    });
  }

  async reviewInstructorApplication(id: string, data: { action: string; notes?: string }): Promise<ApiResponse> {
    return this.request(`/api/admin/instructor-applications/${id}/review`, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async updateCourseAdminApproval(id: string, data: { action: string; reason?: string }): Promise<ApiResponse> {
    return this.request(`/api/courses/${id}/admin-approval`, {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data),
    });
  }

  async updateCourseAdminStatus(id: string, data: { status: string }): Promise<ApiResponse> {
    return this.request(`/api/courses/${id}/admin-status`, {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data),
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
