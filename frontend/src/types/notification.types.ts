export type NotificationType = 'LIKE' | 'COMMENT' | 'MENTION' | 'REPLY';

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  postId?: string | null;
  commentId?: string | null;
  actor: {
    id: string;
    username: string;
    profile?: {
      displayName?: string | null;
      avatarUrl?: string | null;
    };
  };
  post?: {
    id: string;
    content: string;
  } | null;
}

export interface NotificationResponse {
  items: Notification[];
  unreadCount: number;
}
