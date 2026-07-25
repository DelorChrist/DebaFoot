import { User } from '../../../types/auth.types';
import { Avatar } from '../../../components/atoms/Avatar';
import { Button } from '../../../components/atoms/Button';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { formatRelativeTime } from '../../../lib/utils';
import { useAuthStore } from '../../../stores/authStore';

interface ProfileHeaderProps {
  user: User;
  onEditProfile?: () => void;
  onUploadCover?: (file: File) => void;
  onUploadAvatar?: (file: File) => void;
}

export function ProfileHeader({ user, onEditProfile, onUploadCover, onUploadAvatar }: ProfileHeaderProps) {
  const currentUser = useAuthStore(state => state.user);
  const isOwner = currentUser?.id === user.id;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onUploadAvatar) {
      onUploadAvatar(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onUploadCover) {
      onUploadCover(e.target.files[0]);
    }
  };

  return (
    <div className="bg-surface border-b border-border mb-4">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 bg-surface-3 w-full overflow-hidden group">
        {user.profile?.coverUrl ? (
          <img 
            src={user.profile.coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-surface-3"></div>
        )}
        
        {isOwner && onUploadCover && (
          <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-md text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            Changer
            <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 pb-6 max-w-4xl mx-auto relative">
        <div className="flex justify-between items-start">
          <div className="relative -mt-16 sm:-mt-20 group">
            <Avatar 
              src={user.profile?.avatarUrl} 
              fallback={user.profile?.displayName || user.username}
              className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-surface text-4xl"
            />
            {isOwner && onUploadAvatar && (
              <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <span className="text-sm font-medium">Changer</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          
          <div className="mt-4">
            {isOwner && onEditProfile && (
              <Button variant="outline" shape="rounded" onClick={onEditProfile}>
                Éditer le profil
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-text-primary">
            {user.profile?.displayName || user.username}
          </h1>
          <p className="text-text-muted">@{user.username}</p>
        </div>

        {user.profile?.bio && (
          <div className="mt-4 text-text-primary whitespace-pre-wrap max-w-2xl">
            {user.profile.bio}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-sm text-text-secondary">
          {user.profile?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{user.profile.location}</span>
            </div>
          )}
          {user.profile?.website && (
            <div className="flex items-center gap-1.5">
              <LinkIcon size={16} />
              <a href={user.profile.website.startsWith('http') ? user.profile.website : `https://${user.profile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {user.profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>A rejoint {formatRelativeTime(user.createdAt || new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
