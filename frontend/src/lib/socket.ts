import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    // Determine backend URL (useful if running independently during dev)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    socket = io(backendUrl, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket'], // Use websockets primarily
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
