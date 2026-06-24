import { getStore } from '@netlify/blobs';
import { json, requireEnv } from './_utils.mjs';

const GENIUSPAY_BASE_URL = 'https://geniuspay.ci/api/v1/merchant';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const apiKey = requireEnv(
      'GENIUSPAY_API_KEY',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_KEY.',
    );
    const apiSecret = requireEnv(
      'GENIUSPAY_API_SECRET',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_SECRET.',
    );

    const reference = new URLSearchParams(event.rawQuery || '').get('reference');
    if (!reference) return json(400, { error: 'Référence GeniusPay manquante.' });

    const response = await fetch(`${GENIUSPAY_BASE_URL}/payments/${encodeURIComponent(reference)}`, {
      headers: {
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.success === false) {
      const message = data?.error?.message || data?.message || `GeniusPay error ${response.status}`;
      return json(response.status || 502, { error: message, details: data?.error });
    }

    const payment = data.data || {};
    const status = payment.status;
    const paid = status === 'completed';

    const store = getStore('pro-job-copilot-payments');
    const existing = await store.get(`payment:${reference}`, { type: 'json' }).catch(() => null);
    if (existing) {
      const updated = {
        ...existing,
        status,
        paid,
        paymentMethod: payment.payment_method || payment.payment_provider || existing.paymentMethod,
        completedAt: payment.completed_at || existing.completedAt,
        updatedAt: new Date().toISOString(),
      };
      await store.setJSON(`payment:${reference}`, updated);
      if (updated.cvId) await store.setJSON(`cv:${updated.cvId}`, updated);
      if (paid && updated.user?.email) {
        await store.setJSON(`user:${updated.user.email}:latest`, {
          cvId: updated.cvId,
          reference,
          updatedAt: updated.updatedAt,
        });
      }
    }

    return json(200, {
      reference,
      status,
      paid,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.payment_method || payment.payment_provider || null,
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
