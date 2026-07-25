import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../shared/ApiResponse';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const user = await authService.register(req.body);
    res.status(201).json(
      ApiResponse.success(
        'Compte créé avec succès. Vérifiez votre email pour activer votre compte.',
        user
      )
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    res.status(200).json(ApiResponse.success('Connexion réussie', result));
  }

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.status(200).json(ApiResponse.success('Déconnexion réussie'));
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    res.status(200).json(ApiResponse.success('Tokens rafraîchis', tokens));
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.status(200).json(ApiResponse.success(result.message));
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    await authService.forgotPassword(req.body.email);
    res
      .status(200)
      .json(
        ApiResponse.success(
          'Si cet email existe, vous recevrez un lien de réinitialisation.'
        )
      );
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json(ApiResponse.success('Mot de passe réinitialisé avec succès'));
  }
}
