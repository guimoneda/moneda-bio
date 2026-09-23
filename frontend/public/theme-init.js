/*
  Resolves the colour scheme before first paint so the page never flashes.

  This lives outside index.html deliberately. Files in public/ other than
  index.html are copied verbatim by CRA, while index.html is compiled by
  html-webpack-plugin through a lodash template - so any inline script there
  has to survive being re-parsed as a JS string by whatever version of that
  toolchain the host happens to have installed. Keeping the markup free of
  inline JS removes that failure mode entirely.
*/
(function () {
  try {
    var stored = localStorage.getItem('moneda-theme');
    var theme =
      stored === 'ink' || stored === 'paper'
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'paper'
        : 'ink';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    /* Private mode or blocked storage: the default in the markup stands. */
  }
})();
