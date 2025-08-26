import { FastifyInstance } from 'fastify';
import { getPrismaClient } from '@legalassistant/db';

export async function templateRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();

  app.get('/templates', async (req) => {
    const { language } = (req.query ?? {}) as { language?: string };
    const where = language ? { language } : {};
    const templates = await prisma.legalTemplate.findMany({ where, orderBy: { name: 'asc' } });
    return { templates };
  });

  app.get('/templates/:slug', async (req) => {
    const { slug } = (req.params as { slug: string });
    const template = await prisma.legalTemplate.findUnique({ where: { slug } });
    if (!template) return app.httpErrors.notFound('Template not found');
    return { template };
  });
}
