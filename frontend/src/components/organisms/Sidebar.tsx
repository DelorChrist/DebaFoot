import { NavLink } from 'react-router-dom';
import { Home, Compass, Bell, User, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { cn } from '../../lib/utils';

export function Sidebar({ onLogout, onCreatePost }: { onLogout: () => void, onCreatePost?: () => void }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const navItems = [
    { icon: <Home size={24} />, label: 'Accueil', path: '/' },
    { icon: <Compass size={24} />, label: 'Découvrir', path: '/search' },
    { 
      icon: (
        <div className="relative">
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      ), 
      label: 'Notifications', 
      path: '/notifications' 
    },
    { icon: <User size={24} />, label: 'Profil', path: `/profile/${user?.username}` },
    { icon: <Settings size={24} />, label: 'Paramètres', path: '/settings' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ icon: <ShieldAlert size={24} />, label: 'Admin', path: '/admin' });
  }

  return (
    <aside className="sticky top-0 h-screen w-full flex flex-col pt-6 pb-6 pr-6">
      <div className="pl-4 mb-8">
        <Logo size="md" />
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition-all duration-200 group",
              isActive 
                ? "font-bold text-primary" 
                : "text-text-primary hover:bg-surface-2 hover:text-primary"
            )}
          >
            <div className="group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {onCreatePost && (
        <div className="mt-6 mb-8 px-4">
          <Button size="lg" shape="rounded" fullWidth onClick={onCreatePost} className="py-4">
            Débattre
          </Button>
        </div>
      )}

      <div className="mt-auto px-4">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-all duration-200 w-full"
        >
          <LogOut size={24} />
          <span>Déconnexion</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-surface-2 rounded-full border border-border">
          <Avatar size="sm" src={user?.profile?.avatarUrl} fallback={user?.profile?.displayName || user?.username} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate text-text-primary">{user?.profile?.displayName || user?.username}</p>
            <p className="text-xs text-text-muted truncate">@{user?.username}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
