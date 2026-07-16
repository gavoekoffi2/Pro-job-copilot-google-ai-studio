import { loadCheckoutRecord } from './_checkout-store.mjs';
import { authenticateAccount } from './_account-store.mjs';
import { json } from './_utils.mjs';

/**
 * Récupère le CV attaché à une référence de paiement. Le CV contient des données
 * personnelles : la récupération exige une session de compte valide ET que la
 * référence ait été créée pour ce même compte.
 */
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Méthode non autorisée. Utilisez la récupération sécurisée depuis l’application.' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const reference = String(payload.reference || '').trim();
    if (!reference) return json(400, { error: 'Référence GeniusPay manquante.' });

    const account = await authenticateAccount(payload.user);

    const record = await loadCheckoutRecord(reference);
    if (!record?.cv?.personalInfo) {
      return json(404, { error: 'CV introuvable pour cette référence. Relancez le téléchargement depuis le créateur de CV.' });
    }

    const recordEmail = String(record.user?.email || '').trim().toLowerCase();
    const accountEmail = String(account.user?.email || '').trim().toLowerCase();
    if (!recordEmail || recordEmail !== accountEmail) {
      return json(403, { error: 'Cette référence de paiement appartient à un autre compte.' });
    }

    return json(200, {
      reference,
      cv: record.cv,
      templateId: record.templateId,
      accent: record.accent,
      locale: record.locale,
      user: record.user,
      createdAt: record.createdAt,
    });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
