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
    name: 'Onde Turquoise',
    category: 'Créatif',
    description: 'Colonne nuit, photo circulaire et composition organique turquoise.',
    accent: '#55d6c2',
    hasPhoto: true,
  },
  {
    id: 'dakar',
    name: 'Canard Géométrique',
    category: 'Professionnel',
    description: 'En-tête angulaire, photographie intégrée et structure executive.',
    accent: '#145c60',
    dark: true,
    hasPhoto: true,
  },
  {
    id: 'executive',
    name: 'Navy Orbital',
    category: 'Professionnel',
    description: 'Univers bleu nuit, anneaux graphiques et compétences visuelles.',
    accent: '#1686d9',
    hasPhoto: true,
  },
  {
    id: 'lagos',
    name: 'Gold Wave',
    category: 'Créatif',
    description: 'Noir, blanc et or avec portrait organique pour profils créatifs.',
    accent: '#f2bd23',
    hasPhoto: true,
  },
  {
    id: 'minimal',
    name: 'Citrus Cut',
    category: 'Créatif',
    description: 'Vert bouteille, citron lumineux et rubans découpés contemporains.',
    accent: '#d9ee3f',
    hasPhoto: true,
  },
  {
    id: 'kigali',
    name: 'Blue Rings',
    category: 'Professionnel',
    description: 'En-tête corporate bleu, portrait à anneaux et lecture recruteur rapide.',
    accent: '#2476c7',
    hasPhoto: true,
  },
  {
    id: 'abidjan',
    name: 'Golden Ribbon',
    category: 'Créatif',
    description: 'Grand bandeau doré et rubans de sections à forte personnalité.',
    accent: '#e5ad28',
    hasPhoto: true,
  },
  {
    id: 'horizon',
    name: 'Recruiter Navy',
    category: 'Professionnel',
    description: 'Colonne navy structurée, contenu aéré et hiérarchie orientée recrutement.',
    accent: '#3d82bf',
    hasPhoto: true,
  },
  {
    id: 'eclat',
    name: 'Angular Blue',
    category: 'Moderne',
    description: 'Portrait en découpe angulaire et indicateurs de compétences en points.',
    accent: '#2782c4',
    hasPhoto: true,
  },
  {
    id: 'classic',
    name: 'Teal Dots',
    category: 'Professionnel',
    description: 'Colonne canard premium, jauges segmentées et parcours chronologique.',
    accent: '#167b78',
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
