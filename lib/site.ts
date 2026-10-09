/**
 * Fuente única de la URL pública del sitio (SEO-01). El host primario es www: es el destino final de
 * la redirección de Netlify y la canónica que Google seleccionó para el inicio. Toda URL absoluta
 * (canonical, sitemap, og:url, JSON-LD, robots) debe construirse con absoluteUrl().
 */
export const SITE_URL = 'https://www.promocionalesjj.co';
export const SITE_NAME = 'Promocionales J&J';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = '/og-default.jpg';

/** Política de slash: todas las rutas internas terminan en "/" (next.config.js trailingSlash: true). */
export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  // Archivos (imágenes, xml) no llevan slash final.
  if (/\.[a-z0-9]+$/i.test(pathOrUrl)) return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  return `${SITE_URL}${normalizePath(pathOrUrl)}`;
}
