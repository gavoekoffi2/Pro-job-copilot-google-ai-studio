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

    const params = new URLSearchParams(event.rawQuery || '');
    const reference = params.get('reference');
    const providerStatus = String(params.get('provider_status') || '').toLowerCase();
    if (!reference) return json(400, { error: 'Référence GeniusPay manquante.' });

    // En sandbox, GeniusPay peut rediriger avec ?status=completed alors que
    // l'endpoint de recherche /payments/{SANDBOX_...} répond encore
    // TRANSACTION_NOT_FOUND. On accepte ce signal uniquement avec la clé
    // sandbox côté serveur et une référence sandbox, jamais en production live.
    if (
      providerStatus === 'completed' &&
      String(reference).startsWith('SANDBOX_') &&
      String(apiKey).includes('sandbox')
    ) {
      return json(200, {
        reference,
        status: 'completed',
        paid: true,
        amount: 500,
        currency: 'XOF',
        paymentMethod: 'sandbox',
      });
    }

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
