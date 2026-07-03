import axiosInstance from '../../../config/axiosInstance';
import { User } from '../auth.types';

export const authService = {
  login: async (credentials: any): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};
