# Rediseño Flowmatic — Fase 1: Home + Novedades (ES)

## Cómo desplegar esto

1. Copia estos archivos a tu repo `flowmaticc.github.io`, **respetando las rutas**:
   - `css/style-v2.css` → nuevo, no toca `css/style.css`
   - `_includes/navbar-v2.html` → nuevo
   - `_includes/footer-v2.html` → nuevo
   - `_includes/head.html` → **reemplaza** al que ya tienes
   - `_layouts/default.html` → **reemplaza** al que ya tienes
   - `index.html` → **reemplaza** al que ya tienes (tu versión anterior no se pierde, ver más abajo)
   - `novedades/index.html` → **reemplaza** al que ya tienes

2. Haz commit y push. GitHub Pages reconstruirá el sitio automáticamente.

3. **Nada más se ve afectado.** Los otros 7 idiomas, `/utilities/`, `/legal/`, siguen exactamente igual que ahora — usan el CSS y navbar antiguos porque no llevan `design: v2` en su front matter.

## Cómo funciona el interruptor de diseño

Añadí un campo `design: v2` al front matter de una página para activar el sistema nuevo (tipografía Manrope/DM Mono, paleta oscura, nuevo nav/footer). Si una página no lo lleva, sigue usando exactamente lo que ya tenías. Esto es lo que me permite hacer el rollout por fases sin arriesgar nada del resto del sitio.

Cuando quieras migrar otro idioma o página, solo hay que:
1. Copiar el HTML de `index.html` (ES) como plantilla
2. Traducir los textos
3. Añadir `design: v2` y `lang: xx` en el front matter
4. Los enlaces de nav/footer para ese idioma **ya están programados** en `navbar-v2.html` y `footer-v2.html` (los 8 idiomas ya están soportados ahí, aunque hoy solo ES los usa)

## Qué se conservó (nada se ha perdido)

- **SEO**: Schema.org (SoftwareApplication + FAQPage), Open Graph, Twitter Cards, canonical, hreflang (ahora con `it` incluido, que faltaba), robots, sitemap — todo intacto.
- **Analytics**: todos los eventos `data-umami="..."` (click-cta-main, click-buy-mensual/trimestral/anual, click-ver-precios, use-extension, use-google-auth, click-github) están en los mismos sitios. Los IDs de sección que usa `umami-tracking.js` para medir scroll/vistas (`#product`, `#pricing`, `#why`, `#cta-final`) se mantienen exactamente igual.
- **Enlaces**: todos usan `site.links.*` desde `_config.yml`, ninguno está hardcodeado.
- **Checkout**: los botones de planes llevan la clase `lemonsqueezy-button` para que el modal de Lemon Squeezy siga funcionando igual.
- **FAQ**: las 8 preguntas completas (texto igual al que ya tenías, no la versión resumida del mockup).
- **Tabla comparativa**: las 7 filas × 4 columnas originales.
- **Vídeo demo real**: el hero usa tu vídeo real (`Sistema-Macro.webm`) dentro del marco de "ventana de producto" del nuevo diseño — no un mockup falso ni una captura inventada.
- **Tus versiones anteriores** de `index.html` y `novedades/index.html` no se han borrado en mi copia de trabajo (están como `.old_v1` por si algún día quieres comparar), pero no hace falta que subas esos archivos a tu repo.

## Decisiones tomadas (según lo hablado)

- Modo oscuro único, sin toggle claro/oscuro.
- Logo tipográfico "/" en cuadrado lima (marca del mockup).
- Idiomas y utilidades: mantuve el dropdown "Utilidades" (Google Auth Extractor + Position Caret) y el selector de idioma de 8 banderas, restilizados con el lenguaje visual nuevo — el mockup original no los llevaba, pero quitarlos habría perdido navegación real.

## Cosas a revisar tú mismo (no pude verificarlas 100% desde aquí)

- **Carga de GitHub Releases y renderizado Markdown en Novedades**: la lógica es un port fiel de tu implementación actual (mismo repo `joseqwrtt/update_app`, mismo endpoint) + la del mockup nuevo (usa `marked.js` vía CDN para el Markdown). No pude probarlo con red real en este entorno — pruébalo en tu navegador o en GitHub Pages antes de dar por bueno.
- **Espaciados de flexbox/grid en navegadores muy antiguos**: el diseño usa CSS Grid y `gap` en flexbox, soportado por todos los navegadores modernos (Chrome/Firefox/Edge/Safari desde 2020-2021). No es compatible con navegadores muy antiguos, pero no debería ser un problema real para tu audiencia.

