import api from '../../../lib/axios';
import { User, Profile } from '../../../types/auth.types';

export const profileApi = {
  getProfile: async (username: string): Promise<User> => {
    const { data } = await api.get(`/users/${username}`);
    return data.data;
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<User> => {
    const { data } = await api.put('/users/profile', profileData);
    return data.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  uploadCover: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('cover', file);
    const { data } = await api.post('/users/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const { data } = await api.get('/users/search', { params: { q: query } });
    return data.data;
  }
};
