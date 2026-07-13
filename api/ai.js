import { handler as netlifyAiHandler } from '../netlify/functions/ai.mjs';

function normalizeBody(body) {
  if (typeof body === 'string') return body;
  if (body == null) return '{}';
  return JSON.stringify(body);
}

export default async function handler(req, res) {
  const result = await netlifyAiHandler({
    httpMethod: req.method,
    headers: req.headers || {},
    body: normalizeBody(req.body),
  });

  for (const [key, value] of Object.entries(result.headers || {})) {
    res.setHeader(key, value);
  }
  res.status(result.statusCode || 200).send(result.body || '');
}
