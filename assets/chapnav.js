/* ===========================================================
   chapnav.js — 分页导航（四科共用）
   参数约定：?ch=<key>
     - 无 ch  → 目录页（显示单元索引卡）
     - 有 ch  → 单单元页（只渲染该单元）
   接口：
     GS_CH         章节号（数字）或 null        —— 章节型页面用
     GS_KEY        原始 ch 字符串或 null        —— 通用单元型页面用
     GS_SHORT(t)   去掉「第X章」前缀
     GS_renderChapBar / GS_renderChapPager / GS_renderChapIndex    —— 章节型
     GS_renderUnitBar / GS_renderUnitPager / GS_renderUnitIndex    —— 通用单元型
   =========================================================== */
(function () {
  "use strict";

  var NAV = window.GS_NAV || window.JS_NAV || window.YW_NAV ||
            window.YUWEN_NAV || window.HUB_NAV || { chapters: [] };
  var CHS = NAV.chapters || [];

  function qs(k) {
    var m = new RegExp("[?&]" + k + "=([^&]*)").exec(location.search || "");
    if (!m) return null;
    var v = decodeURIComponent(m[1]);
    return v === "" ? null : v;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function shortTitle(t) {
    return String(t || "")
      .replace(/^第[一二三四五六七八九十\d]+章[\s\u3000]*/, "")
      .replace(/^第[一二三四五六七八九十\d]+[部分篇][\s\u3000]*/, "");
  }

  /* ---------- 参数解析 ---------- */
  /* 静态独立页模式：文件内置当前单元，URL 不带参数 */
  var FIXED_CH = (typeof window.GS_FIXED_CH === "number") ? window.GS_FIXED_CH : null;
  var FIXED_KEY = (typeof window.GS_FIXED_KEY === "string") ? window.GS_FIXED_KEY : null;
  var RAW = FIXED_KEY !== null ? FIXED_KEY : qs("ch");

  var CH = null;
  if (FIXED_CH !== null) {
    if (CHS.some(function (c) { return c.no === FIXED_CH; })) CH = FIXED_CH;
  } else if (RAW !== null && /^\d+$/.test(RAW)) {
    var n = parseInt(RAW, 10);
    if (CHS.some(function (c) { return c.no === n; })) CH = n;
  }

  window.GS_NAV_ALL = NAV;
  window.GS_CHAPTERS = CHS;
  window.GS_CH = CH;
  window.GS_KEY = RAW;
  window.GS_STATIC_MODE = (FIXED_CH !== null || FIXED_KEY !== null);
  window.GS_QS = qs;
  window.GS_SHORT = shortTitle;
  /* 对外暴露：静态模式下返回真实文件名，否则回落到 ?ch= */
  window.GS_HREF = hrefOf;
  window.GS_HOME = homeHref;

  /* ---------- 内部渲染 ---------- */
  /* 静态模式：window.GS_STATIC_MAP = {"1":"kn-ch1.html", ...} */
  function staticMap() {
    return (window.GS_STATIC_MAP && typeof window.GS_STATIC_MAP === "object")
      ? window.GS_STATIC_MAP : null;
  }

  function hrefOf(page, key) {
    var m = staticMap();
    if (m && m[String(key)]) return m[String(key)];
    return page + "?ch=" + encodeURIComponent(String(key));
  }

  /* 首页链接：静态模式下回落到不带参数的页面文件 */
  function homeHref(page) {
    var m = staticMap();
    return (m && m.__home) ? m.__home : page;
  }

  function barHtml(page, units, cur, opts) {
    var h = '<div class="chapbar"><span class="cb-lb">' + esc(opts.label || "目录") + "</span>";
    if (opts.withAll !== false) {
      h += '<a class="cb-a' + (cur === null ? " on" : "") + '" href="' + homeHref(page) + '">全部</a>';
    }
    units.forEach(function (u) {
      var on = cur !== null && String(cur) === String(u.key);
      h += '<a class="cb-a' + (on ? " on" : "") + '" href="' + hrefOf(page, u.key) + '">';
      if (u.no != null) h += "<b>" + esc(u.no) + "</b>";
      h += esc(u.label);
      if (u.count != null) h += "<i>" + u.count + "</i>";
      h += "</a>";
    });
    h += "</div>";
    return h;
  }

  function pagerHtml(page, units, cur) {
    if (cur === null) return "";
    var idx = -1;
    units.forEach(function (u, i) { if (String(u.key) === String(cur)) idx = i; });
    if (idx < 0) return "";

    var prev = idx > 0 ? units[idx - 1] : null;
    var next = idx < units.length - 1 ? units[idx + 1] : null;

    var h = '<div class="chpager">';
    h += prev
      ? '<a class="cp-a prev" href="' + hrefOf(page, prev.key) + '"><span>← 上一</span><b>' + esc(prev.label) + "</b></a>"
      : '<span class="cp-a dis"><span>← 上一</span><b>已是第一个</b></span>';
    h += '<a class="cp-a mid" href="' + homeHref(page) + '">返回目录</a>';
    h += next
      ? '<a class="cp-a next" href="' + hrefOf(page, next.key) + '"><span>下一 →</span><b>' + esc(next.label) + "</b></a>"
      : '<span class="cp-a dis"><span>下一 →</span><b>已是最后一个</b></span>';
    h += "</div>";
    return h;
  }

  /* items: [{key|no, title, desc, stats:[{t,v}]}] */
  function indexHtml(page, items) {
    var h = '<div class="chapidx">';
    items.forEach(function (c) {
      var key = (c.key != null) ? c.key : c.no;
      h += '<a class="ci-card" href="' + hrefOf(page, key) + '">';
      h += '<div class="ci-no">' + esc(c.badge != null ? c.badge : (c.no != null ? c.no : key)) + "</div>";
      h += '<div class="ci-bd">';
      h += "<h3>" + esc(c.title) + "</h3>";
      if (c.desc) h += "<p>" + esc(c.desc) + "</p>";
      if (c.stats && c.stats.length) {
        h += '<div class="ci-st">';
        c.stats.forEach(function (s) {
          h += "<span><b>" + s.v + "</b>" + esc(s.t) + "</span>";
        });
        h += "</div>";
      }
      h += "</div>";
      h += '<div class="ci-go">→</div>';
      h += "</a>";
    });
    h += "</div>";
    return h;
  }

  function setHTML(id, html) {
    var host = document.getElementById(id);
    if (host) host.innerHTML = html;
  }

  /* ---------- A) 章节型 ---------- */
  window.GS_renderChapBar = function (hostId, page, opts) {
    opts = opts || {};
    var units = CHS.map(function (c) {
      return {
        key: c.no,
        no: c.no,
        label: shortTitle(c.title),
        count: opts.count ? opts.count(c) : null
      };
    });
    setHTML(hostId, barHtml(page, units, CH, opts));
  };

  window.GS_renderChapPager = function (hostId, page) {
    var units = CHS.map(function (c) {
      return { key: c.no, label: shortTitle(c.title) };
    });
    setHTML(hostId, pagerHtml(page, units, CH));
  };

  window.GS_renderChapIndex = function (hostId, items, page) {
    var norm = items.map(function (c) {
      return {
        key: (c.key != null) ? c.key : c.no,
        badge: (c.no != null) ? c.no : (c.key != null ? c.key : ""),
        title: shortTitle(c.title),
        desc: c.desc,
        stats: c.stats
      };
    });
    setHTML(hostId, indexHtml(page, norm));
  };

  /* ---------- B) 通用单元型 ---------- */
  /* units: [{key, no?, label, count?}] */
  window.GS_renderUnitBar = function (hostId, page, units, opts) {
    opts = opts || {};
    setHTML(hostId, barHtml(page, units, RAW, opts));
  };

  window.GS_renderUnitPager = function (hostId, page, units) {
    setHTML(hostId, pagerHtml(page, units, RAW));
  };

  window.GS_renderUnitIndex = function (hostId, items, page) {
    setHTML(hostId, indexHtml(page, items));
  };
})();
