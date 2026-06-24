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
  return (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    'https://pro-job-copilot-google-ai-studio.netlify.app'
  ).replace(/\/$/, '');
}
