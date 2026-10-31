/* 共用导航：顶部导航条 + 下拉菜单（依赖 assets/manifest.js） */
(function () {
  "use strict";

  var NAV = window.YUWEN_NAV || { groups: [], pieces: [], sections: [], zhenti: [], stats: {} };
  var S = NAV.stats || {};

  /* ---------- 通用工具 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  window.esc = window.esc || esc;

  function pageName() {
    var p = (location.pathname || "").split("/").pop() || "index.html";
    /* 中文文件名在 location.pathname 里是百分号编码，必须解码后再比较，否则高亮永不生效 */
    try { p = decodeURIComponent(p); } catch (e) {}
    return p.replace(/\.html?$/i, "") || "index";
  }

  /* ---------- 渲染导航 ---------- */
  function build() {
    var host = document.getElementById("nav");
    if (!host) return;
    var cur = pageName();

    function a(href, label, num, on) {
      return '<a class="nav-a' + (on ? " on" : "") + '" href="' + href + '">' +
        label + (num != null ? '<span class="n">' + num + "</span>" : "") + "</a>";
    }

    var h = '<div class="nav-in">';
    h += '<a class="nav-brand" href="index.html"><i class="bi" style="background:#b9793a"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 4.9c0-.9.7-1.5 1.6-1.5h13.2v15.2H6.2c-.9 0-1.6.7-1.6 1.5V4.9z"/><path d="M8.6 8.2h6.4M8.6 11.6h6.4"/></svg></i>山东专升本语文</a>';
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


    /* 文言文：下拉选篇 */
    var wenOn = cur === "wen";
    h += '<div class="nav-menu" id="mWen">';
    h += '<a class="nav-a' + (wenOn ? " on" : "") + '" href="wen.html">文言文<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="wen.html">全部篇目</a>';
    h += '<div class="dsep"></div>';
    (NAV.pieces || []).forEach(function (p) {
      h += '<a href="wen.html#' + esc(p.id) + '">' + esc(p.id) + "　" + esc(p.title) +
        '</a>';
    });
    h += "</div></div>";

    /* 文学常识：下拉选板块 */
    var csOn = cur === "changshi";
    h += '<div class="nav-menu" id="mCs">';
    h += '<a class="nav-a' + (csOn ? " on" : "") + '" href="changshi.html">常识<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="changshi.html">全部</a>';
    h += '<div class="dsep"></div>';
    (NAV.sections || []).forEach(function (s) {
      h += '<a href="changshi.html#' + esc(s.key) + '">' + esc(s.name) +
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
        h += '<a href="know.html?ch=1">文言文精读（25 篇） <i style="opacity:.55;font-style:normal">150</i></a>';
    h += '<a href="know.html?ch=2">古汉语实词（293 条） <i style="opacity:.55;font-style:normal">22</i></a>';
    h += '<a href="know.html?ch=3">文学文化常识（1292 条） <i style="opacity:.55;font-style:normal">202</i></a>';
    h += "</div></div>";

h += a("shici.html", "实词", null, cur === "shici");
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

    ["mWen", "mCs"].forEach(function (id) {
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

    function closeAll() {
      document.querySelectorAll(".nav-menu.open").forEach(function (x) { x.classList.remove("open"); });
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nav-menu")) closeAll();
    });

    window.addEventListener("resize", closeAll);
    window.addEventListener("scroll", function () {
      if (isMobile()) closeAll();
    }, { passive: true });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
  }

  /* ---------- 回到顶部 ---------- */
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

  /* 供页面脚本调用：按 id 定位并展开 */
  window.YW_JUMP_PIECE = function (id) { return id; };
})();
