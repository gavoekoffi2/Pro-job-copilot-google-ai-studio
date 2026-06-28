import { json } from './_utils.mjs';
import { cleanAccountUser, loadAccount, publicAccount, saveUserCv, upsertAccount } from './_account-store.mjs';

function parseBody(event) {
  return JSON.parse(event.body || '{}');
}

export async function handler(event) {
  try {
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.rawQuery || '');
      const email = String(params.get('email') || '').trim().toLowerCase();
      const id = String(params.get('id') || '').trim();
      if (!email) return json(400, { error: 'Email compte manquant.' });

      const account = await loadAccount(email);
      if (!account) return json(200, { user: null, cvs: [] });

      if (id) {
        const cv = (account.cvs || []).find((item) => item.id === id);
        if (!cv) return json(404, { error: 'CV introuvable dans ce compte.' });
        return json(200, { user: account.user, cv });
      }

      return json(200, publicAccount(account));
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const payload = parseBody(event);
    const action = payload.action || 'save';
    const user = cleanAccountUser(payload.user);

    if (action === 'register') {
      const account = await upsertAccount(user);
      return json(200, publicAccount(account));
    }

    if (action === 'list') {
      const account = (await loadAccount(user.email)) || (await upsertAccount(user));
      return json(200, publicAccount(account));
    }

    if (action === 'save') {
      const record = await saveUserCv({
        user,
        cv: payload.cv,
        templateId: payload.templateId,
        accent: payload.accent,
        locale: payload.locale || 'fr',
        cvId: payload.cvId,
        paid: payload.paid,
        reference: payload.reference,
      });
      const account = await loadAccount(user.email);
      return json(200, { cv: record, account: publicAccount(account) });
    }

    return json(400, { error: 'Action compte inconnue.' });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
