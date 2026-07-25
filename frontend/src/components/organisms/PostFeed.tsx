import { Post } from '../../types/post.types';
import { PostCard } from '../molecules/PostCard';
import { Spinner } from '../atoms/Spinner';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface PostFeedProps {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
  onReport?: (id: string) => void;
  emptyMessage?: string;
}

export function PostFeed({
  posts,
  isLoading,
  hasMore,
  onLoadMore,
  onLike,
  onDelete,
  onEdit,
  onReport,
  emptyMessage = "Aucun post pour le moment.",
}: PostFeedProps) {
  const { observerTarget } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
  });

  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-2 rounded-lg border border-border">
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onDelete={onDelete}
          onEdit={onEdit}
          onReport={onReport}
        />
      ))}

      <div ref={observerTarget} className="flex justify-center p-4">
        {isLoading && hasMore && <Spinner />}
      </div>
    </div>
  );
}
