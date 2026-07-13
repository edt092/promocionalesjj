import Image from 'next/image';
import Link from 'next/link';
import TiltCard from './TiltCard';

export interface ProductCardData {
  slug: string;
  nombre: string;
  categoria: string;
  imagen_url: string;
  sku: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <TiltCard className="h-full">
      <Link
        href={`/tienda/${product.slug}/`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Image
            src={product.imagen_url}
            alt={product.nombre}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-sky-600">{product.categoria}</span>
          <h3 className="text-sm font-semibold text-ink-700 leading-snug">{product.nombre}</h3>
          <span className="mt-auto text-xs text-slate-400">{product.sku}</span>
        </div>
      </Link>
    </TiltCard>
  );
}
