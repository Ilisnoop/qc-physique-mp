/* anim.js — utilitaires Canvas 2D partagés (vanilla) pour les animations physiques.
   Gestion HiDPI, lecture des couleurs CSS (clair/sombre), tracés de courbes,
   axes, et boucle d'animation respectant prefers-reduced-motion. */

const QC = (function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function colors() {
    return {
      bleu: cssVar('--curve-bleu'),
      rouge: cssVar('--curve-rouge'),
      vert: cssVar('--curve-vert'),
      orange: cssVar('--curve-orange'),
      grid: cssVar('--curve-grid'),
      axis: cssVar('--curve-axis'),
      text: cssVar('--color-text'),
      muted: cssVar('--color-text-muted'),
      bg: cssVar('--color-bg'),
      surface: cssVar('--color-surface'),
    };
  }

  /* Configure un canvas pour le HiDPI selon sa largeur CSS et une hauteur donnée. */
  function setup(canvas, cssHeight) {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssWidth = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
    canvas.style.height = cssHeight + 'px';
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssWidth, h: cssHeight, dpr };
  }

  function clear(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
  }

  /* Tracé d'une fonction y=f(x) sur un repère.
     opts: {xmin,xmax,ymin,ymax, pad:{l,r,t,b}} en px */
  function makePlot(ctx, w, h, opts) {
    const pad = opts.pad || { l: 36, r: 14, t: 14, b: 26 };
    const xr = [opts.xmin, opts.xmax], yr = [opts.ymin, opts.ymax];
    const px = x => pad.l + (x - xr[0]) / (xr[1] - xr[0]) * (w - pad.l - pad.r);
    const py = y => h - pad.b - (y - yr[0]) / (yr[1] - yr[0]) * (h - pad.t - pad.b);
    return {
      px, py, pad, xr, yr,
      grid(c, opts2 = {}) {
        const xticks = opts2.xticks || 0, yticks = opts2.yticks || 0;
        ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
        ctx.beginPath();
        if (xticks) for (let i = 0; i <= xticks; i++) { const x = xr[0] + (xr[1]-xr[0])*i/xticks; ctx.moveTo(px(x), pad.t); ctx.lineTo(px(x), h-pad.b); }
        if (yticks) for (let i = 0; i <= yticks; i++) { const y = yr[0] + (yr[1]-yr[0])*i/yticks; ctx.moveTo(pad.l, py(y)); ctx.lineTo(w-pad.r, py(y)); }
        ctx.stroke();
      },
      axes(c, opts2 = {}) {
        ctx.strokeStyle = c.axis; ctx.lineWidth = 1.4;
        ctx.beginPath();
        const y0 = (yr[0] <= 0 && yr[1] >= 0) ? py(0) : h - pad.b;
        ctx.moveTo(pad.l, y0); ctx.lineTo(w - pad.r, y0);     // axe x
        const x0 = (xr[0] <= 0 && xr[1] >= 0) ? px(0) : pad.l;
        ctx.moveTo(x0, pad.t); ctx.lineTo(x0, h - pad.b);     // axe y
        ctx.stroke();
        ctx.fillStyle = c.muted; ctx.font = '12px IBM Plex Mono, monospace';
        if (opts2.xlabel) { ctx.textAlign = 'right'; ctx.fillText(opts2.xlabel, w - pad.r, y0 - 6); }
        if (opts2.ylabel) { ctx.textAlign = 'left'; ctx.fillText(opts2.ylabel, x0 + 5, pad.t + 11); }
      },
      curve(fn, color, opts2 = {}) {
        ctx.strokeStyle = color; ctx.lineWidth = opts2.lw || 2.4;
        if (opts2.dash) ctx.setLineDash(opts2.dash); else ctx.setLineDash([]);
        ctx.beginPath();
        const N = opts2.N || 400;
        let started = false;
        for (let i = 0; i <= N; i++) {
          const x = xr[0] + (xr[1] - xr[0]) * i / N;
          const y = fn(x);
          if (!isFinite(y)) { started = false; continue; }
          const X = px(x), Y = py(Math.max(yr[0], Math.min(yr[1], y)));
          if (!started) { ctx.moveTo(X, Y); started = true; } else ctx.lineTo(X, Y);
        }
        ctx.stroke(); ctx.setLineDash([]);
      },
      fill(fn, color, opts2 = {}) {
        ctx.fillStyle = color; ctx.globalAlpha = opts2.alpha != null ? opts2.alpha : 0.18;
        ctx.beginPath();
        const N = opts2.N || 300;
        ctx.moveTo(px(xr[0]), py(0));
        for (let i = 0; i <= N; i++) {
          const x = xr[0] + (xr[1] - xr[0]) * i / N;
          const y = Math.max(yr[0], Math.min(yr[1], fn(x)));
          ctx.lineTo(px(x), py(y));
        }
        ctx.lineTo(px(xr[1]), py(0));
        ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      }
    };
  }

  /* Boucle d'animation. tick(t_seconds) appelé à chaque frame.
     Renvoie un contrôleur {stop, running}. Respecte reduced-motion (1 frame). */
  function loop(tick) {
    let raf, start = null, running = true;
    function frame(ts) {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      tick(t);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return {
      get running() { return running; },
      stop() { running = false; cancelAnimationFrame(raf); },
    };
  }

  return { reduced, cssVar, colors, setup, clear, makePlot, loop };
})();
