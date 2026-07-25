import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { usePost, useDeletePost, useReportPost } from '../features/posts/hooks/usePosts';
import { useLike } from '../features/posts/hooks/useLike';
import { usePostComments, useCreateComment, useDeleteComment, useUpdateComment } from '../features/comments/hooks/useComments';
import { PostCard } from '../components/molecules/PostCard';
import { CommentList } from '../components/organisms/CommentList';
import { Spinner } from '../components/atoms/Spinner';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { EditPostModal } from '../components/organisms/EditPostModal';
import { useUpdatePost } from '../features/posts/hooks/useCreatePost';
import { Post } from '../types/post.types';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Avatar } from '../components/atoms/Avatar';
import { useAuthStore } from '../stores/authStore';

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { data: post, isLoading: isLoadingPost } = usePost(id!);
  const { data: commentsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingComments } = usePostComments(id!);
  
  const likeMutation = useLike();
  const deletePostMutation = useDeletePost();
  const reportMutation = useReportPost();
  const updatePostMutation = useUpdatePost();
  
  const createCommentMutation = useCreateComment();
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const comments = useMemo(() => {
    return commentsData?.pages.flatMap((page) => page.items) || [];
  }, [commentsData]);

  const { observerTarget } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const handlePostEdit = async (postId: string, content: string, image: File | null) => {
    await updatePostMutation.mutateAsync({ id: postId, content, image });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    
    createCommentMutation.mutate({
      postId: id,
      content: newComment,
      parentId: replyingTo?.id
    }, {
      onSuccess: () => {
        setNewComment('');
        setReplyingTo(null);
      }
    });
  };

  if (isLoadingPost) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  if (!post) {
    return <div className="p-12 text-center text-text-muted">Post introuvable.</div>;
  }

  return (
    <div className="py-4 flex flex-col h-full max-h-screen">
      <div className="sticky top-0 z-10 glass border-b border-border p-4 mb-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Débat</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <PostCard
          post={post}
          onLike={(postId) => likeMutation.mutate(postId)}
          onDelete={(postId) => {
            if (window.confirm("Supprimer ce post ?")) {
              deletePostMutation.mutate(postId, {
                onSuccess: () => navigate('/')
              });
            }
          }}
          onEdit={(p) => setEditingPost(p)}
          onReport={(postId) => {
            const reason = window.prompt("Raison du signalement :");
            if (reason) reportMutation.mutate({ id: postId, reason });
          }}
        />

        <div className="mt-6 border-t border-border pt-4">
          <h2 className="text-lg font-semibold px-2 mb-4">Commentaires ({post._count?.comments || 0})</h2>
          
          {isLoadingComments ? (
            <div className="flex justify-center p-4"><Spinner size="sm" /></div>
          ) : (
            <CommentList
              comments={comments}
              onDelete={(commentId) => {
                if(window.confirm("Supprimer ce commentaire ?")) {
                  deleteCommentMutation.mutate(commentId);
                }
              }}
              onEdit={(comment) => {
                const newContent = window.prompt("Modifier :", comment.content);
                if (newContent && newContent !== comment.content) {
                  updateCommentMutation.mutate({ id: comment.id, content: newContent });
                }
              }}
              onReply={(commentId, username) => setReplyingTo({ id: commentId, username })}
            />
          )}
          <div ref={observerTarget} className="h-4"></div>
        </div>
      </div>

      {/* Sticky comment input at bottom */}
      <div className="fixed bottom-[56px] lg:bottom-0 left-0 lg:left-[280px] right-0 xl:right-[320px] glass border-t border-border p-4 z-20">
        {replyingTo && (
          <div className="flex items-center justify-between bg-surface-2 px-3 py-1.5 rounded-t-lg border border-border border-b-0 text-sm">
            <span className="text-text-secondary">En réponse à <span className="font-semibold text-primary">@{replyingTo.username}</span></span>
            <button onClick={() => setReplyingTo(null)} className="text-text-muted hover:text-text-primary">✕</button>
          </div>
        )}
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <Avatar src={user?.profile?.avatarUrl} size="sm" className="hidden sm:block" />
          <Input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez un commentaire..."
            className={`flex-1 ${replyingTo ? 'rounded-tl-none rounded-tr-none' : 'rounded-full'}`}
          />
          <Button 
            type="submit" 
            size="icon" 
            shape="rounded"
            disabled={!newComment.trim() || createCommentMutation.isPending}
            isLoading={createCommentMutation.isPending}
            className="shrink-0"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>

      <EditPostModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSubmit={handlePostEdit}
        isLoading={updatePostMutation.isPending}
      />
    </div>
  );
}
