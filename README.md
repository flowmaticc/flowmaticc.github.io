# ⚡ Plantillas Macro — Expansor de plantillas Word y ODT para Windows

**Escribe `/` y tu plantilla DOCX, ODT o TXT se pega al instante en cualquier aplicación de Windows.**

🌐 **Web:** [flowmaticc.github.io](https://flowmaticc.github.io/)  
📥 **Descarga gratuita:** [PlantillasMacro.zip](https://github.com/joseqwrtt/update_app/releases/download/3.0.0.10/PlantillasMacro.zip)

---

## Estructura del repositorio (Jekyll)

```
/
├── _config.yml              ← Configuración Jekyll
├── _layouts/
│   ├── default.html         ← Layout base (navbar + footer automático)
│   └── privacy.html         ← Layout especial para política de privacidad
├── _includes/
│   ├── head.html            ← <head> compartido
│   ├── navbar.html          ← Navbar — editar AQUÍ para todas las páginas
│   └── footer.html          ← Footer — editar AQUÍ para todas las páginas
├── index.html               ← Página principal
├── utilities/
│   ├── google-auth/
│   │   └── index.html       ← /utilities/google-auth/
│   └── extension/
│       └── index.html       ← /utilities/extension/
├── privacy-policy/
│   └── index.html           ← /privacy-policy/
├── css/
│   └── style.css
├── js/
│   └── main.js
├── img/
├── videos/
├── robots.txt
├── sitemap.xml
└── google0b89bbbe04c23175.html
```

## Cómo añadir una nueva página

1. Crea una carpeta en `/utilities/nueva-pagina/`
2. Dentro crea `index.html` con este front matter:

```yaml
---
layout: default
title: "Título de la página"
description: "Descripción para SEO"
nav_active: utilities
---
```

3. Escribe solo el contenido — navbar y footer se añaden solos.

## Modificar navbar o footer

Edita **un solo archivo** y se actualiza en todas las páginas:
- Navbar → `_includes/navbar.html`
- Footer → `_includes/footer.html`

---

*Hecho con ☕ — © 2026 Flowmatic*
