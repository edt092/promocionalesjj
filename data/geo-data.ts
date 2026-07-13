// Datos geográficos para SEO de páginas locales (Colombia)

export interface Ciudad {
  slug: string;
  nombre: string;
  pais: 'colombia';
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  caracteristicas: string[];
}

export interface Pais {
  slug: string;
  nombre: string;
  codigo: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  ciudades: Ciudad[];
}

export const colombia: Pais = {
  slug: 'productos-promocionales-colombia',
  nombre: 'Colombia',
  codigo: 'CO',
  seoTitle: 'Productos Promocionales Colombia | Merchandising Empresarial',
  seoDescription:
    'Productos promocionales en Colombia. Merchandising corporativo, artículos publicitarios y regalos empresariales. Envíos a Bogotá, Medellín, Cali, Barranquilla y Bucaramanga.',
  h1: 'Productos Promocionales en Colombia',
  intro:
    'Somos tu aliado en productos promocionales y merchandising empresarial en Colombia. Ofrecemos artículos publicitarios personalizados con cobertura nacional y tiempos de entrega confiables.',
  ciudades: [
    {
      slug: 'bogota',
      nombre: 'Bogotá',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Bogotá | Merchandising y Artículos Publicitarios',
      seoDescription:
        'Productos promocionales en Bogotá. Artículos publicitarios, merchandising corporativo y regalos empresariales con entrega en toda la capital.',
      h1: 'Productos Promocionales en Bogotá',
      intro:
        'En Bogotá, capital de Colombia, atendemos empresas de todos los sectores con productos promocionales personalizados. Cubrimos el norte, centro, zona empresarial y toda la sabana.',
      caracteristicas: [
        'Entrega en toda Bogotá y municipios de la sabana',
        'Atención a empresas del sector público y privado',
        'Producción para ferias en Corferias y centros de eventos',
        'Cotización rápida para pedidos corporativos',
      ],
    },
    {
      slug: 'medellin',
      nombre: 'Medellín',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Medellín | Merchandising Empresarial Antioquia',
      seoDescription:
        'Productos promocionales en Medellín y Antioquia. Artículos publicitarios y merchandising corporativo con envíos a todo el Valle de Aburrá.',
      h1: 'Productos Promocionales en Medellín',
      intro:
        'Medellín, capital de la innovación en Colombia, cuenta con nuestra línea completa de productos promocionales. Atendemos empresas del Valle de Aburrá y todo Antioquia.',
      caracteristicas: [
        'Envíos a todo el Valle de Aburrá y Antioquia',
        'Atención al sector textil, tecnológico e industrial',
        'Merchandising para ferias y eventos empresariales',
        'Stock disponible para entregas rápidas',
      ],
    },
    {
      slug: 'cali',
      nombre: 'Cali',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Cali | Merchandising Valle del Cauca',
      seoDescription:
        'Productos promocionales en Cali y el Valle del Cauca. Artículos publicitarios personalizados con envíos a toda la región.',
      h1: 'Productos Promocionales en Cali',
      intro:
        'Cali, capital de la salsa y motor comercial del suroccidente colombiano, tiene en nosotros un aliado para su merchandising corporativo. Servimos empresas de todo el Valle del Cauca.',
      caracteristicas: [
        'Envíos a todo el Valle del Cauca',
        'Atención al sector comercial e industrial',
        'Productos para ferias y eventos regionales',
        'Cotización ágil para pedidos al por mayor',
      ],
    },
    {
      slug: 'barranquilla',
      nombre: 'Barranquilla',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Barranquilla | Merchandising Costa Caribe',
      seoDescription:
        'Productos promocionales en Barranquilla y la Costa Caribe. Artículos publicitarios resistentes al clima costero con envíos a toda la región.',
      h1: 'Productos Promocionales en Barranquilla',
      intro:
        'Barranquilla, puerta de oro de Colombia, cuenta con nuestra línea de productos promocionales pensada para el ritmo comercial de la Costa Caribe.',
      caracteristicas: [
        'Envíos a toda la Costa Caribe colombiana',
        'Productos resistentes al clima costero',
        'Atención a empresas portuarias y comerciales',
        'Merchandising para el Carnaval y eventos regionales',
      ],
    },
    {
      slug: 'bucaramanga',
      nombre: 'Bucaramanga',
      pais: 'colombia',
      seoTitle: 'Productos Promocionales Bucaramanga | Merchandising Santander',
      seoDescription:
        'Productos promocionales en Bucaramanga y Santander. Artículos publicitarios y regalos empresariales con envíos a toda el área metropolitana.',
      h1: 'Productos Promocionales en Bucaramanga',
      intro:
        'Bucaramanga, la ciudad bonita de Colombia, es un polo comercial en crecimiento en Santander. Ofrecemos productos promocionales personalizados para empresas de toda el área metropolitana.',
      caracteristicas: [
        'Envíos a Bucaramanga y su área metropolitana',
        'Atención al sector comercial e industrial de Santander',
        'Merchandising para ferias y eventos regionales',
        'Cotización rápida para empresas locales',
      ],
    },
  ],
};

export const paises = [colombia];

export function getPaisBySlug(slug: string): Pais | undefined {
  return paises.find((p) => p.slug === slug);
}

export function getCiudadBySlug(paisSlug: string, ciudadSlug: string): Ciudad | undefined {
  const pais = getPaisBySlug(paisSlug);
  return pais?.ciudades.find((c) => c.slug === ciudadSlug);
}

export function getAllCiudades(): Ciudad[] {
  return paises.flatMap((p) => p.ciudades);
}
