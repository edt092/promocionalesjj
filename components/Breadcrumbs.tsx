import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';
import { jsonLdString } from '@/lib/seo';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumbs visibles + JSON-LD BreadcrumbList (blueprint informe_promodirect_frontend_seo.md:
 * "breadcrumbs visibles con datos estructurados"). El último crumb no lleva href (página actual).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-brand transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center text-ink-700 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
