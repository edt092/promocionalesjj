import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryView from '@/components/CategoryView';
import { categories, getCategory } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';

// Solo categorías publicadas con productos (ver docs/seo/decisiones-categorias.md); el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};
  return pageMetadata({
    title: category.seoTitle,
    description: `${category.count} ${category.count === 1 ? 'modelo' : 'modelos'} de ${category.name.toLowerCase()} para personalizar con el logo de tu empresa. ${category.description}`,
    path: `/tienda/categoria/${category.slug}/`,
  });
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  return <CategoryView category={category} page={1} />;
}
