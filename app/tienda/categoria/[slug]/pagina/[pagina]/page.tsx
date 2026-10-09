import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryView, { categoryTotalPages } from '@/components/CategoryView';
import { categories, getCategory } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((cat) =>
    Array.from({ length: categoryTotalPages(cat.slug) - 1 }, (_, i) => ({ slug: cat.slug, pagina: String(i + 2) }))
  );
}

function resolve(params: { slug: string; pagina: string }) {
  const category = getCategory(params.slug);
  const page = Number(params.pagina);
  if (!category || !Number.isInteger(page) || page < 2 || page > categoryTotalPages(category.slug)) return null;
  return { category, page };
}

export function generateMetadata({ params }: { params: { slug: string; pagina: string } }): Metadata {
  const found = resolve(params);
  if (!found) return {};
  const { category, page } = found;
  return pageMetadata({
    title: `${category.seoTitle} — página ${page}`,
    description: `Página ${page} de ${categoryTotalPages(category.slug)} de ${category.name.toLowerCase()} para personalizar con el logo de tu empresa en Colombia.`,
    path: `/tienda/categoria/${category.slug}/pagina/${page}/`,
  });
}

export default function CategoriaPaginaPage({ params }: { params: { slug: string; pagina: string } }) {
  const found = resolve(params);
  if (!found) notFound();
  return <CategoryView category={found.category} page={found.page} />;
}
