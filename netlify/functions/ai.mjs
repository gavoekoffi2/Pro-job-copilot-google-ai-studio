const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// Budget de sortie généreux : une traduction/adaptation renvoie le CV COMPLET en JSON,
// ce qui peut être volumineux. Un budget trop faible tronque la réponse -> JSON invalide.
const DEFAULT_MAX_TOKENS = 8192;

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
Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans balises de réflexion, sans commentaire, sans texte avant ou après.
Commence ta réponse par "{" et termine-la par "}".
Le JSON doit respecter cette structure attendue autant que possible :
${JSON.stringify(schema || {}, null, 2)}`;
}

function normalizeChatText(data) {
  const message = data?.choices?.[0]?.message;
  let content = message?.content;
  if (Array.isArray(content)) {
    content = content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  if (typeof content === 'string' && content.trim()) return content;
  // Certains modèles « pensants » placent parfois tout dans reasoning quand le budget est juste.
  const reasoning = message?.reasoning || message?.reasoning_content;
  if (typeof reasoning === 'string' && reasoning.trim()) return reasoning;
  return '';
}

/** Retire les blocs de réflexion (<think>…</think>) et le markdown éventuel. */
function stripThinking(text) {
  return String(text || '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .trim();
}

function parseJsonResponse(text) {
  const trimmed = stripThinking(text);
  if (!trimmed) {
    throw new Error(
      "L'IA a renvoyé une réponse vide (réponse probablement tronquée). Réessayez ; si le problème persiste, le CV est peut-être trop long.",
    );
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    // 1) Bloc de code ```json ... ```
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        /* on continue */
      }
    }

    // 2) Premier objet / tableau JSON équilibré dans le texte.
    const candidate = extractBalancedJson(trimmed);
    if (candidate) {
      try {
        return JSON.parse(candidate);
      } catch {
        /* on continue */
      }
    }

    throw new Error("La réponse IA n'est pas un JSON valide.");
  }
}

/**
 * Extrait le premier objet ou tableau JSON « équilibré » d'une chaîne,
 * en tenant compte des chaînes de caractères et de l'échappement.
 * Plus fiable que indexOf('{')/lastIndexOf('}') quand du texte parasite entoure le JSON.
 */
function extractBalancedJson(text) {
  const startObj = text.indexOf('{');
  const startArr = text.indexOf('[');
  let start = -1;
  if (startObj === -1) start = startArr;
  else if (startArr === -1) start = startObj;
  else start = Math.min(startObj, startArr);
  if (start === -1) return null;

  const open = text[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function buildTextPrompt(prompt, schema) {
  return `${systemPromptForSchema(schema)}\n\nTÂCHE UTILISATEUR :\n${prompt}`;
}

function isPdf(mimeType) {
  return String(mimeType || '').toLowerCase().includes('pdf');
}

/**
 * Construit le contenu utilisateur pour OpenRouter.
 * - PDF -> type `file` (+ plugin file-parser, géré côté requête) ;
 * - Image -> type `image_url`.
 */
function openRouterUserContent(prompt, file) {
  const userContent = [];
  if (file?.base64Data && file?.mimeType) {
    const dataUrl = `data:${file.mimeType};base64,${file.base64Data}`;
    if (isPdf(file.mimeType)) {
      userContent.push({
        type: 'file',
        file: { filename: file.filename || 'cv.pdf', file_data: dataUrl },
      });
    } else {
      userContent.push({ type: 'image_url', image_url: { url: dataUrl } });
    }
  }
  userContent.push({ type: 'text', text: prompt });
  return userContent;
}

async function callOpenRouter({ prompt, schema, file }) {
  const apiKey = requireEnv('OPENROUTER_API_KEY');
  const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const siteUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    'https://pro-job-copilot-google-ai-studio.netlify.app';

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: systemPromptForSchema(schema) },
      { role: 'user', content: openRouterUserContent(prompt, file) },
    ],
    temperature: 0.2,
    max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS || DEFAULT_MAX_TOKENS),
    response_format: { type: 'json_object' },
    // Désactive la « réflexion » des modèles Gemini 2.5/o-series : elle consomme le budget de
    // sortie et fait tronquer le JSON, ce qui provoquait « La réponse IA n'est pas un JSON valide ».
    reasoning: { enabled: false },
  };

  // Pour les PDF, OpenRouter doit extraire le texte via le plugin file-parser.
  if (file?.base64Data && isPdf(file?.mimeType)) {
    requestBody.plugins = [{ id: 'file-parser', pdf: { engine: 'pdf-text' } }];
  }

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

  const finishReason = data?.choices?.[0]?.finish_reason;
  return {
    ok: true,
    text: normalizeChatText(data),
    finishReason,
    model,
    provider: 'openrouter',
  };
}

async function callNvidia({ prompt, schema, file }) {
  const apiKey = requireEnv('NVIDIA_API_KEY');
  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-405b-instruct';

  if (file?.base64Data && file?.mimeType) {
    // Le provider NVIDIA est configuré en mode texte : il ne peut pas lire un PDF/image.
    const error = new Error(
      "L'import de fichier (PDF/image) nécessite le provider OpenRouter. Configurez OPENROUTER_API_KEY, ou collez le texte du CV.",
    );
    error.statusCode = 422;
    throw error;
  }

  const requestBody = {
    model,
    messages: [{ role: 'user', content: buildTextPrompt(prompt, schema) }],
    max_tokens: Number(process.env.NVIDIA_MAX_TOKENS || DEFAULT_MAX_TOKENS),
    temperature: Number(process.env.NVIDIA_TEMPERATURE || 0.2),
    top_p: Number(process.env.NVIDIA_TOP_P || 0.95),
    stream: false,
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
    const message =
      data?.error?.message || data?.message || data?.detail || `NVIDIA API error ${response.status}`;
    return { ok: false, status: response.status, error: message };
  }

  const finishReason = data?.choices?.[0]?.finish_reason;
  return { ok: true, text: normalizeChatText(data), finishReason, model, provider: 'nvidia' };
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

    try {
      const parsed = parseJsonResponse(result.text);
      return json(200, { result: parsed, model: result.model, provider: result.provider });
    } catch (parseError) {
      // Si la réponse a été coupée par la limite de tokens, donne un message exploitable.
      if (result.finishReason === 'length') {
        return json(502, {
          error:
            "La réponse de l'IA a été tronquée (limite de longueur). Réessayez ; pour un CV très long, simplifiez-le ou augmentez OPENROUTER_MAX_TOKENS.",
          provider,
        });
      }
      throw parseError;
    }
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
