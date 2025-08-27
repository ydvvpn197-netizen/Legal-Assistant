import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { env } from './env';
import { healthRoutes } from './routes/health';
import { templateRoutes } from './routes/templates';
import { checklistRoutes } from './routes/checklists';
import { chatRoutes } from './routes/chat';
import { authRoutes } from './routes/auth';
import { documentRoutes } from './routes/documents';
import { getPrismaClient } from '@legalassistant/db';

async function start() {
  const app = Fastify({ logger: true });

  await app.register(helmet);
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  // DB test route
  const prisma = getPrismaClient();

  app.get('/', async () => ({
    name: 'legal-assistant-api',
    env: env.NODE_ENV
  }));

  await app.register(healthRoutes);
  await app.register(templateRoutes);
  await app.register(checklistRoutes);
  await app.register(chatRoutes);
  await app.register(authRoutes);
  await app.register(documentRoutes);

  app.get('/db-check', async () => {
    // Lightweight query; introspects if DB is reachable
    await prisma.$queryRaw`SELECT 1`;
    return { db: 'ok' };
  });

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
