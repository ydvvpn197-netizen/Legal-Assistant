"use client";
import { useEffect, useState } from 'react';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function createOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/billing/create-order', { method: 'POST' });
      const data = await res.json();
      setOrder(data);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function mockVerify() {
    if (!order) return;
    setLoading(true);
    try {
      await fetch('/api/billing/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ razorpay_order_id: order.orderId, razorpay_payment_id: 'pay_mock', razorpay_signature: 'sig_mock' })
      });
      window.location.href = '/auth/me';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Upgrade to Pro</h2>
      <p>INR 499 (mock in dev if Razorpay keys are missing)</p>
      <button onClick={createOrder} disabled={loading}>Create Order</button>
      {order && (
        <div style={{ marginTop: 12 }}>
          <div>Order: {order.orderId}</div>
          <button onClick={mockVerify} disabled={loading}>Mark Paid (Dev)</button>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}
