import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiResponse } from '../shared/ApiResponse';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.slice(1).join('.'),
          message: e.message,
        }));
        res.status(400).json(
          ApiResponse.error(`Erreur de validation: ${errors.map((e) => e.message).join(', ')}`)
        );
      } else {
        next(error);
      }
    }
  };
