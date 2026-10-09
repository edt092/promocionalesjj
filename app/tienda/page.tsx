import type { Metadata } from 'next';
import CatalogPage from '@/components/CatalogPage';
import { pageMetadata } from '@/lib/seo';
import { categories, products } from '@/lib/catalog';

export const metadata: Metadata = pageMetadata({
  title: 'Catálogo de productos promocionales en Colombia',
  description: `Catálogo de ${products.length} productos promocionales personalizables con tu logo, en ${categories.length} categorías. Cotiza por WhatsApp para tu empresa.`,
  path: '/tienda/',
});

export default function TiendaPage() {
  return <CatalogPage page={1} />;
}
