import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import toast from 'react-hot-toast';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, image }: { content: string; image?: File | null }) => {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      return postsApi.createPost(formData);
    },
    onSuccess: () => {
      toast.success('Post publié avec succès');
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content, image }: { id: string; content: string; image?: File | null }) => {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      return postsApi.updatePost(id, formData);
    },
    onSuccess: (_, variables) => {
      toast.success('Post modifié');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });
}
