import { Router } from 'express';
import { PostsController } from './posts.controller';
import { authenticate, optionalAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { createPostSchema, updatePostSchema, reportPostSchema } from './posts.schema';

const router = Router();
const postsController = new PostsController();

router.get('/', optionalAuth, (req, res) => postsController.getFeed(req, res));
router.get('/search', optionalAuth, (req, res) => postsController.searchPosts(req, res));
router.get('/user/:userId', optionalAuth, (req, res) => postsController.getUserPosts(req, res));
router.get('/:id', optionalAuth, (req, res) => postsController.getPost(req, res));

router.post(
  '/',
  authenticate,
  upload.single('image'),
  validate(createPostSchema),
  (req, res) => postsController.createPost(req, res)
);

router.put(
  '/:id',
  authenticate,
  upload.single('image'),
  validate(updatePostSchema),
  (req, res) => postsController.updatePost(req, res)
);

router.delete('/:id', authenticate, (req, res) => postsController.deletePost(req, res));
router.post('/:id/like', authenticate, (req, res) => postsController.toggleLike(req, res));
router.post('/:id/report', authenticate, validate(reportPostSchema), (req, res) =>
  postsController.reportPost(req, res)
);

export default router;
