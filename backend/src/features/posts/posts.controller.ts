import { Response } from 'express';
import { PostsService } from './posts.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { AuthRequest } from '../../middlewares/auth.middleware';

const postsService = new PostsService();

export class PostsController {
  async getFeed(req: AuthRequest, res: Response): Promise<void> {
    const { cursor, limit } = req.query as { cursor?: string; limit?: string };
    const result = await postsService.getFeed(cursor, Number(limit) || 10, req.user?.id);
    res.json(ApiResponse.success('Feed récupéré', result));
  }

  async getUserPosts(req: AuthRequest, res: Response): Promise<void> {
    const { userId } = req.params;
    const { cursor, limit } = req.query as { cursor?: string; limit?: string };
    const result = await postsService.getUserPosts(userId, cursor, Number(limit) || 10);
    res.json(ApiResponse.success('Posts utilisateur récupérés', result));
  }

  async getPost(req: AuthRequest, res: Response): Promise<void> {
    const post = await postsService.getPostById(req.params.id, req.user?.id);
    res.json(ApiResponse.success('Post récupéré', post));
  }

  async createPost(req: AuthRequest, res: Response): Promise<void> {
    const { content } = req.body;
    const imageBuffer = req.file?.buffer;
    const post = await postsService.createPost(content, req.user!.id, imageBuffer);
    res.status(201).json(ApiResponse.success('Post créé avec succès', post));
  }

  async updatePost(req: AuthRequest, res: Response): Promise<void> {
    const { content } = req.body;
    const imageBuffer = req.file?.buffer;
    const post = await postsService.updatePost(req.params.id, req.user!.id, content, imageBuffer);
    res.json(ApiResponse.success('Post modifié avec succès', post));
  }

  async deletePost(req: AuthRequest, res: Response): Promise<void> {
    await postsService.deletePost(req.params.id, req.user!.id, req.user!.role);
    res.json(ApiResponse.success('Post supprimé avec succès'));
  }

  async toggleLike(req: AuthRequest, res: Response): Promise<void> {
    const result = await postsService.toggleLike(req.params.id, req.user!.id);
    res.json(ApiResponse.success(result.liked ? 'Post liké' : 'Like retiré', result));
  }

  async reportPost(req: AuthRequest, res: Response): Promise<void> {
    await postsService.reportPost(req.params.id, req.user!.id, req.body.reason);
    res.json(ApiResponse.success('Post signalé'));
  }

  async searchPosts(req: AuthRequest, res: Response): Promise<void> {
    const { q, cursor, limit } = req.query as { q?: string; cursor?: string; limit?: string };
    if (!q) {
      res.json(ApiResponse.success('Résultats', { items: [], nextCursor: null, hasMore: false }));
      return;
    }
    const result = await postsService.searchPosts(q, cursor, Number(limit) || 10);
    res.json(ApiResponse.success('Résultats de recherche', result));
  }
}
