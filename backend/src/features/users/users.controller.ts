import { Response } from 'express';
import { UsersService } from './users.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const usersService = new UsersService();

export class UsersController {
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    const user = await usersService.getMe(req.user!.id);
    res.json(ApiResponse.success('Profil récupéré', user));
  }

  async getUserByUsername(req: AuthRequest, res: Response): Promise<void> {
    const user = await usersService.getUserByUsername(req.params.username);
    res.json(ApiResponse.success('Profil récupéré', user));
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    const profile = await usersService.updateProfile(req.user!.id, req.body);
    res.json(ApiResponse.success('Profil mis à jour', profile));
  }

  async updateAvatar(req: AuthRequest, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json(ApiResponse.error('Aucun fichier fourni'));
      return;
    }
    const result = await usersService.updateAvatar(req.user!.id, req.file.buffer);
    res.json(ApiResponse.success('Avatar mis à jour', result));
  }

  async updateCover(req: AuthRequest, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json(ApiResponse.error('Aucun fichier fourni'));
      return;
    }
    const result = await usersService.updateCover(req.user!.id, req.file.buffer);
    res.json(ApiResponse.success('Photo de couverture mise à jour', result));
  }

  async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    const { q } = req.query as { q: string };
    const users = await usersService.searchUsers(q);
    res.json(ApiResponse.success('Utilisateurs trouvés', users));
  }
}
