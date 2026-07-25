import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import toast from 'react-hot-toast';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  });
}

export function useAdminUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: () => adminApi.getUsers(page, limit),
  });
}

export function useAdminReports(status: string, page: number, limit: number) {
  return useQuery({
    queryKey: ['admin', 'reports', status, page, limit],
    queryFn: () => adminApi.getReports(status, page, limit),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'USER' | 'ADMIN' }) => 
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('Rôle mis à jour');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Erreur lors de la mise à jour du rôle'),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast.success('Utilisateur supprimé');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Erreur lors de la suppression de l\'utilisateur'),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, action }: { reportId: string; action: 'DISMISS' | 'DELETE_POST' | 'BAN_USER' }) => 
      adminApi.resolveReport(reportId, action),
    onSuccess: () => {
      toast.success('Signalement résolu');
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
    onError: () => toast.error('Erreur lors de la résolution du signalement'),
  });
}
