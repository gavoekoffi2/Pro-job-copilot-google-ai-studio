import { json } from './_utils.mjs';
import { loadSettings } from './_settings-store.mjs';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  const settings = await loadSettings();
  return json(200, { cvDownloadPriceXof: settings.cvDownloadPriceXof, currency: settings.currency });
}
