const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function systemPromptForSchema(schema) {
  return `Tu es une API JSON stricte pour Pro Job Copilot.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans commentaire, sans texte avant/après.
Le JSON doit respecter cette structure attendue autant que possible :
${JSON.stringify(schema || {}, null, 2)}`;
}

function normalizeOpenRouterText(data) {
  const message = data?.choices?.[0]?.message;
  const content = message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  return '';
}

function parseJsonResponse(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) throw new Error("Réponse IA vide.");
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i) || trimmed.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) return JSON.parse(match[1]);
    throw new Error("La réponse IA n'est pas un JSON valide.");
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const apiKey = requireEnv('OPENROUTER_API_KEY');
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://pro-job-copilot-google-ai-studio.netlify.app';

    const payload = JSON.parse(event.body || '{}');
    const { prompt, schema, file } = payload;
    if (!prompt || typeof prompt !== 'string') {
      return json(400, { error: 'Missing prompt' });
    }

    const userContent = [];
    if (file?.base64Data && file?.mimeType) {
      userContent.push({
        type: 'image_url',
        image_url: { url: `data:${file.mimeType};base64,${file.base64Data}` },
      });
    }
    userContent.push({ type: 'text', text: prompt });

    const requestBody = {
      model,
      messages: [
        { role: 'system', content: systemPromptForSchema(schema) },
        { role: 'user', content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-Title': 'Pro Job Copilot',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || data?.message || `OpenRouter error ${response.status}`;
      return json(response.status, { error: message });
    }

    const text = normalizeOpenRouterText(data);
    const parsed = parseJsonResponse(text);
    return json(200, { result: parsed, model });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
