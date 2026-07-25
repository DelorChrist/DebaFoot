import { prisma } from '../../shared/prisma';
import { NotificationType } from '@prisma/client';

interface CreateNotificationData {
  type: NotificationType;
  recipientId: string;
  actorId: string;
  postId?: string;
  commentId?: string;
}

export class NotificationsRepository {
  async create(data: CreateNotificationData) {
    return prisma.notification.create({ data });
  }

  async findByUserId(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        read: true,
        createdAt: true,
        postId: true,
        commentId: true,
        actor: {
          select: {
            id: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
        post: { select: { id: true, content: true } },
      },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { recipientId: userId, read: false },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, recipientId: userId },
      data: { read: true },
    });
  }
}
