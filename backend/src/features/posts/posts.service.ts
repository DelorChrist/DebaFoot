import { PostsRepository } from './posts.repository';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { AppError } from '../../shared/AppError';
import { uploadToCloudinary } from '../../middlewares/upload.middleware';

const postsRepository = new PostsRepository();
const notificationsRepository = new NotificationsRepository();

export class PostsService {
  async getFeed(cursor?: string, limit = 10, userId?: string) {
    return postsRepository.findMany(cursor, limit, userId);
  }

  async getUserPosts(authorId: string, cursor?: string, limit = 10) {
    return postsRepository.findByUserId(authorId, cursor, limit);
  }

  async getPostById(id: string, userId?: string) {
    const post = await postsRepository.findById(id, userId);
    if (!post) throw AppError.notFound('Post introuvable');
    return post;
  }

  async createPost(
    content: string,
    authorId: string,
    imageBuffer?: Buffer
  ) {
    let imageUrl: string | undefined;
    if (imageBuffer) {
      const result = await uploadToCloudinary(imageBuffer, 'posts', {
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      });
      imageUrl = result.url;
    }

    return postsRepository.create({ content, imageUrl, authorId });
  }

  async updatePost(id: string, userId: string, content: string, imageBuffer?: Buffer) {
    const post = await postsRepository.findOwner(id);
    if (!post) throw AppError.notFound('Post introuvable');
    if (post.authorId !== userId) throw AppError.forbidden('Vous ne pouvez pas modifier ce post');

    let imageUrl: string | undefined;
    if (imageBuffer) {
      const result = await uploadToCloudinary(imageBuffer, 'posts');
      imageUrl = result.url;
    }

    return postsRepository.update(id, { content, ...(imageUrl && { imageUrl }) });
  }

  async deletePost(id: string, userId: string, userRole: string) {
    const post = await postsRepository.findOwner(id);
    if (!post) throw AppError.notFound('Post introuvable');
    if (post.authorId !== userId && userRole !== 'ADMIN') {
      throw AppError.forbidden('Vous ne pouvez pas supprimer ce post');
    }
    await postsRepository.delete(id);
  }

  async toggleLike(postId: string, userId: string) {
    const post = await postsRepository.findOwner(postId);
    if (!post) throw AppError.notFound('Post introuvable');

    const isLiked = await postsRepository.isLiked(postId, userId);

    if (isLiked) {
      await postsRepository.removeLike(postId, userId);
      return { liked: false };
    } else {
      await postsRepository.addLike(postId, userId);
      // Notify post author (not self-like)
      if (post.authorId !== userId) {
        await notificationsRepository.create({
          type: 'LIKE',
          recipientId: post.authorId,
          actorId: userId,
          postId,
        });
      }
      return { liked: true };
    }
  }

  async reportPost(postId: string, reporterId: string, reason: string) {
    const post = await postsRepository.findOwner(postId);
    if (!post) throw AppError.notFound('Post introuvable');
    if (post.authorId === reporterId) throw AppError.badRequest('Vous ne pouvez pas signaler votre propre post');

    try {
      await postsRepository.createReport(postId, reporterId, reason);
    } catch {
      throw AppError.conflict('Vous avez déjà signalé ce post');
    }
  }

  async searchPosts(query: string, cursor?: string, limit = 10) {
    return postsRepository.search(query, cursor, limit);
  }
}
