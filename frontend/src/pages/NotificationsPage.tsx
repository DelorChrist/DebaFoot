import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '../features/notifications/hooks/useNotifications';
import { NotificationPanel } from '../components/organisms/NotificationPanel';
import { useMemo } from 'react';

export function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const markReadMutation = useMarkNotificationAsRead();

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  return (
    <div className="py-4 lg:py-6 max-w-2xl mx-auto w-full">
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-text-primary">Vos Notifications</h1>
        <p className="text-text-muted">Restez au courant des interactions</p>
      </div>

      <NotificationPanel
        notifications={notifications}
        isLoading={isLoading}
        onMarkAllRead={() => markAllReadMutation.mutate()}
        onNotificationClick={(id) => markReadMutation.mutate(id)}
      />
    </div>
  );
}
