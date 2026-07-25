import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useEffect } from 'react';

export function useNotifications() {
  const { setNotifications } = useNotificationStore();

  const query = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => notificationsApi.getNotifications(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (query.data?.pages) {
      // Flatten pages to a single array
      const allNotifications = query.data.pages.flatMap((page: any) => page.items);
      // We assume the first page contains the total unreadCount for the user
      const unreadCount = query.data.pages[0]?.unreadCount || 0;
      setNotifications(allNotifications, unreadCount);
    }
  }, [query.data, setNotifications]);

  return query;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const markAsReadStore = useNotificationStore((state) => state.markAsRead);

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (_, id) => {
      markAsReadStore(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const markAllAsReadStore = useNotificationStore((state) => state.markAllAsRead);

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      markAllAsReadStore();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
