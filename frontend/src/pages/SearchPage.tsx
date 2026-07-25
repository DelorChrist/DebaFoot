import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { SearchBar } from '../components/molecules/SearchBar';
import { useSearchUsers } from '../features/profile/hooks/useProfile';
import { postsApi } from '../features/posts/api/posts.api';
import { useQuery } from '@tanstack/react-query';
import { UserCard } from '../components/molecules/UserCard';
import { PostCard } from '../components/molecules/PostCard';
import { Spinner } from '../components/atoms/Spinner';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');

  const { data: users, isLoading: isLoadingUsers } = useSearchUsers(query);
  
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['search', 'posts', query],
    queryFn: () => postsApi.searchPosts(query),
    enabled: query.length > 2 && activeTab === 'posts',
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="py-4 min-h-screen">
      <div className="sticky top-0 z-10 glass pb-4 px-4 sm:px-0">
        <SearchBar 
          initialValue={query} 
          onSearch={handleSearch} 
          placeholder="Rechercher des posts, des utilisateurs..."
        />
        
        {query && (
          <div className="flex w-full mt-4 border-b border-border">
            <button 
              className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('posts')}
            >
              Débats
            </button>
            <button 
              className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('users')}
            >
              Comptes
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 px-4 sm:px-0">
        {!query ? (
          <div className="text-center p-12 text-text-muted">
            <SearchIcon className="mx-auto mb-4 opacity-50" size={48} />
            Entrez un terme de recherche pour commencer.
          </div>
        ) : query.length < 3 ? (
          <div className="text-center p-12 text-text-muted">
            Veuillez entrer au moins 3 caractères.
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'users' && (
              isLoadingUsers ? <div className="flex justify-center p-4"><Spinner /></div> :
              users?.length === 0 ? <p className="text-center text-text-muted p-8">Aucun utilisateur trouvé.</p> :
              <div className="grid gap-3">
                {users?.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}

            {activeTab === 'posts' && (
              isLoadingPosts ? <div className="flex justify-center p-4"><Spinner /></div> :
              postsData?.items.length === 0 ? <p className="text-center text-text-muted p-8">Aucun débat trouvé.</p> :
              <div className="grid gap-4">
                {postsData?.items.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Just for the empty state
function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
