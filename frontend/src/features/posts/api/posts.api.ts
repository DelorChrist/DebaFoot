import api from '../../../lib/axios';
import { Post, PostResponse } from '../../../types/post.types';

export const postsApi = {
  getFeed: async (cursor?: string, limit = 10): Promise<PostResponse> => {
    const { data } = await api.get('/posts', { params: { cursor, limit } });
    return data.data;
  },

  getUserPosts: async (userId: string, cursor?: string, limit = 10): Promise<PostResponse> => {
    const { data } = await api.get(`/posts/user/${userId}`, { params: { cursor, limit } });
    return data.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const { data } = await api.get(`/posts/${id}`);
    return data.data;
  },

  createPost: async (formData: FormData): Promise<Post> => {
    const { data } = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  updatePost: async (id: string, formData: FormData): Promise<Post> => {
    const { data } = await api.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  toggleLike: async (id: string): Promise<{ liked: boolean }> => {
    const { data } = await api.post(`/posts/${id}/like`);
    return data.data;
  },

  reportPost: async (id: string, reason: string): Promise<void> => {
    await api.post(`/posts/${id}/report`, { reason });
  },

  searchPosts: async (query: string, cursor?: string, limit = 10): Promise<PostResponse> => {
    const { data } = await api.get('/posts/search', { params: { q: query, cursor, limit } });
    return data.data;
  }
};
