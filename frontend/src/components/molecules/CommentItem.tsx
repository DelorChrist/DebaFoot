import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Edit, MessageCircle } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { Comment } from '../../types/comment.types';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { useAuthStore } from '../../stores/authStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: string) => void;
  onEdit?: (comment: Comment) => void;
  onReply?: (commentId: string, username: string) => void;
  isReply?: boolean;
}

export function CommentItem({ comment, onDelete, onEdit, onReply, isReply = false }: CommentItemProps) {
  const { user } = useAuthStore();
  const isOwner = user?.id === comment.author.id;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-8 mt-2' : 'mt-4'}`}>
      <Link to={`/profile/${comment.author.username}`} className="shrink-0">
        <Avatar
          size={isReply ? 'sm' : 'md'}
          src={comment.author.profile?.avatarUrl}
          fallback={comment.author.profile?.displayName || comment.author.username}
        />
      </Link>
      
      <div className="flex-1">
        <div className="bg-surface-2 p-3 rounded-lg rounded-tl-none border border-border">
          <div className="flex justify-between items-start mb-1">
            <Link to={`/profile/${comment.author.username}`} className="flex items-center gap-2 group">
              <span className="font-medium text-sm text-text-primary group-hover:text-primary transition-colors">
                {comment.author.profile?.displayName || comment.author.username}
              </span>
              <span className="text-xs text-text-muted">{formatRelativeTime(comment.createdAt)}</span>
            </Link>

            {(isOwner || isAdmin) && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="text-text-muted hover:text-text-primary">
                    <MoreHorizontal size={14} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-surface border border-border rounded shadow-lg p-1 min-w-[120px] z-50">
                    {isOwner && onEdit && (
                      <DropdownMenu.Item
                        className="flex items-center gap-2 p-2 text-xs text-text-primary hover:bg-surface-3 rounded cursor-pointer outline-none"
                        onClick={() => onEdit(comment)}
                      >
                        <Edit size={14} /> Modifier
                      </DropdownMenu.Item>
                    )}
                    {(isOwner || isAdmin) && onDelete && (
                      <DropdownMenu.Item
                        className="flex items-center gap-2 p-2 text-xs text-error hover:bg-error/10 rounded cursor-pointer outline-none"
                        onClick={() => onDelete(comment.id)}
                      >
                        <Trash2 size={14} /> Supprimer
                      </DropdownMenu.Item>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
          
          <p className="text-sm text-text-primary whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2">
          {!isReply && onReply && (
            <button 
              onClick={() => onReply(comment.id, comment.author.username)}
              className="text-xs font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <MessageCircle size={12} /> Répondre
            </button>
          )}
          {comment._count?.replies > 0 && !isReply && (
            <span className="text-xs text-text-muted">
              {comment._count.replies} {comment._count.replies > 1 ? 'réponses' : 'réponse'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
