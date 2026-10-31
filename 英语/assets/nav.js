/* 共用导航：顶部导航条 + 下拉菜单（英语版，依赖 assets/manifest.js） */
(function () {
  "use strict";

  var NAV = window.YW_NAV || { groups: [], chapters: [], layers: [], vcats: [], roots: [], stats: {} };
  var S = NAV.stats || {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function pageName() {
    var p = (location.pathname || "").split("/").pop() || "index.html";
    /* 中文文件名在 location.pathname 里是百分号编码，必须解码后再比较，否则高亮永不生效 */
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/\.html?$/i, "") || "index";
  }

  function build() {
    var host = document.getElementById("nav");
    if (!host) return;
    var cur = pageName();

    function a(href, label, num, on) {
      return '<a class="nav-a' + (on ? " on" : "") + '" href="' + href + '">' +
        label + (num != null ? '<span class="n">' + num + "</span>" : "") + "</a>";
    }

    var h = '<div class="nav-in">';
    h += '<a class="nav-brand" href="index.html"><i class="bi" style="background:#3f8f4a"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6c2.3 2.3 3.5 5.2 3.5 8.4s-1.2 6.1-3.5 8.4c-2.3-2.3-3.5-5.2-3.5-8.4s1.2-6.1 3.5-8.4z"/></svg></i>山东专升本英语</a>';
    h += '<div class="nav-links">';
    /* ---------- 题库：统一下拉入口（专项/每日/真题 同源） ---------- */
    var tkOn = ['题库', '专项练习', '每日一练', '历年真题'].indexOf(cur) >= 0
      || /^pr-/.test(cur) || /^zt-/.test(cur);
    h += '<div class="nav-menu" id="mTk">';
    h += '<a class="nav-a' + (tkOn ? " on" : "") + '" href="题库.html">题库'
      + '<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="题库.html"' + (cur === '题库' ? ' class="on"' : '') + '>题库总览</a>';
    h += '<div class="dsep"></div>';
    h += '<a href="专项练习.html"' + (cur === '专项练习' ? ' class="on"' : '') + '>专项练习</a>';
    h += '<a href="每日一练.html"' + (cur === '每日一练' ? ' class="on"' : '') + '>每日一练</a>';
    h += '<a href="历年真题.html"' + (cur === '历年真题' ? ' class="on"' : '') + '>历年真题</a>';
    h += '</div></div>';


    /* 语法：下拉选章节 */
    var gmOn = cur === "grammar";
    h += '<div class="nav-menu" id="mGr">';
    h += '<a class="nav-a' + (gmOn ? " on" : "") + '" href="grammar.html">语法<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="grammar.html">全部章节</a>';
    h += '<div class="dsep"></div>';
    (NAV.chapters || []).forEach(function (c) {
      h += '<a href="grammar.html#c' + c.i + '">' + esc(c.title.replace(/^第.章　?/, "")) +
        '</a>';
    });
    h += "</div></div>";

    /* 时态：下拉选层级 */
    var tnOn = cur === "tenses";
    h += '<div class="nav-menu" id="mTn">';
    h += '<a class="nav-a' + (tnOn ? " on" : "") + '" href="tenses.html">时态语态<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="tenses.html">全部层级</a>';
    h += '<div class="dsep"></div>';
    (NAV.layers || []).forEach(function (L) {
      h += '<a href="tenses.html#t' + L.i + '">' + esc(L.title.replace(/^第.层　?/, "")) +
        '</a>';
    });
    h += "</div></div>";

    
    /* 知识体系：下拉选章节 */
    var knOn = cur === "know";
    h += '<div class="nav-menu" id="mKn">';
    h += '<a class="nav-a' + (knOn ? " on" : "") + '" href="know.html">知识体系<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="know.html">全部章节</a>';
    h += '<div class="dsep"></div>';
        h += '<a href="know.html?ch=1">句子骨架：从五大句型开始 <i style="opacity:.55;font-style:normal">16</i></a>';
    h += '<a href="know.html?ch=2">词法基础：各类词的用法 <i style="opacity:.55;font-style:normal">19</i></a>';
    h += '<a href="know.html?ch=3">动词体系：时态之外的动词规则 <i style="opacity:.55;font-style:normal">23</i></a>';
    h += '<a href="know.html?ch=4">从句：把句子装进句子里 <i style="opacity:.55;font-style:normal">23</i></a>';
    h += '<a href="know.html?ch=5">特殊句式：倒装、强调、虚拟 <i style="opacity:.55;font-style:normal">13</i></a>';
    h += '<a href="know.html?ch=6">时态与语态 <i style="opacity:.55;font-style:normal">21</i></a>';
    h += '<a href="know.html?ch=7">词根词缀（58 组） <i style="opacity:.55;font-style:normal">146</i></a>';
    h += '<a href="know.html?ch=8">核心词汇 <i style="opacity:.55;font-style:normal">271</i></a>';
    h += '<a href="know.html?ch=9">常考词组（83 条） <i style="opacity:.55;font-style:normal">83</i></a>';
    h += '<a href="know.html?ch=10">形近词辨析（37 组） <i style="opacity:.55;font-style:normal">37</i></a>';
    h += "</div></div>";

h += a("vocab.html", "词汇", null, cur === "vocab");
    h += a("roots.html", "词根", null, cur === "roots");
    h += "</div></div>";

    host.innerHTML = h;

    /* ---------- 通用下拉绑定（只绑未绑定的菜单，含题库） ---------- */
    document.querySelectorAll('#nav .nav-menu').forEach(function (mm) {
      if (mm.__bound) return;
      mm.__bound = true;
      var te = mm.querySelector('.nav-a');
      if (!te) return;
      te.addEventListener('click', function (e) {
        if (mm.classList.contains('open')) { mm.classList.remove('open'); return; }
        e.preventDefault();
        document.querySelectorAll('.nav-menu.open').forEach(function (x) {
          x.classList.remove('open');
        });
        if (typeof placeDropdown === 'function') placeDropdown(mm);
        mm.classList.add('open');
      });
    });


    /* ---------- 下拉交互 ---------- */
    function isMobile() {
      return window.matchMedia("(max-width:640px)").matches;
    }

    function placeDropdown(m) {
      var dd = m.querySelector(".dropdown");
      var trigger = m.querySelector(".nav-a");
      if (!dd || !trigger) return;
      if (isMobile()) {
        var r = trigger.getBoundingClientRect();
        dd.style.top = Math.round(r.bottom + 6) + "px";
        dd.style.left = "8px";
        dd.style.right = "8px";
      } else {
        dd.style.top = "";
        dd.style.left = "";
        dd.style.right = "";
      }
    }

    function closeAll() {
      document.querySelectorAll(".nav-menu.open").forEach(function (x) { x.classList.remove("open"); });
    }

    ["mGr", "mTn"].forEach(function (id) {
      var m = document.getElementById(id);
      if (!m) return;
      var trigger = m.querySelector(".nav-a");

      trigger.addEventListener("click", function (e) {
        if (m.classList.contains("open")) {
          m.classList.remove("open");
          return;
        }
        e.preventDefault();
        closeAll();
        placeDropdown(m);
        m.classList.add("open");
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-menu")) closeAll();
    });
    window.addEventListener("resize", closeAll);
    window.addEventListener("scroll", function () { if (isMobile()) closeAll(); }, { passive: true });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  }

  function bindTop() {
    var top = document.getElementById("top");
    if (!top) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) top.classList.add("show");
      else top.classList.remove("show");
    });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { build(); bindTop(); });
  } else { build(); bindTop(); }
})();
