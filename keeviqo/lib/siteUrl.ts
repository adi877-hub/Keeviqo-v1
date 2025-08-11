export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let resolved: string | undefined = env && env.length > 0 ? env : undefined;

  if (typeof window !== 'undefined') {
    // Client: prefer env, otherwise window origin
    resolved = resolved ?? window.location.origin;
  } else {
    // Server: prefer env, otherwise production default, else localhost
    if (!resolved) {
      resolved = process.env.NODE_ENV === 'production'
        ? 'https://keeviqo-v1.vercel.app'
        : 'http://localhost:3000';
    }
  }

  if (resolved.endsWith('/')) resolved = resolved.slice(0, -1);

  if (/localhost(:\d+)?$/i.test(resolved)) {
    console.warn('[SITE_URL] Using localhost. Set NEXT_PUBLIC_SITE_URL to your public domain to avoid auth callback issues.');
  }
  console.log('[SITE_URL] effective =', resolved);

  return resolved;
}

export const SITE_URL = getSiteUrl();