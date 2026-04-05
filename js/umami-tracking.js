// ============================================================
// UMAMI TRACKING — Flowmatic
// Tracking anónimo, sin datos personales, sin identificadores.
// ============================================================

(function () {
  'use strict';

  // Helper: dispara evento Umami si está disponible
  function track(eventName) {
    if (typeof umami === 'undefined') return;
    try {
      umami.track(eventName);
    } catch (e) {
      // silencio: no interrumpir la experiencia del usuario
    }
  }

  // ─── 1. DELEGACIÓN GLOBAL: atributos data-umami en HTML ──────────────────
  // Cualquier elemento con data-umami="nombre-evento" dispara el track al clic.
  // No requiere tocar más JS: solo añadir data-umami="evento" al elemento HTML.
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-umami]');
    if (!el) return;
    const eventName = el.getAttribute('data-umami');
    if (eventName) track(eventName);
  }, true);

  // ─── 2. HUMAN-CONFIRMED — confirma que es un humano real ─────────────────
  // Los bots no mueven el ratón ni hacen touch. Este evento es la señal
  // más fiable para distinguir humanos de crawlers en el dashboard.
  // Se dispara una sola vez con el primer movimiento o toque real.
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

  // ─── 3. VIEW-PRICING — sección de precios entra en viewport ──────────────
  (function () {
    const section = document.getElementById('pricing');
    if (!section) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        track('view-pricing');
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(section);
  })();

  // ─── 4. VIEW-PRODUCT — sección de producto entra en viewport ─────────────
  (function () {
    const section = document.getElementById('product');
    if (!section) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        track('view-product');
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(section);
  })();

  // ─── 5. VIEW-WHY — sección "Por qué elegir" entra en viewport ────────────
  // Indica que el usuario leyó los argumentos de venta, no solo vio el hero.
  (function () {
    const section = document.getElementById('why');
    if (!section) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        track('view-why');
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(section);
  })();

  // ─── 6. VIEW-CTA-FINAL — CTA de cierre entra en viewport ─────────────────
  // La última llamada a la acción al final de la página.
  // Si alguien llega aquí es que ha leído la página entera.
  (function () {
    const section = document.getElementById('cta-final');
    if (!section) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        track('view-cta-final');
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(section);
  })();

  // ─── 7. VIEW-UTILITIES — páginas de utilidades ───────────────────────────
  if (window.location.pathname.startsWith('/utilities')) {
    track('view-utilities');
  }

  // ─── 8. VIDEO-PLAY — usuario interactúa con el vídeo demo ────────────────
  // Autoplay no cuenta. Solo se dispara si el usuario hace clic en el vídeo
  // para pausarlo/reproducirlo, lo que indica interés activo.
  (function () {
    const video = document.querySelector('video.demo-video');
    if (!video) return;
    let fired = false;
    video.addEventListener('play', function () {
      // Ignorar el autoplay inicial (currentTime ≈ 0 y no fue un clic del usuario)
      if (fired) return;
      if (video.currentTime < 0.5 && video.autoplay) return;
      fired = true;
      track('video-play');
    });
    // También detectar clic directo sobre el vídeo
    video.addEventListener('click', function () {
      if (fired) return;
      fired = true;
      track('video-play');
    }, { once: true });
  })();

  // ─── 9. SCROLL-50 y SCROLL-90 ────────────────────────────────────────────
  (function () {
    let fired50 = false;
    let fired90 = false;

    function getScrollPercent() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 100;
      return Math.round((scrollTop / docHeight) * 100);
    }

    function onScroll() {
      const pct = getScrollPercent();
      if (!fired50 && pct >= 50) {
        fired50 = true;
        track('scroll-50');
      }
      if (!fired90 && pct >= 90) {
        fired90 = true;
        track('scroll-90');
        window.removeEventListener('scroll', onScroll, { passive: true });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // ─── 10. ENGAGED-30S — usuario activo ≥ 30 segundos ─────────────────────
  (function () {
    let totalActive = 0;
    let lastActive  = Date.now();
    let fired       = false;
    const THRESHOLD = 30000; // 30 segundos
    const IDLE_GAP  = 5000;  // pausa > 5 s = inactividad

    const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    ACTIVITY_EVENTS.forEach(function (ev) {
      document.addEventListener(ev, function () {
        lastActive = Date.now();
      }, { passive: true });
    });

    setInterval(function () {
      if (fired) return;
      const now   = Date.now();
      const delta = now - lastActive;
      if (delta < IDLE_GAP) totalActive += delta;
      lastActive = now;
      if (totalActive >= THRESHOLD) {
        fired = true;
        track('engaged-30s');
      }
    }, 1000);
  })();

})();
