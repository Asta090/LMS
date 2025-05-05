import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to use current user endpoint which should refresh the token if it's still valid
        const response = await authAPI.getCurrentUser();
        
        // If we get here, we had a valid token and the request succeeded
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getTeachers: (status = 'pending') => api.get(`/admin/teachers?status=${status}`),
  updateTeacherStatus: (id: string, status: string) => 
    api.patch(`/admin/teachers/${id}/status`, { status }),
  getTeacherDetails: (id: string) => api.get(`/admin/teachers/${id}/details`),
  getStudents: () => api.get('/admin/students'),
  getStudentDetails: (id: string) => api.get(`/admin/students/${id}/details`),
  getCourses: (status = 'pending') => api.get(`/admin/courses?status=${status}`),
  updateCourseStatus: (id: string, status: string) => 
    api.patch(`/admin/courses/${id}/status`, { status }),
  getReviews: (status = 'pending') => api.get(`/admin/reviews?status=${status}`),
  updateReviewStatus: (id: string, status: string) => 
    api.patch(`/admin/reviews/${id}/status`, { status }),
};

// Teacher API calls
export const teacherAPI = {
  getProfile: () => api.get('/teacher/profile'),
  updateProfile: (profileData: any) => api.patch('/teacher/profile', profileData),
  getDashboardStats: () => api.get('/teacher/stats'),
  createCourse: (courseData: any) => api.post('/teacher/courses', courseData),
  getMyCourses: () => api.get('/teacher/courses'),
  getCourse: (id: string) => api.get(`/teacher/courses/${id}`),
  updateCourse: (id: string, courseData: any) => api.patch(`/teacher/courses/${id}`, courseData),
};

// Student API calls
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData: any) => api.patch('/student/profile', profileData),
  getAllCourses: () => api.get('/student/courses'),
  getCourseDetail: (id: string) => api.get(`/student/courses/${id}`),
  enrollCourse: (id: string) => api.post(`/student/courses/${id}/enroll`),
  getEnrolledCourses: () => api.get('/student/enrollments'),
  submitReview: (id: string, reviewData: any) => 
    api.post(`/student/courses/${id}/reviews`, reviewData),
  getMyReviews: () => api.get('/student/reviews'),
  updateCourseProgress: (id: string, progress: number) => {
    console.log(`API call: updateCourseProgress - id: ${id}, progress: ${progress}`);
    return api.patch(`/student/courses/${id}/progress`, { progress });
  },
};

export default api; 