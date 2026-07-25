import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { useAuthStore } from '../../../stores/authStore';
import toast from 'react-hot-toast';
import { Profile } from '../../../types/auth.types';

export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => profileApi.getProfile(username),
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      toast.success('Profil mis à jour');
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (data) => {
      toast.success('Avatar mis à jour');
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'avatar');
    },
  });
}

export function useUploadCover() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.uploadCover,
    onSuccess: (data) => {
      toast.success('Photo de couverture mise à jour');
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile', data.username] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => profileApi.searchUsers(query),
    enabled: query.length > 2,
  });
}
