import { Outlet, Navigate, Link } from 'react-router-dom';
import { Users, FileText, AlertTriangle, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Logo } from '../atoms/Logo';
import { cn } from '../../lib/utils';

export function AdminLayout() {
  const { user } = useAuthStore();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Utilisateurs', path: '/admin/users' },
    { icon: <AlertTriangle size={20} />, label: 'Signalements', path: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border shrink-0 md:h-screen md:sticky top-0 flex flex-col">
        <div className="p-6">
          <Logo size="sm" />
          <div className="mt-2 text-xs font-bold text-error tracking-wider uppercase">Panel Admin</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-x-auto md:overflow-y-auto flex md:flex-col pb-4 md:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={({ isActive }: any) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-surface-2">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
