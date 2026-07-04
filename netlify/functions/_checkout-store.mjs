import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const STORE_NAME = 'jobtask-ai-checkouts';
const LOCAL_STORE_PATH = join(process.cwd(), '.jobtask-data/checkouts.json');
const TTL_DAYS = 14;

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
    async delete(key) {
      const data = await readLocalData();
      delete data[key];
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

export async function saveCheckoutRecord(reference, record) {
  if (!reference) throw new Error('Référence paiement manquante pour sauvegarder le CV.');
  const expiresAt = Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000;
  await store().setJSON(reference, {
    ...record,
    reference,
    createdAt: record.createdAt || Date.now(),
    expiresAt,
  });
}

export async function loadCheckoutRecord(reference) {
  if (!reference) return null;
  const record = await store().get(reference, { type: 'json' });
  if (!record) return null;
  if (record.expiresAt && record.expiresAt < Date.now()) {
    await store().delete(reference).catch(() => {});
    return null;
  }
  return record;
}
