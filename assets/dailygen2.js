/* -----------------------------------------------------------
   通用每日一练组卷核心（纯逻辑，无 DOM）
   支持：章节加权 / 均匀抽样、多题型、冷却窗口
   window.GS_GEN2 / globalThis.GS_GEN2
   ----------------------------------------------------------- */
(function (global) {
  "use strict";

  function xmur3(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) { return mulberry32(xmur3(seed)()); }

  function randn(rng) {
    var u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function randGamma(rng, k) {
    if (k < 1) return randGamma(rng, k + 1) * Math.pow(rng(), 1 / k);
    var d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (;;) {
      var x = randn(rng), v = 1 + c * x;
      if (v <= 0) continue;
      v = v * v * v;
      var u = rng();
      if (u < 1 - 0.0331 * x * x * x * x) return d * v;
      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
    }
  }
  function dirichlet(rng, base, alpha) {
    var keys = Object.keys(base);
    var g = keys.map(function (k) {
      return randGamma(rng, Math.max(base[k] * alpha, 1e-9));
    });
    var s = g.reduce(function (a, b) { return a + b; }, 0);
    var out = {};
    keys.forEach(function (k, i) { out[k] = s > 0 ? g[i] / s : 0; });
    return out;
  }

  function quotaWithCap(weights, n, cap) {
    var keys = Object.keys(weights);
    var out = {}, lock = {};
    keys.forEach(function (k) { out[k] = 0; lock[k] = false; });

    var guard = 0;
    while (guard++ < 60) {
      var free = keys.filter(function (k) { return !lock[k]; });
      if (!free.length) break;
      var wsum = free.reduce(function (a, k) { return a + weights[k]; }, 0);
      if (wsum <= 0) break;
      var used = 0;
      keys.forEach(function (k) { if (lock[k]) used += out[k]; });
      var rest = n - used;
      if (rest <= 0) break;

      var fracs = [], baseSum = 0;
      free.forEach(function (k) {
        var v = weights[k] / wsum * rest;
        var b = Math.floor(v);
        out[k] = b;
        baseSum += b;
        fracs.push({ k: k, f: v - b });
      });
      fracs.sort(function (a, b) { return b.f - a.f; });
      var left = rest - baseSum, i = 0;
      while (left > 0 && fracs.length) {
        out[fracs[i % fracs.length].k]++;
        left--; i++;
      }
      var over = false;
      keys.forEach(function (k) {
        if (lock[k]) return;
        if (cap[k] === 0) { out[k] = 0; lock[k] = true; over = true; }
        else if (cap[k] != null && out[k] > cap[k]) {
          out[k] = cap[k]; lock[k] = true; over = true;
        }
      });
      if (!over) break;
    }
    return out;
  }

  function shuffledSample(rng, arr, k) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, Math.min(k, a.length));
  }

  /* 从桶里抽 k 题，优先冷题 */
  function pickFrom(rng, bucket, k, recent) {
    var cold = [], hot = [];
    bucket.forEach(function (q) {
      if (recent && recent[q.id]) hot.push(q); else cold.push(q);
    });
    var got = shuffledSample(rng, cold, k);
    if (got.length < k) {
      got = got.concat(shuffledSample(rng, hot, k - got.length));
    }
    return got;
  }

  /* cfg: { salt, plan:[{type,n,label,short,score}], distType:'chapter'|'uniform',
            chapterW, chapterNames, keyOf(q)->chapter } */
  function buildPaper(dateStr, bank, cfg, opts) {
    opts = opts || {};
    var rng = makeRng((cfg.salt || "s") + "|daily|" + dateStr);
    var recent = opts.recent || null;

    /* 按 type 分桶 */
    var byType = {};
    bank.forEach(function (q) {
      byType[q.type] = byType[q.type] || [];
      byType[q.type].push(q);
    });

    var sections = [];
    var dist = {};

    /* 章节权重：每天浮动 */
    var w = null;
    if (cfg.distType === "chapter" && cfg.chapterW) {
      w = dirichlet(rng, cfg.chapterW, opts.alpha || 12);
    }

    cfg.plan.forEach(function (plan) {
      var bucket = byType[plan.type] || [];
      var picks = [];

      if (w) {
        /* 按章节加权 */
        var byCh = {};
        bucket.forEach(function (q) {
          var ch = cfg.keyOf(q);
          byCh[ch] = byCh[ch] || [];
          byCh[ch].push(q);
        });
        var cap = {};
        Object.keys(cfg.chapterW).forEach(function (ch) {
          cap[ch] = (byCh[ch] || []).length;
        });
        var quota = quotaWithCap(w, plan.n, cap);

        Object.keys(quota).forEach(function (ch) {
          var k = quota[ch];
          if (k <= 0) return;
          pickFrom(rng, byCh[ch] || [], k, recent).forEach(function (q) {
            picks.push(q);
            dist[ch] = (dist[ch] || 0) + 1;
          });
        });

        if (picks.length < plan.n) {
          var usedIds = {};
          picks.forEach(function (q) { usedIds[q.id] = 1; });
          var extra = bucket.filter(function (q) { return !usedIds[q.id]; });
          pickFrom(rng, extra, plan.n - picks.length, recent).forEach(function (q) {
            picks.push(q);
            var ch = cfg.keyOf(q);
            dist[ch] = (dist[ch] || 0) + 1;
          });
        }
      } else {
        /* 均匀抽样 */
        picks = pickFrom(rng, bucket, plan.n, recent);
      }

      picks = shuffledSample(rng, picks, picks.length);

      sections.push({
        type: plan.type,
        name: plan.label,
        short: plan.short,
        score: plan.score || "",
        items: picks
      });
    });

    return { date: dateStr, sections: sections, dist: dist, weights: w };
  }

  global.GS_GEN2 = {
    buildPaper: buildPaper,
    makeRng: makeRng,
    dirichlet: dirichlet,
    shuffledSample: shuffledSample
  };
})(typeof window !== "undefined" ? window : globalThis);
