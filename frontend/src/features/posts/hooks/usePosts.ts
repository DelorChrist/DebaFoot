import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import toast from 'react-hot-toast';

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: ({ pageParam }) => postsApi.getFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: ({ pageParam }) => postsApi.getUserPosts(userId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      toast.success('Post supprimé');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });
}

export function useReportPost() {
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => postsApi.reportPost(id, reason),
    onSuccess: () => {
      toast.success('Signalement envoyé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du signalement');
    },
  });
}
