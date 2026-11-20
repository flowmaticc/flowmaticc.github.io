// ============================================================
// EVENTOS — Flowmaticc
// Tracking anónimo, sin datos personales, sin identificadores.
// Cada evento se envía a Umami y a las estadísticas propias
// (js/visitas.js → window.vexoEvento). Si una de las dos no está
// cargada, la otra sigue funcionando.
// ============================================================

(function () {
  'use strict';

  // Helper: dispara el evento en Umami y en las estadísticas propias
  function track(eventName, props) {
    try {
      if (typeof umami !== 'undefined') {
        if (props) umami.track(eventName, props); else umami.track(eventName);
      }
    } catch (e) { /* silencio: no interrumpir la experiencia del usuario */ }
    try {
      if (typeof window.vexoEvento === 'function') window.vexoEvento(eventName, props);
    } catch (e) {}
  }

  // ─── 1. DELEGACIÓN GLOBAL: atributos data-umami en HTML ──────────────────
  // data-umami="nombre-evento"  y, opcional, data-umami-donde="lugar"
  //   menu (donde: destino)     → clic en un enlace del menú o del pie
  //   enlace (donde: destino)   → clic en un enlace dentro de una página
  //   descarga-vexo (donde: inicio-principal | inicio-final | novedades | ayuda)
  //   extension-instalar, google-auth-descarga, bloqueador-descarga,
  //   github, obtainium, reportar
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-umami]');
    if (!el) return;
    const eventName = el.getAttribute('data-umami');
    if (!eventName) return;
    const donde = el.getAttribute('data-umami-donde');
    track(eventName, donde ? { donde: donde } : undefined);
  }, true);

  // ─── 2. HUMAN-CONFIRMED — confirma que es un humano real ─────────────────
  // Los bots no mueven el ratón ni tocan la pantalla. El panel lo usa para
  // separar personas de robots. Se dispara una sola vez.
  (function () {
    let fired = false;
    function confirm() {
      if (fired) return;
      fired = true;
      track('human-confirmed');
      document.removeEventListener('mousemove', confirm);
      document.removeEventListener('touchstart', confirm);
      document.removeEventListener('keydown', confirm);
    }
    document.addEventListener('mousemove', confirm, { once: true, passive: true });
    document.addEventListener('touchstart', confirm, { once: true, passive: true });
    document.addEventListener('keydown',    confirm, { once: true, passive: true });
  })();

  // ─── 3. SECCIONES VISTAS (entran en pantalla) ─────────────────────────────
  function alVer(id, evento, umbral) {
    const section = document.getElementById(id);
    if (!section || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        track(evento);
        obs.disconnect();
      }
    }, { threshold: umbral });
    obs.observe(section);
  }
  alVer('product',   'view-product',   0.3);   // funciones de Vexo
  alVer('why',       'view-why',       0.3);   // «por qué elegir»
  alVer('cta-final', 'view-cta-final', 0.5);   // llegó al final de la página

  // ─── 4. VIEW-UTILITIES — páginas de utilidades ───────────────────────────
  if (window.location.pathname.indexOf('/utilities') !== -1) {
    track('view-utilities');
  }

  // ─── 5. VIDEO-PLAY — el usuario reproduce el vídeo demo ──────────────────
  // El autoplay no cuenta: solo un clic o una reproducción iniciada por él.
  (function () {
    const video = document.querySelector('video.demo-video');
    if (!video) return;
    let fired = false;
    function una() { if (!fired) { fired = true; track('video-play'); } }
    video.addEventListener('play', function () {
      if (video.currentTime < 0.5 && video.autoplay) return;
      una();
    });
    video.addEventListener('click', una, { once: true });
  })();

  // ─── 6. SCROLL-50 y SCROLL-90 ────────────────────────────────────────────
  (function () {
    let fired50 = false;
    let fired90 = false;
    function pct() {
      const top = window.scrollY || document.documentElement.scrollTop;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      return alto <= 0 ? 100 : Math.round(top / alto * 100);
    }
    function onScroll() {
      const p = pct();
      if (!fired50 && p >= 50) { fired50 = true; track('scroll-50'); }
      if (!fired90 && p >= 90) {
        fired90 = true; track('scroll-90');
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // ─── 7. ENGAGED-30S — 30 s de uso real ───────────────────────────────────
  // Solo cuentan los segundos con la pestaña visible y con actividad
  // (ratón, teclado, scroll, toques) en los últimos 5 s. Antes contaba
  // cualquier segundo con la página abierta aunque nadie la tocara.
  (function () {
    const UMBRAL   = 30;     // segundos activos
    const INACTIVO = 5000;   // sin actividad durante más de 5 s = no cuenta
    let ultimaActividad = 0;
    let activos = 0;
    const marcar = function () { ultimaActividad = Date.now(); };
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, marcar, { passive: true });
    });
    const t = setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - ultimaActividad > INACTIVO) return;
      activos += 1;
      if (activos >= UMBRAL) {
        clearInterval(t);
        track('engaged-30s');
      }
    }, 1000);
  })();

})();
