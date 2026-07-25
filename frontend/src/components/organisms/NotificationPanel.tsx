import { Notification } from '../../types/notification.types';
import { NotificationItem } from '../molecules/NotificationItem';
import { Button } from '../atoms/Button';
import { Spinner } from '../atoms/Spinner';

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkAllRead: () => void;
  onNotificationClick: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  isLoading,
  onMarkAllRead,
  onNotificationClick,
}: NotificationPanelProps) {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-2 rounded-lg border border-border">
        <p className="text-text-muted">Vous n'avez aucune notification.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="card glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface-2/50">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="text-xs">
            Tout marquer comme lu
          </Button>
        )}
      </div>
      <div className="flex flex-col">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={() => {
              if (!notification.read) {
                onNotificationClick(notification.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
