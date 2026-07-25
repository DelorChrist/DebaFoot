import 'express-async-errors';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { initSocket } from './config/socket';
import { swaggerSpec } from './config/swagger';
import { globalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';

import authRoutes from './features/auth/auth.routes';
import usersRoutes from './features/users/users.routes';
import postsRoutes from './features/posts/posts.routes';
import commentsRoutes from './features/comments/comments.routes';
import notificationsRoutes from './features/notifications/notifications.routes';
import adminRoutes from './features/admin/admin.routes';

const app = express();
const httpServer = http.createServer(app);

// Init Socket.io
initSocket(httpServer);

// Security
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

// General middleware
app.use(compression());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', globalLimiter);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts/:postId/comments', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT;
httpServer.listen(PORT, () => {
  console.log(`
  ⚽ DebaFoot Server Running
  🌍 Environment: ${env.NODE_ENV}
  🚀 Port: ${PORT}
  📚 Swagger: http://localhost:${PORT}/api/docs
  `);
});

export default app;
