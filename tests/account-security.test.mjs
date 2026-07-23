import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Le store local écrit dans `${process.cwd()}/.jobtask-data` : on isole les tests
// dans un dossier temporaire AVANT d'importer le module (chemin figé à l'import).
process.chdir(mkdtempSync(join(tmpdir(), 'jobtask-account-test-')));

const {
  authenticateAccount,
  effectiveAccess,
  loginAccount,
  registerOrLoginAccount,
  upsertAccount,
} = await import('../netlify/functions/_account-store.mjs');

test('un nouveau compte exige un mot de passe de 8 caractères minimum', async () => {
  await assert.rejects(
    registerOrLoginAccount({ email: 'court@example.com', password: 'abc123' }),
    /8 caractères/,
  );
});

test("l'inscription ne permet jamais de s'auto-attribuer un rôle ou un plan", async () => {
  const { account } = await registerOrLoginAccount({
    email: 'escalade@example.com',
    password: 'motdepasse-solide',
    name: 'Testeur',
    phone: '+22890000000',
    role: 'super_admin',
    plan: 'unlimited',
  });
  const access = effectiveAccess(account.user);
  assert.equal(access.role, 'user');
  assert.equal(access.plan, 'free');
  assert.equal(access.isSuperAdmin, false);
});

test('upsertAccount ignore role/plan/active envoyés par le client', async () => {
  const account = await upsertAccount({
    email: 'escalade@example.com',
    name: 'Testeur',
    phone: '+22890000000',
    role: 'super_admin',
    plan: 'unlimited',
    active: true,
    subscriptionExpiresAt: null,
  });
  const access = effectiveAccess(account.user);
  assert.equal(access.role, 'user');
  assert.equal(access.plan, 'free');
  assert.equal(access.canDownloadPdf, false);
});

test('le jeton de session permet de se ré-authentifier, pas un jeton forgé', async () => {
  const { sessionToken } = await loginAccount({ email: 'escalade@example.com', password: 'motdepasse-solide' });
  const account = await authenticateAccount({ email: 'escalade@example.com', sessionToken });
  assert.equal(account.user.email, 'escalade@example.com');

  await assert.rejects(
    authenticateAccount({ email: 'escalade@example.com', sessionToken: 'jeton-forge' }),
    (error) => error.statusCode === 401,
  );
});

test('5 mots de passe erronés verrouillent temporairement le compte', async () => {
  await registerOrLoginAccount({ email: 'bruteforce@example.com', password: 'motdepasse-solide' });
  for (let i = 0; i < 5; i++) {
    await assert.rejects(
      loginAccount({ email: 'bruteforce@example.com', password: `mauvais-${i}` }),
      (error) => error.statusCode === 401 || error.statusCode === 429,
    );
  }
  await assert.rejects(
    loginAccount({ email: 'bruteforce@example.com', password: 'motdepasse-solide' }),
    (error) => error.statusCode === 429,
  );
});

test('aucun super admin par défaut sans variables d’environnement', async () => {
  // Les anciens identifiants en dur ne doivent plus jamais fonctionner.
  const { account } = await registerOrLoginAccount({
    email: 'claude@jobtaskai.com',
    password: 'Claude@JobTask-2026',
  });
  const access = effectiveAccess(account.user);
  assert.equal(access.isSuperAdmin, false);
  assert.equal(access.role, 'user');
});
