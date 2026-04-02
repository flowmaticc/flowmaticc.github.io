// ============================================================
// UMAMI TRACKING — Flowmatic
// Tracking anónimo, sin datos personales, sin identificadores.
// ============================================================

(function () {
  'use strict';

  // Helper: dispara evento Umami si está disponible
  function track(eventName, props) {
    if (typeof umami === 'undefined') return;
    try {
      if (props && Object.keys(props).length > 0) {
        umami.track(eventName, props);
      } else {
        umami.track(eventName);
      }
    } catch (e) {
      // silencio: no interrumpir la experiencia del usuario
    }
  }

  // ─── 1. DELEGACIÓN GLOBAL: atributos data-umami en HTML ──────────────────
  // Cualquier elemento con data-umami="nombre-evento" dispara el track al clic.
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-umami]');
    if (!el) return;
    const eventName = el.getAttribute('data-umami');
    if (eventName) track(eventName);
  }, true);

  // ─── 2. VIEW-PRICING — sección de precios entra en viewport ──────────────
  (function () {
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !fired) {
          fired = true;
          track('view-pricing');
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(pricingSection);
  })();

  // ─── 3. VIEW-PRODUCT — sección de producto entra en viewport ─────────────
  (function () {
    const productSection = document.getElementById('product');
    if (!productSection) return;
    let fired = false;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !fired) {
          fired = true;
          track('view-product');
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(productSection);
  })();

  // ─── 4. VIEW-UTILITIES — página de utilidades ────────────────────────────
  (function () {
    const isUtilitiesPage =
      window.location.pathname.startsWith('/utilities') ||
      document.querySelector('[data-page="utilities"]');
    if (isUtilitiesPage) track('view-utilities');
  })();

  // ─── 5. SCROLL-50 y SCROLL-90 ────────────────────────────────────────────
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

  // ─── 6. ENGAGED-30S — usuario activo ≥ 30 segundos ──────────────────────
  (function () {
    let totalActive = 0;
    let lastActive = Date.now();
    let fired = false;
    const THRESHOLD = 30000; // 30 segundos
    const IDLE_GAP = 5000;   // pausa > 5 s = inactividad

    function tick() {
      if (fired) return;
      const now = Date.now();
      const delta = now - lastActive;
      if (delta < IDLE_GAP) totalActive += delta;
      lastActive = now;
      if (totalActive >= THRESHOLD) {
        fired = true;
        track('engaged-30s');
      }
    }

    const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    ACTIVITY_EVENTS.forEach(function (ev) {
      document.addEventListener(ev, function () {
        lastActive = Date.now();
      }, { passive: true });
    });

    setInterval(tick, 1000);
  })();

  // ─── 7. REUSE-TOOL — herramienta usada más de una vez en sesión ──────────
  (function () {
    const toolUsage = {};
    document.addEventListener('click', function (e) {
      const el = e.target.closest('[data-umami-tool]');
      if (!el) return;
      const toolId = el.getAttribute('data-umami-tool');
      if (!toolId) return;
      toolUsage[toolId] = (toolUsage[toolId] || 0) + 1;
      if (toolUsage[toolId] === 2) {
        track('reuse-tool', { tool: toolId });
      }
    }, true);
  })();

  // ─── 8. ERROR-TOOL — errores en herramientas (event bus global) ──────────
  // Las páginas de utilidades pueden llamar:
  //   window.dispatchEvent(new CustomEvent('flowmatic:tool-error', { detail: { tool: 'google-auth' } }))
  window.addEventListener('flowmatic:tool-error', function (e) {
    const tool = (e.detail && e.detail.tool) ? e.detail.tool : 'unknown';
    track('error-tool', { tool: tool });
  });

})();
