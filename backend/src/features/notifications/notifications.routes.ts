import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const notificationsController = new NotificationsController();

router.get('/', authenticate, (req, res) => notificationsController.getNotifications(req, res));
router.put('/read-all', authenticate, (req, res) => notificationsController.markAllRead(req, res));
router.put('/:id/read', authenticate, (req, res) => notificationsController.markRead(req, res));

export default router;
