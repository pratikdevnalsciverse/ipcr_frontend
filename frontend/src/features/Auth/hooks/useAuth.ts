import { useState } from 'react';
import { User } from '../auth.types';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return { user, isLoading, error, login, logout };
};
