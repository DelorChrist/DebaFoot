import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/auth.schema';
import { useForgotPassword } from '../hooks/useAuth';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import { Link } from 'react-router-dom';

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Mot de passe oublié ?</h1>
        <p className="text-sm text-text-muted mt-2">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input 
          type="email" 
          placeholder="votre@email.com"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
      </div>

      <Button type="submit" fullWidth isLoading={forgotPasswordMutation.isPending} className="mt-6">
        Envoyer le lien
      </Button>

      <div className="text-center mt-4">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
