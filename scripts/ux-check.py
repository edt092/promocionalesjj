"""Verificación UX/UI de extremo a extremo con Playwright (docs/ux-ui/qa-results.md).

No abre conversaciones reales: las URL de wa.me se bloquean y solo se inspecciona el href generado.
La analítica se verifica con un dataLayer de prueba inyectado en la página.

Uso: python scripts/ux-check.py [base_url] [carpeta_salida]
"""
import json
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4190"
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else "docs/ux-ui/qa")
OUT.mkdir(parents=True, exist_ok=True)
WIDTHS = [320, 375, 440, 768, 834, 1194, 1280, 1440, 1920]
SHOT_WIDTHS = {320, 768, 1280}
PAGES = {
    "inicio": "/",
    "tienda": "/tienda/",
    "producto-ballpop": "/tienda/boligrafo-ballpop/",
    "categoria-gorras": "/tienda/categoria/gorras/",
    "promociones": "/promociones/",
    "contacto": "/contacto/",
    "cotizacion": "/cotizacion/",
}
results = {"responsive": {}, "contraste": {}, "flujos": {}, "teclado": {}, "analitica": {}}
failures = []


def check(name, condition, detail=""):
    results["flujos"].setdefault(name, []).append({"ok": bool(condition), "detalle": detail})
    if not condition:
        failures.append(f"{name}: {detail}")


LAYOUT = """
() => {
  const nav = document.querySelector('nav.fixed');
  const overflow = document.documentElement.scrollWidth - window.innerWidth;
  const offenders = overflow > 0 ? [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 && !el.closest('.overflow-x-auto') && el.offsetParent).slice(0,3).map(el => el.tagName + '.' + (el.className||'').toString().slice(0,40)) : [];
  const small = [...document.querySelectorAll('a[href], button, input, select, summary')].filter(el => {
    const r = el.getBoundingClientRect(); if (!el.offsetParent || r.width === 0) return false;
    if (el.closest('.article-body')) return false; // enlaces en línea dentro de texto: excepción 2.5.8
    if (el.classList.contains('sr-only')) return false; // enlace de salto: solo visible con foco
    return r.height < 24 || r.width < 24;
  }).map(el => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30));
  // Controles de la página tapados por el botón flotante de WhatsApp en la vista inicial.
  const fab = document.querySelector('a[data-cta="flotante"]');
  let covered = [];
  if (fab) {
    const f = fab.getBoundingClientRect();
    // Solo acciones principales; el contenido desplazable bajo un elemento fijo se alcanza al desplazarse.
    covered = [...document.querySelectorAll('main a[data-cta], main button[type=submit], main button.bg-danger-600, main input')].filter(el => {
      const r = el.getBoundingClientRect(); if (!el.offsetParent || r.bottom > window.innerHeight || r.width === 0) return false;
      return !(r.right <= f.left || r.left >= f.right || r.bottom <= f.top || r.top >= f.bottom);
    }).map(el => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30));
  }
  return { overflowPx: overflow, offenders, navVisible: nav ? getComputedStyle(nav).visibility === 'visible' : false, targetsBelow24: small, coveredByFab: covered };
}
"""

