import { Link } from 'react-router-dom';
import { Heart, MessageSquare, MoreHorizontal, Flag, Trash2, Edit } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { Post } from '../../types/post.types';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { useAuthStore } from '../../stores/authStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
  onReport?: (id: string) => void;
}

export function PostCard({ post, onLike, onDelete, onEdit, onReport }: PostCardProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === post.author.id;
  const isAdmin = user?.role === 'ADMIN';
  const hasLiked = post.likes?.some(like => like.id !== undefined) || false; // Simple check based on data structure

  return (
    <div className="card glass-card p-4 hover:border-primary/30 transition-smooth">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3 group">
          <Avatar
            src={post.author.profile?.avatarUrl}
            fallback={post.author.profile?.displayName || post.author.username}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                {post.author.profile?.displayName || post.author.username}
              </span>
              <span className="text-sm text-text-muted">@{post.author.username}</span>
            </div>
            <span className="text-xs text-text-secondary">{formatRelativeTime(post.createdAt)}</span>
          </div>
        </Link>

        {(isOwner || isAdmin || onReport) && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-primary rounded-full">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface-2 border border-border rounded-lg shadow-xl p-1 min-w-[150px] z-50">
                {isOwner && onEdit && (
                  <DropdownMenu.Item
                    className="flex items-center gap-2 p-2 text-sm text-text-primary hover:bg-surface-3 rounded cursor-pointer outline-none"
                    onClick={() => onEdit(post)}
                  >
                    <Edit size={16} /> Modifier
                  </DropdownMenu.Item>
                )}
                {(isOwner || isAdmin) && onDelete && (
                  <DropdownMenu.Item
                    className="flex items-center gap-2 p-2 text-sm text-error hover:bg-error/10 rounded cursor-pointer outline-none"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 size={16} /> Supprimer
                  </DropdownMenu.Item>
                )}
                {!isOwner && onReport && (
                  <DropdownMenu.Item
                    className="flex items-center gap-2 p-2 text-sm text-warning hover:bg-warning/10 rounded cursor-pointer outline-none"
                    onClick={() => onReport(post.id)}
                  >
                    <Flag size={16} /> Signaler
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      <div className="mb-3">
        <p className="post-content whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border">
            <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border-light">
        <button
          onClick={() => onLike?.(post.id)}
          className={`flex items-center gap-2 text-sm transition-colors ${
            hasLiked ? 'text-primary' : 'text-text-secondary hover:text-primary'
          }`}
        >
          <Heart size={18} className={hasLiked ? 'fill-primary' : ''} />
          <span>{post._count?.likes || 0}</span>
        </button>
        
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
        >
          <MessageSquare size={18} />
          <span>{post._count?.comments || 0}</span>
        </Link>
      </div>
    </div>
  );
}
