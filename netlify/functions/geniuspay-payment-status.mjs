import { json } from './_utils.mjs';
import { fetchGeniusPayPayment, geniusPayCredentials, isSandboxReference } from './_geniuspay.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    geniusPayCredentials();

    const params = new URLSearchParams(event.rawQuery || '');
    const reference = params.get('reference');
    const providerStatus = String(params.get('provider_status') || '').toLowerCase();
    if (!reference) return json(400, { error: 'Référence GeniusPay manquante.' });

    // En sandbox, GeniusPay peut rediriger avec ?status=completed alors que
    // l'endpoint de recherche /payments/{SANDBOX_...} répond encore
    // TRANSACTION_NOT_FOUND. On accepte ce signal uniquement avec la clé
    // sandbox côté serveur et une référence sandbox, jamais en production live.
    if (providerStatus === 'completed' && isSandboxReference(reference)) {
      return json(200, {
        reference,
        status: 'completed',
        paid: true,
        amount: 500,
        currency: 'XOF',
        paymentMethod: 'sandbox',
      });
    }

    const result = await fetchGeniusPayPayment(reference);
    if (!result.ok) {
      return json(result.status || 502, { error: result.message, details: result.details });
    }

    const payment = result.payment;
    const status = payment.status;

    return json(200, {
      reference,
      status,
      paid: status === 'completed',
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.payment_method || payment.payment_provider || null,
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
