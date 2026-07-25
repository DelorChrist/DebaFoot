import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authenticate, requireAdmin);

router.get('/stats', (req, res) => adminController.getStats(req, res));
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));
router.get('/reports', (req, res) => adminController.getReports(req, res));
router.put('/reports/:id', (req, res) => adminController.updateReport(req, res));

export default router;
