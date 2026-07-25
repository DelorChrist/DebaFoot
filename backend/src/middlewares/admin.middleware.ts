import { Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';
import { AuthRequest } from './auth.middleware';

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(AppError.unauthorized());
  }
  if (req.user.role !== 'ADMIN') {
    return next(AppError.forbidden('Accès réservé aux administrateurs'));
  }
  next();
};
