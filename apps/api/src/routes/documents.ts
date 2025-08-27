import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generateNdaPdf } from '@legalassistant/docgen';
import { generateNdaDocx } from '@legalassistant/docgen/src/docx';
import { saveFile } from '@legalassistant/storage';
import { getPrismaClient } from '@legalassistant/db';

export async function documentRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();
  app.post('/documents/nda.pdf', async (req, reply) => {
    const schema = z.object({
      partyAName: z.string().min(2),
      partyBName: z.string().min(2),
      effectiveDate: z.string().min(4),
      termMonths: z.number().int().positive()
    });
    const input = schema.parse((req as any).body ?? {});
    const pdf = await generateNdaPdf(input);
    const filePath = `users/${(req as any).userId || 'anon'}/documents/nda-${Date.now()}.pdf`;
    await saveFile(filePath, pdf);
    await prisma.document.create({ data: { userId: (req as any).userId || undefined, type: 'NDA', format: 'PDF', filePath } });
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', 'attachment; filename="nda.pdf"');
    reply.send(pdf);
  });

  app.post('/documents/nda.docx', async (req, reply) => {
    const schema = z.object({
      partyAName: z.string().min(2),
      partyBName: z.string().min(2),
      effectiveDate: z.string().min(4),
      termMonths: z.number().int().positive()
    });
    const input = schema.parse((req as any).body ?? {});
    const docx = await generateNdaDocx(input);
    const filePath = `users/${(req as any).userId || 'anon'}/documents/nda-${Date.now()}.docx`;
    await saveFile(filePath, docx);
    await prisma.document.create({ data: { userId: (req as any).userId || undefined, type: 'NDA', format: 'DOCX', filePath } });
    reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    reply.header('Content-Disposition', 'attachment; filename="nda.docx"');
    reply.send(docx);
  });

  app.get('/documents', async (req) => {
    const userId = (req as any).userId as string | undefined;
    const docs = await prisma.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return { documents: docs };
  });

  app.get('/documents/:id/download', async (req, reply) => {
    const { id } = (req.params as { id: string });
    const userId = (req as any).userId as string | undefined;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return reply.notFound();
    if (doc.userId && doc.userId !== userId) return reply.forbidden();
    const data = await (await import('@legalassistant/storage')).readFile(doc.filePath);
    if (doc.format === 'PDF') reply.header('Content-Type', 'application/pdf');
    if (doc.format === 'DOCX') reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    reply.send(data);
  });
}
