import type { AnalysisResult, CVData } from '../types';
import { uid } from '../lib/utils';

type Schema = Record<string, any>;

const Type = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
} as const;

// Les clés IA restent côté serveur Netlify. Le front appelle seulement la fonction sécurisée.
export const hasApiKey = true;

/* ----------------------------- Schémas ----------------------------- */

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: 'Score global sur 100, sévère mais juste.',
    },
    summary: { type: Type.STRING, description: "Résumé bref de l'analyse." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Actions concrètes pour améliorer le CV.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Mots-clés ATS recommandés à intégrer.',
    },
  },
  required: ['score', 'summary', 'strengths', 'weaknesses', 'suggestions', 'keywords'],
};

// Schéma CV sans `id` ni `photo` (générés/réattachés côté client pour économiser des tokens).
const cvSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        title: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        address: { type: Type.STRING },
        website: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
    },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          description: {
            type: Type.STRING,
            description: 'Une réalisation par ligne (séparées par des sauts de ligne).',
          },
        },
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          location: { type: Type.STRING },
          year: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: {
            type: Type.STRING,
            description: 'Débutant, Intermédiaire, Avancé ou Expert.',
          },
        },
      },
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.STRING },
        },
      },
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING },
          year: { type: Type.STRING },
        },
      },
    },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

/* ----------------------------- Helpers ----------------------------- */

function ensureKey() {
  // La présence de la clé est vérifiée côté fonction Netlify afin de ne jamais exposer OPENROUTER_API_KEY au navigateur.
}

const VALID_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
const EMPTY_TEXT_MARKERS = new Set(['null', 'undefined', 'n/a', 'na', 'néant', 'aucun', 'aucune']);

function cleanText(value: unknown): string {
  if (value == null) return '';
  const text = String(value).trim();
  return EMPTY_TEXT_MARKERS.has(text.toLowerCase()) ? '' : text;
}

function cleanTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(cleanText).filter(Boolean);
}

/** Réinjecte des ids stables et des valeurs par défaut sur une sortie IA partielle. */
export function normalizeCV(partial: any, previous?: CVData): CVData {
  const p = partial?.personalInfo ?? {};
  return {
    personalInfo: {
      fullName: cleanText(p.fullName),
      title: cleanText(p.title),
      email: cleanText(p.email),
      phone: cleanText(p.phone),
      address: cleanText(p.address),
      website: cleanText(p.website),
      linkedin: cleanText(p.linkedin),
      summary: cleanText(p.summary),
      // La photo n'est jamais envoyée à l'IA : on la conserve depuis l'état précédent.
      photo: previous?.personalInfo.photo,
      showPhoto: previous?.personalInfo.showPhoto ?? true,
    },
    experiences: (partial?.experiences ?? []).map((e: any) => ({
      id: uid('exp'),
      title: cleanText(e.title),
      company: cleanText(e.company),
      location: cleanText(e.location),
      startDate: cleanText(e.startDate),
      endDate: cleanText(e.endDate),
      current: Boolean(e.current),
      description: cleanText(e.description),
    })),
    education: (partial?.education ?? []).map((e: any) => ({
      id: uid('edu'),
      degree: cleanText(e.degree),
      school: cleanText(e.school),
      location: cleanText(e.location),
      year: cleanText(e.year),
      description: cleanText(e.description),
    })),
    skills: (partial?.skills ?? []).map((s: any) => {
      const level = cleanText(s.level);
      return {
        id: uid('sk'),
        name: cleanText(s.name),
        // Ne jamais inventer un niveau lors d'un import. L'utilisateur peut le
        // préciser ensuite dans l'éditeur si le CV source ne l'indique pas.
        level: VALID_LEVELS.includes(level) ? level : '',
      };
    }),
    languages: (partial?.languages ?? []).map((l: any) => ({
      id: uid('lg'),
      name: typeof l === 'string' ? cleanText(l) : cleanText(l.name),
      level: typeof l === 'string' ? '' : cleanText(l.level),
    })),
    certifications: (partial?.certifications ?? []).map((c: any) => ({
      id: uid('cert'),
      name: cleanText(c.name),
      issuer: cleanText(c.issuer),
      year: cleanText(c.year),
    })),
    interests: cleanTextArray(partial?.interests),
  };
}

