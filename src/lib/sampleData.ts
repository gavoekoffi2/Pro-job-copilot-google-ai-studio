import type { CVData } from '../types';
import { uid } from './utils';

/** CV vide — point de départ du créateur. */
export function emptyCV(): CVData {
  return {
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      summary: '',
      photo: undefined,
      showPhoto: true,
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    interests: [],
  };
}

/** Signature de l'exemple : sert à savoir si l'utilisateur travaille encore
 *  sur l'aperçu de démonstration (non personnalisé) ou sur son propre CV. */
export const EXAMPLE_EMAIL = 'afi.mensah@email.com';
export const EXAMPLE_NAME = 'Afi Mensah';

/** Vrai tant que l'utilisateur n'a pas remplacé l'identité de l'exemple. */
export function isExampleCV(data: CVData): boolean {
  return (
    data.personalInfo.fullName.trim() === EXAMPLE_NAME &&
    data.personalInfo.email.trim() === EXAMPLE_EMAIL
  );
}

/** Vrai quand le CV contient assez de contenu réel pour être exporté. */
export function cvIsReady(data: CVData): boolean {
  if (isExampleCV(data)) return false;
  const hasIdentity = data.personalInfo.fullName.trim().length > 0;
  const hasBody =
    data.experiences.length > 0 ||
    data.education.length > 0 ||
    data.skills.length > 0;
  return hasIdentity && hasBody;
}

/** Exemple riche (français) servant d'aperçu et de démonstration. */
export function exampleCV(): CVData {
  return {
    personalInfo: {
      fullName: 'Afi Mensah',
      title: 'Cheffe de Projet Digital',
      email: 'afi.mensah@email.com',
      phone: '+228 90 12 34 56',
      address: 'Lomé, Togo',
      website: 'afimensah.pro',
      linkedin: 'linkedin.com/in/afimensah',
      summary:
        "Cheffe de projet digital avec 6 ans d’expérience dans la conduite de produits numériques à fort impact au Togo et en Afrique de l’Ouest. Spécialiste de la transformation digitale, je pilote des équipes pluridisciplinaires pour livrer des solutions qui augmentent l’engagement client et la performance opérationnelle.",
      photo: undefined,
      showPhoto: true,
    },
    experiences: [
      {
        id: uid('exp'),
        title: 'Cheffe de Projet Digital Senior',
        company: 'Togo Digital Agency',
        location: 'Lomé',
        startDate: '2022',
        endDate: '',
        current: true,
        description:
          'Piloté le lancement de 4 produits mobiles touchant plus de 500 000 utilisateurs.\nAugmenté le taux de rétention de 34 % grâce à une refonte de l’expérience utilisateur.\nManagé une équipe de 9 personnes (design, développement, marketing).',
      },
      {
        id: uid('exp'),
        title: 'Chargée de Projet Produit',
        company: 'Moov Africa Togo',
        location: 'Lomé',
        startDate: '2019',
        endDate: '2022',
        current: false,
        description:
          'Coordonné le déploiement d’une fonctionnalité de paiement marchand dans 3 pays.\nRéduit le temps de mise en marché de 25 % en instaurant une méthodologie agile.\nCollaboré avec les équipes conformité pour respecter les régulations locales.',
      },
    ],
    education: [
      {
        id: uid('edu'),
        degree: 'Master en Management des Systèmes d’Information',
        school: 'Université de Lomé',
        location: 'Lomé',
        year: '2018',
        description: 'Major de promotion — mention Très Bien.',
      },
      {
        id: uid('edu'),
        degree: 'Licence en Informatique de Gestion',
        school: 'ESGIS Togo',
        location: 'Lomé',
        year: '2016',
        description: '',
      },
    ],
    skills: [
      { id: uid('sk'), name: 'Gestion de projet Agile', level: 'Expert' },
      { id: uid('sk'), name: 'Product Management', level: 'Avancé' },
      { id: uid('sk'), name: 'UX / Design Thinking', level: 'Avancé' },
      { id: uid('sk'), name: 'Analyse de données', level: 'Intermédiaire' },
      { id: uid('sk'), name: 'Jira & Notion', level: 'Expert' },
      { id: uid('sk'), name: 'Leadership d’équipe', level: 'Avancé' },
    ],
    languages: [
      { id: uid('lg'), name: 'Français', level: 'Natif' },
      { id: uid('lg'), name: 'Anglais', level: 'Courant' },
      { id: uid('lg'), name: 'Éwé', level: 'Courant' },
    ],
    certifications: [
      {
        id: uid('cert'),
        name: 'Professional Scrum Master I (PSM I)',
        issuer: 'Scrum.org',
        year: '2021',
      },
      {
        id: uid('cert'),
        name: 'Google Project Management',
        issuer: 'Google',
        year: '2020',
      },
    ],
    interests: ['Mentorat de jeunes talents', 'Photographie', 'Course à pied'],
  };
}
