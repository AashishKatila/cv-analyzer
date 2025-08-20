import { deleteCookie, getCookie, setCookie } from '@/helper/cookie-handler';
import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

const getAccessToken = async () => await getCookie('access_token');

// --- Request Interceptor ---
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === 'undefined') return Promise.reject(error);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          ENDPOINTS.refresh,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.data?.accessToken || response.data.accessToken;
        await setCookie('access_token', newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        deleteCookie('access_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const http = {
  get: <T = any>(url: string, config = {}) => api.get<T>(url, config),
  post: <T = any>(url: string, data: any, config = {}) =>
    api.post<T>(url, data, config),
  patch: <T = any>(url: string, data: any, config = {}) =>
    api.patch<T>(url, data, config),
  del: <T = any>(url: string, config = {}) => api.delete<T>(url, config),
  postWithFile: <T = any>(url: string, data: FormData, config = {}) =>
    api.post<T>(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),
};
