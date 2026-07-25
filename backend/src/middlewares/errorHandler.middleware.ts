import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';
import { ApiResponse } from '../shared/ApiResponse';
import { env } from '../config/env';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json(ApiResponse.error(error.message));
    return;
  }

  // Prisma errors
  if (error.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] ?? 'champ';
      res.status(409).json(ApiResponse.error(`Ce ${field} est déjà utilisé`));
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json(ApiResponse.error('Ressource introuvable'));
      return;
    }
  }

  // Generic error
  const message =
    env.NODE_ENV === 'development' ? error.message : 'Une erreur interne est survenue';

  res.status(500).json(ApiResponse.error(message));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(ApiResponse.error(`Route ${req.method} ${req.path} introuvable`));
};
