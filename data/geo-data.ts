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
  /** Categorías del catálogo que se enlazan desde la página (solo slugs publicados con productos). */
  categoriasDestacadas: string[];
  /** Secciones editoriales propias de la ciudad. Solo datos verificados: sin sedes, plazos ni clientes supuestos. */
  secciones?: { titulo: string; parrafos: string[] }[];
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
      seoTitle: 'Productos promocionales en Bogotá',
      seoDescription:
        'Productos promocionales y merchandising para empresas en Bogotá: bolígrafos, botilitos, bolsas, tecnología y más con tu logo. Cotiza por WhatsApp.',
      h1: 'Productos promocionales y merchandising en Bogotá',
      intro:
        'Promocionales J&J atiende a empresas de Bogotá que necesitan productos promocionales y merchandising con su logo: artículos publicitarios para ferias, campañas, eventos internos y regalos corporativos. Eliges los modelos en el catálogo, nos escribes por WhatsApp y te enviamos la cotización.',
      caracteristicas: [
        'Entrega en toda Bogotá y municipios de la sabana',
        'Atención a empresas del sector público y privado',
        'Producción para ferias en Corferias y centros de eventos',
        'Cotización rápida para pedidos corporativos',
      ],
      categoriasDestacadas: [
        'articulos-escritura',
        'tecnologia',
        'bolsas',
        'tomatodos-y-botilitos-personalizados',
        'vasos-personalizados',
        'mugs',
        'libretas',
        'paraguas',
      ],
      secciones: [
        {
          titulo: 'Merchandising y artículos publicitarios para empresas bogotanas',
          parrafos: [
            'Como proveedor de merchandising trabajamos con áreas de mercadeo, compras y talento humano que buscan artículos publicitarios útiles: bolígrafos y sets de escritura, libretas, botilitos, bolsas reutilizables, accesorios de tecnología y kits de oficina. Cada ficha del catálogo muestra las medidas, el área de marcación y la venta mínima cuando el fabricante las publica.',
            'Si tu pedido es para una feria, un lanzamiento o un evento interno, indícanos la fecha requerida al cotizar: así confirmamos qué modelos y técnicas de marcación encajan con tu calendario antes de aprobar el pedido.',
          ],
        },
      ],
    },
    {
      slug: 'medellin',
      nombre: 'Medellín',
      pais: 'colombia',
      seoTitle: 'Productos publicitarios y merchandising en Medellín',
      seoDescription:
        'Productos publicitarios y merchandising con tu logo para empresas de Medellín y el Valle de Aburrá. Explora el catálogo y cotiza por WhatsApp.',
      h1: 'Productos publicitarios y merchandising en Medellín',
      intro:
        'Medellín, capital de la innovación en Colombia, cuenta con nuestra línea completa de productos promocionales. Atendemos empresas del Valle de Aburrá y todo Antioquia.',
      caracteristicas: [
        'Envíos a todo el Valle de Aburrá y Antioquia',
        'Atención al sector textil, tecnológico e industrial',
        'Merchandising para ferias y eventos empresariales',
        'Stock disponible para entregas rápidas',
      ],
      categoriasDestacadas: ['tecnologia', 'articulos-escritura', 'bolsas', 'libretas', 'tomatodos-y-botilitos-personalizados', 'llaveros'],
      secciones: [
        {
          titulo: 'Productos publicitarios para empresas de Medellín',
          parrafos: [
            'Para empresas de Medellín reunimos en un mismo catálogo productos publicitarios de uso diario: accesorios de tecnología como cargadores inalámbricos y speakers, artículos de escritura, libretas, bolsas y botilitos. Todos se personalizan con tu logo y se cotizan directamente por WhatsApp.',
            'Al cotizar, cuéntanos la cantidad, el lugar de entrega en el Valle de Aburrá y la fecha requerida; con esos datos confirmamos técnica de marcación, disponibilidad y condiciones de envío.',
          ],
        },
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
      categoriasDestacadas: ['articulos-escritura', 'tecnologia', 'bolsas', 'tomatodos-y-botilitos-personalizados'],
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
      categoriasDestacadas: ['tomatodos-y-botilitos-personalizados', 'bolsas', 'paraguas', 'articulos-escritura'],
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
      categoriasDestacadas: ['articulos-escritura', 'tecnologia', 'libretas', 'bolsas'],
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
