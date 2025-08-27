import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getPrismaClient } from '@legalassistant/db';
import crypto from 'crypto';

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function signJwt(payload: object, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const toSign = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', secret).update(toSign).digest('base64url');
  return `${toSign}.${sig}`;
}

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

export async function authRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  app.addHook('preHandler', async (req) => {
    const cookie = (req.headers['cookie'] || '').split(';').find((c) => c.trim().startsWith('auth='));
    if (!cookie) return;
    const token = cookie.split('=')[1];
    const payload = verifyJwt(token, JWT_SECRET);
    if (payload) (req as any).userId = payload.sub;
  });

  app.post('/auth/register', async (req) => {
    const schema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional() });
    const { email, password, name } = schema.parse((req as any).body ?? {});
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return app.httpErrors.conflict('Email already registered');
    const user = await prisma.user.create({ data: { email, name, passwordHash: hashPassword(password) } });
    const token = signJwt({ sub: user.id, email: user.email }, JWT_SECRET);
    (req as any).res?.setHeader?.('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax`);
    return { id: user.id, email: user.email, name: user.name };
  });

  app.post('/auth/login', async (req) => {
    const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
    const { email, password } = schema.parse((req as any).body ?? {});
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== hashPassword(password)) return app.httpErrors.unauthorized('Invalid credentials');
    const token = signJwt({ sub: user.id, email: user.email }, JWT_SECRET);
    (req as any).res?.setHeader?.('Set-Cookie', `auth=${token}; HttpOnly; Path=/; SameSite=Lax`);
    return { id: user.id, email: user.email, name: user.name };
  });

  app.post('/auth/logout', async (req) => {
    (req as any).res?.setHeader?.('Set-Cookie', `auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
    return { ok: true };
  });

  app.get('/auth/me', async (req) => {
    const cookie = (req.headers['cookie'] || '').split(';').find((c) => c.trim().startsWith('auth='));
    if (!cookie) return { user: null };
    const token = cookie.split('=')[1];
    const payload = verifyJwt(token, JWT_SECRET);
    if (!payload) return { user: null };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return { user: null };
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan } };
  });
}
