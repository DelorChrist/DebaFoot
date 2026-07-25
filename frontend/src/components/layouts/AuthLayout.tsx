import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Logo } from '../atoms/Logo';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="bg-surface border border-border shadow-2xl shadow-black/5 rounded-[24px] p-6 sm:p-8">
          
          <div className="flex flex-col items-center mb-6">
            <Logo size="lg" />
            <p className="text-text-muted mt-3 text-sm text-center">
              Le réseau des passionnés de football
            </p>
          </div>

          {isAuthPage && (
            <>
              <Button 
                variant="outline" 
                fullWidth 
                shape="rounded"
                className="bg-transparent border-border text-text-primary hover:bg-surface-2 h-12"
                onClick={() => alert("Connexion Google bientôt disponible !")}
              >
                <div className="flex items-center justify-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.82 14.07H2.15V16.92C3.96 20.52 7.69 23 12 23Z" fill="#34A853"/>
                    <path d="M5.82 14.07C5.59 13.39 5.46 12.7 5.46 12C5.46 11.3 5.59 10.61 5.82 9.93V7.08H2.15C1.41 8.56 1 10.23 1 12C1 13.77 1.41 15.44 2.15 16.92L5.82 14.07Z" fill="#FBBC05"/>
                    <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7.01L19.36 3.86C17.45 2.07 14.96 1 12 1C7.69 1 3.96 3.48 2.15 7.08L5.82 9.93C6.7 7.3 9.13 5.36 12 5.36Z" fill="#EA4335"/>
                  </svg>
                  <span className="font-medium">Continuer avec Google</span>
                </div>
              </Button>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">OU</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Segmented Control */}
              <div className="flex bg-surface-2 p-1 rounded-xl mb-6">
                <Link
                  to="/login"
                  className={cn(
                    "flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                    isLogin ? "bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "flex-1 text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                    !isLogin ? "bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  Inscription
                </Link>
              </div>
            </>
          )}

          <Outlet />

        </div>
      </div>
    </div>
  );
}
