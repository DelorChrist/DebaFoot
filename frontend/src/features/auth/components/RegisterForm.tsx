import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useAuth';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pseudo</label>
        <Input 
          type="text" 
          placeholder="johndoe"
          error={!!errors.username}
          {...register('username')}
        />
        {errors.username && <span className="text-error text-sm mt-1">{errors.username.message}</span>}
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

      <div>
        <label className="block text-sm font-medium mb-1">Confirmer mot de passe</label>
        <Input 
          type="password" 
          placeholder="••••••••"
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>}
      </div>

      <Button type="submit" fullWidth shape="rounded" isLoading={registerMutation.isPending} className="mt-6">
        Créer mon compte
      </Button>
    </form>
  );
}