CONTRAST = """
() => {
  const parse = (c) => { const m = c.match(/[\\d.]+/g); if (!m) return null; const [r,g,b,a] = m.map(Number); return {r,g,b,a: a===undefined?1:a}; };
  const lin = (v) => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); };
  const L = (c) => 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b);
  const blend = (fg, bg) => ({ r: fg.r*fg.a+bg.r*(1-fg.a), g: fg.g*fg.a+bg.g*(1-fg.a), b: fg.b*fg.a+bg.b*(1-fg.a), a: 1 });
  function bgOf(el) {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { unknown: true };
      // Cabecera fija transparente: el fondo real es el hero que pasa por detrás, no su ancestro DOM.
      if (n.matches('nav.fixed') && parse(cs.backgroundColor)?.a === 0) return { unknown: true };
      const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = {r:255,g:255,b:255,a:1};
    for (let i = layers.length-1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  }
  const out = []; const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const el = t.parentElement;
    if (!t.textContent.trim() || !el || !el.offsetParent) continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.bottom < 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity < 0.1) continue;
    const bg = bgOf(el); if (bg.unknown) continue;
    let fg = parse(cs.color); if (!fg) continue; fg = blend(fg, bg);
    const [a, b] = [L(fg), L(bg)].sort((x,y)=>y-x); const ratio = (a+0.05)/(b+0.05);
    const size = parseFloat(cs.fontSize); const bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const min = large ? 3 : 4.5;
    if (ratio < min) { const key = t.textContent.trim().slice(0,40)+cs.color; if (!seen.has(key)) { seen.add(key); out.push({ text: t.textContent.trim().slice(0,40), ratio: +ratio.toFixed(2), min, color: cs.color }); } }
  }
  return out;
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---------------------------------------------------------------- responsive + contraste
    for width in WIDTHS:
        ctx = browser.new_context(viewport={"width": width, "height": 900}, is_mobile=width < 768, has_touch=width < 768)
        ctx.route("https://wa.me/**", lambda route: route.abort())
        page = ctx.new_page()
        for name, path in PAGES.items():
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(900)
            data = page.evaluate(LAYOUT)
            results["responsive"][f"{name}@{width}"] = data
            if data["coveredByFab"]:
                failures.append(f"botón flotante tapa {name}@{width}: {data['coveredByFab']}")
            if data["overflowPx"] > 0:
                failures.append(f"desbordamiento {name}@{width}: {data['overflowPx']}px {data['offenders']}")
            if width in SHOT_WIDTHS:
                page.screenshot(path=str(OUT / f"{name}-{width}.png"), full_page=False)
            if width in (375, 1280):
                results["contraste"][f"{name}@{width}"] = page.evaluate(CONTRAST)
        ctx.close()

    # ---------------------------------------------------------------- flujos
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    ctx.add_init_script("window.dataLayer = []; window.__eventos = window.dataLayer;")
    ctx.route("https://wa.me/**", lambda route: route.abort())
    ctx.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE)
    page = ctx.new_page()
    events = []
    def collect():
        events.extend(page.evaluate("(window.dataLayer || []).map(e => ({...e}))"))
        page.evaluate("window.dataLayer.length = 0")

    # Happy path A: referencia conocida -> ficha -> cotización con cantidad inválida -> corrección -> resumen
    page.goto(BASE + "/tienda/", wait_until="networkidle")
    page.fill("#buscar-productos", "ballpop")
    page.wait_for_selector("text=producto encontrado", timeout=10000)
    status = page.inner_text("[aria-live=polite]")
    check("A: búsqueda por nombre", "1 producto encontrado" in status, status)
    check("A: búsqueda en la URL", "q=ballpop" in page.url, page.url)
    page.fill("#buscar-productos", "JJ-000001")
    page.wait_for_timeout(300)
    check("A: búsqueda por SKU", "Ballpop" in page.inner_text("main"), "")
    page.fill("#buscar-productos", "esfero")
    page.wait_for_timeout(300)
    syn = page.inner_text("[aria-live=polite]")
    check("A: sinónimo esfero→bolígrafo", "encontrados" in syn, syn)
    page.select_option("#filtro-material", "metal")
    page.wait_for_timeout(300)
    check("A: filtro material activo", "material=metal" in page.url, page.url)
    page.mouse.wheel(0, 1400)
    page.wait_for_timeout(300)
    url_before = page.url
    scroll_before = page.evaluate("window.scrollY")
    target = page.locator("main ul.grid a[href^='/tienda/']:not([href*='/categoria/'])").nth(5)
    target_href = target.get_attribute("href")
    target.click()
    page.wait_for_url("**" + target_href)
    page.wait_for_load_state("networkidle")
    page.go_back()
    page.wait_for_url("**/tienda/?*")
    page.wait_for_selector("text=productos encontrados", timeout=10000)
    page.wait_for_timeout(600)
    check("A: filtros conservados al volver", page.url == url_before and page.input_value("#buscar-productos") == "esfero" and page.input_value("#filtro-material") == "metal", page.url)
    scroll_after = page.evaluate("window.scrollY")
    check("A: posición conservada al volver", abs(scroll_after - scroll_before) < 200, f"{scroll_before} -> {scroll_after}")
    collect()

    page.goto(BASE + "/tienda/boligrafo-ballpop/", wait_until="networkidle")
    check("A: ficha muestra la regla de cantidad", "múltiplos de 50 unidades por color" in page.inner_text("#cantidad-producto + p"), "")
    page.click("text=Preparar cotización")
    page.wait_for_url("**/cotizacion/")
    page.wait_for_selector("#cantidad-boligrafo-ballpop")
    page.fill("#cantidad-boligrafo-ballpop", "120")
    err = page.inner_text("#cantidad-boligrafo-ballpop-error")
    check("A: error de cantidad explica la regla", "múltiplos de 50" in err and "100" in err and "150" in err, err)
    check("A: no se redondea automáticamente", page.input_value("#cantidad-boligrafo-ballpop") == "120", "")
    page.click("#cantidad-boligrafo-ballpop-error button:has-text('100')")
    check("A: sugerencia aplicada por decisión del usuario", page.input_value("#cantidad-boligrafo-ballpop") == "100", "")
    page.fill("#notas-boligrafo-ballpop", "50 azules y 50 rojos")
    page.click("text=Abrir WhatsApp con este mensaje")
    check("A: resumen incompleto muestra errores en vez de abrir", page.locator("[role=alert]:has-text('Revisa estos datos')").is_visible(), "")
    page.fill("#ciudad", "Bogotá")
    page.fill("#fecha", "2026-11-20")
    msg = page.input_value("#mensaje-cotizacion")
    check("A: mensaje con producto, cantidad, ciudad y fecha", all(s in msg for s in ["Bolígrafo Ballpop (JJ-000001): 100 unidades", "50 azules", "Bogotá", "20/11/2026"]), msg)
    href = page.get_attribute("a[data-cta=cotizacion_resumen]", "href")
    text = parse_qs(urlparse(href).query).get("text", [""])[0]
    check("A: enlace de WhatsApp lleva el mismo mensaje codificado", text == msg and href.startswith("https://wa.me/573155595134"), href[:80])
    with page.expect_popup() as popup_info:
        page.click("a[data-cta=cotizacion_resumen]")
    popup_info.value.close()
    after = page.inner_text("[role=status]")
    check("A: tras abrir no se afirma 'solicitud recibida'", "recibid" not in after.lower() and "Revisa el mensaje" in after, after)
    page.bring_to_front()
    page.click("text=Copiar mensaje")
    page.wait_for_timeout(200)
    clip = page.evaluate("navigator.clipboard.readText()")
    copy_status = page.inner_text("[role=status]")
    # El portapapeles de Windows guarda los saltos de línea como CRLF.
    check("A: copiar mensaje (alternativa si WhatsApp no abre)", clip.replace(chr(13), "") == msg, copy_status)
    collect()  # antes de recargar: el dataLayer de prueba vive en la página
    page.reload(wait_until="networkidle")
    page.wait_for_selector("#cantidad-boligrafo-ballpop")
    check("A: borrador conservado al regresar", page.input_value("#cantidad-boligrafo-ballpop") == "100" and page.input_value("#ciudad") == "Bogotá", "")
    collect()
    page.screenshot(path=str(OUT / "flujo-a-cotizacion-390.png"), full_page=True)

    # Happy path B: asesoría sin productos
    page.click("text=Vaciar lista y borrar datos")
    page.click("text=Sí, borrar")
    page.wait_for_timeout(200)
    check("B: lista vacía tras borrar", "Tu lista está vacía" in page.inner_text("main"), "")
    stored = page.evaluate("localStorage.getItem('jj-cotizacion-v1')")
    check("B: datos borrados del navegador", stored is None, str(stored))
    page.check("text=Necesito asesoría para elegir productos")
    page.fill("#objetivo", "regalos para 200 asistentes de una feria")
    page.fill("#ciudad", "Medellín")
    page.check("text=Sin fecha definida")
    msg_b = page.input_value("#mensaje-cotizacion")
    check("B: mensaje de asesoría con objetivo y sin fecha", "necesito asesoría" in msg_b and "200 asistentes" in msg_b and "sin fecha definida" in msg_b, msg_b)
    check("B: resumen listo sin productos", page.get_attribute("a[data-cta=cotizacion_resumen]", "data-ready") == "true", "")
    collect()

    # Unhappy: sin resultados
    page.goto(BASE + "/tienda/", wait_until="networkidle")
    page.fill("#buscar-productos", "zzqxw inexistente")
    page.wait_for_selector("text=No encontramos productos con esa búsqueda", timeout=10000)
    check("U: estado sin resultados con salida", page.locator("text=Consultar por WhatsApp").first.is_visible() and page.locator("text=Limpiar búsqueda").first.is_visible(), "")
    page.click("text=Limpiar búsqueda y filtros")
    check("U: limpiar vuelve al listado", page.input_value("#buscar-productos") == "" and page.locator("nav[aria-label='Paginación del catálogo']").is_visible(), "")
    collect()

    # Unhappy: fallo de carga del índice y reintento
    ctx2 = browser.new_context(viewport={"width": 1280, "height": 900})
    blocked = {"on": True}
    ctx2.route("**/catalogo-busqueda.json", lambda route: route.abort() if blocked["on"] else route.continue_())
    p2 = ctx2.new_page()
    p2.goto(BASE + "/tienda/", wait_until="networkidle")
    p2.fill("#buscar-productos", "mug")
    p2.wait_for_selector("text=No pudimos cargar el buscador", timeout=10000)
    check("U: error de carga visible y catálogo sigue accesible", p2.locator("nav[aria-label='Paginación del catálogo']").is_visible(), "")
    blocked["on"] = False
    p2.get_by_role("button", name="Reintentar").click()
    p2.wait_for_selector("text=productos encontrados", timeout=10000)
    check("U: reintento recupera la búsqueda conservando el texto", p2.input_value("#buscar-productos") == "mug", "")
    ctx2.close()

    # ---------------------------------------------------------------- teclado
    kctx = browser.new_context(viewport={"width": 1280, "height": 900})
    k = kctx.new_page()
    k.goto(BASE + "/tienda/boligrafo-ballpop/", wait_until="networkidle")
    k.keyboard.press("Tab")
    first = k.evaluate("document.activeElement.textContent.trim()")
    results["teclado"]["primer_tab"] = first
    check("K: primer Tab = saltar al contenido", first == "Saltar al contenido", first)
    k.keyboard.press("Enter")
    k.wait_for_timeout(200)
    check("K: el salto mueve el foco a main", k.evaluate("document.activeElement.id") == "contenido", "")
    k.goto(BASE + "/", wait_until="networkidle")
    k.wait_for_timeout(1200)
    k.focus("button[aria-label^='Ver ejemplo de marcación']")
    k.keyboard.press("Enter")
    k.wait_for_selector("[role=dialog]")
    inside = k.evaluate("!!document.activeElement.closest('[role=dialog]')")
    check("K: foco dentro del diálogo al abrir", inside, "")
    for _ in range(6):
        k.keyboard.press("Tab")
    check("K: Tab queda atrapado en el diálogo", k.evaluate("!!document.activeElement.closest('[role=dialog]')"), "")
    check("K: copy ilustrativo en el diálogo", "Ejemplo ilustrativo" in k.inner_text("[role=dialog]"), "")
    k.keyboard.press("Escape")
    k.wait_for_timeout(200)
    back = k.evaluate("document.activeElement.getAttribute('aria-label') || ''")
    check("K: Escape cierra y devuelve el foco al disparador", back.startswith("Ver ejemplo de marcación") and k.locator("[role=dialog]").count() == 0, back)
    k.goto(BASE + "/cotizacion/", wait_until="networkidle")
    k.screenshot(path=str(OUT / "foco-cotizacion-1280.png"))
    kctx.close()

    # ---------------------------------------------------------------- analítica
    results["analitica"]["eventos"] = events
    names = sorted({e.get("event") for e in events})
    results["analitica"]["tipos"] = names
    flat = json.dumps(events, ensure_ascii=False).lower()
    pii = [w for w in ["ballpop\"", "bogot", "medell", "azules", "asistentes", "esfero", "zzqxw", "573155595134"] if w in flat]
    check("T: eventos sin datos sensibles ni texto libre", not pii, ",".join(pii))
    for expected in ["search_used", "product_viewed", "quote_item_added", "quote_start", "quote_summary_ready", "whatsapp_open_clicked"]:
        check(f"T: evento {expected} emitido", expected in names, ",".join(names))
    browser.close()

(OUT / "resultados.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
total = sum(len(v) for v in results["flujos"].values())
print(json.dumps({"comprobaciones": total, "fallos": failures}, ensure_ascii=True, indent=1))
