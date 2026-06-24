/* =========================================================================
   Modèle de données — Pro Job Copilot
   ========================================================================= */

export type SkillLevel = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // une réalisation par ligne
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  year: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface Language {
  id: string;
  name: string;
  level: string; // ex. "Natif", "Courant", "Intermédiaire"
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  summary: string;
  photo?: string; // chaîne base64 (data URL)
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  interests: string[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywords: string[]; // mots-clés ATS manquants ou recommandés
}

/** Identifiants des templates premium disponibles. */
export type TemplateId =
  | 'sahel'
  | 'dakar'
  | 'executive'
  | 'lagos'
  | 'minimal'
  | 'kigali'
  | 'abidjan'
  | 'horizon'
  | 'eclat'
  | 'classic'
  | 'tech'
  | 'nairobi'
  | 'zurich'
  | 'accra'
  | 'casablanca'
  | 'capetown'
  | 'montreal'
  | 'savane';

export type TemplateCategory =
  | 'Moderne'
  | 'Professionnel'
  | 'Créatif'
  | 'Minimaliste'
  | 'Élégant';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  description: string;
  accent: string; // couleur d'accent hex par défaut
  dark?: boolean; // aperçu sur fond sombre
  hasPhoto: boolean;
}

/** Vues principales de l'application. */
export enum AppView {
  HOME = 'HOME',
  BUILDER = 'BUILDER',
  UPDATE = 'UPDATE',
  ANALYZE = 'ANALYZE',
  TRANSLATE = 'TRANSLATE',
  TAILOR = 'TAILOR',
}

export type Locale = 'fr' | 'en';

/** Langues proposées pour la traduction du CV. */
export interface TargetLanguage {
  code: string;
  labelFr: string;
  labelEn: string;
  flag: string;
}
