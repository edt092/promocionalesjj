"""Validación visual/móvil (SEO-12/20) sobre el servidor de previsualización.

Toma capturas en escritorio (1366x768) y móvil (390x844) y mide lo que la auditoría marcó:
legibilidad del navbar, desbordamiento horizontal, H1 recortado, CTA frente al botón flotante,
tamaño de zonas táctiles y menú móvil con teclado.

Uso: python scripts/visual-check.py [base_url] [carpeta_salida]
"""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173"
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "docs/seo/capturas/despues")
OUT.mkdir(parents=True, exist_ok=True)

PAGES = {
    "inicio": "/",
    "tienda-p2": "/tienda/pagina/2/",
    "categoria-vasos": "/tienda/categoria/vasos-personalizados/",
    "producto": "/tienda/trevon/",
    "producto-sin-foto": "/tienda/hamond-stylus/",
    "ciudad-bogota": "/productos-promocionales-colombia/bogota/",
    "contacto": "/contacto/",
}
VIEWPORTS = {"escritorio": (1366, 768), "movil": (390, 844)}

MEASURE = """
() => {
  const lum = (c) => { const m = c.match(/\\d+(\\.\\d+)?/g).map(Number); const [r,g,b] = m.slice(0,3).map(v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*r+0.7152*g+0.0722*b; };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const nav = document.querySelector('nav.fixed');
  let navBg = getComputedStyle(nav).backgroundColor;
  if (navBg === 'rgba(0, 0, 0, 0)') navBg = 'rgb(10, 26, 47)'; // transparente sobre el hero navy
  const word = nav.querySelector('a[aria-label] span span');
  const burger = nav.querySelector('button[aria-controls]');
  const visibleLinks = [...nav.querySelectorAll('a')].filter(a => a.offsetParent);
  const smallTargets = [...document.querySelectorAll('main a, footer a, nav a, button')]
    .filter(el => el.offsetParent && el.getBoundingClientRect().height > 0 && el.getBoundingClientRect().height < 40)
    .map(el => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30));
  const h1 = document.querySelector('h1');
  const clipped = [...h1.querySelectorAll('span')].some(s => s.scrollHeight > s.clientHeight + 1 && getComputedStyle(s).overflow !== 'visible');
  const cta = [...document.querySelectorAll('main a[data-cta], main button[type=submit], main a[href^="https://wa.me"]')].find(el => el.offsetParent);
  const fab = document.querySelector('a[data-cta="flotante"]') || document.querySelector('a[aria-label="Contactar por WhatsApp"]');
  let overlap = false; let ctaTop = null;
  if (cta && fab) { const a = cta.getBoundingClientRect(), b = fab.getBoundingClientRect(); ctaTop = Math.round(a.top);
    overlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom); }
  return {
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    navBg,
    wordmarkContrast: word ? +contrast(getComputedStyle(word).color, navBg).toFixed(2) : null,
    burgerContrast: burger && burger.offsetParent ? +contrast(getComputedStyle(burger).color, navBg).toFixed(2) : null,
    navLinksVisibles: visibleLinks.length,
    h1: h1.textContent.trim().slice(0, 70),
    h1Recortado: clipped,
    h1Top: Math.round(h1.getBoundingClientRect().top),
    ctaTop, ctaSolapaFlotante: overlap,
    zonasTactilesPequenas: smallTargets.length,
    ejemplosPequenas: smallTargets.slice(0, 5),
  };
}
"""

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp_name, (w, h) in VIEWPORTS.items():
        ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=1, is_mobile=vp_name == "movil", has_touch=vp_name == "movil")
        page = ctx.new_page()
        for name, path in PAGES.items():
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(1200)  # animaciones de entrada (GSAP)
            page.screenshot(path=str(OUT / f"{name}-{vp_name}.png"))
            try:
                results[f"{name}/{vp_name}"] = page.evaluate(MEASURE)
            except Exception as exc:  # p. ej. la ruta no existe en el build comparado
                results[f"{name}/{vp_name}"] = {"error": str(exc).splitlines()[0]}
        if vp_name == "movil":
            page.goto(BASE + "/tienda/trevon/", wait_until="networkidle")
            page.click("nav.fixed button[aria-expanded]")
            page.wait_for_timeout(500)
            page.screenshot(path=str(OUT / "menu-abierto-movil.png"))
            page.keyboard.press("Tab")
            focused = page.evaluate("document.activeElement && document.activeElement.textContent.trim()")
            results["menu-movil/teclado"] = {"primerFoco": focused}
        ctx.close()
    browser.close()

(OUT / "mediciones.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(results, ensure_ascii=True, indent=1))
