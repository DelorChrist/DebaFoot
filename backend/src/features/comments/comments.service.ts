import { CommentsRepository } from './comments.repository';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { AppError } from '../../shared/AppError';
import { prisma } from '../../shared/prisma';

const commentsRepository = new CommentsRepository();
const notificationsRepository = new NotificationsRepository();

export class CommentsService {
  async getComments(postId: string) {
    return commentsRepository.findByPostId(postId);
  }

  async getReplies(parentId: string) {
    return commentsRepository.findReplies(parentId);
  }

  async createComment(
    postId: string,
    authorId: string,
    content: string,
    parentId?: string
  ) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) throw AppError.notFound('Post introuvable');

    const comment = await commentsRepository.create({ content, postId, authorId, parentId });

    // Notification to post author
    if (post.authorId !== authorId) {
      await notificationsRepository.create({
        type: 'COMMENT',
        recipientId: post.authorId,
        actorId: authorId,
        postId,
        commentId: comment.id,
      });
    }

    // Notification to parent comment author (reply)
    if (parentId) {
      const parentComment = await commentsRepository.findOwner(parentId);
      if (parentComment && parentComment.authorId !== authorId && parentComment.authorId !== post.authorId) {
        await notificationsRepository.create({
          type: 'REPLY',
          recipientId: parentComment.authorId,
          actorId: authorId,
          postId,
          commentId: comment.id,
        });
      }
    }

    return comment;
  }

  async updateComment(id: string, userId: string, content: string) {
    const comment = await commentsRepository.findOwner(id);
    if (!comment) throw AppError.notFound('Commentaire introuvable');
    if (comment.authorId !== userId) throw AppError.forbidden('Vous ne pouvez pas modifier ce commentaire');

    return commentsRepository.update(id, content);
  }

  async deleteComment(id: string, userId: string, userRole: string) {
    const comment = await commentsRepository.findOwner(id);
    if (!comment) throw AppError.notFound('Commentaire introuvable');
    if (comment.authorId !== userId && userRole !== 'ADMIN') {
      throw AppError.forbidden('Vous ne pouvez pas supprimer ce commentaire');
    }
    await commentsRepository.delete(id);
  }
}
