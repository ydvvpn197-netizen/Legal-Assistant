import { FastifyInstance } from 'fastify';
import { getPrismaClient } from '@legalassistant/db';

export async function checklistRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();

  app.get('/checklists', async () => {
    const checklists = await prisma.complianceChecklist.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, slug: true, name: true, category: true }
    });
    return { checklists };
  });

  app.get('/checklists/:slug', async (req) => {
    const { slug } = (req.params as { slug: string });
    const checklist = await prisma.complianceChecklist.findUnique({
      where: { slug },
      include: { items: { orderBy: { order: 'asc' } } }
    });
    if (!checklist) return app.httpErrors.notFound('Checklist not found');
    return { checklist };
  });
}
