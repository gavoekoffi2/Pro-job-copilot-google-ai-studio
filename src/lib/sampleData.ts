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
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    interests: [],
  };
}

/** Exemple riche (français) servant d'aperçu et de démonstration. */
export function exampleCV(): CVData {
  return {
    personalInfo: {
      fullName: 'Awa Diallo',
      title: 'Cheffe de Projet Digital',
      email: 'awa.diallo@email.com',
      phone: '+225 07 12 34 56 78',
      address: 'Abidjan, Côte d’Ivoire',
      website: 'awadiallo.pro',
      linkedin: 'linkedin.com/in/awadiallo',
      summary:
        "Cheffe de projet digital avec 6 ans d’expérience dans la conduite de produits numériques à fort impact en Afrique de l’Ouest. Spécialiste de la transformation digitale, je pilote des équipes pluridisciplinaires pour livrer des solutions qui augmentent l’engagement et le chiffre d’affaires.",
      photo: undefined,
    },
    experiences: [
      {
        id: uid('exp'),
        title: 'Cheffe de Projet Digital Senior',
        company: 'Orange Digital Center',
        location: 'Abidjan',
        startDate: '2022',
        endDate: '',
        current: true,
        description:
          'Piloté le lancement de 4 produits mobiles touchant plus de 500 000 utilisateurs.\nAugmenté le taux de rétention de 34 % grâce à une refonte de l’expérience utilisateur.\nManagé une équipe de 9 personnes (design, développement, marketing).',
      },
      {
        id: uid('exp'),
        title: 'Chargée de Projet Produit',
        company: 'Wave Mobile Money',
        location: 'Dakar',
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
        school: 'INP-HB',
        location: 'Yamoussoukro',
        year: '2018',
        description: 'Major de promotion — mention Très Bien.',
      },
      {
        id: uid('edu'),
        degree: 'Licence en Informatique de Gestion',
        school: 'Université Félix Houphouët-Boigny',
        location: 'Abidjan',
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
      { id: uid('lg'), name: 'Dioula', level: 'Courant' },
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