/** Vrai si l'extraction n'a remonté aucune information exploitable. */
function isCVEmpty(cv: CVData): boolean {
  const p = cv.personalInfo;
  const hasPersonal = [p.fullName, p.title, p.email, p.phone, p.summary, p.address].some(
    (v) => (v ?? '').trim().length > 0,
  );
  return (
    !hasPersonal &&
    cv.experiences.length === 0 &&
    cv.education.length === 0 &&
    cv.skills.length === 0 &&
    cv.languages.length === 0 &&
    cv.certifications.length === 0 &&
    cv.interests.length === 0
  );
}

const EMPTY_EXTRACTION_MESSAGE =
  "Aucune information n'a pu être détectée dans ce document. Si votre CV est une image scannée ou une photo, assurez-vous qu'il est net et bien lisible, puis réessayez (un PDF ou une photo plus nette donne de meilleurs résultats).";

/** Retire la photo (lourde) avant tout envoi à l'IA. */
function stripPhoto(data: CVData): CVData {
  return {
    ...data,
    personalInfo: { ...data.personalInfo, photo: undefined },
  };
}

function aiEndpointCandidates(): string[] {
  const configured = import.meta.env.VITE_AI_ENDPOINT?.trim();
  if (configured) return [configured];

  const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
  const endpoints = isVercel
    ? ['/api/ai', '/.netlify/functions/ai']
    : ['/.netlify/functions/ai', '/api/ai'];

  return Array.from(new Set(endpoints));
}

function parseAiPayload(raw: string): any {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function shouldTryNextAiEndpoint(response: Response, raw: string) {
  const contentType = response.headers.get('content-type') || '';
  return response.status === 404 || (contentType.includes('text/html') && raw.trim().startsWith('<!DOCTYPE'));
}

async function postAi(body: Record<string, unknown>): Promise<any> {
  const endpoints = aiEndpointCandidates();
  let lastNetworkError: unknown = null;
  let lastResponseError: Error | null = null;

  for (const endpoint of endpoints) {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      lastNetworkError = error;
      continue;
    }

    const raw = await response.text().catch(() => '');
    const data = parseAiPayload(raw);

    if (response.ok) {
      if (data?.result == null) {
        throw new Error("Réponse IA incomplète. Réessayez dans un instant.");
      }
      return data.result;
    }

    if (shouldTryNextAiEndpoint(response, raw)) {
      lastResponseError = new Error(`Endpoint IA introuvable (${response.status}) : ${endpoint}`);
      continue;
    }

    const requestId = response.headers.get('x-nf-request-id');
    const rawMessage = raw && raw.length < 300 && !raw.trim().startsWith('<') ? raw.trim() : '';
    const fallback = rawMessage
      ? `Service IA indisponible (${response.status}) : ${rawMessage}${requestId ? ` — ID ${requestId}` : ''}`
      : `Erreur serveur IA (${response.status}). Réessayez dans un instant${requestId ? ` — ID ${requestId}` : ''}.`;
    throw new Error(data?.error || fallback);
  }

  if (lastResponseError) {
    throw new Error("Service IA introuvable sur ce déploiement. L'import CV doit être publié avec le serveur Node.js Hostinger et la route /.netlify/functions/ai.");
  }
  if (lastNetworkError) {
    throw new Error('Connexion au service IA impossible. Vérifiez votre connexion et réessayez.');
  }
  throw new Error('Service IA indisponible. Réessayez dans un instant.');
}

// 'analyze' -> analyse/scoring ; 'generate' -> rédaction/extraction/import CV.
// Les modèles exacts sont choisis côté fonction Netlify via OpenRouter.
type AiTask = 'analyze' | 'generate';

async function generateJson(prompt: string, schema: Schema, task: AiTask = 'generate'): Promise<any> {
  return postAi({ prompt, schema, task });
}

/* --------------------------- Fonctions IA --------------------------- */

/** Analyse un CV (texte ou JSON) et renvoie un diagnostic structuré. */
export async function analyzeCVContent(cvText: string): Promise<AnalysisResult> {
  ensureKey();
  let textToAnalyze = cvText;
  try {
    const json = JSON.parse(cvText);
    if (json.personalInfo) textToAnalyze = JSON.stringify(stripPhoto(json));
  } catch {
    /* texte brut */
  }

  const prompt = `
Tu es un expert en recrutement international et en optimisation ATS.
Analyse le CV ci-dessous : clarté, structure, impact des descriptions, pertinence professionnelle,
et compatibilité avec les filtres ATS. Donne un score sévère mais juste sur 100.
Réponds dans la même langue que le CV.

Contenu du CV :
${textToAnalyze.substring(0, 100000)}
`;
  return (await generateJson(prompt, analysisSchema, 'analyze')) as AnalysisResult;
}

