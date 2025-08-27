import { FastifyInstance } from 'fastify';
import { getPrismaClient } from '@legalassistant/db';

export async function privacyRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();

  app.delete('/me', async (req) => {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return app.httpErrors.unauthorized('Not authenticated');

    await prisma.$transaction([
      prisma.auditLog.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);
    return { ok: true };
  });
}
