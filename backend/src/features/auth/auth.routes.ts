import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from './auth.schema';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 */
router.post('/register', authLimiter, validate(registerSchema), (req, res) =>
  authController.register(req, res)
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion
 *     tags: [Auth]
 */
router.post('/login', authLimiter, validate(loginSchema), (req, res) =>
  authController.login(req, res)
);

router.post('/logout', (req, res) => authController.logout(req, res));

router.post('/refresh', validate(refreshTokenSchema), (req, res) =>
  authController.refresh(req, res)
);

router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), (req, res) =>
  authController.forgotPassword(req, res)
);

router.post('/reset-password', validate(resetPasswordSchema), (req, res) =>
  authController.resetPassword(req, res)
);

export default router;
