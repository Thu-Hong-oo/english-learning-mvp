import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { ApiResponse } from '../../services/api';

// Course interface
export interface Course {
  _id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'general';
  thumbnail?: string;
  duration: number;
  lessonsCount: number;
  isPublished: boolean;
  teacher: string;
  lessons: string[];
  tags: string[];
  difficulty: number;
  rating: number;
  totalStudents: number;
  price: number;
  requirements?: string[];
  objectives?: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// State interface
interface CourseState {
  courses: Course[];
  featuredCourses: Course[];
  loading: boolean;
  error: string | null;
  currentCourse: Course | null;
}

// Initial state
const initialState: CourseState = {
  courses: [],
  featuredCourses: [],
  loading: false,
  error: null,
  currentCourse: null,
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCourses();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

export const fetchFeaturedCourses = createAsyncThunk(
  'courses/fetchFeaturedCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all courses and filter for featured ones
      const response = await apiService.getCourses();
      // Extract data from ApiResponse with proper typing
      const apiResponse = response as ApiResponse<Course[]>;
      if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
        return apiResponse.data;
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getCourseDetail(courseId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course');
    }
  }
);

// Course slice
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
           extraReducers: (builder) => {
           // fetchCourses
           builder
             .addCase(fetchCourses.pending, (state) => {
               state.loading = true;
               state.error = null;
             })
             .addCase(fetchCourses.fulfilled, (state, action) => {
               state.loading = false;
               // Handle both direct data and nested data structure
               if (action.payload && typeof action.payload === 'object' && 'data' in action.payload && Array.isArray(action.payload.data)) {
                 state.courses = action.payload.data;
               } else if (Array.isArray(action.payload)) {
                 state.courses = action.payload;
               } else {
                 state.courses = [];
               }
             })
             .addCase(fetchCourses.rejected, (state, action) => {
               state.loading = false;
               state.error = action.payload as string;
             });

           // fetchFeaturedCourses
           builder
             .addCase(fetchFeaturedCourses.pending, (state) => {
               state.loading = true;
               state.error = null;
             })
             .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
               state.loading = false;
               // Handle both direct data and nested data structure
               if (action.payload && typeof action.payload === 'object' && 'data' in action.payload && Array.isArray(action.payload.data)) {
                 state.featuredCourses = action.payload.data;
               } else if (Array.isArray(action.payload)) {
                 state.featuredCourses = action.payload;
               } else {
                 state.featuredCourses = [];
               }
             })
             .addCase(fetchFeaturedCourses.rejected, (state, action) => {
               state.loading = false;
               state.error = action.payload as string;
             });

           // fetchCourseById
           builder
             .addCase(fetchCourseById.pending, (state) => {
               state.loading = true;
               state.error = null;
             })
                          .addCase(fetchCourseById.fulfilled, (state, action) => {
               state.loading = false;
               // Extract data from ApiResponse
               if (action.payload && typeof action.payload === 'object' && 'data' in action.payload && action.payload.data) {
                 state.currentCourse = action.payload.data;
               } else {
                 state.currentCourse = null;
               }
             })
             .addCase(fetchCourseById.rejected, (state, action) => {
               state.loading = false;
               state.error = action.payload as string;
             });
         },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
