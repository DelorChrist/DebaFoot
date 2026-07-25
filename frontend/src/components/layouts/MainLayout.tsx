import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from '../organisms/Sidebar';
import { Navbar } from '../organisms/Navbar';
import { TrendingTopics } from '../organisms/TrendingTopics';
import { useAuthStore } from '../../stores/authStore';
import { useSocket } from '../../hooks/useSocket';
import { CreatePostModal } from '../organisms/CreatePostModal';
import { useCreatePost } from '../../features/posts/hooks/useCreatePost';

export function MainLayout() {
  const { isAuthenticated, logout } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createPostMutation = useCreatePost();
  
  // Initialize socket connection
  useSocket();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCreatePost = async (content: string, image: File | null) => {
    await createPostMutation.mutateAsync({ content, image });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar onCreatePost={() => setIsCreateModalOpen(true)} />
      
      <div className="page grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px] gap-6 pb-20 lg:pb-0">
        
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden lg:block sticky top-0 h-screen overflow-y-auto no-scrollbar border-r border-border">
          <Sidebar 
            onLogout={logout} 
            onCreatePost={() => setIsCreateModalOpen(true)} 
          />
        </div>

        {/* Main Content Area */}
        <main className="w-full max-w-[680px] mx-auto lg:mx-0 min-h-screen border-x-0 lg:border-x border-border pt-4 px-0 lg:px-6">
          <Outlet />
        </main>

        {/* Right Sidebar (XL Desktop only) */}
        <div className="hidden xl:block sticky top-0 h-screen overflow-y-auto no-scrollbar pt-6">
          <TrendingTopics />
          
          <footer className="mt-6 text-xs text-text-muted text-center p-4">
            <p>&copy; 2026 DebaFoot.</p>
            <div className="flex justify-center gap-3 mt-2">
              <a href="#" className="hover:text-primary transition-colors">Conditions</a>
              <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            </div>
          </footer>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        isLoading={createPostMutation.isPending}
      />
    </div>
  );
}
