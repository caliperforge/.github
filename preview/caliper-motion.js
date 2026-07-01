/* =============================================================================
   caliper-motion.js
   Motion layer for the CaliperForge home + what-we-caught pages.

   Adds, in vanilla JS, four tasteful motion effects on top of the LOCKED design:
     1. Scroll-reveal — section blocks fade in and rise ~16px on viewport entry
        (IntersectionObserver, ~450ms ease-out, fires once, threshold 0.15).
     2. Count-up — every .cf-stat-num animates from 0 to its final value when
        the stat scrolls into view (rAF, ~900ms ease-out cubic). For data-loaded
        stats the final value is read AFTER caliper-data.js has filled it
        (single number source preserved). Numeric prefix is animated; a suffix
        like "%" is kept verbatim.
     3. Decision-ledger stagger — each grid cell (gold / brick / navy) fades in
        with an 8ms cascade once the ledger scrolls into view.
     4. Catch-rate bar — the gold-caught / brick-missed grow widths animate
        from 0 to the loaded ratio.

   Accessibility:
     - All motion is gated behind @media (prefers-reduced-motion: no-preference)
       in CSS, and the JS short-circuits the count-up reset / ledger reset /
       bar reset / reveal classing when the user prefers reduced motion. The
       final, readable state is rendered with zero animation.
     - Content is not gated behind animation — reveal is a CSS opacity layer
       on already-rendered DOM, never display:none.

   Coupling: depends on caliper-data.js firing a "caliper:data-ready"
   CustomEvent after it has filled [data-stat], [data-ledger], and [data-bar].
   ========================================================================== */
(function () {
  'use strict';

  // --- capability + preference checks ------------------------------------
  if (!('IntersectionObserver' in window) || !window.requestAnimationFrame) {
    // No supported scroll API — leave the page in its final, static state.
    return;
  }
  var REDUCE = (typeof window.matchMedia === 'function')
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- shared IntersectionObserver factory --------------------------------
  function onceVisible(el, threshold, cb) {
    var obs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          obs.disconnect();
          cb(entries[i].target);
          return;
        }
      }
    }, { threshold: threshold, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
  }

  // ============================================================
  // 1. SCROLL REVEAL
  // ============================================================
  function setupReveal() {
    if (REDUCE) return;
    // Reveal every direct child of every <section>'s .cf-shell. The hero
    // masthead is a <div class="cf-band--navy">, not a <section>, so it is
    // naturally excluded — the hero stays visible on first paint.
    var candidates = document.querySelectorAll('section .cf-shell > *');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      // Skip the ledger — it has its own per-cell stagger animation.
      if (el.classList.contains('cf-ledger')) continue;
      el.classList.add('cf-reveal');
      onceVisible(el, 0.15, function (t) { t.classList.add('cf-revealed'); });
    }
  }

  // ============================================================
  // 2. COUNT-UP
  // ============================================================
  // Parse a stat text "74%" -> { target:74, suffix:"%", isInt:true }.
  // Returns null if the leading character isn't a digit.
  function parseStat(text) {
    var m = String(text).match(/^([\d][\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    var num = Number(m[1].replace(/,/g, ''));
    if (!isFinite(num)) return null;
    return { target: num, suffix: m[2] || '', isInt: m[1].indexOf('.') === -1 };
  }

  function animateNum(el, parsed, finalText) {
    var dur = 900;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var t = (now - start) / dur;
      if (t >= 1) {
        el.textContent = finalText;
        return;
      }
      var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      var val = parsed.target * eased;
      el.textContent = (parsed.isInt
        ? Math.round(val).toLocaleString()
        : val.toFixed(1)
      ) + parsed.suffix;
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  function primeAndObserveCount(el) {
    if (el.dataset.cfCounted === '1') return;
    var finalText = el.textContent;
    if (!finalText) return; // empty: data not yet filled, will retry on data-ready
    var parsed = parseStat(finalText);
    if (!parsed) return; // non-numeric (e.g. a date) — leave it alone
    el.dataset.cfCounted = '1';
    if (REDUCE) return; // honor reduced motion: final value already on screen
    el.dataset.cfFinal = finalText;
    el.textContent = (parsed.isInt ? '0' : '0.0') + parsed.suffix;
    onceVisible(el, 0.4, function () { animateNum(el, parsed, finalText); });
  }

  function setupCountUpHardcoded() {
    // Pass 1: stat numbers hardcoded in the HTML (no data-stat binding).
    var els = document.querySelectorAll('.cf-stat-num:not([data-stat])');
    for (var i = 0; i < els.length; i++) primeAndObserveCount(els[i]);
  }

  function setupCountUpDataLoaded() {
    // Pass 2: stat numbers filled by caliper-data.js. Runs synchronously on
    // the caliper:data-ready event so the "0" placeholder replaces the final
    // text in the same task — no flash before paint.
    var els = document.querySelectorAll('.cf-stat-num[data-stat]');
    for (var i = 0; i < els.length; i++) primeAndObserveCount(els[i]);
  }

  // ============================================================
  // 3. DECISION-LEDGER STAGGER
  // ============================================================
  function setupLedger() {
    if (REDUCE) return;
    var ledgers = document.querySelectorAll('[data-ledger]');
    for (var i = 0; i < ledgers.length; i++) {
      var ledger = ledgers[i];
      if (ledger.dataset.cfStaggered === '1') continue;
      var cells = ledger.querySelectorAll('.cf-ledger-cell');
      if (!cells.length) continue; // caliper-data not yet populated
      ledger.dataset.cfStaggered = '1';
      ledger.classList.add('cf-ledger-anim');
      for (var k = 0; k < cells.length; k++) {
        cells[k].style.transitionDelay = (k * 8) + 'ms';
      }
      (function (lg) {
        onceVisible(lg, 0.1, function () { lg.classList.add('cf-ledger-played'); });
      })(ledger);
    }
  }

  // ============================================================
  // 4. CATCH-RATE BAR FILL
  // ============================================================
  function setupBar() {
    if (REDUCE) return;
    var bars = document.querySelectorAll('[data-bar="catch"]');
    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i];
      if (bar.dataset.cfBar === '1') continue;
      var c = bar.querySelector('.cf-bar__caught');
      var m = bar.querySelector('.cf-bar__missed');
      if (!c || !m) continue;
      // caliper-data has set inline flex on each segment. Capture, reset to 0.
      var cTarget = c.style.flex;
      var mTarget = m.style.flex;
      if (!cTarget && !mTarget) continue; // data not yet filled
      bar.dataset.cfBar = '1';
      c.style.flex = '0';
      m.style.flex = '0';
      bar.classList.add('cf-bar-anim');
      // force layout so the transition picks up the change from 0 -> target
      void bar.offsetWidth;
      (function (cEl, mEl, cVal, mVal, b) {
        onceVisible(b, 0.3, function () {
          cEl.style.flex = cVal;
          mEl.style.flex = mVal;
        });
      })(c, m, cTarget, mTarget, bar);
    }
  }

  // ============================================================
  // BOOTSTRAP
  // ============================================================
  function onReady() {
    setupReveal();
    setupCountUpHardcoded();
  }

  function onDataReady() {
    setupCountUpDataLoaded();
    setupLedger();
    setupBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
  document.addEventListener('caliper:data-ready', onDataReady);
})();
