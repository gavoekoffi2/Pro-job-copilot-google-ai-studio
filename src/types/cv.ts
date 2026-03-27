// ─── CV Data Model ──────────────────────────────────────────
export interface CVExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface CVSkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface CVLanguage {
  language: string;
  level: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url?: string;
}

export interface CVData {
  // Personal
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photo?: string; // base64 data URL

  // Profile
  summary: string;

  // Sections
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkillGroup[];
  languages: CVLanguage[];
  certifications: CVCertification[];
  projects: CVProject[];

  // Template
  templateId: string;
}

// ─── Template Metadata ──────────────────────────────────────
export interface CVTemplate {
  id: string;
  name: string;
  category: 'Corporate' | 'Modern' | 'Creative' | 'Minimal' | 'Executive';
  description: string;
  hasPhoto: boolean;
  accentColor: string;
  tags: string[];
  thumbnail?: string;
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'apex-corporate',
    name: 'Apex Corporate',
    category: 'Corporate',
    description: 'Classique deux colonnes, parfait pour la finance et le conseil.',
    hasPhoto: false,
    accentColor: '#1e3a5f',
    tags: ['2 colonnes', 'Sidebar', 'Finance', 'Conseil'],
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    category: 'Executive',
    description: 'Mono-colonne élégant pour les cadres supérieurs.',
    hasPhoto: false,
    accentColor: '#1a1a2e',
    tags: ['1 colonne', 'Cadre', 'Premium'],
  },
  {
    id: 'vega-purple',
    name: 'Vega Modern',
    category: 'Modern',
    description: 'Sidebar colorée moderne, idéal pour la tech.',
    hasPhoto: true,
    accentColor: '#7c3aed',
    tags: ['Sidebar', 'Tech', 'Photo', 'Moderne'],
  },
  {
    id: 'nexus-dark',
    name: 'Nexus Dark',
    category: 'Modern',
    description: 'Sidebar sombre avec accent vif, style tech premium.',
    hasPhoto: true,
    accentColor: '#0f172a',
    tags: ['Dark', 'Tech', 'Photo', 'Sidebar'],
  },
  {
    id: 'aura-gradient',
    name: 'Aura Gradient',
    category: 'Creative',
    description: 'En-tête dégradé audacieux, design très contemporain.',
    hasPhoto: true,
    accentColor: '#6366f1',
    tags: ['Gradient', 'Moderne', 'Créatif', 'Photo'],
  },
  {
    id: 'blanc-minimal',
    name: 'Blanc Minimal',
    category: 'Minimal',
    description: 'Ultra épuré, beaucoup d\'espace, élégance maximale.',
    hasPhoto: false,
    accentColor: '#111111',
    tags: ['Minimal', 'Épuré', 'Luxe'],
  },
  {
    id: 'nordic-clean',
    name: 'Nordic Clean',
    category: 'Minimal',
    description: 'Inspiration scandinave, propre et professionnel.',
    hasPhoto: false,
    accentColor: '#2563eb',
    tags: ['Scandinave', 'Propre', 'Tech', 'Consulting'],
  },
  {
    id: 'prestige-photo',
    name: 'Prestige Photo',
    category: 'Executive',
    description: 'Layout premium avec photo en vedette, très élégant.',
    hasPhoto: true,
    accentColor: '#0d2137',
    tags: ['Photo', 'Premium', 'Executive'],
  },
  {
    id: 'canvas-creative',
    name: 'Canvas Creative',
    category: 'Creative',
    description: 'Design créatif avec photo et barres de compétences.',
    hasPhoto: true,
    accentColor: '#059669',
    tags: ['Créatif', 'Photo', 'Coloré', 'Design'],
  },
  {
    id: 'diamond-elite',
    name: 'Diamond Elite',
    category: 'Executive',
    description: 'Accents dorés, proportions classiques, luxe absolu.',
    hasPhoto: false,
    accentColor: '#78350f',
    tags: ['Gold', 'Luxe', 'Premium', 'Finance'],
  },
  {
    id: 'techstack-pro',
    name: 'TechStack Pro',
    category: 'Modern',
    description: 'Optimisé pour les développeurs, badges technologies.',
    hasPhoto: false,
    accentColor: '#0891b2',
    tags: ['Dev', 'Tech', 'Badges', 'GitHub'],
  },
  {
    id: 'horizon-bold',
    name: 'Horizon Bold',
    category: 'Creative',
    description: 'Typographie audacieuse, header pleine largeur impactant.',
    hasPhoto: true,
    accentColor: '#dc2626',
    tags: ['Bold', 'Impact', 'Marketing', 'Créatif'],
  },
];

// ─── Default empty CV ────────────────────────────────────────
export const DEFAULT_CV: CVData = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  photo: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  templateId: 'vega-purple',
};

// ─── Sample CV for previews ──────────────────────────────────
export const SAMPLE_CV: CVData = {
  firstName: 'Alexandra',
  lastName: 'Martin',
  title: 'Senior Product Manager',
  email: 'alex.martin@email.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  website: 'alexmartin.io',
  linkedin: 'linkedin.com/in/alexmartin',
  github: '',
  photo: '',
  summary: 'Product Manager passionnée avec 7 ans d\'expérience dans la création de produits digitaux à fort impact. Expertise en stratégie produit, data analytics et leadership d\'équipes cross-fonctionnelles.',
  experience: [
    {
      id: '1',
      company: 'TechVision Inc.',
      position: 'Senior Product Manager',
      location: 'Paris',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead product strategy for a B2B SaaS platform with 200K+ users.',
      achievements: [
        'Increased MAU by 45% through data-driven feature prioritization',
        'Led a team of 8 engineers and 2 designers across 3 product lines',
        'Launched 12 major features resulting in €2M additional ARR',
      ],
    },
    {
      id: '2',
      company: 'Startup Hub',
      position: 'Product Manager',
      location: 'Paris',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Managed the core product roadmap for a fintech application.',
      achievements: [
        'Redesigned onboarding flow, reducing churn by 30%',
        'Shipped mobile app (iOS/Android) from 0 to 50K downloads',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'HEC Paris',
      degree: 'Master',
      field: 'Management & Innovation',
      startDate: '2016',
      endDate: '2018',
      gpa: '18/20',
    },
    {
      id: '2',
      institution: 'Université Paris-Saclay',
      degree: 'Licence',
      field: 'Informatique',
      startDate: '2013',
      endDate: '2016',
    },
  ],
  skills: [
    { id: '1', category: 'Product', items: ['Roadmapping', 'User Research', 'A/B Testing', 'OKRs', 'PRD Writing'] },
    { id: '2', category: 'Data', items: ['SQL', 'Mixpanel', 'Amplitude', 'Google Analytics', 'Looker'] },
    { id: '3', category: 'Tools', items: ['Figma', 'Jira', 'Notion', 'Miro', 'Linear'] },
  ],
  languages: [
    { language: 'Français', level: 'Native' },
    { language: 'English', level: 'Fluent' },
    { language: 'Español', level: 'Intermediate' },
  ],
  certifications: [
    { id: '1', name: 'Product Management Certification', issuer: 'Product School', date: '2020' },
  ],
  projects: [],
  templateId: 'vega-purple',
};
