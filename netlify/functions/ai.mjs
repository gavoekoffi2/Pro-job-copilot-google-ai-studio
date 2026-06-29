const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Netlify coupe cette fonction synchrone à 30 s. On garde donc une marge côté
// OpenRouter pour renvoyer une erreur JSON propre au front au lieu d'un 502
// `Sandbox.Timedout` opaque.
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 24000);

// Budgets par défaut plus rapides. Les gros budgets (8192+) ralentissent parfois
// Gemini/OpenRouter jusqu'au timeout Netlify, surtout sur extraction PDF/OCR.
const DEFAULT_MAX_TOKENS_GENERATE = 4096;
const DEFAULT_MAX_TOKENS_ANALYZE = 2048;

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
  if (!value) {
    const messages = {
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

function isPdf(mimeType) {
  return String(mimeType || '').toLowerCase().includes('pdf');
}

/**
 * Construit le contenu utilisateur pour OpenRouter.
 * - PDF -> type `file` (+ plugin file-parser, géré côté requête) ;
 * - Image -> type `image_url`.
 */
function openRouterUserContent(prompt, file, imageDetail = 'high') {
  const userContent = [];
  if (file?.base64Data && file?.mimeType) {
    const dataUrl = `data:${file.mimeType};base64,${file.base64Data}`;
    if (isPdf(file.mimeType)) {
      userContent.push({
        type: 'file',
        file: { filename: file.filename || 'cv.pdf', file_data: dataUrl },
      });
    } else {
      // `detail: 'high'` force une analyse fine de l'image : indispensable pour lire le
      // petit texte d'un CV (au lieu d'une vignette basse résolution où seul le nom ressort).
      userContent.push({ type: 'image_url', image_url: { url: dataUrl, detail: imageDetail } });
    }
  }
  userContent.push({ type: 'text', text: prompt });
  return userContent;
}

/**
 * Convertit un schéma en schéma JSON « strict » (compatible structured outputs) :
 * chaque objet voit toutes ses propriétés rendues obligatoires et interdit les
 * propriétés supplémentaires. Cela force le modèle à RAISONNER sur chaque champ
 * (et donc à remplir toutes les sections du CV) au lieu de ne renvoyer que le nom.
 */
function buildStrictSchema(schema) {
  if (!schema || typeof schema !== 'object') return schema;
  if (schema.type === 'object' && schema.properties) {
    const properties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      properties[key] = buildStrictSchema(value);
    }
    return {
      ...schema,
      properties,
      required: Object.keys(properties),
      additionalProperties: false,
    };
  }
  if (schema.type === 'array' && schema.items) {
    return { ...schema, items: buildStrictSchema(schema.items) };
  }
  return schema;
}

// Modèle par tâche, tout via la même clé OpenRouter.
// Par défaut on garde Gemini pour les deux flux : il est disponible sur OpenRouter,
// rapide, économique, et compatible avec les imports PDF/image utilisés pour les CV.
// La génération reste surchargeable via OPENROUTER_MODEL_GENERATE si un autre modèle est validé.
function modelForTask(task) {
  const gemini = process.env.OPENROUTER_MODEL_ANALYZE || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
  const generate = process.env.OPENROUTER_MODEL_GENERATE || 'google/gemini-2.5-flash';
  return task === 'analyze' ? gemini : generate;
}

function maxTokensForTask(task) {
  if (process.env.OPENROUTER_MAX_TOKENS) return Number(process.env.OPENROUTER_MAX_TOKENS);
  return task === 'analyze' ? DEFAULT_MAX_TOKENS_ANALYZE : DEFAULT_MAX_TOKENS_GENERATE;
}

async function callOpenRouter({
  prompt,
  schema,
  file,
  task,
  systemPrompt,
  temperature = 0.2,
  pdfEngine = 'pdf-text',
  responseFormat,
  enableReasoning = false,
}) {
  const apiKey = requireEnv('OPENROUTER_API_KEY');
  const model = modelForTask(task);
  const siteUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    'https://pro-job-copilot-google-ai-studio.netlify.app';

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: systemPrompt || systemPromptForSchema(schema) },
      { role: 'user', content: openRouterUserContent(prompt, file) },
    ],
    temperature,
    max_tokens: maxTokensForTask(task),
    response_format: responseFormat || { type: 'json_object' },
    // Par défaut, la « réflexion » est coupée (elle consomme le budget et tronque le JSON).
    // Pour l'EXTRACTION depuis un fichier/image, on l'active : le modèle a besoin de
    // parcourir tout le document, sinon il ne renvoie que l'information la plus saillante (le nom).
    reasoning: { enabled: enableReasoning },
  };

  // Pour les PDF, OpenRouter traite le fichier via le plugin file-parser.
  // - `pdf-text` : extrait la couche texte (gratuit, idéal pour un PDF numérique) ;
  // - `mistral-ocr` : OCR pour les PDF SCANNÉS / composés d'images (CV photographiés,
  //   image collée dans Word puis exportée en PDF) — où `pdf-text` ne trouve aucun texte.
  if (file?.base64Data && isPdf(file?.mimeType)) {
    requestBody.plugins = [{ id: 'file-parser', pdf: { engine: pdfEngine } }];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-Title': 'Pro Job Copilot',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return {
        ok: false,
        status: 504,
        error:
          "Le service IA met trop de temps à répondre. Réessayez avec un CV plus léger, ou importez le texte du CV plutôt qu'un PDF scanné.",
      };
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

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

