import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('la lettre de motivation est un outil visible et distinct dans toute la navigation', () => {
  const types = read('src/types.ts');
  const app = read('src/App.tsx');
  const navbar = read('src/components/Navbar.tsx');
  const footer = read('src/components/Footer.tsx');
  const landing = read('src/components/LandingPage.tsx');
  const translations = read('src/i18n/translations.ts');

  assert.match(types, /COVER_LETTER\s*=\s*['"]COVER_LETTER['"]/);
  assert.match(app, /CoverLetterView/);
  assert.match(app, /view\s*===\s*AppView\.COVER_LETTER/);
  assert.match(navbar, /AppView\.COVER_LETTER/);
  assert.match(footer, /AppView\.COVER_LETTER/);
  assert.match(landing, /features\.coverLetter/);
  assert.match(translations, /coverLetter:\s*['"]Lettre de motivation['"]/);
  assert.match(translations, /coverLetter:\s*['"]Cover letter['"]/);
});

test('le parcours génère une lettre personnalisée depuis le CV et une offre', () => {
  const view = read('src/components/flows/CoverLetterView.tsx');
  const service = read('src/services/geminiService.ts');

  assert.match(view, /CVImporter/);
  assert.match(view, /generateCoverLetter/);
  assert.match(view, /jobDescription/);
  assert.match(view, /navigator\.clipboard\.writeText/);
  assert.match(view, /lettre-motivation-/);
  assert.match(view, /textarea/);

  assert.match(service, /export async function generateCoverLetter/);
  assert.match(service, /N['’]invente aucune expérience/);
  assert.match(service, /250 à 350 mots/);
  assert.match(service, /langue de l['’]offre/);
  assert.match(service, /stripPhoto\(currentData\)/);
});
