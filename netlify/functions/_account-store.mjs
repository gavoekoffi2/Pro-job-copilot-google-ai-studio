import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

const STORE_NAME = 'jobtask-ai-accounts';
const LOCAL_STORE_PATH = join(process.cwd(), '.jobtask-data/accounts.json');
const INDEX_KEY = 'accounts:index';
// Le bootstrap super admin n'existe QUE si les deux variables d'environnement sont
// définies. Aucun identifiant par défaut ne doit vivre dans le code source.
const SUPER_ADMIN_EMAIL = (process.env.JOBTASK_SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
const SUPER_ADMIN_PASSWORD = String(process.env.JOBTASK_SUPER_ADMIN_PASSWORD || '');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const MIN_NEW_PASSWORD_LENGTH = 8;

async function readLocalData() {
  try { return JSON.parse(await readFile(LOCAL_STORE_PATH, 'utf8')); } catch { return {}; }
}

function localStore() {
  return {
    async get(key) { const data = await readLocalData(); return data[key] || null; },
    async setJSON(key, value) {
      const data = await readLocalData(); data[key] = value;
      await mkdir(dirname(LOCAL_STORE_PATH), { recursive: true });
      await writeFile(LOCAL_STORE_PATH, JSON.stringify(data, null, 2));
    },
    async delete(key) {
      const data = await readLocalData(); delete data[key];
      await mkdir(dirname(LOCAL_STORE_PATH), { recursive: true });
      await writeFile(LOCAL_STORE_PATH, JSON.stringify(data, null, 2));
    },
    async list({ prefix = '' } = {}) {
      const data = await readLocalData();
      return { blobs: Object.keys(data).filter((key) => key.startsWith(prefix)).map((key) => ({ key })) };
    },
  };
}

function store() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token) return getStore({ name: STORE_NAME, siteID, token });
  if (process.env.NETLIFY || process.env.CONTEXT) return getStore(STORE_NAME);
  return localStore();
}

