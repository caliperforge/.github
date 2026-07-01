/* =============================================================================
   caliper-data.js
   Live-data loader for CaliperForge home + what-we-caught.
   Replaces the design-tool runtime (`support.js`) — pure vanilla JS.
   Reads /data/org_stats.json + /data/caught_public.json on every page load
   and fills [data-stat] slots, the decision ledger, the catch-rate bar, and
   the misses list. Number text is NEVER hardcoded in the HTML.
   ========================================================================== */
(function () {
  'use strict';

  var FEEDS = {
    org:    '/data/org_stats.json',
    caught: '/data/caught_public.json'
  };

  // --- formatters ---------------------------------------------------------
  function formatInt(n) {
    if (n === null || n === undefined || isNaN(n)) return '';
    return Number(n).toLocaleString();
  }
  function passthrough(v) {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  // --- resolver: data-stat key -> [source, path, formatter] --------------
  // source is 'org' or 'caught', path is a dotted accessor on that feed.
  var STATS = {
    // caught_public.json -> metrics
    'caught.tp':           ['caught', 'metrics.tp',                       formatInt],
    'caught.fn':           ['caught', 'metrics.fn',                       formatInt],
    'caught.fp':           ['caught', 'metrics.fp',                       formatInt],
    'caught.tn':           ['caught', 'metrics.tn',                       formatInt],
    'caught.adjudicated':  ['caught', 'metrics.adjudicated',              formatInt],
    'caught.catch_rate':   ['caught', 'metrics.catch_rate_display',       passthrough],
    'caught.precision':    ['caught', 'metrics.precision_display',        passthrough],
    'caught.fp_rate':      ['caught', 'metrics.false_positive_rate_display', passthrough],
    'caught.window_start': ['caught', 'window_start',                     passthrough],
    'caught.window_end':   ['caught', 'window_end',                       passthrough],

    // org_stats.json -> top-level
    'org.days_running':            ['org', 'days_running',            formatInt],
    'org.specialized_agents':      ['org', 'specialized_agents',      formatInt],
    // T-completeness-enforcement-2026-06-30 CEO steer: honest relabel.
    // The number stays the same (control_effectiveness.jsonl line count)
    // but the KEY is now `logged_agent_decisions` — 2,181 of those rows
    // are decision.v1 telemetry, not gate reviews. `org.gate_reviews`
    // retained as a legacy alias (falls back to logged_agent_decisions).
    'org.logged_agent_decisions':  ['org', 'logged_agent_decisions',  formatInt],
    'org.gate_reviews':            ['org', 'gate_reviews',            formatInt],
    'org.agent_dispatches':        ['org', 'agent_dispatches',        formatInt]
  };

  function dottedGet(obj, path) {
    if (!obj) return undefined;
    return path.split('.').reduce(function (acc, part) {
      return (acc && acc[part] !== undefined) ? acc[part] : undefined;
    }, obj);
  }

  function fillStats(feeds) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-stat]'), function (el) {
      var key = el.getAttribute('data-stat');
      var spec = STATS[key];
      if (!spec) return;
      var src = feeds[spec[0]];
      if (!src) return;
      var raw = dottedGet(src, spec[1]);
      var out = spec[2](raw);
      if (out !== '' && out !== undefined && out !== null) el.textContent = out;
    });
  }

  // --- decision ledger: render tp gold + fn brick + tn navy ---------------
  function fillLedgers(caught) {
    if (!caught || !caught.metrics) return;
    var tp = Number(caught.metrics.tp) || 0;
    var fn = Number(caught.metrics.fn) || 0;
    var tn = Number(caught.metrics.tn) || 0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-ledger]'), function (container) {
      var html = '';
      for (var i = 0; i < tp; i++) html += '<span class="cf-ledger-cell cf-ledger-cell--caught"></span>';
      for (var j = 0; j < fn; j++) html += '<span class="cf-ledger-cell cf-ledger-cell--missed"></span>';
      for (var k = 0; k < tn; k++) html += '<span class="cf-ledger-cell cf-ledger-cell--clean"></span>';
      container.innerHTML = html;
    });
  }

  // --- catch-rate bar: scale .cf-bar__caught / .cf-bar__missed by tp / fn -
  function fillBars(caught) {
    if (!caught || !caught.metrics) return;
    var tp = Number(caught.metrics.tp) || 0;
    var fn = Number(caught.metrics.fn) || 0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-bar="catch"]'), function (bar) {
      var c = bar.querySelector('.cf-bar__caught');
      var m = bar.querySelector('.cf-bar__missed');
      if (c) c.style.flex = String(tp);
      if (m) m.style.flex = String(fn);
    });
  }

  // --- escape helpers for safe text-in-HTML insertion ---------------------
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // --- misses list: render from caught_public.misses[] -------------------
  function fillMisses(caught) {
    if (!caught || !Array.isArray(caught.misses)) return;
    var host = document.querySelector('[data-misses-list]');
    if (!host) return;
    var html = caught.misses.map(function (m, i) {
      var idx = String(i + 1).padStart(2, '0');
      var gate = m.gate_missed ? 'MISS ' + idx + ' · ' + esc(m.gate_missed) : 'MISS ' + idx + ' · DOCUMENTED';
      var meta = [];
      if (m.caught_by)  meta.push('caught by ' + esc(m.caught_by));
      if (m.caught_iso) meta.push(esc(m.caught_iso));
      if (m.fix_ref)    meta.push(esc(m.fix_ref));
      var metaLine = meta.length ? meta.join(' · ') : 'Logged, reproduced, and corrected.';
      var headline = esc(m.headline || 'Logged, reproduced, and corrected.');
      // body: first sentence of the frame, capped, plain text only.
      var bodyText = '';
      if (m.frame) {
        var raw = String(m.frame).replace(/<[^>]+>/g, ''); // strip any inline HTML
        var firstSentence = raw.split(/\.\s|\."\s|\.\)\s/)[0];
        if (firstSentence && firstSentence.length > 240) firstSentence = firstSentence.slice(0, 237) + '…';
        bodyText = esc(firstSentence) + (firstSentence && !/[.!?…]$/.test(firstSentence) ? '.' : '');
      }
      var writeup = m.writeup_url
        ? '<a href="' + esc(m.writeup_url) + '" class="cf-link-gold--deep">Read the write-up &rarr;</a>'
        : '<span class="cf-link-gold--deep" style="opacity:.55;cursor:default;">Write-up in the ledger</span>';
      return ''
        + '<div class="cf-card cf-card--miss">'
        +   '<div class="cf-card__eyebrow cf-card__eyebrow--miss">' + gate + '</div>'
        +   '<div class="cf-card__title cf-card__title--miss">' + headline + '</div>'
        +   '<p class="cf-card__body cf-card__body--miss">' + bodyText + '</p>'
        +   '<div class="cf-card__foot cf-card__foot--miss"><span>' + metaLine + '</span></div>'
        + '</div>';
    }).join('');
    host.innerHTML = html;
  }

  // --- fetch + dispatch ---------------------------------------------------
  function fetchJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
      return r.json();
    });
  }

  function run() {
    Promise.all([
      fetchJSON(FEEDS.org).catch(function (e) { console.warn('[caliper-data]', e); return null; }),
      fetchJSON(FEEDS.caught).catch(function (e) { console.warn('[caliper-data]', e); return null; })
    ]).then(function (results) {
      var feeds = { org: results[0], caught: results[1] };
      fillStats(feeds);
      fillLedgers(feeds.caught);
      fillBars(feeds.caught);
      fillMisses(feeds.caught);
      // Notify the motion layer (caliper-motion.js) synchronously, so it can
      // reset count-up targets to "0" in the same task — no flash of final
      // value before paint. No-op if motion layer isn't loaded.
      try {
        document.dispatchEvent(new CustomEvent('caliper:data-ready', { detail: feeds }));
      } catch (_) { /* CustomEvent unsupported — motion just stays static */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
