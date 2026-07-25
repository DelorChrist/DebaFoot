import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      
      <div>
        <label className="block text-sm font-medium mb-1">Mot de passe</label>
        <Input 
          type="password" 
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
      </div>

      <Button type="submit" fullWidth shape="rounded" isLoading={loginMutation.isPending} className="mt-6">
        Se connecter
      </Button>
    </form>
  );
}