## Imágenes que sería ideal añadir (opcional, no bloquean nada)

Ahora mismo no falta ninguna imagen — reutilicé tu vídeo real para el hero. Pero si en el futuro quieres reforzar visualmente otras páginas cuando las migremos, esto es lo que te recomendaría preparar:

1. **OG image / preview para redes sociales** (`img/og-image.png`, 1200×630px)
   Ahora mismo sigue siendo la antigua. Si quieres una nueva coherente con la estética v2: fondo `#101010`, el logotipo "/" en lima, titular corto en Manrope negrita ("Escribe / y tu plantilla aparece"), quizá un fragmento del "product window" con el vídeo congelado en un fotograma limpio.

2. **Captura de Position Caret (extensión Chrome) en acción**
   Para cuando migremos `/utilities/extension/` al diseño v2 — una captura mostrando el popup/comportamiento real de la extensión, envuelta en el mismo componente `.product-window` que ya usa el hero. Ideal: 1200×800px, fondo oscuro si es posible para que combine.

3. **Captura del Google Auth Extractor en uso**
   Mismo caso que arriba, para `/utilities/google-auth/`.

4. **Favicon / apple-touch-icon actualizado**
   Si quieres que el icono de pestaña del navegador sea coherente con la nueva marca "/" en lima, en vez del favicon actual.

Ninguna de estas 4 es urgente ni bloquea nada — el sitio funciona igual sin ellas. Te las dejo apuntadas porque las pediste, no porque falten.

## Ronda 2 de ajustes (ya aplicados)

- **Vídeo del hero más grande**: la columna del vídeo ahora ocupa más ancho por defecto, y además al pasar el ratón por encima se amplía (`zoom-in`) sin recortarse — tuve que aislar el círculo decorativo del hero en su propia capa (`.hero-decor`) porque el `overflow:hidden` que lo recortaba también habría recortado el vídeo ampliado. En móvil el hover no aplica (no tiene sentido sin ratón), así que ahí se queda en su tamaño normal.
- **Bug de espaciado en el hero**: el párrafo "Plantillas Macro es el expansor..." pegaba directamente contra el título porque el `<h1>` no tenía margen inferior. Añadido `margin-top` al bloque de texto.
- **Novedades — selector Programa / Paquete de idiomas**: nuevo interruptor en la barra superior. "Programa" apunta a `joseqwrtt/update_app` (como hasta ahora, con descargas). "Paquete de idiomas" apunta a `joseqwrtt/update_language` y **no muestra descargas**, solo la información de la versión (tal y como pediste).
- **Quitado el botón "Ver release completa →"** de las tarjetas de versión, en ambos repos.

## Ronda 3 de ajustes (ya aplicados) — mejoras de interacción y visuales

- **Reveal al hacer scroll** (`js/reveal-v2.js`, nuevo): las tarjetas de producto, los puntos de "por qué", las filas de la comparativa, los planes de precio, las preguntas del FAQ y las tarjetas de versión en Novedades aparecen suavemente (fade + desplazamiento) **la primera vez** que entran en pantalla al hacer scroll — no se repite después. Respeta `prefers-reduced-motion`. Incluye un `MutationObserver` porque las releases de Novedades se cargan por fetch después de que la página termine de cargar.
- **Precios interactivos**: al pasar el ratón por cualquier plan, ese plan se resalta (se eleva, borde lima) y los otros dos se atenúan levemente — así queda claro cuál estás mirando aunque "Trimestral" sea el marcado por defecto.
- **Hovers añadidos en varios sitios** (no en todo, para no saturar): tarjetas de "Producto", puntos de "por qué" (barra lima a la izquierda), filas de la tabla comparativa, y el texto de las preguntas del FAQ.
- **Vídeo del hero**: además de ocupar más espacio por defecto, ahora también se puede ampliar pasando el ratón por encima (ya lo teníamos desde la ronda 2, sigue intacto).
- **Nuevo elemento gráfico en "Por qué"**: la columna izquierda de esa sección se quedaba con mucho espacio en blanco bajo el texto. Añadí un pequeño diagrama SVG (01 → 02 → 03, en el mismo lenguaje visual de líneas/números/mono que usa el resto de la web) ilustrando el flujo "Escribe / → Filtra en tiempo real → Se pega con formato". No es una imagen — es SVG vectorial hecho a medida, así que no pesa nada y se ve nítido a cualquier tamaño.
- **`marked.js` auto-hospedado**: en vez de cargarlo desde un CDN externo (cdnjs), ahora vive en `js/vendor/marked.min.js` dentro de tu propio repo. Menos dependencias externas, más rápido, y coherente con el mensaje de "100% local" de la web.

