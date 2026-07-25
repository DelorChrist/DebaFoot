import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env';

let io: SocketServer;

export const initSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };
      (socket as unknown as { userId: string }).userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as unknown as { userId: string }).userId;
    console.log(`🔌 User connected: ${userId}`);

    // Join personal room for notifications
    socket.join(`user:${userId}`);

    socket.on('join:post', (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on('leave:post', (postId: string) => {
      socket.leave(`post:${postId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};

export const emitToPost = (postId: string, event: string, data: unknown): void => {
  if (io) io.to(`post:${postId}`).emit(event, data);
};
