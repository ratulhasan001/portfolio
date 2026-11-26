/**
 * The site's two inline scripts (run in <head> before the first paint). Kept here, in a plain module, so the admin
 * panel's Content-Security-Policy (src/lib/csp.ts) can allow exactly these by their hashes.
 */

/** Applies the saved light/dark theme before paint. */
export const themeInitScript = `
(function() {
  try {
    var stored = window.localStorage.getItem('theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

/** Reveals any scroll animation that hasn't run after 2.5 s. */
export const forceVisibleScript = `
(function() {
  setTimeout(function() {
    document.documentElement.classList.add('force-visible');
  }, 2500);
})();
`;
