import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

const STORE_NAME = 'jobtask-ai-accounts';
const LOCAL_STORE_PATH = join(process.cwd(), '.jobtask-data/accounts.json');

async function readLocalData() {
  try {
    return JSON.parse(await readFile(LOCAL_STORE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function localStore() {
  return {
    async get(key) {
      const data = await readLocalData();
      return data[key] || null;
    },
    async setJSON(key, value) {
      const data = await readLocalData();
      data[key] = value;
      await mkdir(dirname(LOCAL_STORE_PATH), { recursive: true });
      await writeFile(LOCAL_STORE_PATH, JSON.stringify(data, null, 2));
    },
  };
}

function store() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

  if (siteID && token) {
    return getStore({ name: STORE_NAME, siteID, token });
  }

  if (process.env.NETLIFY || process.env.CONTEXT) {
    return getStore(STORE_NAME);
  }

  return localStore();
}

export function cleanAccountUser(user = {}, { requireName = true, requirePhone = true } = {}) {
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  const phone = String(user.phone || '').trim();

  if (!email) {
    const error = new Error('Email obligatoire pour le compte.');
    error.statusCode = 400;
    throw error;
  }
  if (requireName && !name) {
    const error = new Error('Nom complet obligatoire pour créer le compte.');
    error.statusCode = 400;
    throw error;
  }
  if (requirePhone && !phone) {
    const error = new Error('Téléphone obligatoire pour créer le compte.');
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

function cleanPassword(password) {
  const value = String(password || '');
  if (value.length < 6) {
    const error = new Error('Mot de passe obligatoire (minimum 6 caractères).');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function hashPassword(password, salt = randomBytes(16).toString('base64url')) {
  const hash = scryptSync(password, salt, 64).toString('base64url');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored = '') {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = Buffer.from(scryptSync(password, salt, 64).toString('base64url'));
  const expected = Buffer.from(hash);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function hashSessionToken(token) {
  return createHash('sha256').update(String(token)).digest('base64url');
}

function newSessionToken() {
  return randomBytes(32).toString('base64url');
}

function accountKey(email) {
  return `account:${Buffer.from(String(email).toLowerCase()).toString('base64url')}`;
}

function createEmptyAccount(user, password) {
  const now = Date.now();
  return {
    user,
    auth: { passwordHash: hashPassword(cleanPassword(password)), sessions: [] },
    cvs: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function loadAccount(email) {
  if (!email) return null;
  return store().get(accountKey(email), { type: 'json' });
}

export async function saveAccount(account) {
  const email = account?.user?.email;
  if (!email) throw new Error('Email compte manquant.');
  await store().setJSON(accountKey(email), {
    ...account,
    updatedAt: Date.now(),
  });
}

export async function registerOrLoginAccount(user = {}) {
  const cleanUser = cleanAccountUser(user);
  const password = cleanPassword(user.password);
  const existing = await loadAccount(cleanUser.email);
  const account = existing || createEmptyAccount(cleanUser, password);

  if (existing?.auth?.passwordHash && !verifyPassword(password, existing.auth.passwordHash)) {
    const error = new Error('Mot de passe incorrect pour ce compte.');
    error.statusCode = 401;
    throw error;
  }

  if (!account.auth?.passwordHash) {
    account.auth = { passwordHash: hashPassword(password), sessions: [] };
  }

  account.user = { ...account.user, ...cleanUser };
  const sessionToken = newSessionToken();
  account.auth.sessions = [
    { hash: hashSessionToken(sessionToken), createdAt: Date.now() },
    ...(account.auth.sessions || []).slice(0, 4),
  ];
  await saveAccount(account);
  return { account, sessionToken };
}

export async function authenticateAccount(user = {}) {
  const cleanUser = cleanAccountUser(user, { requireName: false, requirePhone: false });
  const account = await loadAccount(cleanUser.email);
  if (!account) {
    const error = new Error('Compte introuvable. Créez le compte avant de continuer.');
    error.statusCode = 404;
    throw error;
  }

  const sessionToken = String(user.sessionToken || '');
  if (sessionToken) {
    const tokenHash = hashSessionToken(sessionToken);
    if ((account.auth?.sessions || []).some((session) => session.hash === tokenHash)) return account;
  }

  if (user.password && account.auth?.passwordHash && verifyPassword(String(user.password), account.auth.passwordHash)) return account;

  const error = new Error('Connexion requise : email ou mot de passe incorrect.');
  error.statusCode = 401;
  throw error;
}

export async function upsertAccount(user) {
  const cleanUser = cleanAccountUser(user);
  const existing = await loadAccount(cleanUser.email);
  const account = existing || createEmptyAccount(cleanUser, user.password || randomBytes(12).toString('base64url'));
  account.user = { ...account.user, ...cleanUser };
  await saveAccount(account);
  return account;
}

function cvTitle(cv) {
  return String(cv?.personalInfo?.fullName || cv?.personalInfo?.title || 'CV sans nom').trim() || 'CV sans nom';
}

export async function saveUserCv({ user, cv, templateId, accent, locale = 'fr', cvId, paid = false, reference = '' }) {
  const account = await upsertAccount(user);
  if (!cv?.personalInfo) {
    const error = new Error('CV invalide ou manquant.');
    error.statusCode = 400;
    throw error;
  }

  const now = Date.now();
  const id = cvId || `cv_${now}_${Math.random().toString(36).slice(2, 10)}`;
  const existingIndex = account.cvs.findIndex((item) => item.id === id);
  const existing = existingIndex >= 0 ? account.cvs[existingIndex] : null;
  const record = {
    id,
    title: cvTitle(cv),
    subtitle: String(cv?.personalInfo?.title || '').trim(),
    cv,
    templateId,
    accent: accent || '#10b981',
    locale,
    paid: Boolean(paid || existing?.paid),
    reference: reference || existing?.reference || '',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    account.cvs[existingIndex] = record;
  } else {
    account.cvs.unshift(record);
  }

  await saveAccount(account);
  return record;
}

export function publicAccount(account, sessionToken = '') {
  if (!account) return null;
  return {
    user: sessionToken ? { ...account.user, sessionToken } : account.user,
    cvs: Array.isArray(account.cvs)
      ? account.cvs.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          templateId: item.templateId,
          accent: item.accent,
          locale: item.locale,
          paid: Boolean(item.paid),
          reference: item.reference || '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))
      : [],
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
