import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const STORE_NAME = 'pro-job-copilot-accounts';
const LOCAL_STORE_PATH = join(process.cwd(), '.netlify-local/accounts.json');

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

export function cleanAccountUser(user = {}) {
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  const phone = String(user.phone || '').trim();

  if (!name || !email || !phone) {
    const error = new Error('Nom, email et téléphone sont obligatoires pour le compte.');
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

function accountKey(email) {
  return `account:${Buffer.from(String(email).toLowerCase()).toString('base64url')}`;
}

function createEmptyAccount(user) {
  const now = Date.now();
  return {
    user,
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

export async function upsertAccount(user) {
  const cleanUser = cleanAccountUser(user);
  const existing = await loadAccount(cleanUser.email);
  const account = existing || createEmptyAccount(cleanUser);
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

export function publicAccount(account) {
  if (!account) return null;
  return {
    user: account.user,
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
