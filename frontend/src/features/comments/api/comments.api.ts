import api from '../../../lib/axios';
import { Comment } from '../../../types/comment.types';

export const commentsApi = {
  getCommentsForPost: async (postId: string, cursor?: string, limit = 20): Promise<{ items: Comment[]; nextCursor: string | null; hasMore: boolean }> => {
    const { data } = await api.get(`/posts/${postId}/comments`, { params: { cursor, limit } });
    return data.data;
  },

  createComment: async (postId: string, content: string, parentId?: string): Promise<Comment> => {
    const { data } = await api.post(`/posts/${postId}/comments`, { content, parentId });
    return data.data;
  },

  updateComment: async (id: string, content: string): Promise<Comment> => {
    const { data } = await api.put(`/comments/${id}`, { content });
    return data.data;
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  }
};
