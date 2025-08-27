import { FastifyInstance } from 'fastify';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getPrismaClient } from '@legalassistant/db';

export async function billingRoutes(app: FastifyInstance) {
  const prisma = getPrismaClient();
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const isMock = !keyId || !keySecret;

  const razor = !isMock
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : (null as any);

  app.post('/billing/create-order', async (req) => {
    const amountInPaise = 49900; // INR 499.00
    if (isMock) {
      return { orderId: `order_mock_${Date.now()}`, amount: amountInPaise, currency: 'INR', keyId: null };
    }
    const order = await razor.orders.create({ amount: amountInPaise, currency: 'INR', receipt: `pro_${Date.now()}` });
    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId };
  });

  app.post('/billing/verify', async (req) => {
    const body: any = (req as any).body || {};
    const userId = (req as any).userId as string | undefined;
    if (!userId) return app.httpErrors.unauthorized('Not authenticated');

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (isMock) {
      if (!String(razorpay_order_id || '').startsWith('order_mock_')) return app.httpErrors.badRequest('Invalid mock order');
      await prisma.user.update({ where: { id: userId }, data: { plan: 'PRO', planUpdatedAt: new Date() } });
      return { status: 'ok', plan: 'PRO' };
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');
    if (digest !== razorpay_signature) return app.httpErrors.unauthorized('Invalid signature');
    await prisma.user.update({ where: { id: userId }, data: { plan: 'PRO', planUpdatedAt: new Date() } });
    return { status: 'ok', plan: 'PRO' };
  });
}
