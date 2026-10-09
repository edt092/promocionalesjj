import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsListener from '@/components/AnalyticsListener';
import WhatsAppFab from '@/components/WhatsAppFab';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';
import { jsonLdString, siteJsonLd } from '@/lib/seo';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Promocionales J&J — Productos Promocionales y Merchandising en Colombia',
    template: '%s | Promocionales J&J',
  },
  description:
    'Productos promocionales personalizados con logo para empresas en Colombia. Merchandising corporativo y artículos publicitarios con cotización por WhatsApp.',
  // Sin alternates ni og:url globales: cada ruta declara su propia canónica (lib/seo.ts pageMetadata).
  // Un canonical heredado hacía que el 404 y las páginas sin metadata apuntaran al inicio.
  openGraph: {
    siteName: SITE_NAME,
    locale: 'es_CO',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={manrope.variable}>
      <body className="font-sans">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(siteJsonLd()) }} />
        <Navbar />
        <main id="contenido" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <AnalyticsListener />
        <WhatsAppFab />
      </body>
    </html>
  );
}
