import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { connectSocket, disconnectSocket } from '../lib/socket';
import { Notification } from '../types/notification.types';

export function useSocket() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const socket = connectSocket(accessToken);

      socket.on('notification:new', (notification: Notification) => {
        addNotification(notification);
        // Play a subtle sound or trigger toast here if needed
      });

      return () => {
        socket.off('notification:new');
        disconnectSocket();
      };
    }
  }, [isAuthenticated, accessToken, addNotification]);
}
