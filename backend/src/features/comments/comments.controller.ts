import { Response } from 'express';
import { CommentsService } from './comments.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const commentsService = new CommentsService();

export class CommentsController {
  async getComments(req: AuthRequest, res: Response): Promise<void> {
    const comments = await commentsService.getComments(req.params.postId);
    res.json(ApiResponse.success('Commentaires récupérés', comments));
  }

  async getReplies(req: AuthRequest, res: Response): Promise<void> {
    const replies = await commentsService.getReplies(req.params.commentId);
    res.json(ApiResponse.success('Réponses récupérées', replies));
  }

  async createComment(req: AuthRequest, res: Response): Promise<void> {
    const { content, parentId } = req.body;
    const comment = await commentsService.createComment(
      req.params.postId,
      req.user!.id,
      content,
      parentId
    );
    res.status(201).json(ApiResponse.success('Commentaire créé', comment));
  }

  async updateComment(req: AuthRequest, res: Response): Promise<void> {
    const comment = await commentsService.updateComment(
      req.params.id,
      req.user!.id,
      req.body.content
    );
    res.json(ApiResponse.success('Commentaire modifié', comment));
  }

  async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    await commentsService.deleteComment(req.params.id, req.user!.id, req.user!.role);
    res.json(ApiResponse.success('Commentaire supprimé'));
  }
}
