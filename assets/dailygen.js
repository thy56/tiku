/* -----------------------------------------------------------
   高数一 · 组卷核心（纯逻辑，无 DOM）
   浏览器与 Node 共用：window.GS_GEN / globalThis.GS_GEN
   ----------------------------------------------------------- */
(function (global) {
  "use strict";

  /* ================= 随机数（可复现） ================= */
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

  /* ================= 真题知识点权重 ================= */
  var CHAPTER_W = {
    "1": 0.20, "2": 0.24, "3": 0.19, "4": 0.10,
    "5": 0.11, "6": 0.08, "7": 0.08
  };

  var CHAPTER_NAME = {
    "1": "函数、极限和连续",
    "2": "一元函数微分学",
    "3": "一元函数积分学",
    "4": "向量代数与空间解析几何",
    "5": "多元函数微积分学",
    "6": "无穷级数",
    "7": "常微分方程"
  };

  var TYPE_PLAN = [
    { type: "单选", n: 10, label: "单项选择题", short: "单选", score: "每题 3 分" },
    { type: "填空", n: 5, label: "填空题", short: "填空", score: "每题 3 分" },
    { type: "计算", n: 8, label: "解答题", short: "解答", score: "共 56 分" }
  ];

  var TOTAL = TYPE_PLAN.reduce(function (a, t) { return a + t.n; }, 0);

  /* ================= 整数配额（最大余数法 + 容量修正） ================= */
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

  /* ================= 组卷 ================= */
  function buildPaper(dateStr, bank, opts) {
    opts = opts || {};
    var rng = makeRng((opts.salt || "gaoshu1") + "|daily|" + dateStr);
    /* recent：近期用过的题目 id 集合，优先避开（冷却窗口） */
    var recent = opts.recent || null;

    var pool = {};
    bank.forEach(function (q) {
      var ch = String(q.id).split("-")[0];
      if (!CHAPTER_W[ch]) return;
      pool[ch] = pool[ch] || {};
      pool[ch][q.type] = pool[ch][q.type] || [];
      pool[ch][q.type].push(q);
    });

    var ALPHA = opts.alpha || 12;
    var w = dirichlet(rng, CHAPTER_W, ALPHA);

    var sections = [];
    var dist = {};

    TYPE_PLAN.forEach(function (plan) {
      var cap = {};
      Object.keys(CHAPTER_W).forEach(function (ch) {
        cap[ch] = (pool[ch] && pool[ch][plan.type]) ? pool[ch][plan.type].length : 0;
      });

      var quota = quotaWithCap(w, plan.n, cap);
      var picks = [];

      Object.keys(quota).forEach(function (ch) {
        var k = quota[ch];
        if (k <= 0) return;
        var bucket = (pool[ch] && pool[ch][plan.type]) || [];

        /* 先抽冷题（近期未用），不够再抽热题 */
        var cold = [], hot = [];
        bucket.forEach(function (q) {
          if (recent && recent[q.id]) hot.push(q); else cold.push(q);
        });

        var got = shuffledSample(rng, cold, k);
        if (got.length < k) {
          got = got.concat(shuffledSample(rng, hot, k - got.length));
        }
        got.forEach(function (q) {
          picks.push(q);
          dist[ch] = (dist[ch] || 0) + 1;
        });
      });

      if (picks.length < plan.n) {
        var usedIds = {};
        picks.forEach(function (q) { usedIds[q.id] = 1; });
        var extra = [];
        Object.keys(pool).forEach(function (ch) {
          (pool[ch][plan.type] || []).forEach(function (q) {
            if (!usedIds[q.id]) extra.push(q);
          });
        });
        shuffledSample(rng, extra, plan.n - picks.length).forEach(function (q) {
          picks.push(q);
          var ch = String(q.id).split("-")[0];
          dist[ch] = (dist[ch] || 0) + 1;
        });
      }

      picks = shuffledSample(rng, picks, picks.length);

      sections.push({
        type: plan.type,
        name: plan.label,
        short: plan.short,
        score: plan.score,
        items: picks
      });
    });

    var no = 0;
    sections.forEach(function (sec) {
      sec.items.forEach(function (q) { no++; q.__no = no; });
    });

    return { date: dateStr, sections: sections, dist: dist, weights: w };
  }

  global.GS_GEN = {
    buildPaper: buildPaper,
    CHAPTER_W: CHAPTER_W,
    CHAPTER_NAME: CHAPTER_NAME,
    TYPE_PLAN: TYPE_PLAN,
    TOTAL: TOTAL,
    makeRng: makeRng
  };
})(typeof window !== "undefined" ? window : globalThis);