/**
 * Appel OpenRouter avec repli de format : tous les modèles/fournisseurs ne
 * supportent pas `json_schema`. En cas d'échec sur ce format, on réessaie en
 * `json_object` (le schéma reste décrit dans le prompt système).
 */
async function callWithFallback(options) {
  const result = await callOpenRouter(options);
  if (!result.ok && options.responseFormat?.type === 'json_schema') {
    return callOpenRouter({ ...options, responseFormat: { type: 'json_object' } });
  }
  return result;
}

async function repairJsonResponse({ badText, schema, task }) {
  const repairPrompt = `
Convertis la réponse ci-dessous en UN SEUL objet JSON valide.
Règles strictes :
- Ne garde que le JSON final.
- Supprime tout markdown, commentaire, phrase explicative, virgule finale ou texte hors JSON.
- Si une valeur manque, utilise une chaîne vide "" ou un tableau vide [] selon le schéma.
- Respecte ce schéma autant que possible :
${JSON.stringify(schema || {}, null, 2)}

Réponse à réparer :
${String(badText || '').slice(0, 60000)}
`;

  return callOpenRouter({
    prompt: repairPrompt,
    schema,
    task,
    file: null,
    temperature: 0,
    systemPrompt:
      'Tu es un réparateur JSON strict. Réponds uniquement avec un objet JSON valide, sans markdown ni texte autour.',
  });
}

/**
 * Détecte un résultat d'extraction « vide » : toutes les chaînes vides, tous les
 * tableaux vides, etc. C'est le cas typique d'un PDF scanné passé en `pdf-text`
 * (aucune couche texte) -> on bascule alors vers un moteur OCR.
 */
function isEmptyExtraction(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return value === false;
  if (Array.isArray(value)) return value.every(isEmptyExtraction);
  if (typeof value === 'object') return Object.values(value).every(isEmptyExtraction);
  return false;
}

/**
 * Parse la réponse, avec réparation automatique si le JSON est imparfait.
 * Lève une erreur (avec statusCode) si la réponse est irrécupérable.
 */
