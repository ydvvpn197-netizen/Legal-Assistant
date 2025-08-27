import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { answerWithCitations } from '@legalassistant/ai';

export async function chatRoutes(app: FastifyInstance) {
  app.post('/chat', async (req) => {
    const bodySchema = z.object({ query: z.string().min(3) });
    const { query } = bodySchema.parse((req as any).body ?? {});
    const result = await answerWithCitations(query);
    return result;
  });
}
