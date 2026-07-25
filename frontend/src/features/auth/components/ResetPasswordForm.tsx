import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/auth.schema';
import { useResetPassword } from '../hooks/useAuth';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors }, setError } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (!token) {
      setError('root', { message: "Token manquant ou invalide" });
    }
  }, [token, setError]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    resetPasswordMutation.mutate({ password: data.password, token });
  };

  if (!token) {
    return (
      <div className="text-center p-4">
        <p className="text-error font-medium">Lien de réinitialisation invalide ou expiré.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Nouveau mot de passe</h1>
        <p className="text-sm text-text-muted mt-2">
          Choisissez un nouveau mot de passe sécurisé.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
        <Input 
          type="password" 
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
        <Input 
          type="password" 
          placeholder="••••••••"
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>}
      </div>

      <Button type="submit" fullWidth isLoading={resetPasswordMutation.isPending} className="mt-6">
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
