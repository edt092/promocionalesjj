"""Genera public/og-default.jpg (1200x630): imagen social de marca, sin simular fotos de producto.
Uso: python scripts/og-image.py  (requiere playwright con chromium instalado)."""
import base64
import pathlib
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
icon = base64.b64encode((root / "public" / "promocionalesjj_icon.png").read_bytes()).decode()
html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
body{{margin:0;width:1200px;height:630px;font-family:'Segoe UI',Arial,sans-serif;
background:radial-gradient(900px circle at 85% 20%,rgba(0,191,255,.22),transparent 60%),linear-gradient(135deg,#0A1A2F,#060F1C);
color:#fff;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}}
.brand{{display:flex;align-items:center;gap:22px}} .brand img{{height:88px}}
.name small{{display:block;font-size:22px;letter-spacing:.12em;font-weight:700;opacity:.85}}
.name b{{display:block;font-size:52px;font-weight:800;line-height:1}}
h1{{margin:56px 0 0;font-size:64px;line-height:1.05;font-weight:800;max-width:900px}}
h1 span{{color:#33CDFF}} p{{margin:26px 0 0;font-size:28px;opacity:.8}}
.bar{{position:absolute;left:90px;bottom:60px;width:120px;height:8px;border-radius:8px;background:#FF2D2D}}
</style></head><body>
<div class="brand"><img src="data:image/png;base64,{icon}"><div class="name"><small>PROMOCIONALES</small><b>J&amp;J</b></div></div>
<h1>Productos promocionales <span>con tu logo</span></h1>
<p>Merchandising corporativo para empresas en Colombia · www.promocionalesjj.co</p>
<div class="bar"></div></body></html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 630})
    page.set_content(html)
    page.screenshot(path=str(root / "public" / "og-default.jpg"), type="jpeg", quality=88)
    browser.close()
print("public/og-default.jpg generado")
