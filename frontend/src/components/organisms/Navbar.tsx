import { NavLink } from 'react-router-dom';
import { Home, Compass, Bell, User, PlusSquare } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Logo } from '../atoms/Logo';
import { cn } from '../../lib/utils';

export function Navbar({ onCreatePost }: { onCreatePost?: () => void }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const navItems = [
    { icon: <Home size={24} />, path: '/' },
    { icon: <Compass size={24} />, path: '/search' },
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
      path: '/notifications' 
    },
    { icon: <User size={24} />, path: `/profile/${user?.username}` },
  ];

  return (
    <>
      {/* Top Navbar for Mobile */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border lg:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <button 
              onClick={onCreatePost}
              className="text-primary hover:text-primary-hover transition-colors"
            >
              <PlusSquare size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navbar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border pb-safe lg:hidden">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full text-text-muted transition-colors",
                isActive && "text-primary"
              )}
            >
              {item.icon}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
