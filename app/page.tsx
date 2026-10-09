import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ProductShowcase from '@/components/ProductShowcase';
import CategoryGrid from '@/components/CategoryGrid';
import ProductRail from '@/components/ProductRail';
import CTABanner from '@/components/CTABanner';
import TrustSection from '@/components/TrustSection';
import FAQSection from '@/components/FAQSection';
import { toCardData } from '@/components/ProductCard';
import { CatalogProduct, products } from '@/lib/catalog';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Promocionales J&J — Productos Promocionales en Colombia',
  description:
    'Productos promocionales personalizados con logo para empresas en Colombia: bolígrafos, botilitos, bolsas, tecnología y más. Cotiza tu merchandising por WhatsApp.',
  path: '/',
  absoluteTitle: true,
});

function pickDestacados(count: number) {
  // Un producto con fotografía real por categoría distinta primero (evita que "destacados" se vea
  // dominado por la categoría más grande del catálogo), completando con el resto si hace falta.
  const seenCategoria = new Set<string>();
  const picked: CatalogProduct[] = [];
  const conFoto = products.filter((p) => p.hasRealImage);
  for (const product of conFoto) {
    if (!seenCategoria.has(product.categoriaSlug)) {
      seenCategoria.add(product.categoriaSlug);
      picked.push(product);
    }
    if (picked.length >= count) break;
  }
  for (const product of conFoto) {
    if (picked.length >= count) break;
    if (!picked.includes(product)) picked.push(product);
  }
  return picked;
}

export default function HomePage() {
  const destacados = pickDestacados(8).map(toCardData);

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
