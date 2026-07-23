import { json } from './_utils.mjs';
import {
  authenticateAccount,
  effectiveAccess,
  loadAccount,
  loginAccount,
  publicAccount,
  registerOrLoginAccount,
  saveUserCv,
} from './_account-store.mjs';
import { loadCheckoutRecord } from './_checkout-store.mjs';
import { fetchGeniusPayPayment, isSandboxReference } from './_geniuspay.mjs';

function parseBody(event) {
  return JSON.parse(event.body || '{}');
}

/**
 * Un CV ne peut être marqué « payé » que si la référence GeniusPay correspond à un
 * checkout créé pour CE compte et confirmé côté GeniusPay. Le flag `paid` envoyé
 * par le navigateur n'est jamais suffisant à lui seul.
 */
async function isPaidReferenceForEmail(reference, email) {
  if (!reference) return false;
  const record = await loadCheckoutRecord(reference).catch(() => null);
  if (!record) return false;
  const recordEmail = String(record.user?.email || '').trim().toLowerCase();
  if (!recordEmail || recordEmail !== String(email || '').trim().toLowerCase()) return false;
  if (isSandboxReference(reference)) return true;
  const result = await fetchGeniusPayPayment(reference).catch(() => null);
  return Boolean(result?.ok && result.payment?.status === 'completed');
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
      // L'identité vient du compte authentifié. Seuls le nom et le téléphone peuvent
      // être complétés depuis le navigateur — jamais le rôle, le plan ou l'email.
      const profileUser = {
        email: user.email,
        name: String(payload.user?.name || user.name || '').trim(),
        phone: String(payload.user?.phone || user.phone || '').trim(),
      };

      const access = effectiveAccess(user);
      const reference = String(payload.reference || '').trim();
      let paid = false;
      if (payload.paid) {
        if (access.canDownloadPdf || access.isAdmin) {
          paid = true;
        } else {
          paid = await isPaidReferenceForEmail(reference, user.email);
          if (!paid) {
            return json(402, {
              error: 'Paiement non confirmé pour ce CV. Terminez le paiement GeniusPay puis réessayez.',
            });
          }
        }
      }

      const record = await saveUserCv({
        user: profileUser,
        cv: payload.cv,
        templateId: payload.templateId,
        accent: payload.accent,
        locale: payload.locale || 'fr',
        cvId: payload.cvId,
        paid,
        reference,
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
