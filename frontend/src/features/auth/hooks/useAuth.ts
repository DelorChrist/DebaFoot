import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../../../stores/authStore';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Connexion réussie');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la connexion');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data: any) => {
      toast.success(data.message || 'Lien de réinitialisation envoyé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) => 
      authApi.resetPassword(password, token),
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur');
    },
  });
}
