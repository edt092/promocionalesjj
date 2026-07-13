/**
 * Netlify Image CDN loader para Next.js con output: 'export'.
 * En producción (Netlify), las imágenes se sirven optimizadas via /.netlify/images.
 * En desarrollo local, devuelve la URL directamente sin proxy.
 */
export default function netlifyImageLoader({ src, width, quality }) {
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
