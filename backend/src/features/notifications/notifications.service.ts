import { NotificationsRepository } from './notifications.repository';

const notificationsRepository = new NotificationsRepository();

export class NotificationsService {
  async getNotifications(userId: string, limit = 20) {
    const [items, unreadCount] = await Promise.all([
      notificationsRepository.findByUserId(userId, limit),
      notificationsRepository.countUnread(userId),
    ]);
    return { items, unreadCount };
  }

  async markAllRead(userId: string) {
    await notificationsRepository.markAllRead(userId);
  }

  async markRead(id: string, userId: string) {
    await notificationsRepository.markRead(id, userId);
  }
}
