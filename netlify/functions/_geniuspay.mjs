import { requireEnv } from './_utils.mjs';

const GENIUSPAY_BASE_URL = 'https://geniuspay.ci/api/v1/merchant';

export function geniusPayCredentials() {
  const apiKey = requireEnv(
    'GENIUSPAY_API_KEY',
    'Configuration paiement manquante : ajoutez GENIUSPAY_API_KEY (clé publique pk_sandbox_... ou pk_live_...).',
  );
  const apiSecret = requireEnv(
    'GENIUSPAY_API_SECRET',
    'Configuration paiement manquante : ajoutez GENIUSPAY_API_SECRET côté serveur.',
  );
  return { apiKey, apiSecret };
}

/** Interroge GeniusPay pour connaître l'état réel d'un paiement. */
export async function fetchGeniusPayPayment(reference) {
  const { apiKey, apiSecret } = geniusPayCredentials();
  const response = await fetch(`${GENIUSPAY_BASE_URL}/payments/${encodeURIComponent(reference)}`, {
    headers: { 'X-API-Key': apiKey, 'X-API-Secret': apiSecret },
  });
  const data = await response.json().catch(() => ({}));
  const ok = response.ok && data?.success !== false;
  return {
    ok,
    status: response.status,
    payment: data?.data || {},
    message: data?.error?.message || data?.message || (ok ? '' : `GeniusPay error ${response.status}`),
    details: data?.error,
  };
}

export async function createGeniusPayPayment(payload) {
  const { apiKey, apiSecret } = geniusPayCredentials();
  const response = await fetch(`${GENIUSPAY_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'X-API-Secret': apiSecret,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  const ok = response.ok && data?.success !== false;
  return {
    ok,
    status: response.status,
    payment: data?.data || {},
    message: data?.error?.message || data?.message || (ok ? '' : `GeniusPay error ${response.status}`),
    details: data?.error,
  };
}

/**
 * En sandbox, l'endpoint de recherche /payments/{SANDBOX_...} peut répondre
 * TRANSACTION_NOT_FOUND alors que le paiement de test est passé. Ce raccourci
 * n'est valable qu'avec une clé sandbox ET une référence sandbox — jamais en live.
 */
export function isSandboxReference(reference) {
  return (
    String(reference || '').startsWith('SANDBOX_') &&
    String(process.env.GENIUSPAY_API_KEY || '').includes('sandbox')
  );
}
