import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string, rememberMe?: boolean) =>
    api.post('/auth/login', { email, password, rememberMe }),
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    age?: number;
    sex?: string;
    role?: string;
  }) => api.post('/auth/register', data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Image API
export const imageAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Prediction API
export const predictionAPI = {
  predict: (data: {
    imageId: string;
    age?: number;
    sex?: string;
    eyeSide?: string;
    notes?: string;
  }) => api.post('/predict', data),
  getHistory: (params?: {
    page?: number;
    limit?: number;
    grade?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => api.get('/predictions/history', { params }),
  getById: (id: string) => api.get(`/predictions/${id}`),
  delete: (id: string) => api.delete(`/predictions/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: {
    fullName?: string;
    age?: number;
    sex?: string;
  }) => api.patch('/users/me', data),
  getStats: () => api.get('/users/me/stats'),
};

// Admin API
export const adminAPI = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: { role?: string; status?: string }) =>
    api.patch(`/admin/users/${id}`, data),
  getUserStats: () => api.get('/admin/users/stats'),
};

// Analytics API
export const analyticsAPI = {
  getPerformance: () => api.get('/analytics/performance'),
  getUsage: () => api.get('/analytics/usage'),
  getDailyUploads: (days?: number) =>
    api.get('/analytics/daily-uploads', { params: { days } }),
  getModelVersions: () => api.get('/analytics/model-versions'),
  activateModel: (versionId: string) =>
    api.post(`/analytics/model-versions/${versionId}/activate`),
};

export default api;
