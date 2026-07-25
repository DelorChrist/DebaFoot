import api from '../../../lib/axios';

export const adminApi = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    const { data } = await api.get('/admin/users', { params: { page, limit } });
    return data.data;
  },

  updateUserRole: async (userId: string, role: 'USER' | 'ADMIN') => {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
    return data.data;
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/admin/users/${userId}`);
  },

  getReports: async (status = 'PENDING', page = 1, limit = 10) => {
    const { data } = await api.get('/admin/reports', { params: { status, page, limit } });
    return data.data;
  },

  resolveReport: async (reportId: string, action: 'DISMISS' | 'DELETE_POST' | 'BAN_USER') => {
    const { data } = await api.post(`/admin/reports/${reportId}/resolve`, { action });
    return data.data;
  }
};
