import test from 'node:test';
import assert from 'node:assert/strict';
import { pdfPageCount } from '../src/lib/pdfPagination.ts';

test('un CV A4 web de 1123 px ne crée pas une deuxième page vide', () => {
  const imageHeightMm = (1123 * 210) / 794;
  assert.equal(pdfPageCount(imageHeightMm, 297), 1);
});

test('un contenu dépassant réellement une page produit deux pages', () => {
  assert.equal(pdfPageCount(410, 297), 2);
});

test('le calcul prend en charge trois pages réelles', () => {
  assert.equal(pdfPageCount(700, 297), 3);
});
