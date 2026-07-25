import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layouts/MainLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { PostPage } from './pages/PostPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { useThemeInit } from './hooks/useTheme';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import api from './lib/axios';

export function App() {
  useThemeInit();
  const { accessToken, setAuth, logout } = useAuthStore();

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      if (accessToken) {
        try {
          const { data } = await api.get('/auth/me');
          // Update user info silently if needed
        } catch (error) {
          // Handled by axios interceptor if token is expired, 
          // but if completely invalid, log out
        }
      }
    };
    validateSession();
  }, [accessToken]);

  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-text-inverse)',
            },
          },
        }} 
      />
      
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected User Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<div className="p-4">Paramètres (En construction)</div>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<div className="p-4">Gestion des utilisateurs (En construction)</div>} />
          <Route path="reports" element={<div className="p-4">Gestion des signalements (En construction)</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-xl font-bold">404 - Page Introuvable</div>} />
      </Routes>
    </BrowserRouter>
  );
}
