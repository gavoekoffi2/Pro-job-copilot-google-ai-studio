import { saveCheckoutRecord } from './_checkout-store.mjs';
import { loadSettings } from './_settings-store.mjs';
import { json, requireEnv, siteUrl } from './_utils.mjs';
import { authenticateAccount } from './_account-store.mjs';

const GENIUSPAY_BASE_URL = 'https://geniuspay.ci/api/v1/merchant';

function cleanUser(user = {}, cv = {}) {
  const email = String(user.email || cv?.personalInfo?.email || '').trim().toLowerCase();
  const name = String(user.name || cv?.personalInfo?.fullName || (email ? email.split('@')[0] : '') || 'Client JobTask').trim();
  const phone = String(user.phone || cv?.personalInfo?.phone || '-').trim();
  if (!email) {
    const error = new Error('Email obligatoire pour créer le compte et lancer le paiement.');
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
    const payload = JSON.parse(event.body || '{}');
    const cv = payload.cv;
    if (!cv?.personalInfo) {
      return json(400, { error: 'CV invalide ou manquant.' });
    }

    // Le paiement ne peut être lancé qu'avec une vraie session de compte.
    // Ne jamais se contenter de l'email envoyé par le navigateur.
    const account = await authenticateAccount(payload.user);
    const user = cleanUser(account.user, cv);

    const apiKey = requireEnv(
      'GENIUSPAY_API_KEY',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_KEY (clé publique pk_sandbox_... ou pk_live_...).',
    );
    const apiSecret = requireEnv(
      'GENIUSPAY_API_SECRET',
      'Configuration paiement manquante : ajoutez GENIUSPAY_API_SECRET côté serveur.',
    );

    const cvId = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const origin = siteUrl();
    const settings = await loadSettings();
    const cvDownloadPriceXof = settings.cvDownloadPriceXof;

    const createPaymentPayload = {
      amount: cvDownloadPriceXof,
      currency: 'XOF',
      description: 'Téléchargement CV JobTask AI',
      customer: user,
      success_url: `${origin}/?payment=success`,
      error_url: `${origin}/?payment=error`,
      metadata: {
        product: 'cv_download',
        price_xof: cvDownloadPriceXof,
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

    await saveCheckoutRecord(reference, {
      cv,
      templateId: payload.templateId,
      accent: payload.accent,
      locale: payload.locale || 'fr',
      user,
      cvId,
      checkoutUrl,
      status: payment.status || 'pending',
      amount: cvDownloadPriceXof,
      currency: 'XOF',
      createdAt: Date.now(),
    });

    return json(200, {
      reference,
      cvId,
      checkoutUrl,
      amount: cvDownloadPriceXof,
      currency: 'XOF',
      status: payment.status || 'pending',
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
