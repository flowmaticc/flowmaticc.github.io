/* =========================================================
   FLOWMATIC v2 — Reveal al hacer scroll
   Solo para páginas con design: v2.
   Los elementos con [data-reveal] aparecen la PRIMERA vez que
   entran en el viewport (fade + translateY sutil) y luego se
   dejan de observar — no se repite el efecto al volver a
   pasar por ahí, para no saturar visualmente.

   Incluye un MutationObserver porque algunas tarjetas (p.ej.
   las releases de Novedades) se inyectan en el DOM después de
   un fetch, no están presentes al cargar la página.
========================================================= */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;

  function revealAll(nodeList) {
    nodeList.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (!supportsIO || reduceMotion) {
    revealAll(document.querySelectorAll('[data-reveal]'));
    if (window.MutationObserver) {
      new MutationObserver(function () {
        revealAll(document.querySelectorAll('[data-reveal]:not(.is-visible)'));
      }).observe(document.body, { childList: true, subtree: true });
    }
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function observeNew(root) {
    var list = [];
    if (root.matches && root.matches('[data-reveal]')) list.push(root);
    if (root.querySelectorAll) {
      Array.prototype.push.apply(list, root.querySelectorAll('[data-reveal]'));
    }
    list.forEach(function (el) {
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
  }

  observeNew(document.body);

  if (window.MutationObserver) {
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) observeNew(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
