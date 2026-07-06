import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const STORE_NAME = 'jobtask-ai-settings';
const LOCAL_STORE_PATH = join(process.cwd(), '.jobtask-data/settings.json');
const SETTINGS_KEY = 'global';
const DEFAULTS = { cvDownloadPriceXof: 500, currency: 'XOF', updatedAt: 0 };

async function readLocalData() {
  try { return JSON.parse(await readFile(LOCAL_STORE_PATH, 'utf8')); } catch { return {}; }
}

function localStore() {
  return {
    async get(key) { const data = await readLocalData(); return data[key] || null; },
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
  if (siteID && token) return getStore({ name: STORE_NAME, siteID, token });
  if (process.env.NETLIFY || process.env.CONTEXT) return getStore(STORE_NAME);
  return localStore();
}

export async function loadSettings() {
  const saved = await store().get(SETTINGS_KEY, { type: 'json' }).catch(() => null);
  const price = Number(saved?.cvDownloadPriceXof || process.env.CV_DOWNLOAD_PRICE_XOF || DEFAULTS.cvDownloadPriceXof);
  return {
    ...DEFAULTS,
    ...(saved || {}),
    cvDownloadPriceXof: Number.isFinite(price) && price > 0 ? Math.round(price) : DEFAULTS.cvDownloadPriceXof,
    currency: 'XOF',
  };
}

export async function saveSettings(patch = {}) {
  const current = await loadSettings();
  const price = Number(patch.cvDownloadPriceXof ?? current.cvDownloadPriceXof);
  const next = {
    ...current,
    ...patch,
    cvDownloadPriceXof: Number.isFinite(price) && price > 0 ? Math.round(price) : current.cvDownloadPriceXof,
    currency: 'XOF',
    updatedAt: Date.now(),
  };
  await store().setJSON(SETTINGS_KEY, next);
  return next;
}
