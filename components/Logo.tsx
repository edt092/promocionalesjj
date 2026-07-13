import Image from 'next/image';

/**
 * El lockup original (public/promocionalesjj_logo_first_version.png) tiene fondo blanco
 * opaco "horneado" en el archivo (no transparente) y el wordmark en gris oscuro pensado para
 * fondo claro, así que a tamaños pequeños de navbar se vuelve ilegible sobre navy y deja una
 * caja blanca fea. Se generó `promocionalesjj_icon.png` recortando solo la marca geométrica y
 * aplicando chroma-key para dejarla transparente; el wordmark se renderiza como texto real
 * (nítido a cualquier tamaño, accesible, en el color que corresponda al fondo).
 */
export function Logo({
  className = 'h-8 sm:h-9',
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/promocionalesjj_icon.png"
        alt=""
        width={497}
        height={358}
        priority
        className={`w-auto ${className}`}
      />
      <span className={`font-extrabold leading-none tracking-tight ${textClassName ?? 'text-white'}`}>
        <span className="block text-[0.68em] font-bold uppercase tracking-[0.08em] opacity-90">Promocionales</span>
        <span className="block text-[1.05em]">J&amp;J</span>
      </span>
    </span>
  );
}
