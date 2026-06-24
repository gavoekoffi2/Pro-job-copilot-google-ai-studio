const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

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

function configuredProvider() {
  return (process.env.AI_PROVIDER || (process.env.NVIDIA_API_KEY ? 'nvidia' : 'openrouter')).toLowerCase();
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const messages = {
      NVIDIA_API_KEY:
        "Configuration IA serveur manquante : ajoutez NVIDIA_API_KEY dans Netlify/GitHub pour activer l'analyse, la traduction et l'optimisation de CV.",
      OPENROUTER_API_KEY:
        "Configuration IA serveur manquante : ajoutez OPENROUTER_API_KEY dans Netlify/GitHub pour activer l'analyse, la traduction et l'optimisation de CV.",
    };
    const error = new Error(messages[name] || `${name} is not configured`);
    error.statusCode = 503;
    throw error;
  }
  return value;
}

function systemPromptForSchema(schema) {
  return `Tu es une API JSON stricte pour Pro Job Copilot.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans commentaire, sans texte avant/après.
Le JSON doit respecter cette structure attendue autant que possible :
${JSON.stringify(schema || {}, null, 2)}`;
}

function normalizeChatText(data) {
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
  if (!trimmed) throw new Error('Réponse IA vide.');
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) return JSON.parse(fenced[1]);

    const firstObject = trimmed.indexOf('{');
    const lastObject = trimmed.lastIndexOf('}');
    const firstArray = trimmed.indexOf('[');
    const lastArray = trimmed.lastIndexOf(']');

    if (firstObject !== -1 && lastObject > firstObject) {
      return JSON.parse(trimmed.slice(firstObject, lastObject + 1));
    }
    if (firstArray !== -1 && lastArray > firstArray) {
      return JSON.parse(trimmed.slice(firstArray, lastArray + 1));
    }
    throw new Error("La réponse IA n'est pas un JSON valide.");
  }
}

function buildTextPrompt(prompt, schema) {
  return `${systemPromptForSchema(schema)}\n\nTÂCHE UTILISATEUR :\n${prompt}`;
}

function openRouterUserContent(prompt, file) {
  const userContent = [];
  if (file?.base64Data && file?.mimeType) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:${file.mimeType};base64,${file.base64Data}` },
    });
  }
  userContent.push({ type: 'text', text: prompt });
  return userContent;
}

async function callOpenRouter({ prompt, schema, file }) {
  const apiKey = requireEnv('OPENROUTER_API_KEY');
  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://pro-job-copilot-google-ai-studio.netlify.app';

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: systemPromptForSchema(schema) },
      { role: 'user', content: openRouterUserContent(prompt, file) },
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
    return { ok: false, status: response.status, error: message };
  }

  return { ok: true, text: normalizeChatText(data), model, provider: 'openrouter' };
}

async function callNvidia({ prompt, schema, file }) {
  const apiKey = requireEnv('NVIDIA_API_KEY');
  const model = process.env.NVIDIA_MODEL || 'google/diffusiongemma-26b-a4b-it';

  let content = buildTextPrompt(prompt, schema);
  if (file?.base64Data && file?.mimeType) {
    // NVIDIA/Gemma endpoint utilisé ici est traité comme modèle texte. On garde une erreur claire
    // plutôt que d'envoyer une image non supportée silencieusement.
    content += `\n\nNOTE SYSTÈME : un fichier ${file.mimeType} a été joint, mais ce provider NVIDIA est configuré en mode texte. Si le contenu du fichier n'a pas été extrait côté navigateur, demandez à l'utilisateur de coller le texte du CV.`;
  }

  const requestBody = {
    model,
    messages: [{ role: 'user', content }],
    max_tokens: Number(process.env.NVIDIA_MAX_TOKENS || 4096),
    temperature: Number(process.env.NVIDIA_TEMPERATURE || 0.2),
    top_p: Number(process.env.NVIDIA_TOP_P || 0.95),
    stream: false,
    chat_template_kwargs: { enable_thinking: true },
  };

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || data?.message || data?.detail || `NVIDIA API error ${response.status}`;
    return { ok: false, status: response.status, error: message };
  }

  return { ok: true, text: normalizeChatText(data), model, provider: 'nvidia' };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { prompt, schema, file } = payload;
    if (!prompt || typeof prompt !== 'string') {
      return json(400, { error: 'Missing prompt' });
    }

    const provider = configuredProvider();
    let result;
    if (provider === 'nvidia') {
      result = await callNvidia({ prompt, schema, file });
    } else if (provider === 'openrouter') {
      result = await callOpenRouter({ prompt, schema, file });
    } else {
      return json(400, { error: `AI_PROVIDER non supporté : ${provider}` });
    }

    if (!result.ok) {
      return json(result.status || 502, { error: result.error, provider });
    }

    const parsed = parseJsonResponse(result.text);
    return json(200, { result: parsed, model: result.model, provider: result.provider });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}
