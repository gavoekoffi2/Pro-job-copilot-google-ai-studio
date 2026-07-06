import { json } from './_utils.mjs';
import {
  authenticateAccount,
  cleanAccountUser,
  loadAccount,
  loginAccount,
  publicAccount,
  registerOrLoginAccount,
  saveUserCv,
} from './_account-store.mjs';

function parseBody(event) {
  return JSON.parse(event.body || '{}');
}

export async function handler(event) {
  try {
    if (event.httpMethod === 'GET') {
      return json(405, { error: 'Utilisez la connexion email + mot de passe depuis l’application.' });
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const payload = parseBody(event);
    const action = payload.action || 'save';

    if (action === 'login') {
      const { account, sessionToken } = await loginAccount(payload.user);
      return json(200, publicAccount(account, sessionToken));
    }

    if (action === 'register') {
      const { account, sessionToken } = await registerOrLoginAccount(payload.user);
      return json(200, publicAccount(account, sessionToken));
    }

    const account = await authenticateAccount(payload.user);
    const user = account.user;

    if (action === 'list') {
      return json(200, publicAccount(account, payload.user?.sessionToken || ''));
    }

    if (action === 'get') {
      const id = String(payload.id || '').trim();
      if (!id) return json(400, { error: 'Identifiant CV manquant.' });
      const cv = (account.cvs || []).find((item) => item.id === id);
      if (!cv) return json(404, { error: 'CV introuvable dans ce compte.' });
      const publicUser = payload.user?.sessionToken ? { ...user, sessionToken: payload.user.sessionToken } : user;
      return json(200, { user: publicUser, cv });
    }

    if (action === 'save') {
      // Vérifie que les infos publiques restent propres, mais l’accès vient de authenticateAccount.
      cleanAccountUser({ ...user, ...payload.user, password: undefined });
      const record = await saveUserCv({
        user: { ...user, ...payload.user, sessionToken: undefined, password: undefined },
        cv: payload.cv,
        templateId: payload.templateId,
        accent: payload.accent,
        locale: payload.locale || 'fr',
        cvId: payload.cvId,
        paid: payload.paid,
        reference: payload.reference,
      });
      const updated = await loadAccount(user.email);
      return json(200, { cv: record, account: publicAccount(updated, payload.user?.sessionToken || '') });
    }

    return json(400, { error: 'Action compte inconnue.' });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
