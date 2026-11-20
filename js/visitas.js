// ============================================================
// VISITAS — Estadísticas propias de Flowmaticc (Cloudflare)
// Anónimas: sin cookies, sin datos personales, sin identificadores
// permanentes. Solo se envía la página, el título, la web de origen,
// el idioma del navegador y el tamaño de pantalla. La IP no se guarda
// y no se guarda nada en el navegador del visitante.
//
// No contar este navegador (tus propias visitas):
//   abrir cualquier página con  ?no-contar=1   (para volver: ?contar=1)
// ============================================================
(function () {
  'use strict';

  var RECOLECTOR = 'https://vexo-recolector.flowmaticc-web.workers.dev/v';
  if (location.hostname !== 'flowmaticc.github.io') return;   // pruebas en local: no cuentan
  if (window.__vexoRedirigiendo) return;                      // lang-redirect.js nos lleva a otro idioma

  // ── Excluir este navegador ──────────────────────────────────
  try {
    var q = new URLSearchParams(location.search);
    if (q.has('no-contar')) {
      localStorage.setItem('flowmaticc.no-contar', '1');
      localStorage.setItem('umami.disabled', '1');            // Umami también deja de contarte
    } else if (q.has('contar')) {
      localStorage.removeItem('flowmaticc.no-contar');
      localStorage.removeItem('umami.disabled');
    }
    if (localStorage.getItem('flowmaticc.no-contar') === '1') {
      window.vexoEvento = function () {};
      return;
    }
  } catch (e) { /* sin almacenamiento: se cuenta normalmente */ }

  function enviar(datos) {
    var cuerpo = JSON.stringify(datos);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(RECOLECTOR, new Blob([cuerpo], { type: 'text/plain' }))) return;
    } catch (e) {}
    try {
      fetch(RECOLECTOR, { method: 'POST', body: cuerpo, keepalive: true, mode: 'cors',
                          headers: { 'Content-Type': 'text/plain' } });
    } catch (e) {}
  }

  // Eventos: window.vexoEvento('descarga-vexo', { donde: 'inicio-principal' })
  window.vexoEvento = function (nombre, propiedades) {
    if (!nombre) return;
    var d = { k: 'e', n: String(nombre).slice(0, 60), r: location.pathname };
    if (propiedades && typeof propiedades === 'object') d.d = propiedades;
    enviar(d);
  };

  // Vista de página
  enviar({
    k: 'v',
    r: location.pathname,
    t: document.title,
    f: document.referrer,
    l: navigator.language,
    s: screen.width + 'x' + screen.height
  });
})();
