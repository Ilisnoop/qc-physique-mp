/* Thème clair/sombre + menu déroulant questions — choix conservé entre les pages (localStorage) */
(function () {
  const root = document.documentElement;
  const STORE_KEY = 'qc-theme';
  let stored = null;
  try { stored = localStorage.getItem(STORE_KEY); } catch (e) {}
  // 1) on respecte le choix mémorisé ; 2) sinon, on suit la préférence du navigateur.
  let theme = (stored === 'dark' || stored === 'light')
    ? stored
    : (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  function saveTheme(t) {
    try { localStorage.setItem(STORE_KEY, t); } catch (e) {}
  }

  const sun = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function paint(btn) {
    btn.innerHTML = theme === 'dark' ? sun : moon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      paint(btn);
      btn.addEventListener('click', function () {
        theme = theme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', theme);
        saveTheme(theme);
        paint(btn);
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
      });
    }

    // menu déroulant questions
    const menu = document.querySelector('.qmenu');
    if (menu) {
      const tog = menu.querySelector('.qmenu-toggle');
      const list = menu.querySelector('.qmenu-list');
      tog.addEventListener('click', function (e) {
        e.stopPropagation();
        const open = list.classList.toggle('open');
        tog.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target)) { list.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { list.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); }
      });
    }
  });
})();
