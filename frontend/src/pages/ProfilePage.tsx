import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useProfile, useUploadAvatar, useUploadCover, useUpdateProfile } from '../features/profile/hooks/useProfile';
import { useUserPosts } from '../features/posts/hooks/usePosts';
import { ProfileHeader } from '../features/profile/components/ProfileHeader';
import { EditProfileModal } from '../features/profile/components/EditProfileModal';
import { PostFeed } from '../components/organisms/PostFeed';
import { Spinner } from '../components/atoms/Spinner';
import { useAuthStore } from '../stores/authStore';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const { data: profileUser, isLoading: isLoadingProfile } = useProfile(username!);
  
  const { 
    data: postsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: isLoadingPosts 
  } = useUserPosts(profileUser?.id || '');

  const uploadAvatarMutation = useUploadAvatar();
  const uploadCoverMutation = useUploadCover();
  const updateProfileMutation = useUpdateProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const posts = useMemo(() => {
    return postsData?.pages.flatMap((page) => page.items) || [];
  }, [postsData]);

  if (isLoadingProfile) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  if (!profileUser) {
    return <div className="p-12 text-center text-text-muted">Utilisateur introuvable.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <div className="sticky top-0 z-10 glass border-b border-border p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold leading-tight">{profileUser.profile?.displayName || profileUser.username}</h1>
          <p className="text-xs text-text-muted">{posts.length} posts</p>
        </div>
      </div>

      <ProfileHeader 
        user={profileUser}
        onEditProfile={() => setIsEditModalOpen(true)}
        onUploadAvatar={(file) => uploadAvatarMutation.mutate(file)}
        onUploadCover={(file) => uploadCoverMutation.mutate(file)}
      />

      <div className="mt-2">
        <div className="border-b border-border">
          <div className="flex w-full">
            <button className="flex-1 py-4 font-bold text-primary border-b-2 border-primary">
              Posts
            </button>
            <button className="flex-1 py-4 font-medium text-text-muted hover:text-text-primary transition-colors cursor-not-allowed opacity-50">
              Réponses
            </button>
            <button className="flex-1 py-4 font-medium text-text-muted hover:text-text-primary transition-colors cursor-not-allowed opacity-50">
              Médias
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-0 sm:mt-4">
          <PostFeed
            posts={posts}
            isLoading={isLoadingPosts || isFetchingNextPage}
            hasMore={!!hasNextPage}
            onLoadMore={fetchNextPage}
            emptyMessage={`@${profileUser.username} n'a pas encore publié de post.`}
          />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profileUser.profile}
        username={profileUser.username}
        onSubmit={async (data) => {
          await updateProfileMutation.mutateAsync(data);
        }}
        isLoading={updateProfileMutation.isPending}
      />
    </div>
  );
}
