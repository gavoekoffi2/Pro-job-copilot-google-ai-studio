import type { TemplateId, TemplateMeta } from '../types';

/** Couleurs d'accent proposées dans le créateur. */
export const ACCENT_PRESETS = [
  '#10b981', // émeraude
  '#059669', // émeraude foncé
  '#f59e0b', // or
  '#2563eb', // bleu
  '#4f46e5', // indigo
  '#7c3aed', // violet
  '#db2777', // rose
  '#dc2626', // rouge
  '#0d9488', // sarcelle
  '#0f172a', // encre
] as const;

/** Catalogue des modèles premium. */
export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'sahel',
    name: 'Sahel',
    category: 'Moderne',
    description: 'Bandeau d’en-tête épuré, mise en page aérée et lisible.',
    accent: '#10b981',
    hasPhoto: true,
  },
  {
    id: 'dakar',
    name: 'Dakar',
    category: 'Professionnel',
    description: 'Bande latérale sombre élégante, contenu structuré.',
    accent: '#0f172a',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'Professionnel',
    description: 'Style corporate intemporel, typographie sérif raffinée.',
    accent: '#1e3a8a',
    hasPhoto: false,
  },
  {
    id: 'lagos',
    name: 'Lagos',
    category: 'Créatif',
    description: 'En-tête couleur audacieux, idéal pour se démarquer.',
    accent: '#7c3aed',
    hasPhoto: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    category: 'Minimaliste',
    description: 'Ultra épuré, beaucoup d’espace, élégance discrète.',
    accent: '#0f172a',
    hasPhoto: false,
  },
  {
    id: 'kigali',
    name: 'Kigali',
    category: 'Moderne',
    description: 'Colonne latérale à droite, photo mise en valeur.',
    accent: '#0d9488',
    hasPhoto: true,
  },
  {
    id: 'abidjan',
    name: 'Abidjan',
    category: 'Créatif',
    description: 'Expériences en frise chronologique dynamique.',
    accent: '#f59e0b',
    hasPhoto: true,
  },
  {
    id: 'horizon',
    name: 'Horizon',
    category: 'Moderne',
    description: 'Large bandeau dégradé, grille moderne et nette.',
    accent: '#2563eb',
    hasPhoto: false,
  },
  {
    id: 'eclat',
    name: 'Éclat',
    category: 'Élégant',
    description: 'En-tête dégradé premium, raffinement et contraste.',
    accent: '#059669',
    hasPhoto: true,
  },
  {
    id: 'classic',
    name: 'Classique',
    category: 'Professionnel',
    description: 'Optimisé ATS, sobre et parfaitement lisible.',
    accent: '#111827',
    hasPhoto: false,
  },
  {
    id: 'tech',
    name: 'Tech',
    category: 'Moderne',
    description: 'Accents monospace et tags, esprit produit / tech.',
    accent: '#0ea5e9',
    hasPhoto: false,
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    category: 'Élégant',
    description: 'Deux colonnes raffinées, hiérarchie typographique soignée.',
    accent: '#b45309',
    hasPhoto: true,
  },
];

export const TEMPLATE_MAP: Record<TemplateId, TemplateMeta> = TEMPLATES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TemplateId, TemplateMeta>,
);

export const DEFAULT_TEMPLATE: TemplateId = 'sahel';
