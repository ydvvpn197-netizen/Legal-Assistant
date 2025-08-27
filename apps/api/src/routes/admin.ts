import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getPrismaClient } from '@legalassistant/db';

export async function adminRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();

  app.addHook('preHandler', async (req) => {
    const userId = (req as any).userId as string | undefined;
    if (!userId) throw app.httpErrors.unauthorized('Not authenticated');
    const me = await prisma.user.findUnique({ where: { id: userId } });
    if (!me || me.role !== 'ADMIN') throw app.httpErrors.forbidden('Admin only');
  });

  app.get('/admin/users', async () => {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, plan: true, createdAt: true } });
    return { users };
  });

  app.get('/admin/templates', async () => {
    const templates = await prisma.legalTemplate.findMany({ orderBy: { updatedAt: 'desc' } });
    return { templates };
  });

  app.post('/admin/templates', async (req) => {
    const schema = z.object({
      name: z.string().min(2),
      slug: z.string().min(2),
      category: z.enum(['NDA','RENT_AGREEMENT','EMPLOYMENT_OFFER','TERMINATION_NOTICE','FOUNDERS_AGREEMENT','PRIVACY_POLICY']),
      language: z.enum(['en','hi']).default('en'),
      bodyMd: z.string().min(2),
      isPremium: z.boolean().default(false)
    });
    const data = schema.parse((req as any).body ?? {});
    const tpl = await prisma.legalTemplate.upsert({ where: { slug: data.slug }, update: data, create: data });
    return { template: tpl };
  });

  app.put('/admin/templates/:id', async (req) => {
    const { id } = (req.params as { id: string });
    const schema = z.object({
      name: z.string().min(2).optional(),
      bodyMd: z.string().optional(),
      isPremium: z.boolean().optional()
    });
    const data = schema.parse((req as any).body ?? {});
    const tpl = await prisma.legalTemplate.update({ where: { id }, data });
    return { template: tpl };
  });

  app.delete('/admin/templates/:id', async (req) => {
    const { id } = (req.params as { id: string });
    await prisma.legalTemplate.delete({ where: { id } });
    return { ok: true };
  });

  app.get('/admin/flags', async () => {
    const flags = await prisma.featureFlag.findMany({});
    return { flags };
  });

  app.post('/admin/flags', async (req) => {
    const schema = z.object({ key: z.string().min(2), enabled: z.boolean() });
    const data = schema.parse((req as any).body ?? {});
    const flag = await prisma.featureFlag.upsert({ where: { key: data.key }, update: { enabled: data.enabled }, create: data });
    return { flag };
  });
}
