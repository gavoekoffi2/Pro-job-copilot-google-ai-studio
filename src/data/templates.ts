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
  '#991b1b', // rouge profond
  '#166534', // vert institutionnel
  '#1e1b4b', // indigo nuit
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
  {
    id: 'zurich',
    name: 'Zurich',
    category: 'Minimaliste',
    description: 'Style suisse typographique, grille « étiquette / contenu ».',
    accent: '#0f172a',
    hasPhoto: false,
  },
  {
    id: 'accra',
    name: 'Accra',
    category: 'Créatif',
    description: 'En-tête bi-ton audacieux, contraste couleur et sombre.',
    accent: '#db2777',
    hasPhoto: true,
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    category: 'Élégant',
    description: 'Monogramme centré, sérif raffiné, filets discrets.',
    accent: '#0d9488',
    hasPhoto: false,
  },
  {
    id: 'capetown',
    name: 'Cape Town',
    category: 'Moderne',
    description: 'Bande latérale dégradée, cartes modernes et lisibles.',
    accent: '#2563eb',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'montreal',
    name: 'Montréal',
    category: 'Professionnel',
    description: 'Mise en page équilibrée, sobre et corporate.',
    accent: '#4f46e5',
    hasPhoto: false,
  },

  {
    id: 'lome',
    name: 'Lomé Signature',
    category: 'Élégant',
    description: 'Couverture éditoriale premium, contraste noir ivoire et signature exécutive.',
    accent: '#991b1b',
    hasPhoto: true,
  },
  {
    id: 'kpalime',
    name: 'Kpalimé Studio',
    category: 'Créatif',
    description: 'Design graphique haut de gamme, cartes superposées et rythme visuel fort.',
    accent: '#166534',
    hasPhoto: true,
  },
  {
    id: 'maritime',
    name: 'Maritime Executive',
    category: 'Professionnel',
    description: 'Grille luxe corporate, colonne prestige et finition cabinet international.',
    accent: '#1e1b4b',
    dark: true,
    hasPhoto: false,
  },
  {
    id: 'savane',
    name: 'Savane',
    category: 'Élégant',
    description: 'Élégance chaleureuse, tons doux et accents dorés.',
    accent: '#d97706',
    hasPhoto: true,
  },
  {
    id: 'atlas',
    name: 'Atlas Éditorial',
    category: 'Élégant',
    description: 'Composition éditoriale de luxe, frise chronologique et détails de magazine international.',
    accent: '#9f1239',
    hasPhoto: true,
  },
  {
    id: 'volta',
    name: 'Volta Studio',
    category: 'Créatif',
    description: 'Direction artistique contemporaine, géométrie audacieuse et cartes professionnelles.',
    accent: '#06b6d4',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'aurora',
    name: 'Aurora Premium',
    category: 'Moderne',
    description: 'En-tête nocturne lumineux, panneaux raffinés et finition produit haut de gamme.',
    accent: '#8b5cf6',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'heritage',
    name: 'Héritage Executive',
    category: 'Professionnel',
    description: 'Élégance intemporelle de cabinet international, sérif prestige et structure ATS claire.',
    accent: '#a16207',
    hasPhoto: false,
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
