import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { updateProfileSchema } from './users.schema';

const router = Router();
const usersController = new UsersController();

router.get('/me', authenticate, (req, res) => usersController.getMe(req, res));
router.put('/me', authenticate, validate(updateProfileSchema), (req, res) =>
  usersController.updateProfile(req, res)
);
router.post('/me/avatar', authenticate, upload.single('avatar'), (req, res) =>
  usersController.updateAvatar(req, res)
);
router.post('/me/cover', authenticate, upload.single('cover'), (req, res) =>
  usersController.updateCover(req, res)
);
router.get('/search', (req, res) => usersController.searchUsers(req, res));
router.get('/:username', (req, res) => usersController.getUserByUsername(req, res));

export default router;