### Sobre "meter más gráficos donde hay mucho texto"

Ahora mismo no hay ningún hueco vacío sin resolver — el diagrama SVG de "por qní" cubre el único hueco real que había. Pero para cuando quieras reforzar aún más la web con contenido visual real (no obligatorio, solo ideas):

- **Un mini "tour" del producto** entre la sección Producto y Precios: 3 capturas de pantalla reales (el popup de búsqueda filtrando, el resultado pegado en Word, el resultado pegado en Outlook), envueltas en el mismo componente `.product-window` que ya usa el hero.
- **Recomendación para grabar/capturar en el futuro**, para que combine con la estética de la web:
  - Fondo de escritorio: un color sólido oscuro casi negro (algo como `#101010`–`#161616`, el mismo que usa la web) en vez del fondo de Windows por defecto. Sin iconos visibles en el escritorio.
  - Si activas el modo oscuro de Word/Outlook antes de grabar, las capturas combinan mucho mejor que con el blanco por defecto de Office.
  - Recorta ajustado al contenido (sin la barra de tareas de Windows, sin más ventanas de fondo).
  - Resolución cómoda: 1600×1000 o similar, cursor visible para que se entienda la acción.
  - Evita nombres/datos reales en los campos de ejemplo (Para, Asunto, etc.) — mejor algo genérico tipo "Ejemplo Cliente".

## Ronda 4 — 4 ajustes de comportamiento + resto de la web en español

### Ajustes de comportamiento

1. **Timing del reveal-on-scroll corregido**: antes se disparaba justo al asomar el elemento por el borde inferior de la pantalla, así que el usuario aún bajando se lo perdía. Ahora el efecto espera a que el elemento haya subido al 70% superior de la pantalla antes de animarse — ya lo estás viendo cuando ocurre.
2. **Vídeo ampliable a pantalla completa**: clic en el vídeo del hero (o en el botón "⤢ Ampliar") abre un lightbox oscuro con el vídeo grande y controles nativos (play/pausa/volumen/pantalla completa), sin salir de la web. Se cierra con la ×, haciendo clic fuera, o con Esc.
3. **Barra de navegación fija**: ahora usa `position: sticky`, así que se queda visible y pulsable en la parte superior aunque el usuario baje por cualquier sección — igual que el comportamiento original, mismo diseño nuevo.
4. **"PROBAR GRATIS" corregido**: antes bajaba a Precios, ahora baja directamente a la sección con el botón de descarga real (`#cta-final`).

### Resto de la web en español, ya con diseño v2

- **`/utilities/google-auth/`** — página completa del Google Auth Extractor: hero, motivo, características (lista con check), capturas, instalación con bloques de código (el botón "Copiar" sigue funcionando exactamente igual que antes), uso, guía paso a paso con las 3 tarjetas de modo, dependencias, solución de problemas, seguridad y CTA final con licencia MIT. Todo el contenido, enlaces y textos ES/EN se han conservado.
- **`/utilities/extension/`** — página de Position Caret: hero centrado con badges, vista previa de la extensión (reutilizando el mismo componente de "ventana" que el hero de inicio), cómo funciona (4 pasos numerados), compatibilidad de navegadores, qué incluye (6 puntos), y CTA final.
- **`/legal/privacidad/`, `/legal/aviso-legal/`, `/legal/terminos/`** — mismo contenido legal exacto (ni una palabra cambiada), con un layout nuevo (`_layouts/legal-v2.html`) que aplica la identidad oscura/lima/DM Mono: resumen destacado, índice de contenidos en su propia caja, tablas técnicas, todo con la tipografía y el sistema de líneas del resto del sitio. Estas páginas siguen marcadas `noindex` para SEO, igual que antes.

### Nota que te dejo, no es urgente

