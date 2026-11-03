/* ===========================================================
   kp_index.js — 知识体系三级导航页（章 → 专题 → 知识点）
   支持三种状态：
     know.html              全部章节总览
     know.html?ch=N         第 N 章：专题 + 该章全部知识点
     know.html?ch=N&g=M     第 N 章第 M 专题：只列该专题知识点
   依赖 window.KP_DATA（data/knflat.js）
   =========================================================== */
(function () {
  "use strict";

  var D = window.KP_DATA;
  if (!D) return;

  var CHS = D.chapters || [];
  var ALL = D.items || [];
  var QS = window.GS_QS || function (k) {
    var m = new RegExp("[?&]" + k + "=([^&]*)").exec(location.search || "");
    if (!m) return null;
    var v = decodeURIComponent(m[1]);
    return v === "" ? null : v;
  };

  /* 章号：优先用 chapnav 给的 GS_CH，否则自己从 URL 解析
     （语文/英语的 manifest 结构与计算机/高数不同，不能依赖 GS_CH） */
  var CH = (function () {
    if (typeof window.GS_CH === "number") return window.GS_CH;
    var raw = QS("ch");
    if (raw === null || !/^\d+$/.test(raw)) return null;
    var n = parseInt(raw, 10);
    return CHS.some(function (c) { return c.no === n; }) ? n : null;
  })();

  var G = (function () {
    var v = QS("g");
    if (v === null) return null;
    var n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  })();

  var KEY = "";
  var $main = document.getElementById("main");
  var $q = document.getElementById("q");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function hl(s) {
    var t = esc(s);
    if (!KEY) return t;
    var re = new RegExp("(" + KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return t.replace(re, '<span class="hl">$1</span>');
  }
  function has(s) { return String(s == null ? "" : s).toLowerCase().indexOf(KEY) !== -1; }
  function shortTitle(t) {
    return String(t || "").replace(/^第[一二三四五六七八九十\d]+章[\s\u3000]*/, "");
  }
  function match(x) {
    if (!KEY) return true;
    if (has(x.t) || has(x.body)) return true;
    return (x.points || []).some(has);
  }

  /* ============ 状态一：全部章节总览 ============ */
  function renderAll() {
    document.getElementById("bar").style.display = "none";

    var h = '<div class="kp-grid">';
    CHS.forEach(function (c) {
      var n = c.count;
      h += '<a class="kp-chcard" href="know.html?ch=' + c.no + '">';
      h += '<div class="kp-chno">第 ' + c.no + ' 章</div>';
      h += '<h3>' + esc(shortTitle(c.title)) + '</h3>';
      if (c.desc) h += '<p>' + esc(c.desc) + '</p>';
      h += '<div class="kp-chst">';
      h += '<span><b>' + n + '</b> 知识点</span>';
      h += '<span><b>' + (c.groups || []).length + '</b> 专题</span>';
      h += '<span class="kp-go">进入 →</span>';
      h += '</div></a>';
    });
    h += '</div>';

    $main.innerHTML = h;

    var bd = document.getElementById("hBadge");
    if (bd) bd.textContent = CHS.length + " 章 · " + D.total + " 知识点";
    var sb = document.getElementById("hSub");
    if (sb) sb.textContent = "共 " + CHS.length + " 章 " + D.total +
      " 个知识点。每个知识点都是独立页面，页内有前后翻页与相关知识点跳转。";
  }

  /* ============ 状态二/三：单章 / 单专题 ============ */
  function renderChapter() {
    var ch = CHS.filter(function (c) { return c.no === CH; })[0];
    if (!ch) {
      $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
      return;
    }
    document.getElementById("bar").style.display = "";

    var inCh = ALL.filter(function (x) { return x.ch === CH; });

    /* 搜索模式：平铺所有命中项 */
    if (KEY) {
      var hit = inCh.filter(match);
      var hh = '<div class="chaphero"><span class="ch-no">第 ' + ch.no + ' 章</span>';
      hh += '<h2>' + esc(shortTitle(ch.title)) + '</h2>';
      hh += '<div class="ch-st"><span><b>' + hit.length + '</b> / ' + inCh.length + ' 命中</span></div></div>';
      if (!hit.length) {
        $main.innerHTML = hh + '<div class="empty">本章没有匹配「' + esc(KEY) + '」的知识点</div>';
      } else {
        var hb = '<div class="stats"><span>搜索：' + esc(KEY) + '</span></div><div class="kplist">';
        hit.forEach(function (x) {
          hb += '<a class="kpi" href="' + x.id + '.html">';
          hb += '<span class="kpi-n">' + x.n + '</span>';
          hb += '<span class="kpi-t">' + hl(x.t) + '</span>';
          hb += '<span class="kpi-g">' + esc(x.gTitle) + '</span>';
          hb += '<span class="kpi-go">→</span></a>';
        });
        hb += '</div>';
        $main.innerHTML = hh + hb;
      }
      updateHead(ch, inCh.length);
      return;
    }

    /* 单专题视图 */
    if (G !== null && ch.groups[G]) {
      var g = ch.groups[G];
      var hg = '<div class="chaphero"><span class="ch-no">第 ' + ch.no + ' 章 · 第 ' + (G + 1) + ' 组</span>';
      hg += '<h2>' + esc(g.title) + '</h2>';
      if (g.desc) hg += '<p>' + esc(g.desc) + '</p>';
      hg += '<div class="ch-st"><span><b>' + g.items.length + '</b> 知识点</span></div></div>';

      hg += '<div style="margin:0 0 16px"><a href="topic-' + ch.no + '-' + G + '.html" '
        + 'style="display:inline-block;padding:9px 20px;border-radius:8px;'
        + 'background:#1f4e79;color:#fff;font-size:13px;font-weight:600;'
        + 'text-decoration:none">进入本站点专页（含题型与练习） →</a></div>';

      hg += '<div class="kplist">';
      g.items.forEach(function (it) {
        hg += '<a class="kpi" href="' + it.id + '.html">';
        hg += '<span class="kpi-n">' + it.n + '</span>';
        hg += '<span class="kpi-t">' + esc(it.t) + '</span>';
        hg += '<span class="kpi-go">→</span></a>';
      });
      hg += '</div>';
      hg += '<div class="kp-back"><a href="know.html?ch=' + ch.no + '">← 返回本章全部专题</a></div>';

      $main.innerHTML = hg;
      updateHead(ch, inCh.length);
      renderGroupPager(ch, G);
      return;
    }

    /* 单章视图：专题卡片 + 全部知识点列表 */
    var h = '<div class="chaphero"><span class="ch-no">第 ' + ch.no + ' 章</span>';
    h += '<h2>' + esc(shortTitle(ch.title)) + '</h2>';
    if (ch.desc) h += '<p>' + esc(ch.desc) + '</p>';
    h += '<div class="ch-st">';
    h += '<span><b>' + inCh.length + '</b> 知识点</span>';
    h += '<span><b>' + ch.groups.length + '</b> 专题</span>';
    h += '</div></div>';

    /* 专题卡 —— 直达考点专页 topic-N-M.html */
    h += '<div class="kp-sech">考点专页<span style="margin-left:auto;font-size:12px;font-weight:400;color:var(--ink-4)">每个考点一页：知识点 + 题型 + 练习</span></div>';
    h += '<div class="kp-ggrid">';
    ch.groups.forEach(function (g, gi) {
      h += '<a class="kp-gcard" href="topic-' + ch.no + '-' + gi + '.html">';
      h += '<div class="kp-gno">' + (gi + 1) + '</div>';
      h += '<div class="kp-gbd"><h4>' + esc(g.title) + '</h4>';
      h += '<span>' + g.items.length + ' 个知识点 · 进入专页</span></div>';
      h += '<div class="kp-going">→</div></a>';
    });
    h += '</div>';

    /* 全部知识点（按专题分组平铺） */
    h += '<div class="kp-sech">本章全部知识点</div>';
    ch.groups.forEach(function (g, gi) {
      h += '<div class="kp-gtitle">' + esc(g.title) + '<span>' + g.items.length + '</span></div>';
      h += '<div class="kplist">';
      g.items.forEach(function (it) {
        h += '<a class="kpi" href="' + it.id + '.html">';
        h += '<span class="kpi-n">' + it.n + '</span>';
        h += '<span class="kpi-t">' + esc(it.t) + '</span>';
        h += '<span class="kpi-go">→</span></a>';
      });
      h += '</div>';
    });

    $main.innerHTML = h;
    updateHead(ch, inCh.length);
  }

  function updateHead(ch, n) {
    var bd = document.getElementById("hBadge");
    if (bd) bd.textContent = "第 " + ch.no + " 章 · " + n + " 知识点";
    var sb = document.getElementById("hSub");
    if (sb) sb.textContent = shortTitle(ch.title) + "。点任一知识点进入独立页面。";
  }

  function renderGroupPager(ch, gi) {
    var host = document.getElementById("chpager");
    if (!host) return;
    var p = '<div class="chpager">';
    if (gi > 0) {
      p += '<a class="cp-a prev" href="know.html?ch=' + ch.no + '&g=' + (gi - 1) + '"><span>← 上一专题</span><b>' +
        esc(ch.groups[gi - 1].title) + '</b></a>';
    } else {
      p += '<span class="cp-a dis"><span>← 上一专题</span><b>已是第一个</b></span>';
    }
    p += '<a class="cp-a mid" href="know.html?ch=' + ch.no + '">本章全部</a>';
    if (gi < ch.groups.length - 1) {
      p += '<a class="cp-a next" href="know.html?ch=' + ch.no + '&g=' + (gi + 1) + '"><span>下一专题 →</span><b>' +
        esc(ch.groups[gi + 1].title) + '</b></a>';
    } else {
      p += '<span class="cp-a dis"><span>下一专题 →</span><b>已是最后一个</b></span>';
    }
    p += '</div>';
    host.innerHTML = p;
  }

  function renderChapterBar() {
    var host = document.getElementById("chapbar");
    if (!host) return;
    var h = '<div class="chapbar"><span class="cb-lb">目录</span>';
    h += '<a class="cb-a' + (CH === null ? " on" : "") + '" href="know.html">全部</a>';
    CHS.forEach(function (c) {
      var on = (CH !== null && c.no === CH);
      h += '<a class="cb-a' + (on ? " on" : "") + '" href="know.html?ch=' + c.no + '">';
      h += "<b>" + c.no + "</b>" + esc(shortTitle(c.title).slice(0, 10));
      h += "<i>" + c.count + "</i></a>";
    });
    h += "</div>";
    host.innerHTML = h;
  }

  function renderChapterPager() {
    var host = document.getElementById("chpager");
    if (!host || CH === null) return;
    var idx = -1;
    CHS.forEach(function (c, i) { if (c.no === CH) idx = i; });
    if (idx < 0) return;
    var pv = idx > 0 ? CHS[idx - 1] : null;
    var nx = idx < CHS.length - 1 ? CHS[idx + 1] : null;
    var p = '<div class="chpager">';
    p += pv
      ? '<a class="cp-a prev" href="know.html?ch=' + pv.no + '"><span>← 上一章</span><b>' + esc(shortTitle(pv.title)) + '</b></a>'
      : '<span class="cp-a dis"><span>← 上一章</span><b>已是第一章</b></span>';
    p += '<a class="cp-a mid" href="know.html">全部章节</a>';
    p += nx
      ? '<a class="cp-a next" href="know.html?ch=' + nx.no + '"><span>下一章 →</span><b>' + esc(shortTitle(nx.title)) + '</b></a>'
      : '<span class="cp-a dis"><span>下一章 →</span><b>已是最后一章</b></span>';
    p += '</div>';
    host.innerHTML = p;
  }

  /* ============ 事件 ============ */
  var timer = null;
  if ($q) {
    $q.addEventListener("input", function () {
      clearTimeout(timer);
      var v = this.value;
      timer = setTimeout(function () {
        KEY = v.trim().toLowerCase();
        if (CH === null) {
          if (KEY) { window.location.href = "know.html?ch=1"; return; }
          renderAll();
        } else {
          renderChapter();
        }
      }, 180);
    });
  }

  var top = document.getElementById("top");
  if (top) top.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ============ 启动 ============ */
  renderChapterBar();
  if (CH === null) {
    renderAll();
  } else {
    renderChapter();
    if (G === null) renderChapterPager();
  }
})();