async function parseWithRepair(result, schema, task) {
  try {
    return {
      parsed: parseJsonResponse(result.text),
      model: result.model,
      provider: result.provider,
      repaired: false,
    };
  } catch (parseError) {
    // Réponse coupée par la limite de tokens : message exploitable, pas de réparation possible.
    if (result.finishReason === 'length') {
      const error = new Error(
        "La réponse de l'IA a été tronquée (limite de longueur). Réessayez ; pour un CV très long, simplifiez-le ou augmentez OPENROUTER_MAX_TOKENS.",
      );
      error.statusCode = 502;
      throw error;
    }
    // Deuxième chance : certains modèles renvoient du texte explicatif, des virgules
    // finales ou un objet JSON imparfait malgré response_format. On répare côté serveur.
    const repaired = await repairJsonResponse({ badText: result.text, schema, task });
    if (!repaired.ok) {
      const error = new Error(repaired.error);
      error.statusCode = repaired.status || 502;
      throw error;
    }
    return {
      parsed: parseJsonResponse(repaired.text),
      model: repaired.model,
      provider: repaired.provider,
      repaired: true,
    };
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { prompt, schema, file, task } = payload;
    if (!prompt || typeof prompt !== 'string') {
      return json(400, { error: 'Missing prompt' });
    }

    // Extraction depuis un fichier/image : on durcit la sortie pour que le modèle
    // remplisse TOUTES les sections du CV (et non seulement le nom) :
    //  - schéma JSON strict (tous les champs obligatoires) ;
    //  - raisonnement activé (le modèle parcourt tout le document) ;
    //  - température 0 (fidélité maximale à ce qui est écrit).
    const isExtraction = Boolean(file?.base64Data && schema);
    const useStrictExtraction = process.env.OPENROUTER_STRICT_EXTRACTION === 'true';
    const responseFormat = isExtraction && useStrictExtraction
      ? {
          type: 'json_schema',
          json_schema: { name: 'cv_extraction', strict: true, schema: buildStrictSchema(schema) },
        }
      : undefined;
    const callOptions = isExtraction
      ? {
          responseFormat,
          enableReasoning: process.env.OPENROUTER_ENABLE_EXTRACTION_REASONING === 'true',
          temperature: 0,
        }
      : {};

    // Chaîne de moteurs pour les PDF : on tente d'abord l'extraction du texte
    // (gratuite, parfaite pour un PDF numérique), puis l'OCR (mistral-ocr) si le PDF
    // est scanné / composé d'images et que le texte extrait est vide.
    const usePdfChain = Boolean(file?.base64Data && isPdf(file?.mimeType));
    const engines = usePdfChain
      ? (process.env.OPENROUTER_PDF_ENGINES || 'pdf-text')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [undefined];

    let lastEmpty = null;
    let lastError = null;

    for (const pdfEngine of engines) {
      let result;
      try {
        result = await callWithFallback({ prompt, schema, file, task, pdfEngine, ...callOptions });
      } catch (e) {
        lastError = e;
        continue;
      }
      if (!result.ok) {
        lastError = Object.assign(new Error(result.error), { statusCode: result.status || 502 });
        continue;
      }

      let out;
      try {
        out = await parseWithRepair(result, schema, task);
      } catch (e) {
        lastError = e;
        continue;
      }

      // PDF scanné + `pdf-text` -> JSON vide : on garde de côté et on tente le moteur OCR suivant.
      if (usePdfChain && engines.length > 1 && isEmptyExtraction(out.parsed)) {
        lastEmpty = out;
        continue;
      }

      return json(200, {
        result: out.parsed,
        model: out.model,
        provider: out.provider,
        ...(out.repaired ? { repaired: true } : {}),
      });
    }

    // Tous les moteurs tentés. On privilégie un résultat (même vide, le front
    // affichera un message clair) plutôt qu'une erreur opaque.
    if (lastEmpty) {
      return json(200, {
        result: lastEmpty.parsed,
        model: lastEmpty.model,
        provider: lastEmpty.provider,
      });
    }
    if (lastError) {
      return json(Number(lastError.statusCode) || 502, {
        error: lastError.message,
        provider: 'openrouter',
      });
    }
    return json(502, { error: "Aucune réponse de l'IA.", provider: 'openrouter' });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    return json(statusCode, {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}
