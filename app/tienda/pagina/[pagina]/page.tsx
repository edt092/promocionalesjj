import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CatalogPage, { tiendaTotalPages } from '@/components/CatalogPage';
import { pageMetadata } from '@/lib/seo';

// Export estático: solo existen las páginas 2..n generadas; cualquier otra ruta es un 404 real.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: tiendaTotalPages - 1 }, (_, i) => ({ pagina: String(i + 2) }));
}

function parsePage(value: string) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 2 && page <= tiendaTotalPages ? page : null;
}

export function generateMetadata({ params }: { params: { pagina: string } }): Metadata {
  const page = parsePage(params.pagina);
  if (!page) return {};
  return pageMetadata({
    title: `Catálogo de productos promocionales — página ${page}`,
    description: `Página ${page} de ${tiendaTotalPages} del catálogo de productos promocionales personalizables con tu logo para empresas en Colombia.`,
    path: `/tienda/pagina/${page}/`,
  });
}

export default function TiendaPaginaPage({ params }: { params: { pagina: string } }) {
  const page = parsePage(params.pagina);
  if (!page) notFound();
  return <CatalogPage page={page} />;
}
