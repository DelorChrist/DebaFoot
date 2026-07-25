import api from '../../../lib/axios';
import { NotificationResponse } from '../../../types/notification.types';

export const notificationsApi = {
  getNotifications: async (cursor?: string, limit = 20): Promise<NotificationResponse> => {
    const { data } = await api.get('/notifications', { params: { cursor, limit } });
    return data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  }
};
