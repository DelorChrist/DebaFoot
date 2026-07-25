import { Link } from 'react-router-dom';
import { Heart, MessageSquare, AtSign, Reply } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { Notification } from '../../types/notification.types';
import { Avatar } from '../atoms/Avatar';
import { cn } from '../../lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'LIKE': return <Heart size={16} className="text-error fill-error" />;
      case 'COMMENT': return <MessageSquare size={16} className="text-primary" />;
      case 'MENTION': return <AtSign size={16} className="text-info" />;
      case 'REPLY': return <Reply size={16} className="text-warning" />;
      default: return null;
    }
  };

  const getMessage = () => {
    const actorName = notification.actor.profile?.displayName || notification.actor.username;
    switch (notification.type) {
      case 'LIKE': return <span><span className="font-semibold text-text-primary">{actorName}</span> a aimé votre post.</span>;
      case 'COMMENT': return <span><span className="font-semibold text-text-primary">{actorName}</span> a commenté votre post.</span>;
      case 'MENTION': return <span><span className="font-semibold text-text-primary">{actorName}</span> vous a mentionné.</span>;
      case 'REPLY': return <span><span className="font-semibold text-text-primary">{actorName}</span> a répondu à votre commentaire.</span>;
      default: return null;
    }
  };

  const linkTarget = notification.postId ? `/post/${notification.postId}` : `/profile/${notification.actor.username}`;

  return (
    <Link 
      to={linkTarget} 
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 border-b border-border transition-colors hover:bg-surface-2 block",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="relative">
        <Avatar
          src={notification.actor.profile?.avatarUrl}
          fallback={notification.actor.profile?.displayName || notification.actor.username}
        />
        <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-1 border border-border">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-text-secondary">{getMessage()}</p>
        {notification.post?.content && (
          <p className="text-sm text-text-muted mt-1 truncate max-w-full">
            "{notification.post.content}"
          </p>
        )}
        <span className="text-xs text-text-muted mt-1 block">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
      )}
    </Link>
  );
}
