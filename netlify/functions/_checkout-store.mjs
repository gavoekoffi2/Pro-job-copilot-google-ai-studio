import { getStore } from '@netlify/blobs';

const STORE_NAME = 'pro-job-copilot-checkouts';
const TTL_DAYS = 14;

function store() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;

  if (siteID && token) {
    return getStore({ name: STORE_NAME, siteID, token });
  }

  return getStore(STORE_NAME);
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
