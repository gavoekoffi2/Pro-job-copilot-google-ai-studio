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

/** Réinjecte des ids stables et des valeurs par défaut sur une sortie IA partielle. */
export function normalizeCV(partial: any, previous?: CVData): CVData {
  const p = partial?.personalInfo ?? {};
  return {
    personalInfo: {
      fullName: p.fullName ?? '',
      title: p.title ?? '',
      email: p.email ?? '',
      phone: p.phone ?? '',
      address: p.address ?? '',
      website: p.website ?? '',
      linkedin: p.linkedin ?? '',
      summary: p.summary ?? '',
      // La photo n'est jamais envoyée à l'IA : on la conserve depuis l'état précédent.
      photo: previous?.personalInfo.photo,
    },
    experiences: (partial?.experiences ?? []).map((e: any) => ({
      id: uid('exp'),
      title: e.title ?? '',
      company: e.company ?? '',
      location: e.location ?? '',
      startDate: e.startDate ?? '',
      endDate: e.endDate ?? '',
      current: Boolean(e.current),
      description: e.description ?? '',
    })),
    education: (partial?.education ?? []).map((e: any) => ({
      id: uid('edu'),
      degree: e.degree ?? '',
      school: e.school ?? '',
      location: e.location ?? '',
      year: e.year ?? '',
      description: e.description ?? '',
    })),
    skills: (partial?.skills ?? []).map((s: any) => ({
      id: uid('sk'),
      name: s.name ?? '',
      level: VALID_LEVELS.includes(s.level) ? s.level : 'Intermédiaire',
    })),
    languages: (partial?.languages ?? []).map((l: any) => ({
      id: uid('lg'),
      name: typeof l === 'string' ? l : l.name ?? '',
      level: typeof l === 'string' ? '' : l.level ?? '',
    })),
    certifications: (partial?.certifications ?? []).map((c: any) => ({
      id: uid('cert'),
      name: c.name ?? '',
      issuer: c.issuer ?? '',
      year: c.year ?? '',
    })),
    interests: partial?.interests ?? [],
  };
}

/** Retire la photo (lourde) avant tout envoi à l'IA. */
function stripPhoto(data: CVData): CVData {
  return {
    ...data,
    personalInfo: { ...data.personalInfo, photo: undefined },
  };
}

async function generateJson(prompt: string, schema: Schema): Promise<any> {
  const response = await fetch('/.netlify/functions/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, schema }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Erreur lors de l'appel IA.");
  }
  return data.result;
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
  return (await generateJson(prompt, analysisSchema)) as AnalysisResult;
}

/** Améliore le contenu d'un CV (orthographe, style, verbes d'action). */
export async function optimizeCVContent(currentData: CVData): Promise<CVData> {
  ensureKey();
  const prompt = `
Tu es un rédacteur de CV professionnel. Améliore le contenu du CV JSON suivant.
1. Corrige l'orthographe et la grammaire.
2. Rends le résumé ("summary") plus percutant et orienté résultats.
3. Reformule les descriptions d'expériences avec des verbes d'action et des réalisations chiffrées si possible.
4. Conserve les faits (dates, noms, entreprises) ; améliore uniquement la forme.
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
Conserve tout le contenu existant non concerné par la demande.
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
Extrais toutes les informations possibles. Laisse vide les champs absents.
Pour les compétences, estime le niveau (Intermédiaire/Avancé) selon le contexte.
Conserve la langue d'origine.

Texte brut :
${rawText.substring(0, 50000)}
`;
  const result = await generateJson(prompt, cvSchema);
  return normalizeCV(result);
}

/** Structure un CV depuis un fichier (PDF ou image) en CVData. */
export async function parseCVFromFile(
  base64Data: string,
  mimeType: string,
): Promise<CVData> {
  ensureKey();
  const prompt = `
Analyse ce document (CV). Transforme son contenu en JSON strictement formaté selon le schéma fourni.
Extrais le contact, les expériences, formations, compétences, langues, certifications et centres d'intérêt.
Conserve la langue d'origine. Laisse vide ce qui est absent.
`;
  const response = await fetch('/.netlify/functions/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      schema: cvSchema,
      file: { base64Data, mimeType },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Impossible de structurer le CV.');
  }
  return normalizeCV(data.result);
}
