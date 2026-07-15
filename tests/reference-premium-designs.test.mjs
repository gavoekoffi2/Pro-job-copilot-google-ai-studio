import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/cv/templates/referencePremium.tsx', import.meta.url), 'utf8');

const variants = [
  ['RefWaveTemplate', 'original'],
  ['RefTealGeometryTemplate', 'teal'],
  ['RefNavyOrbitTemplate', 'royal'],
  ['RefGoldWaveTemplate', 'gold'],
  ['RefCitrusTemplate', 'forest'],
  ['RefBlueRingsTemplate', 'sky'],
  ['RefGoldenRibbonTemplate', 'burgundy'],
  ['RefRecruiterTemplate', 'slate'],
  ['RefAngularTemplate', 'violet'],
  ['RefTealDotsTemplate', 'graphite'],
];

test('les dix modèles sont des déclinaisons du modèle Harry Nelson reçu', () => {
  assert.match(source, /function HarryNelsonTemplate\b/);
  for (const [component, variant] of variants) {
    assert.match(
      source,
      new RegExp(`function ${component}\\b[\\s\\S]*?<HarryNelsonTemplate[\\s\\S]*?variant=\\"${variant}\\"`),
      `${component} doit utiliser la déclinaison ${variant}`,
    );
  }
});

test('la reproduction contient tous les motifs structurants du modèle reçu', () => {
  for (const motif of [
    'top-wave-navy',
    'top-wave-cyan',
    'bottom-wave-navy',
    'bottom-wave-cyan',
    'portrait-cutout',
    'two-column-grid',
    'dated-timeline',
    'segmented-skills',
    'footer-url',
  ]) {
    assert.ok(source.includes(`data-design-motif=\"${motif}\"`), `motif manquant: ${motif}`);
  }
});

test('le composant partagé garde le format A4 écran exact', () => {
  assert.match(source, /h-\[1123px\]/);
  assert.match(source, /w-\[794px\]/);
  assert.match(source, /overflow-hidden/);
  assert.match(source, /data-design-reference=\{`harry-nelson-\$\{variant\}`\}/);
});

test('les dates sont espacées des points et les titres ont des bordures arrondies', () => {
  assert.match(source, /grid-cols-\[82px_1fr\] gap-\[21px\]/);
  assert.match(source, /pr-\[28px\]/);
  assert.match(source, /rounded-\[14px\] border-2/);
});

test('la taille des textes Harry Nelson suit le réglage utilisateur', () => {
  assert.match(source, /fontScale = 1/);
  assert.match(source, /const safeFontScale = Math\.max\(0\.9, Math\.min\(1\.15, fontScale\)\)/);
  assert.match(source, /fontSize: `\$\{16 \* safeFontScale\}px`/);
});

test('les modèles Harry Nelson utilisent la couleur choisie dans le panneau Design', () => {
  assert.match(source, /function HarryNelsonTemplate\(\{ data, accent, locale, variant/);
  assert.match(source, /paletteFromAccent\(PALETTES\[variant\], accent\)/);
  assert.match(source, /data-user-accent=\{accent\}/);
});

test('le bas de page reste un ornement fin à gauche et ne masque plus le texte', () => {
  assert.match(source, /data-design-motif="bottom-corner-accent"/);
  assert.match(source, /h-\[34px\] w-\[286px\]/);
  assert.equal(source.includes('h-[146px] w-[794px]'), false);
  assert.match(source, /data-content-safe-bottom="true"/);
});

test('la photo est plus discrète et les expériences restantes passent sur une page de suite', () => {
  assert.match(source, /h-\[246px\] w-\[214px\]/);
  assert.match(source, /data-design-motif="continuation-page"/);
  assert.match(source, /paginateExperiences\(/);
  assert.equal(source.includes('data.experiences.slice(0, 3)'), false);
});

test('aucun contenu fictif du CV de référence ne fuit dans le produit', () => {
  for (const placeholder of ['HARRY NELSON', 'helpshared@gmail.com', 'FIRST UNIVERCITY', 'Lorem ipsum']) {
    assert.equal(source.includes(placeholder), false, `contenu fictif interdit: ${placeholder}`);
  }
});
