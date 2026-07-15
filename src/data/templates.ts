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
    name: 'Harry Nelson Original',
    category: 'Créatif',
    description: 'Reproduction fidèle du modèle reçu : vagues navy, portrait détouré et chronologies.',
    accent: '#84b9ce',
    hasPhoto: true,
  },
  {
    id: 'dakar',
    name: 'Harry Nelson Teal',
    category: 'Professionnel',
    description: 'Déclinaison sarcelle de la composition Harry Nelson.',
    accent: '#68b8b0',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'executive',
    name: 'Harry Nelson Royal',
    category: 'Professionnel',
    description: 'Déclinaison bleu royal de la composition Harry Nelson.',
    accent: '#78a8dc',
    hasPhoto: true,
  },
  {
    id: 'lagos',
    name: 'Harry Nelson Gold',
    category: 'Créatif',
    description: 'Déclinaison noire et or de la composition Harry Nelson.',
    accent: '#c7a052',
    hasPhoto: true,
  },
  {
    id: 'minimal',
    name: 'Harry Nelson Forest',
    category: 'Créatif',
    description: 'Déclinaison vert forêt de la composition Harry Nelson.',
    accent: '#83ad98',
    hasPhoto: true,
  },
  {
    id: 'kigali',
    name: 'Harry Nelson Sky',
    category: 'Professionnel',
    description: 'Déclinaison bleu ciel de la composition Harry Nelson.',
    accent: '#7cb9d5',
    hasPhoto: true,
  },
  {
    id: 'abidjan',
    name: 'Harry Nelson Burgundy',
    category: 'Créatif',
    description: 'Déclinaison bordeaux de la composition Harry Nelson.',
    accent: '#c18a9e',
    hasPhoto: true,
  },
  {
    id: 'horizon',
    name: 'Harry Nelson Slate',
    category: 'Professionnel',
    description: 'Déclinaison ardoise de la composition Harry Nelson.',
    accent: '#91a9b8',
    hasPhoto: true,
  },
  {
    id: 'eclat',
    name: 'Harry Nelson Violet',
    category: 'Moderne',
    description: 'Déclinaison violette de la composition Harry Nelson.',
    accent: '#9b8ac4',
    hasPhoto: true,
  },
  {
    id: 'classic',
    name: 'Harry Nelson Graphite',
    category: 'Professionnel',
    description: 'Déclinaison graphite de la composition Harry Nelson.',
    accent: '#99a3ad',
    hasPhoto: true,
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
