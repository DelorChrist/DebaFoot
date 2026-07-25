import { Router } from 'express';
import { CommentsController } from './comments.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCommentSchema, updateCommentSchema } from './comments.schema';

const router = Router({ mergeParams: true });
const commentsController = new CommentsController();

router.get('/', (req, res) => commentsController.getComments(req, res));
router.get('/:commentId/replies', (req, res) => commentsController.getReplies(req, res));
router.post('/', authenticate, validate(createCommentSchema), (req, res) =>
  commentsController.createComment(req, res)
);
router.put('/:id', authenticate, validate(updateCommentSchema), (req, res) =>
  commentsController.updateComment(req, res)
);
router.delete('/:id', authenticate, (req, res) => commentsController.deleteComment(req, res));

export default router;
