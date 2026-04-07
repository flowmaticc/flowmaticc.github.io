/**
 * lang-redirect.js
 * Auto-detects browser language and redirects to the matching version.
 * Only runs on the root ES pages (not /en/, /fr/, /de/, /pt/).
 * Respects user choice: if they manually navigated, don't redirect again.
 */
(function () {
  // Supported language prefixes
  const SUPPORTED = ['en', 'fr', 'de', 'pt'];

  // Don't redirect if already on a language-prefixed path
  const path = window.location.pathname;
  const onLangPath = SUPPORTED.some(l => path.startsWith('/' + l + '/') || path === '/' + l);
  if (onLangPath) return;

  // Don't redirect if the user already made a manual language choice
  const chosen = sessionStorage.getItem('lang_chosen');
  if (chosen) return;

  // Get browser language (e.g. "fr-FR" → "fr")
  const browserLang = (navigator.language || navigator.userLanguage || 'es').toLowerCase().split('-')[0];

  // Spanish is default — no redirect needed
  if (browserLang === 'es') return;

  // Find a supported match
  const match = SUPPORTED.find(l => l === browserLang);
  if (!match) return; // Unknown language → stay on ES (fallback)

  // Build target URL preserving the current path suffix
  // e.g. /novedades/ → /en/changelog/  (special mapping)
  let targetPath = '/' + match + path;

  // Special path mappings ES → other lang
  if (match === 'en') {
    targetPath = targetPath.replace('/novedades/', '/changelog/');
  } else {
    // fr/de/pt also use /changelog/
    targetPath = targetPath.replace('/novedades/', '/changelog/');
  }

  // Mark as auto-redirected so we don't loop
  sessionStorage.setItem('lang_chosen', 'auto');

  window.location.replace(targetPath);
})();
