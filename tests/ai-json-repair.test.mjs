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
