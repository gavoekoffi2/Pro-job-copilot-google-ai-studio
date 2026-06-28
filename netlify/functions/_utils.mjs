export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

export function requireEnv(name, message) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(message || `${name} is not configured`);
    error.statusCode = 503;
    throw error;
  }
  return value;
}

export function siteUrl() {
  // Toujours renvoyer vers le domaine canonique public. Les URLs de deploy preview
  // Netlify sont immuables : si GeniusPay y renvoie après un vieux paiement,
  // l'utilisateur peut retomber sur un ancien bundle sans le correctif paiement.
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.URL ||
    'https://pro-job-copilot-google-ai-studio.netlify.app'
  ).replace(/\/$/, '');
}
