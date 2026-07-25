import { Response } from 'express';
import { AdminService } from './admin.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const adminService = new AdminService();

export class AdminController {
  async getStats(req: AuthRequest, res: Response): Promise<void> {
    const stats = await adminService.getStats();
    res.json(ApiResponse.success('Statistiques récupérées', stats));
  }

  async getUsers(req: AuthRequest, res: Response): Promise<void> {
    const { page, limit, search } = req.query as { page?: string; limit?: string; search?: string };
    const result = await adminService.getUsers(Number(page) || 1, Number(limit) || 20, search);
    res.json(ApiResponse.success('Utilisateurs récupérés', result));
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    await adminService.deleteUser(req.params.id);
    res.json(ApiResponse.success('Utilisateur supprimé'));
  }

  async getReports(req: AuthRequest, res: Response): Promise<void> {
    const { page, limit, status } = req.query as { page?: string; limit?: string; status?: string };
    const result = await adminService.getReports(Number(page) || 1, Number(limit) || 20, status);
    res.json(ApiResponse.success('Signalements récupérés', result));
  }

  async updateReport(req: AuthRequest, res: Response): Promise<void> {
    const report = await adminService.updateReport(req.params.id, req.body.status);
    res.json(ApiResponse.success('Signalement mis à jour', report));
  }
}
