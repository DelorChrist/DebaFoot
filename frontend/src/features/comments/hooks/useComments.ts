import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments.api';
import toast from 'react-hot-toast';

export function usePostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => commentsApi.getCommentsForPost(postId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) => 
      commentsApi.createComment(postId, content, parentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire');
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => 
      commentsApi.updateComment(id, content),
    onSuccess: () => {
      toast.success('Commentaire modifié');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      toast.success('Commentaire supprimé');
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      // Might want to invalidate post to update comment count, but requires knowing postId
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
}
