import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Định nghĩa base structure cho API response theo chuẩn của backend
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Xử lý chung cho response thành công
    return response.data; // Trả về trực tiếp data payload để component không phải response.data.data
  },
  (error: any) => {
    // Xử lý lỗi global (ví dụ: 401 Unauthorized -> clear token và redirect về login)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } else if (status >= 500) {
        console.error('Server Error:', error.response.data);
      }
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;