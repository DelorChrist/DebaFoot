import { useFeed, useDeletePost, useReportPost } from '../features/posts/hooks/usePosts';
import { useLike } from '../features/posts/hooks/useLike';
import { PostFeed } from '../components/organisms/PostFeed';
import { useMemo, useState } from 'react';
import { EditPostModal } from '../components/organisms/EditPostModal';
import { useUpdatePost } from '../features/posts/hooks/useCreatePost';
import { Post } from '../types/post.types';

export function HomePage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeed();
  const likeMutation = useLike();
  const deleteMutation = useDeletePost();
  const reportMutation = useReportPost();
  const updateMutation = useUpdatePost();
  
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const handleEditSubmit = async (id: string, content: string, image: File | null) => {
    await updateMutation.mutateAsync({ id, content, image });
  };

  return (
    <div className="py-4">
      <div className="mb-6 px-4 lg:px-0">
        <h1 className="text-2xl font-bold text-text-primary">Votre fil d'actualité</h1>
        <p className="text-text-muted">Découvrez les derniers débats</p>
      </div>

      <PostFeed
        posts={posts}
        isLoading={isLoading || isFetchingNextPage}
        hasMore={!!hasNextPage}
        onLoadMore={fetchNextPage}
        onLike={(id) => likeMutation.mutate(id)}
        onDelete={(id) => {
          if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            deleteMutation.mutate(id);
          }
        }}
        onEdit={(post) => setEditingPost(post)}
        onReport={(id) => {
          const reason = window.prompt("Raison du signalement :");
          if (reason) {
            reportMutation.mutate({ id, reason });
          }
        }}
      />

      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
