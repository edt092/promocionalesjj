import Image from 'next/image';
import Link from 'next/link';
import TiltCard from './TiltCard';
import { quantityNote, type QuantityRule } from '@/lib/quote-rules';

export interface ProductCardData {
  slug: string;
  displayName: string;
  categoriaNombre: string;
  imagenUrl: string;
  hasRealImage: boolean;
  sku: string;
  /** Regla de cantidad publicada, si existe (no se muestra un mínimo genérico). */
  quantityNote?: string;
}

/** Solo los campos que la tarjeta necesita: evita serializar fichas completas en el payload. */
export function toCardData(p: Omit<ProductCardData, 'quantityNote'> & { quantityRule?: QuantityRule }): ProductCardData {
  return {
    quantityNote: quantityNote(p.quantityRule),
    slug: p.slug,
    displayName: p.displayName,
    categoriaNombre: p.categoriaNombre,
    imagenUrl: p.imagenUrl,
    hasRealImage: p.hasRealImage,
    sku: p.sku,
  };
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <TiltCard className="h-full">
      <Link
        href={`/tienda/${product.slug}/`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          {product.hasRealImage ? (
            <Image
              src={product.imagenUrl}
              alt={product.displayName}
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            // Sin fotografía del modelo: se indica de forma honesta en lugar de simular una foto.
            <div className="flex h-full w-full items-center justify-center p-6 text-center text-xs text-slate-600">
              Imagen disponible al cotizar
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-sky-700">{product.categoriaNombre}</span>
          <h3 className="text-sm font-semibold text-ink-700 leading-snug">{product.displayName}</h3>
          {product.quantityNote && <span className="text-xs text-slate-700">{product.quantityNote}</span>}
          <span className="mt-auto pt-1 text-xs text-slate-600">{product.sku}</span>
        </div>
      </Link>
    </TiltCard>
  );
}