export function cleanAccountUser(user = {}, { requireName = true, requirePhone = true } = {}) {
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  const phone = String(user.phone || '').trim();
  if (!email) { const error = new Error('Email obligatoire pour le compte.'); error.statusCode = 400; throw error; }
  if (requireName && !name) { const error = new Error('Nom complet obligatoire pour créer le compte.'); error.statusCode = 400; throw error; }
  if (requirePhone && !phone) { const error = new Error('Téléphone obligatoire pour créer le compte.'); error.statusCode = 400; throw error; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { const error = new Error('Email invalide.'); error.statusCode = 400; throw error; }
  return { name, email, phone };
}

function cleanPassword(password) {
  // Connexion : on exige seulement un mot de passe non vide, la vérification se
  // fait contre le hash stocké (les anciens comptes peuvent avoir 6-7 caractères).
  const value = String(password || '');
  if (!value) { const error = new Error('Mot de passe obligatoire.'); error.statusCode = 400; throw error; }
  return value;
}
function cleanNewPassword(password) {
  const value = String(password || '');
  if (value.length < MIN_NEW_PASSWORD_LENGTH) {
    const error = new Error(`Mot de passe trop court : minimum ${MIN_NEW_PASSWORD_LENGTH} caractères.`);
    error.statusCode = 400;
    throw error;
  }
  return value;
}
export function generateRandomPassword() { return randomBytes(12).toString('base64url'); }
function hashPassword(password, salt = randomBytes(16).toString('base64url')) { return `${salt}:${scryptSync(password, salt, 64).toString('base64url')}`; }
function verifyPassword(password, stored = '') {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = Buffer.from(scryptSync(password, salt, 64).toString('base64url'));
  const expected = Buffer.from(hash);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
function hashSessionToken(token) { return createHash('sha256').update(String(token)).digest('base64url'); }
function newSessionToken() { return randomBytes(32).toString('base64url'); }
function newSessionEntry(token) {
  const now = Date.now();
  return { hash: hashSessionToken(token), createdAt: now, expiresAt: now + SESSION_TTL_MS };
}
function isSessionEntryValid(session, tokenHash) {
  if (!session || session.hash !== tokenHash) return false;
  const expiresAt = Number(session.expiresAt) || (Number(session.createdAt || 0) + SESSION_TTL_MS);
  return expiresAt > Date.now();
}
function assertNotLocked(account) {
  const lockedUntil = Number(account?.auth?.lockedUntil || 0);
  if (lockedUntil > Date.now()) {
    const minutes = Math.max(1, Math.ceil((lockedUntil - Date.now()) / 60000));
    const error = new Error(`Trop de tentatives échouées. Compte verrouillé, réessayez dans ${minutes} min.`);
    error.statusCode = 429;
    throw error;
  }
}
async function recordFailedLogin(account) {
  const failed = Number(account.auth?.failedLogins || 0) + 1;
  account.auth = {
    ...(account.auth || {}),
    failedLogins: failed,
    lockedUntil: failed >= MAX_FAILED_LOGINS ? Date.now() + LOCKOUT_MS : 0,
  };
  await saveAccount(account).catch(() => {});
}
function clearFailedLogins(account) {
  if (!account.auth) return;
  account.auth.failedLogins = 0;
  account.auth.lockedUntil = 0;
}
function accountKey(email) { return `account:${Buffer.from(String(email).toLowerCase()).toString('base64url')}`; }

function normalizeRole(role, email = '') {
  const value = String(role || '').trim().toLowerCase();
  if (value === 'super_admin' || (SUPER_ADMIN_EMAIL && String(email).toLowerCase() === SUPER_ADMIN_EMAIL)) return 'super_admin';
  if (value === 'admin') return 'admin';
  return 'user';
}
function normalizePlan(plan, role = 'user') {
  const value = String(plan || '').trim().toLowerCase();
  if (role === 'super_admin') return 'unlimited';
  if (['unlimited', 'illimite', 'illimité'].includes(value)) return 'unlimited';
  if (['pro', 'premium'].includes(value)) return 'pro';
  return 'free';
}
export function effectiveAccess(user = {}) {
  const role = normalizeRole(user.role, user.email);
  const plan = normalizePlan(user.plan, role);
  const expiresAt = user.subscriptionExpiresAt || null;
  const active = user.active !== false;
  const expired = Boolean(expiresAt && Number(expiresAt) <= Date.now());
  const isUnlimited = active && (role === 'super_admin' || plan === 'unlimited' || (plan === 'pro' && !expiresAt));
  const canDownloadPdf = active && (isUnlimited || (plan === 'pro' && !expired));
  return { role, plan, effectivePlan: !active || expired ? 'free' : plan, active, subscriptionExpiresAt: expiresAt, expired, isAdmin: role === 'admin' || role === 'super_admin', isSuperAdmin: role === 'super_admin', isUnlimited, canDownloadPdf };
}
function normalizeUserForStorage(user = {}) {
  const email = String(user.email || '').trim().toLowerCase();
  const role = normalizeRole(user.role, email);
  const plan = normalizePlan(user.plan, role);
  const fallbackName = email ? email.split('@')[0] : 'Utilisateur JobTask';
  return { name: String(user.name || fallbackName).trim(), email, phone: String(user.phone || '-').trim(), role, plan, subscriptionExpiresAt: role === 'super_admin' || plan === 'unlimited' ? null : (user.subscriptionExpiresAt || null), active: user.active !== false };
}
function createEmptyAccount(user, password) {
  const now = Date.now();
  return { user: normalizeUserForStorage(user), auth: { passwordHash: hashPassword(cleanNewPassword(password)), sessions: [] }, cvs: [], audit: [{ type: 'account_created', at: now }], createdAt: now, updatedAt: now };
}
async function loadIndex() { const index = await store().get(INDEX_KEY, { type: 'json' }).catch(() => null); return Array.isArray(index?.emails) ? index.emails : []; }
async function saveIndex(emails) { const unique = Array.from(new Set(emails.map((email) => String(email).trim().toLowerCase()).filter(Boolean))).sort(); await store().setJSON(INDEX_KEY, { emails: unique, updatedAt: Date.now() }); }
async function addToIndex(email) { await saveIndex([...(await loadIndex()), email]); }
async function removeFromIndex(email) { const target = String(email || '').trim().toLowerCase(); await saveIndex((await loadIndex()).filter((item) => item !== target)); }

export async function loadAccount(email) { if (!email) return null; return store().get(accountKey(email), { type: 'json' }); }
export async function saveAccount(account) {
  const email = account?.user?.email;
  if (!email) throw new Error('Email compte manquant.');
  account.user = normalizeUserForStorage(account.user);
  await store().setJSON(accountKey(email), { ...account, updatedAt: Date.now() });
  await addToIndex(email);
}
export async function deleteAccount(email) {
  const target = String(email || '').trim().toLowerCase();
  if (!target) return;
  const s = store();
  if (typeof s.delete === 'function') await s.delete(accountKey(target));
  await removeFromIndex(target);
}
async function maybeBootstrapSuperAdmin(cleanUser, password) {
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) return null;
  if (cleanUser.email !== SUPER_ADMIN_EMAIL || String(password || '') !== SUPER_ADMIN_PASSWORD) return null;
  const existing = await loadAccount(cleanUser.email);
  if (existing) {
    const access = effectiveAccess(existing.user || {});
    const canLoginWithBootstrapPassword = existing.auth?.passwordHash && verifyPassword(password, existing.auth.passwordHash);
    existing.user = normalizeUserForStorage({
      ...existing.user,
      ...cleanUser,
      role: 'super_admin',
      plan: 'unlimited',
      subscriptionExpiresAt: null,
      active: true,
    });
    if (!access.isSuperAdmin || !access.isUnlimited || !canLoginWithBootstrapPassword) {
      setAccountPassword(existing, password);
      existing.audit = [{ type: 'super_admin_bootstrap_repair', at: Date.now() }, ...(existing.audit || []).slice(0, 49)];
    }
    await saveAccount(existing);
    return existing;
  }
  const account = createEmptyAccount({ ...cleanUser, name: cleanUser.name || 'Accès privé', phone: cleanUser.phone || '-', role: 'super_admin', plan: 'unlimited', subscriptionExpiresAt: null, active: true }, password);
  account.audit.push({ type: 'super_admin_bootstrap', at: Date.now() });
  await saveAccount(account);
  return account;
}
export async function registerOrLoginAccount(user = {}) {
  const cleanUser = cleanAccountUser(user, { requireName: false, requirePhone: false });
  const password = cleanPassword(user.password);
  const safeUser = { ...cleanUser, name: cleanUser.name || cleanUser.email.split('@')[0], phone: cleanUser.phone || '-' };
  const bootstrapped = await maybeBootstrapSuperAdmin(safeUser, password);
  const existing = bootstrapped || await loadAccount(safeUser.email);
  if (existing) assertNotLocked(existing);
  const account = existing || createEmptyAccount(safeUser, password);
  if (existing?.auth?.passwordHash && !verifyPassword(password, existing.auth.passwordHash)) {
    await recordFailedLogin(existing);
    const error = new Error('Mot de passe incorrect pour ce compte.'); error.statusCode = 401; throw error;
  }
  if (account.user?.active === false && effectiveAccess(account.user).role !== 'super_admin') { const error = new Error('Compte désactivé. Contactez l’administrateur.'); error.statusCode = 403; throw error; }
  if (!account.auth?.passwordHash) account.auth = { passwordHash: hashPassword(cleanNewPassword(password)), sessions: [] };
  const existingAccess = effectiveAccess(account.user || {});
  account.user = normalizeUserForStorage({ ...account.user, ...safeUser, role: existingAccess.role, plan: account.user?.plan, subscriptionExpiresAt: account.user?.subscriptionExpiresAt, active: account.user?.active });
  clearFailedLogins(account);
  const sessionToken = newSessionToken();
  account.auth.sessions = [newSessionEntry(sessionToken), ...(account.auth.sessions || []).slice(0, 4)];
  account.lastLoginAt = Date.now();
  await saveAccount(account);
  return { account, sessionToken };
}
export async function loginAccount(user = {}) {
  const cleanUser = cleanAccountUser(user, { requireName: false, requirePhone: false });
  const password = cleanPassword(user.password);
  const account = await maybeBootstrapSuperAdmin(cleanUser, password) || await loadAccount(cleanUser.email);
  if (!account) { const error = new Error('Compte introuvable. Cliquez sur “S’inscrire” pour créer votre compte.'); error.statusCode = 404; throw error; }
  assertNotLocked(account);
  if (!account.auth?.passwordHash || !verifyPassword(password, account.auth.passwordHash)) {
    await recordFailedLogin(account);
    const error = new Error('Email ou mot de passe incorrect.'); error.statusCode = 401; throw error;
  }
  if (account.user?.active === false && effectiveAccess(account.user).role !== 'super_admin') { const error = new Error('Compte désactivé. Contactez l’administrateur.'); error.statusCode = 403; throw error; }
  clearFailedLogins(account);
  const sessionToken = newSessionToken();
  account.auth.sessions = [newSessionEntry(sessionToken), ...(account.auth.sessions || []).slice(0, 4)];
  account.lastLoginAt = Date.now();
  await saveAccount(account);
  return { account, sessionToken };
}
export async function authenticateAccount(user = {}) {
  const cleanUser = cleanAccountUser(user, { requireName: false, requirePhone: false });
  const account = await loadAccount(cleanUser.email);
  if (!account) { const error = new Error('Compte introuvable. Créez le compte avant de continuer.'); error.statusCode = 404; throw error; }
  if (account.user?.active === false && effectiveAccess(account.user).role !== 'super_admin') { const error = new Error('Compte désactivé. Contactez l’administrateur.'); error.statusCode = 403; throw error; }
  const sessionToken = String(user.sessionToken || '');
  if (sessionToken) {
    const tokenHash = hashSessionToken(sessionToken);
    if ((account.auth?.sessions || []).some((session) => isSessionEntryValid(session, tokenHash))) return account;
  }
  if (user.password) {
    assertNotLocked(account);
    if (account.auth?.passwordHash && verifyPassword(String(user.password), account.auth.passwordHash)) {
      clearFailedLogins(account);
      return account;
    }
    await recordFailedLogin(account);
  }
  const error = new Error('Session expirée ou identifiants incorrects. Reconnectez-vous.'); error.statusCode = 401; throw error;
}
export async function requireSuperAdmin(user = {}) {
  const account = await authenticateAccount(user);
  if (!effectiveAccess(account.user).isSuperAdmin) { const error = new Error('Accès super administrateur requis.'); error.statusCode = 403; throw error; }
  return account;
}
export async function upsertAccount(user) {
  // N'accepte JAMAIS role / plan / active / subscriptionExpiresAt venant du client :
  // seuls le nom, l'email et le téléphone sont modifiables ici. Les privilèges ne
  // changent que via l'espace super admin (admin.mjs), après requireSuperAdmin.
  const cleanUser = cleanAccountUser(user, { requireName: false, requirePhone: false });
  const existing = await loadAccount(cleanUser.email);
  const account = existing || createEmptyAccount({ ...cleanUser, name: cleanUser.name || cleanUser.email, phone: cleanUser.phone || '-' }, user.password || generateRandomPassword());
  account.user = normalizeUserForStorage({
    ...account.user,
    name: cleanUser.name || account.user?.name,
    email: cleanUser.email,
    phone: cleanUser.phone || account.user?.phone,
  });
  await saveAccount(account);
  return account;
}
function cvTitle(cv) { return String(cv?.personalInfo?.fullName || cv?.personalInfo?.title || 'CV sans nom').trim() || 'CV sans nom'; }
export async function saveUserCv({ user, cv, templateId, accent, locale = 'fr', cvId, paid = false, reference = '' }) {
  const account = await upsertAccount(user);
  if (!cv?.personalInfo) { const error = new Error('CV invalide ou manquant.'); error.statusCode = 400; throw error; }
  const access = effectiveAccess(account.user);
  const now = Date.now();
  const id = cvId || `cv_${now}_${Math.random().toString(36).slice(2, 10)}`;
  const existingIndex = account.cvs.findIndex((item) => item.id === id);
  const existing = existingIndex >= 0 ? account.cvs[existingIndex] : null;
  // `paid` doit avoir été validé par l'appelant (référence GeniusPay vérifiée ou
  // droit serveur canDownloadPdf/admin). Un CV déjà payé le reste.
  const record = { id, title: cvTitle(cv), subtitle: String(cv?.personalInfo?.title || '').trim(), cv, templateId, accent: accent || '#10b981', locale, paid: Boolean(paid || access.canDownloadPdf || access.isAdmin || existing?.paid), reference: reference || existing?.reference || '', createdAt: existing?.createdAt || now, updatedAt: now };
  if (existingIndex >= 0) account.cvs[existingIndex] = record; else account.cvs.unshift(record);
  account.usage = { ...(account.usage || {}), cvsSaved: account.cvs.length, pdfDownloads: (account.usage?.pdfDownloads || 0) + (paid ? 1 : 0) };
  await saveAccount(account);
  return record;
}
export function setAccountPassword(account, password, { keepSessionToken = '' } = {}) {
  if (!String(password || '').trim()) return account;
  const sessions = keepSessionToken ? [newSessionEntry(keepSessionToken)] : [];
  account.auth = { ...(account.auth || {}), passwordHash: hashPassword(cleanNewPassword(password)), sessions, failedLogins: 0, lockedUntil: 0 };
  account.audit = [{ type: 'password_reset', at: Date.now() }, ...(account.audit || []).slice(0, 49)];
  return account;
}

export async function listAccounts() {
  const emails = new Set(await loadIndex());
  const s = store();
  if (typeof s.list === 'function') {
    try {
      const listed = await s.list({ prefix: 'account:' });
      for (const item of listed?.blobs || []) {
        const key = item.key || item.name;
        if (key && key.startsWith('account:')) { try { emails.add(Buffer.from(key.slice('account:'.length), 'base64url').toString('utf8').toLowerCase()); } catch {} }
      }
    } catch {}
  }
  const accounts = [];
  for (const email of emails) { const account = await loadAccount(email).catch(() => null); if (account?.user?.email) accounts.push(account); }
  return accounts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}
export function adminAccountSummary(account) {
  const access = effectiveAccess(account.user || {});
  return { user: { ...account.user, ...access }, cvCount: Array.isArray(account.cvs) ? account.cvs.length : 0, paidCvCount: Array.isArray(account.cvs) ? account.cvs.filter((cv) => cv.paid).length : 0, createdAt: account.createdAt, updatedAt: account.updatedAt, lastLoginAt: account.lastLoginAt || null };
}
export function publicAccount(account, sessionToken = '') {
  if (!account) return null;
  const access = effectiveAccess(account.user || {});
  return {
    user: sessionToken ? { ...account.user, ...access, sessionToken } : { ...account.user, ...access },
    cvs: Array.isArray(account.cvs) ? account.cvs.map((item) => ({ id: item.id, title: item.title, subtitle: item.subtitle, templateId: item.templateId, accent: item.accent, locale: item.locale, paid: Boolean(item.paid), reference: item.reference || '', createdAt: item.createdAt, updatedAt: item.updatedAt })) : [],
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
