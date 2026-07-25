import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';

export function useLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.toggleLike,
    onMutate: async (postId) => {
      // Optimistic update could be implemented here
      return { postId };
    },
    onSuccess: (_, postId) => {
      // Invalidate specific queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
