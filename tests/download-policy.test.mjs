import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FREE_WATERMARK,
  downloadGateFor,
  isAuthenticatedAccount,
  isDownloadAdministrator,
  shouldShowMyCvs,
} from '../src/lib/downloadPolicy.ts';

const visitor = null;
const user = {
  name: 'Utilisateur',
  email: 'user@example.com',
  phone: '+22890000000',
  sessionToken: 'session-user',
  canDownloadPdf: true,
  isUnlimited: true,
  plan: 'unlimited',
};
const admin = {
  ...user,
  email: 'admin@example.com',
  role: 'admin',
  isAdmin: true,
};
const superAdmin = {
  ...user,
  email: 'super@example.com',
  role: 'super_admin',
  isSuperAdmin: true,
};

test('un visiteur doit se connecter avant tout téléchargement', () => {
  assert.equal(isAuthenticatedAccount(visitor), false);
  assert.equal(downloadGateFor(visitor), 'authenticate');
  assert.equal(shouldShowMyCvs(visitor), false);
});

test('un utilisateur connecté voit le choix gratuit filigrané ou payant même avec un ancien accès illimité', () => {
  assert.equal(isAuthenticatedAccount(user), true);
  assert.equal(isDownloadAdministrator(user), false);
  assert.equal(downloadGateFor(user), 'choose');
  assert.equal(shouldShowMyCvs(user), true);
});

test('les administrateurs téléchargent directement sans paiement', () => {
  assert.equal(isDownloadAdministrator(admin), true);
  assert.equal(isDownloadAdministrator(superAdmin), true);
  assert.equal(downloadGateFor(admin), 'admin-download');
  assert.equal(downloadGateFor(superAdmin), 'admin-download');
});

test('le PDF gratuit porte un filigrane massif et explicite', () => {
  assert.match(FREE_WATERMARK.text, /APERÇU/i);
  assert.match(FREE_WATERMARK.text, /JOBTASK AI/i);
  assert.ok(FREE_WATERMARK.fontSize >= 32);
  assert.ok(FREE_WATERMARK.rows >= 5);
  assert.ok(FREE_WATERMARK.opacity >= 0.25);
});
