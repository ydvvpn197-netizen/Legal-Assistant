import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generateNdaPdf } from '@legalassistant/docgen';

export async function documentRoutes(app: FastifyInstance) {
  app.post('/documents/nda.pdf', async (req, reply) => {
    const schema = z.object({
      partyAName: z.string().min(2),
      partyBName: z.string().min(2),
      effectiveDate: z.string().min(4),
      termMonths: z.number().int().positive()
    });
    const input = schema.parse((req as any).body ?? {});
    const pdf = await generateNdaPdf(input);
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', 'attachment; filename="nda.pdf"');
    reply.send(pdf);
  });
}
