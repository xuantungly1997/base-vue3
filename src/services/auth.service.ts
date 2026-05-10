import apiClient, { type ApiResponse } from './api';
import type { LoginCredentials, User } from '@/types/auth';

export const authService = {
  login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return apiClient.post('/auth/login', credentials);
  },
  getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/profile');
  }
};