En `/legal/privacidad/` hay una frase que dice que la web usa `localStorage` para la preferencia de tema claro/oscuro — como quitamos el toggle, esa frase ya no es del todo exacta (aunque `localStorage` se sigue usando para el caché de versión de la app). No la he tocado porque es texto legal y preferí no editarlo sin que me lo pidas explícitamente. Dímelo si quieres que la ajuste.

### Archivos nuevos/modificados en esta ronda

`css/style-v2.css`, `js/reveal-v2.js`, `_includes/navbar-v2.html`, `index.html`, `_layouts/legal-v2.html` (nuevo), `utilities/google-auth/index.html`, `utilities/extension/index.html`, `legal/aviso-legal/index.html`, `legal/privacidad/index.html`, `legal/terminos/index.html`.

## Ronda 5 — Arquitectura de traducciones (i18n) para Home, Novedades y Utilidades

### Qué cambió

Antes, todo el texto en español estaba escrito directamente dentro de cada `.html`. Ahora:

- **`_data/i18n/es.yml`** contiene TODO el texto visible de Home, Novedades, Google Auth Extractor y Position Caret — organizado por secciones (hero, features, why, comparison, pricing, faq, etc.).
- **`index.html`, `novedades/index.html`, `utilities/google-auth/index.html`, `utilities/extension/index.html`** ya no tienen ni una palabra de español escrita directamente — todo se lee de `site.data.i18n[page.lang]` con Liquid. El HTML/CSS/diseño es 100% independiente del idioma.

**Beneficio inmediato:** si mañana cambias un titular, reordenas una sección, o ajustas el diseño, lo haces **una sola vez** en el HTML y se aplica a los 8 idiomas en cuanto existan sus archivos de traducción. Ya no hay que tocar 8 archivos por cada cambio de diseño.

### Cómo añadir un idioma nuevo (ej. inglés)

1. Copia `_data/i18n/es.yml` como `_data/i18n/en.yml`.
2. Traduce solo los **valores** (la parte derecha de cada `:`). No toques las claves (la parte izquierda) — son el "enlace" entre el archivo y el HTML.
3. Los campos que terminan en `_html` pueden llevar etiquetas simples (`<strong>`, `<code>`, `<a>`, `<br>`) — consérvalas tal cual, solo traduce el texto que hay entre ellas.
4. Crea `en/index.html`, `en/changelog/index.html`, etc. con el front matter `lang: en` y `design: v2` (el HTML de dentro puede quedar prácticamente vacío o copiado del ES, ya que todo el contenido sale de `en.yml`).
5. Listo — no hace falta tocar `navbar-v2.html`, `footer-v2.html` ni ningún CSS, ya están preparados para los 8 idiomas.

### Qué NO se movió a este sistema (y por qué)

- **Las 3 páginas legales** (privacidad, aviso legal, términos): son documentos completos, no frases sueltas repetidas — no aportaba beneficio real meterlas en YAML, y ya comparten el mismo layout (`legal-v2.html`), así que el diseño también se edita una sola vez para las tres. Cuando toque traducirlas, se traduce el documento completo por idioma, como hace cualquier web con textos legales.
- **Textos del nav/footer**: ya estaban preparados para 8 idiomas desde la ronda 1 (con `{% case page.lang %}` dentro de `navbar-v2.html`/`footer-v2.html`). No hacía falta re-arquitecturarlos.

### Corregido de paso: bug en los datos estructurados (SEO)

El `schema:` que iba en el front matter de `index.html` tenía `{{ site.links.app_download }}` dentro — pero **Jekyll no procesa Liquid dentro del front matter**, así que en producción se habría publicado el texto literal `{{ site.links.app_download }}` en el JSON-LD en vez de la URL real (dato estructurado roto de cara a Google). Lo he movido al cuerpo de la página, donde Liquid sí se procesa, y de paso el FAQ schema ahora se genera automáticamente desde los mismos datos del acordeón visible — antes eran dos copias separadas que se podían desincronizar si alguien editaba una FAQ sin acordarse de la otra.

### Archivos nuevos/modificados en esta ronda

`_data/i18n/es.yml` (nuevo), `index.html`, `novedades/index.html`, `utilities/google-auth/index.html`, `utilities/extension/index.html`.

## Siguiente paso

Una vez confirmes que Home + Novedades en ES se ven y funcionan bien en tu repo real, replico el mismo sistema a los otros 7 idiomas + `/utilities/` + `/legal/`.
