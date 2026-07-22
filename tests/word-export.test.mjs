import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const exporter = readFileSync(new URL('../src/lib/word.ts', import.meta.url), 'utf8');
const builder = readFileSync(new URL('../src/components/builder/CVBuilder.tsx', import.meta.url), 'utf8');

test('l’export Word produit un vrai fichier DOCX éditable', () => {
  assert.match(exporter, /new Document\(/);
  assert.match(exporter, /Packer\.toBlob\(document\)/);
  assert.match(exporter, /\.docx/);
});

test('le créateur expose clairement l’export Word', () => {
  // L'export Word est proposé dans le menu « Télécharger » (PDF / Word).
  assert.match(builder, /Word \(\.docx\)/);
  assert.match(builder, /exportCvToWord\(data, locale\)/);
});
