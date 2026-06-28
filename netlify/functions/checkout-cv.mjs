import { loadCheckoutRecord } from './_checkout-store.mjs';
import { json } from './_utils.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const reference = new URLSearchParams(event.rawQuery || '').get('reference');
    if (!reference) return json(400, { error: 'Référence GeniusPay manquante.' });

    const record = await loadCheckoutRecord(reference);
    if (!record?.cv?.personalInfo) {
      return json(404, { error: 'CV introuvable pour cette référence. Relancez le téléchargement depuis le créateur de CV.' });
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
