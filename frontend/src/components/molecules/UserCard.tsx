import { Link } from 'react-router-dom';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    profile?: {
      displayName?: string | null;
      avatarUrl?: string | null;
      bio?: string | null;
    };
  };
  actionLabel?: string;
  onAction?: (userId: string) => void;
}

export function UserCard({ user, actionLabel, onAction }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={user.profile?.avatarUrl}
          fallback={user.profile?.displayName || user.username}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-primary truncate">
            {user.profile?.displayName || user.username}
          </h4>
          <p className="text-sm text-text-muted truncate">@{user.username}</p>
          {user.profile?.bio && (
            <p className="text-xs text-text-secondary mt-1 truncate">
              {user.profile.bio}
            </p>
          )}
        </div>
      </Link>
      
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            onAction(user.id);
          }}
          className="shrink-0 ml-3"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