/** Améliore le contenu d'un CV (orthographe, style, verbes d'action). */
export async function optimizeCVContent(currentData: CVData): Promise<CVData> {
  ensureKey();
  const prompt = `
Tu es un rédacteur de CV professionnel. Améliore le contenu du CV JSON suivant.
RÈGLE ANTI-HALLUCINATION PRIORITAIRE : n'ajoute jamais de diplôme, entreprise, date, chiffre,
compétence, langue, certification, lieu ou information personnelle qui n'existe pas déjà dans le CV.
Si une donnée manque, laisse-la vide ou conserve l'information existante ; ne la remplace pas par une donnée plausible.
1. Corrige l'orthographe et la grammaire.
2. Rends le résumé ("summary") plus percutant sans ajouter de faits nouveaux.
3. Reformule les descriptions d'expériences avec des verbes d'action, mais n'ajoute des chiffres QUE s'ils sont déjà présents.
4. Conserve strictement les faits (dates, noms, entreprises, lieux, diplômes).
5. Garde la même langue que le CV original.

Données actuelles :
${JSON.stringify(stripPhoto(currentData))}
`;
  const result = await generateJson(prompt, cvSchema);
  return normalizeCV(result, currentData);
}

/**
 * Applique une instruction en langage naturel au CV et renvoie le CV complet mis à jour,
 * en intégrant la modification au bon endroit avec une mise en forme soignée.
 */
export async function applyModifications(
  currentData: CVData,
  instruction: string,
): Promise<CVData> {
  ensureKey();
  const prompt = `
Tu es un assistant de rédaction de CV. Voici le CV actuel au format JSON et une demande de modification.
Applique la demande en INTÉGRANT le changement au bon endroit (bonne section, bon ordre chronologique),
avec une rédaction professionnelle et une mise en forme cohérente avec le reste du CV.
RÈGLE ANTI-HALLUCINATION PRIORITAIRE :
- Si l'utilisateur demande d'ajouter une information précise, ajoute uniquement les détails explicitement fournis dans la demande.
- Si un détail est absent (date, entreprise, lieu, diplôme, chiffre, contact), laisse ce champ vide au lieu d'inventer.
- Ne crée jamais d'expérience, diplôme, certification, langue ou compétence plausible pour "compléter".
- Conserve tout le contenu existant non concerné par la demande sans inventer de nouveaux faits.
Réponds dans la même langue que le CV. Renvoie le CV COMPLET mis à jour (schéma JSON imposé).

Demande de modification :
"${instruction}"

CV actuel :
${JSON.stringify(stripPhoto(currentData))}
`;
  const result = await generateJson(prompt, cvSchema);
  return normalizeCV(result, currentData);
}

/** Traduit l'intégralité d'un CV dans une langue cible (vocabulaire métier adapté). */
export async function translateCV(
  currentData: CVData,
  targetLanguageLabel: string,
): Promise<CVData> {
  ensureKey();
  const prompt = `
Traduis l'intégralité de ce CV (JSON) en ${targetLanguageLabel}.
Règles :
1. Traduis tous les textes (titre, résumé, descriptions, compétences, niveaux, centres d'intérêt).
2. Adapte le vocabulaire professionnel et les intitulés de poste aux usages du pays/langue cible.
3. NE traduis PAS les noms propres (personnes, entreprises, écoles) ni les e-mails/URL.
4. Conserve les dates et la structure à l'identique.
Renvoie le CV complet traduit (même schéma JSON).

CV :
${JSON.stringify(stripPhoto(currentData))}
`;
  const result = await generateJson(prompt, cvSchema);
  return normalizeCV(result, currentData);
}

/** Adapte un CV à une offre d'emploi précise (ATS-friendly). */
export async function tailorCVToJob(
  cvText: string,
  jobDescription: string,
): Promise<CVData> {
  ensureKey();
  const prompt = `
Adapte le CV ci-dessous pour qu'il corresponde parfaitement à l'offre d'emploi (optimisé ATS).
1. Extrais les informations du CV et restructure-les selon le schéma JSON.
2. Réécris le résumé pour refléter les mots-clés de l'offre.
3. Mets en avant les compétences demandées présentes dans le CV.
4. Ajuste les descriptions d'expériences pour montrer la pertinence par rapport au poste.
5. Réponds dans la langue de l'offre. N'invente pas de fausses expériences.

Offre d'emploi :
${jobDescription.substring(0, 50000)}

CV original :
${cvText.substring(0, 50000)}
`;
  const result = await generateJson(prompt, cvSchema);
  return normalizeCV(result);
}

