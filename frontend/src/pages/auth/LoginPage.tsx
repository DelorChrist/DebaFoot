import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <>
      <LoginForm />

      <div className="mt-5 text-center">
        <Link to="/forgot-password" className="text-sm text-text-muted hover:text-primary transition-colors">
          Mot de passe oublié ?
        </Link>
      </div>
    </>
  );
}
