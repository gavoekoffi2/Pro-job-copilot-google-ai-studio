import assert from 'node:assert/strict';
import test from 'node:test';

import { handler } from '../netlify/functions/ai.mjs';

const schema = {
  type: 'object',
  properties: {
    personalInfo: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        summary: { type: 'string' },
      },
    },
  },
};

function openRouterResponse(content, finishReason = 'stop') {
  return new Response(
    JSON.stringify({
      choices: [{ finish_reason: finishReason, message: { content } }],
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}

test('CV extraction retries an interrupted structured response instead of accepting only name and title', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY='***';

  const fullSchema = {
    type: 'object',
    properties: {
      personalInfo: { type: 'object', properties: { fullName: { type: 'string' }, title: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' }, website: { type: 'string' }, linkedin: { type: 'string' }, summary: { type: 'string' } } },
      experiences: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, company: { type: 'string' }, location: { type: 'string' }, startDate: { type: 'string' }, endDate: { type: 'string' }, current: { type: 'boolean' }, description: { type: 'string' } } } },
      education: { type: 'array', items: { type: 'object', properties: { degree: { type: 'string' }, school: { type: 'string' }, location: { type: 'string' }, year: { type: 'string' }, description: { type: 'string' } } } },
      skills: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, level: { type: 'string' } } } },
      languages: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, level: { type: 'string' } } } },
      certifications: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, issuer: { type: 'string' }, year: { type: 'string' } } } },
      interests: { type: 'array', items: { type: 'string' } },
    },
  };
  const transcription = `KOFFI GAVOE\nDéveloppeur Full Stack\nkoffi@example.com\nEXPÉRIENCE\nDéveloppeur - Pro Genius AI - 2024\nCréation d'applications web\nFORMATION\nLicence Informatique - Université de Lomé - 2023\nCOMPÉTENCES\nReact\nLANGUES\nFrançais`;
  const complete = {
    personalInfo: { fullName: 'KOFFI GAVOE', title: 'Développeur Full Stack', email: 'koffi@example.com', phone: '', address: '', website: '', linkedin: '', summary: '' },
    experiences: [{ title: 'Développeur', company: 'Pro Genius AI', location: '', startDate: '2024', endDate: '', current: false, description: "Création d'applications web" }],
    education: [{ degree: 'Licence Informatique', school: 'Université de Lomé', location: '', year: '2023', description: '' }],
    skills: [{ name: 'React', level: '' }],
    languages: [{ name: 'Français', level: '' }],
    certifications: [], interests: [],
  };

  const responses = [
    openRouterResponse(JSON.stringify({ transcription })),
    openRouterResponse('{"personalInfo":{"fullName":"KOFFI GAVOE","title":"Développeur Full Stack"', 'error'),
    openRouterResponse(JSON.stringify(complete)),
  ];
  let calls = 0;
  globalThis.fetch = async () => responses[calls++] || openRouterResponse(JSON.stringify(complete));

  try {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        prompt: 'Extrais tout le CV.', schema: fullSchema, task: 'generate',
        file: { base64Data: 'ZmFrZQ==', mimeType: 'image/jpeg', filename: 'cv.jpg' },
      }),
    });
    assert.equal(response.statusCode, 200, response.body);
    const result = JSON.parse(response.body).result;
    assert.equal(calls, 3, 'la réponse structurée interrompue doit être retentée');
    assert.equal(result.experiences.length, 1);
    assert.equal(result.education.length, 1);
    assert.deepEqual(result.skills, [{ name: 'React', level: '' }]);
    assert.deepEqual(result.languages, [{ name: 'Français', level: '' }]);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey == null) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
  }
});

test('ai handler rejects a response that remains interrupted after bounded retries', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY='***';
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return openRouterResponse('{"personalInfo":{"fullName":"KOFFI GAVOE"', 'error');
  };

  try {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: 'Structure ce CV.', schema, task: 'generate' }),
    });
    assert.equal(calls, 3);
    assert.equal(response.statusCode, 502);
    assert.match(JSON.parse(response.body).error, /interrompue|incomplète/i);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey == null) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = String(previousKey);
  }
});

test('ai handler repairs common malformed JSON without exposing a JSON validity error', async () => {
  const previousKey = process.env.OPENROUTER_API_KEY;
  const previousFetch = globalThis.fetch;
  process.env.OPENROUTER_API_KEY = 'test-key';

  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    // Real providers occasionally return trailing commas and literal newlines in
    // strings. This is recoverable and must never become a user-facing 500.
    return openRouterResponse(`{
      "personalInfo": {
        "fullName": "Koffi GAVOE",
        "summary": "Développeur web
orienté produit",
      },
    }`);
  };

  try {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        prompt: 'Structure ce CV.',
        schema,
        task: 'generate',
      }),
    });

    assert.equal(response.statusCode, 200, response.body);
    const body = JSON.parse(response.body);
    assert.equal(body.result.personalInfo.fullName, 'Koffi GAVOE');
    assert.match(body.result.personalInfo.summary, /Développeur web/);
    assert.doesNotMatch(response.body, /n'est pas un JSON valide/);
    assert.ok(calls >= 1);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey == null) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = previousKey;
  }
});
