import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/cv/templates/referencePremium.tsx', import.meta.url), 'utf8');

const requiredDesigns = [
  ['RefWaveTemplate', 'harry-nelson-wave'],
  ['RefTealGeometryTemplate', 'mohammed-azab-geometry'],
  ['RefNavyOrbitTemplate', 'john-smith-blue-geometry'],
  ['RefGoldWaveTemplate', 'editorial-gold-curve'],
  ['RefCitrusTemplate', 'creative-citrus-cut'],
  ['RefBlueRingsTemplate', 'dicky-layered-blue'],
  ['RefGoldenRibbonTemplate', 'graphic-golden-ribbon'],
  ['RefRecruiterTemplate', 'french-corporate-recruiter'],
  ['RefAngularTemplate', 'adrian-tech-angular'],
  ['RefTealDotsTemplate', 'teal-cyan-timeline'],
];

test('les dix modèles premium portent une direction artistique de référence distincte', () => {
  for (const [component, marker] of requiredDesigns) {
    assert.match(source, new RegExp(`function ${component}\\b[\\s\\S]*?data-design-reference=\\"${marker}\\"`), `${component} doit exposer le marqueur ${marker}`);
  }
});

test('les motifs essentiels des références sont présents', () => {
  for (const motif of ['wave-top', 'wave-bottom', 'diagonal-panel', 'layered-photo', 'vertical-timeline', 'skill-dots']) {
    assert.ok(source.includes(`data-design-motif=\"${motif}\"`), `motif manquant: ${motif}`);
  }
});

test('chaque modèle garde le format A4 écran sans débordement', () => {
  const roots = source.match(/data-design-reference=/g) ?? [];
  assert.equal(roots.length, 10);
  assert.ok((source.match(/min-h-\[1123px\]/g) ?? []).length >= 10);
  assert.ok((source.match(/w-\[794px\]/g) ?? []).length >= 10);
  assert.ok((source.match(/overflow-hidden/g) ?? []).length >= 10);
});
