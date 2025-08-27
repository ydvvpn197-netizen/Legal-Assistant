import { FastifyInstance } from 'fastify';
import { summarize } from '@legalassistant/ai';
import pdfParse from 'pdf-parse';

export async function summariesRoutes(app: FastifyInstance) {
  app.post('/summaries/upload', async (req) => {
    // Using fastify-multipart: req.file() returns a single file
    // @ts-ignore
    const file = await (req as any).file({ limits: { fileSize: 10 * 1024 * 1024 } });
    if (!file) return app.httpErrors.badRequest('No file uploaded');
    const mimetype = file.mimetype || 'application/octet-stream';
    const buffer = await file.toBuffer();
    let text = '';
    if (mimetype === 'application/pdf' || file.filename?.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text || '';
    } else {
      text = buffer.toString('utf8');
    }
    if (!text.trim()) return app.httpErrors.badRequest('Could not extract text');
    const summary = summarize(text, 6);
    return { summary, meta: { filename: file.filename, mimetype } };
  });
}
