import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const functionsDir = resolve(__dirname, 'netlify/functions');
const port = Number(process.env.PORT || 3000);
const MAX_BODY_BYTES = 8_000_000;

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

const functionCache = new Map();
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    ...securityHeaders,
    ...headers,
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      const error = new Error('Payload too large');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function loadFunction(name) {
  // Les modules préfixés par "_" sont des utilitaires internes (stores, helpers) :
  // ils ne doivent jamais être adressables par URL.
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name)) return null;
  if (!functionCache.has(name)) {
    const url = pathToFileURL(join(functionsDir, `${name}.mjs`)).href;
    functionCache.set(name, import(url));
  }
  const mod = await functionCache.get(name);
  return typeof mod.handler === 'function' ? mod.handler : null;
}

async function handleFunction(req, res, url) {
  const name = url.pathname.replace('/.netlify/functions/', '').split('/')[0];
  const handler = await loadFunction(name);
  if (!handler) return send(res, 404, JSON.stringify({ error: 'Function not found' }), { 'Content-Type': 'application/json' });

  const body = await readBody(req);
  const event = {
    httpMethod: req.method,
    path: url.pathname,
    rawQuery: url.searchParams.toString(),
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    headers: req.headers,
    body,
    isBase64Encoded: false,
  };

  const result = await handler(event, {});
  const headers = result?.headers || {};
  send(res, result?.statusCode || 200, result?.body || '', headers);
}

async function serveStatic(req, res, url) {
  const pathname = decodeURIComponent(url.pathname);
  const cleanPath = normalize(pathname).replace(/^([/\\])+/, '');
  let filePath = resolve(distDir, cleanPath || 'index.html');
  // Comparaison avec séparateur : sans lui, un chemin résolu vers un dossier
  // frère (ex. dist-backup/) passerait le contrôle startsWith(distDir).
  if (filePath !== distDir && !filePath.startsWith(distDir + sep)) {
    filePath = join(distDir, 'index.html');
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error('not file');
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-store' : 'public, max-age=31536000, immutable',
      ...securityHeaders,
    });
    createReadStream(filePath).pipe(res);
  } catch {
    // Un asset manquant (chemin avec extension) doit renvoyer 404, pas la SPA :
    // sinon le navigateur reçoit du HTML à la place d'un JS/CSS/image attendu.
    if (extname(pathname)) {
      return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    const indexHtml = await readFile(join(distDir, 'index.html'), 'utf8');
    send(res, 200, indexHtml, { 'Content-Type': 'text/html; charset=utf-8' });
  }
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/health') {
      return send(res, 200, JSON.stringify({ ok: true, app: 'JobTask AI' }), { 'Content-Type': 'application/json' });
    }

    if (url.pathname.startsWith('/.netlify/functions/')) {
      return await handleFunction(req, res, url);
    }

    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    const statusCode = Number(error?.statusCode) || 500;
    return send(res, statusCode, JSON.stringify({ error: statusCode === 413 ? 'Payload too large' : 'Server error' }), { 'Content-Type': 'application/json' });
  }
}).listen(port, () => {
  console.log(`JobTask AI server listening on ${port}`);
});
