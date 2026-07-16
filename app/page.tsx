import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import CategoryGrid from '@/components/CategoryGrid';
import ProductRail from '@/components/ProductRail';
import CTABanner from '@/components/CTABanner';
import TrustSection from '@/components/TrustSection';
import FAQSection from '@/components/FAQSection';
import productsData from '@/data/products.json';

export const metadata: Metadata = {
  title: 'Promocionales J&J — Productos Promocionales en Colombia',
  description:
    'Productos promocionales personalizados con logo para empresas en Colombia. Merchandising corporativo con envíos a Bogotá, Medellín, Cali, Barranquilla y Bucaramanga.',
  alternates: { canonical: '/' },
};

function pickDestacados(count: number) {
  // Un producto por categoría distinta primero (evita que "destacados" se vea dominado por
  // la categoría más grande del catálogo real), completando con el resto si hace falta.
  const seenCategoria = new Set<string>();
  const picked: typeof productsData = [];
  for (const product of productsData) {
    if (!seenCategoria.has(product.categoria_slug)) {
      seenCategoria.add(product.categoria_slug);
      picked.push(product);
    }
    if (picked.length >= count) break;
  }
  if (picked.length < count) {
    for (const product of productsData) {
      if (picked.length >= count) break;
      if (!picked.includes(product)) picked.push(product);
    }
  }
  return picked;
}

export default function HomePage() {
  const destacados = pickDestacados(8);

  return (
    <>
      <HeroSection />
      <ProductShowcase />
      <CategoryGrid />
      <ProductRail id="destacados" title="Productos destacados" products={destacados} />
      <CTABanner />
      <TrustSection />
      <FAQSection />
    </>
  );
}
