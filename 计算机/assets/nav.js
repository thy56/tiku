/* 计算机导航（依赖 assets/manifest.js） */
(function () {
  "use strict";
  var NAV = window.JS_NAV || { chapters: [], stats: {} };
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
    h += '<a class="nav-brand" href="index.html"><i class="bi" style="background:#7a5aa8"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="4.4" width="17.6" height="11.6" rx="1.8"/><path d="M9 20h6M12 16v4"/></svg></i>山东专升本计算机</a>';
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


    /* 知识体系：下拉选章节 */
    var knOn = cur === "know";
    h += '<div class="nav-menu" id="mKn">';
    h += '<a class="nav-a' + (knOn ? " on" : "") + '" href="know.html">知识体系<span class="caret">▼</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="know.html">全部章节</a>';
    h += '<div class="dsep"></div>';
    (NAV.chapters || []).forEach(function (c) {
      h += '<a href="know.html#ch' + c.no + '">' + esc(c.title.replace(/^第.章　?/, "")) +
        '</a>';
    });
    h += "</div></div>";

    h += a("examples.html", "例题精讲", null, cur === "examples");

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
        dd.style.top = ""; dd.style.left = ""; dd.style.right = "";
      }
    }
    function closeAll() {
      document.querySelectorAll(".nav-menu.open").forEach(function (x) { x.classList.remove("open"); });
    }

    var m = document.getElementById("mKn");
    if (m) {
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
    }

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
      top.classList.toggle("show", window.scrollY > 400);
    });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { build(); bindTop(); });
  } else { build(); bindTop(); }
})();
