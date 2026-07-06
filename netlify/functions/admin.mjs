import { json } from './_utils.mjs';
import {
  adminAccountSummary,
  deleteAccount,
  effectiveAccess,
  listAccounts,
  loadAccount,
  requireSuperAdmin,
  saveAccount,
  setAccountPassword,
  upsertAccount,
} from './_account-store.mjs';
import { loadSettings, saveSettings } from './_settings-store.mjs';

function parseBody(event) { return JSON.parse(event.body || '{}'); }
function toExpiresAt(durationDays, permanent) {
  if (permanent) return null;
  const days = Number(durationDays || 0);
  if (!Number.isFinite(days) || days <= 0) return null;
  return Date.now() + Math.round(days) * 24 * 60 * 60 * 1000;
}
function computeStats(accounts) {
  const stats = { totalUsers: accounts.length, activeUsers: 0, blockedUsers: 0, admins: 0, superAdmins: 0, unlimitedUsers: 0, proUsers: 0, freeUsers: 0, totalCvs: 0, paidCvs: 0 };
  for (const account of accounts) {
    const access = effectiveAccess(account.user || {});
    if (access.active) stats.activeUsers += 1; else stats.blockedUsers += 1;
    if (access.isAdmin) stats.admins += 1;
    if (access.isSuperAdmin) stats.superAdmins += 1;
    if (access.isUnlimited) stats.unlimitedUsers += 1;
    else if (access.effectivePlan === 'pro') stats.proUsers += 1;
    else stats.freeUsers += 1;
    stats.totalCvs += Array.isArray(account.cvs) ? account.cvs.length : 0;
    stats.paidCvs += Array.isArray(account.cvs) ? account.cvs.filter((cv) => cv.paid).length : 0;
  }
  return stats;
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const payload = parseBody(event);
    const adminAccount = await requireSuperAdmin(payload.admin);
    const action = payload.action || 'dashboard';

    if (action === 'dashboard') {
      const accounts = await listAccounts();
      const settings = await loadSettings();
      return json(200, { admin: adminAccountSummary(adminAccount), settings, stats: computeStats(accounts), users: accounts.map(adminAccountSummary) });
    }

    if (action === 'settings') {
      const settings = await saveSettings({ cvDownloadPriceXof: payload.cvDownloadPriceXof });
      const accounts = await listAccounts();
      return json(200, { settings, stats: computeStats(accounts), users: accounts.map(adminAccountSummary) });
    }

    if (action === 'saveUser') {
      const target = payload.target || {};
      const email = String(target.email || '').trim().toLowerCase();
      if (!email) return json(400, { error: 'Email utilisateur manquant.' });
      const existing = await loadAccount(email);
      const account = existing || await upsertAccount({
        name: target.name || email,
        email,
        phone: target.phone || '',
        password: target.initialPassword || Math.random().toString(36).slice(2, 10) + 'Aa1!',
      });
      account.user = {
        ...account.user,
        name: String(target.name || account.user.name || email).trim(),
        email,
        phone: String(target.phone || account.user.phone || '').trim(),
        role: target.role || account.user.role || 'user',
        plan: target.plan || account.user.plan || 'free',
        subscriptionExpiresAt: toExpiresAt(target.durationDays, target.permanent || target.plan === 'unlimited' || target.role === 'super_admin'),
        active: target.active !== false,
      };
      if (target.initialPassword) setAccountPassword(account, target.initialPassword);
      account.audit = [{ type: 'admin_save_user', at: Date.now(), by: adminAccount.user.email, plan: account.user.plan, role: account.user.role }, ...(account.audit || []).slice(0, 49)];
      await saveAccount(account);
      const accounts = await listAccounts();
      return json(200, { user: adminAccountSummary(account), stats: computeStats(accounts), users: accounts.map(adminAccountSummary) });
    }

    if (action === 'deleteUser') {
      const email = String(payload.email || '').trim().toLowerCase();
      if (!email) return json(400, { error: 'Email utilisateur manquant.' });
      if (email === adminAccount.user.email) return json(400, { error: 'Vous ne pouvez pas supprimer votre propre compte super administrateur.' });
      await deleteAccount(email);
      const accounts = await listAccounts();
      return json(200, { stats: computeStats(accounts), users: accounts.map(adminAccountSummary) });
    }

    return json(400, { error: 'Action admin inconnue.' });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
