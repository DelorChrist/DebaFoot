import api from '../../../lib/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../../../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const { data } = await api.post('/auth/register', credentials);
    return data.data;
  },

  logout: async (refreshToken: string | null) => {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (password: string, token: string) => {
    const { data } = await api.post('/auth/reset-password', { password, token });
    return data;
  },
};
