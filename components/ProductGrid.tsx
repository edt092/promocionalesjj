import ProductCard, { ProductCardData } from './ProductCard';

/** Grilla renderizada en servidor: cada página exportada contiene en su HTML los enlaces a sus productos. */
export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
