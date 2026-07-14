import test from 'node:test';
import assert from 'node:assert/strict';
import { groundExtractedCV } from '../netlify/functions/_ground-cv.mjs';

const sourceText = `
KOFFI IMPORT TEST
Développeur web
Email : koffi.import@example.com
Expérience professionnelle
Développeur — Exemple SARL — Lomé — janvier 2023 à juin 2025
Création d'applications React.
Formation
Licence informatique — Université de Lomé — 2022
Compétences : React, TypeScript, Node.js
Langues : Français courant
`;

test('retire les sociétés et expériences absentes du CV source', () => {
  const grounded = groundExtractedCV({
    personalInfo: {
      fullName: 'Koffi Import Test',
      title: 'Développeur web',
      email: 'koffi.import@example.com',
      phone: '+228 99 99 99 99',
      address: 'Paris, France',
      website: '',
      linkedin: '',
      summary: 'Expert international avec dix ans d’expérience.',
    },
    experiences: [
      {
        title: 'Développeur',
        company: 'Exemple SARL',
        location: 'Lomé',
        startDate: 'janvier 2023',
        endDate: 'juin 2025',
        current: false,
        description: "Création d'applications React.",
      },
      {
        title: 'Consultant senior',
        company: 'Microsoft Afrique',
        location: 'Dakar',
        startDate: '2020',
        endDate: '2022',
        current: false,
        description: 'Pilotage de projets stratégiques.',
      },
    ],
    education: [],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Python', level: 'Avancé' },
    ],
    languages: [
      { name: 'Français', level: 'courant' },
      { name: 'Anglais', level: 'bilingue' },
    ],
    certifications: [{ name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2024' }],
    interests: ['Football'],
  }, sourceText);

  assert.equal(grounded.personalInfo.fullName, 'Koffi Import Test');
  assert.equal(grounded.personalInfo.phone, '');
  assert.equal(grounded.personalInfo.address, '');
  assert.equal(grounded.personalInfo.summary, '');
  assert.equal(grounded.experiences.length, 1);
  assert.equal(grounded.experiences[0].company, 'Exemple SARL');
  assert.deepEqual(grounded.skills, [{ name: 'React', level: '' }]);
  assert.deepEqual(grounded.languages, [{ name: 'Français', level: 'courant' }]);
  assert.deepEqual(grounded.certifications, []);
  assert.deepEqual(grounded.interests, []);
});

test('conserve uniquement les champs explicitement présents dans le CV', () => {
  const grounded = groundExtractedCV({
    personalInfo: { fullName: 'Koffi Import Test', title: 'Web Developer', email: 'koffi.import@example.com' },
    experiences: [],
    education: [{ degree: 'Licence informatique', school: 'Université de Lomé', location: 'Lomé', year: '2022', description: '' }],
    skills: [{ name: 'Node.js', level: '' }],
    languages: [],
    certifications: [],
    interests: [],
  }, sourceText);

  assert.equal(grounded.personalInfo.title, '');
  assert.equal(grounded.education.length, 1);
  assert.equal(grounded.education[0].school, 'Université de Lomé');
  assert.deepEqual(grounded.skills, [{ name: 'Node.js', level: '' }]);
});
