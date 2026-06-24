import { json, requireEnv, siteUrl } from './_utils.mjs';

const GENIUSPAY_BASE_URL = 'https://geniuspay.ci/api/v1/merchant';
const CV_DOWNLOAD_PRICE_XOF = 500;

function cleanUser(user = {}) {
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  const phone = String(user.phone || '').trim();
  if (!name || !email || !phone) {
    const error = new Error('Nom, email et téléphone sont obligatoires pour créer le compte et lancer le paiement.');
    error.statusCode = 400;
    throw error;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    const error = new Error('Email invalide.');
    error.statusCode = 400;
    throw error;
  }
  return { name, email, phone };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const apiKey = requireEnv(
      'GENIUSPAY_API_KEY',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_KEY (clé publique pk_sandbox_... ou pk_live_...).',
    );
    const apiSecret = requireEnv(
      'GENIUSPAY_API_SECRET',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_SECRET côté serveur.',
    );

    const payload = JSON.parse(event.body || '{}');
    const user = cleanUser(payload.user);
    const cv = payload.cv;
    if (!cv?.personalInfo) {
      return json(400, { error: 'CV invalide ou manquant.' });
    }

    const cvId = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const origin = siteUrl();

    const createPaymentPayload = {
      amount: CV_DOWNLOAD_PRICE_XOF,
      currency: 'XOF',
      description: 'Téléchargement CV Pro Job Copilot',
      customer: user,
      success_url: `${origin}/?payment=success`,
      error_url: `${origin}/?payment=error`,
      metadata: {
        product: 'cv_download',
        price_xof: CV_DOWNLOAD_PRICE_XOF,
        cv_id: cvId,
        user_email: user.email,
      },
    };

    const response = await fetch(`${GENIUSPAY_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPaymentPayload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.success === false) {
      const message = data?.error?.message || data?.message || `GeniusPay error ${response.status}`;
      return json(response.status || 502, { error: message, details: data?.error });
    }

    const payment = data.data || {};
    const reference = payment.reference;
    const checkoutUrl = payment.checkout_url || payment.payment_url;
    if (!reference || !checkoutUrl) {
      return json(502, { error: "GeniusPay n'a pas retourné de référence ou d'URL de paiement." });
    }

    return json(200, {
      reference,
      cvId,
      checkoutUrl,
      amount: CV_DOWNLOAD_PRICE_XOF,
      currency: 'XOF',
      status: payment.status || 'pending',
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
