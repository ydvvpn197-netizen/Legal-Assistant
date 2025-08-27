import { FastifyInstance } from 'fastify';
import { getPrismaClient } from '@legalassistant/db';

export async function auditPlugin(app: FastifyInstance) {
  const prisma = getPrismaClient();
  app.addHook('onResponse', async (req, reply) => {
    try {
      const userId = (req as any).userId || null;
      const action = `${req.method} ${req.routerPath || req.url}`;
      await prisma.auditLog.create({
        data: {
          userId: userId || undefined,
          action,
          route: req.url,
          ip: (req.headers['x-forwarded-for'] as string) || req.ip,
          userAgent: req.headers['user-agent'] as string,
          metadata: { statusCode: reply.statusCode }
        }
      });
    } catch (e) {
      app.log.warn({ err: e }, 'audit log failed');
    }
  });
}