/** Structure un texte brut de CV en CVData. */
export async function parseCVFromText(rawText: string): Promise<CVData> {
  ensureKey();
  const prompt = `
Transforme le texte brut de ce CV en JSON strictement formaté selon le schéma.
RÈGLE ANTI-HALLUCINATION PRIORITAIRE : extrais uniquement les informations écrites dans le texte.
N'invente jamais de nom, e-mail, téléphone, poste, entreprise, dates, école, diplôme, compétence,
langue, certification, niveau ou centre d'intérêt. Si une information est absente ou illisible, laisse
le champ vide ou le tableau vide. Ne complète pas avec des exemples.
Extrais toutes les informations visibles et conserve la langue d'origine.

Texte brut :
${rawText.substring(0, 50000)}
`;
  const result = await generateJson(prompt, cvSchema);
  const cv = normalizeCV(result);
  if (isCVEmpty(cv)) throw new Error(EMPTY_EXTRACTION_MESSAGE);
  return cv;
}

/** Structure un CV depuis un fichier (PDF ou image) en CVData. */
export async function parseCVFromFile(
  base64Data: string,
  mimeType: string,
  filename?: string,
): Promise<CVData> {
  ensureKey();

  // Garde-fou de taille : la fonction Netlify (sync) limite la requête à ~6 Mo.
  // Le base64 gonfle la taille d'environ 1/3 ; on bloque au-delà avec un message clair.
  const approxBytes = Math.ceil((base64Data.length * 3) / 4);
  if (approxBytes > 4_500_000) {
    throw new Error(
      'Ce fichier est trop volumineux (max ~4,5 Mo). Compressez votre CV, réduisez le nombre de pages, ou importez-le sous forme d\'image (JPG/PNG) ou de PDF plus léger.',
    );
  }

  const prompt = `
Tu es un expert en extraction de données de CV avec OCR. Tu reçois un CV sous forme de fichier
(PDF ou image), éventuellement SCANNÉ ou PHOTOGRAPHIÉ (par ex. une image collée dans un document
puis exportée en PDF).

ÉTAPES OBLIGATOIRES :
1. Lis INTÉGRALEMENT le document, de haut en bas et de gauche à droite — y compris les COLONNES
   latérales, les en-têtes, pieds de page, encadrés et icônes. Fais l'OCR si c'est une image/scan,
   même de mauvaise qualité.
2. Repère chaque section : coordonnées, titre/poste, résumé/profil, expériences professionnelles,
   formations/diplômes, compétences, langues, certifications, centres d'intérêt.
3. Pour CHAQUE expérience visible, crée une entrée distincte : poste, entreprise, lieu, date de
   début, date de fin (ou "en cours"), et la description complète des missions/réalisations
   (une réalisation par ligne).
4. Pour CHAQUE formation, compétence, langue, certification et centre d'intérêt visible, crée
   aussi une entrée distincte.

RÈGLES STRICTES ANTI-HALLUCINATION :
- N'OMETS RIEN de ce qui est visible. Ne te limite SURTOUT PAS au nom et aux coordonnées.
- Recopie fidèlement les textes visibles : n'invente pas, ne complète pas, ne devine pas.
- Si une zone est illisible ou si une donnée n'est pas clairement présente, laisse le champ vide ou le tableau vide.
- Ne génère jamais de diplôme, école, entreprise, poste, date, lieu, chiffre, langue, niveau,
  certification ou compétence plausible pour remplacer une donnée absente.
- Pour les niveaux de compétences/langues, utilise uniquement un niveau écrit dans le CV ; sinon laisse vide.
- Conserve la langue d'origine du document.
- Ne laisse un champ vide QUE si l'information est réellement absente ou illisible dans le document.

Renvoie uniquement le JSON structuré selon le schéma imposé, avec TOUTES les sections remplies.
`;
  const result = await postAi({
    prompt,
    schema: cvSchema,
    task: 'generate',
    file: { base64Data, mimeType, filename },
  });
  const cv = normalizeCV(result);
  if (isCVEmpty(cv)) throw new Error(EMPTY_EXTRACTION_MESSAGE);
  return cv;
}
