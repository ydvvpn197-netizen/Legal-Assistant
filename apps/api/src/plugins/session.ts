import { FastifyInstance } from 'fastify';
import crypto from 'crypto';

function verifyJwt(token: string, secret: string): any | null {
  const [header, body, sig] = token.split('.');
  if (!header || !body || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  if (expected !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export async function sessionPlugin(app: FastifyInstance) {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  app.addHook('preHandler', async (req) => {
    const cookie = (req.headers['cookie'] || '').split(';').find((c) => c.trim().startsWith('auth='));
    if (!cookie) return;
    const token = cookie.split('=')[1];
    const payload = verifyJwt(token, JWT_SECRET);
    if (payload) (req as any).userId = payload.sub;
  });
}
