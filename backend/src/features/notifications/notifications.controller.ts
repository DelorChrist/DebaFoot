import { Response } from 'express';
import { NotificationsService } from './notifications.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const notificationsService = new NotificationsService();

export class NotificationsController {
  async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    const result = await notificationsService.getNotifications(req.user!.id);
    res.json(ApiResponse.success('Notifications récupérées', result));
  }

  async markAllRead(req: AuthRequest, res: Response): Promise<void> {
    await notificationsService.markAllRead(req.user!.id);
    res.json(ApiResponse.success('Toutes les notifications marquées comme lues'));
  }

  async markRead(req: AuthRequest, res: Response): Promise<void> {
    await notificationsService.markRead(req.params.id, req.user!.id);
    res.json(ApiResponse.success('Notification marquée comme lue'));
  }
}
