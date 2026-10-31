/* 高数一导航（依赖 assets/manifest.js） */
(function () {
  "use strict";
  var NAV = window.GS_NAV || { chapters: [], stats: {} };
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
    h += '<a class="nav-brand" href="index.html"><i class="bi" style="background:#2e74b5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14.4 3.6c-1.9 0-2.9 1.2-2.9 3.2v10.4c0 2-1 3.2-2.9 3.2"/></svg></i>山东专升本高数一</a>';
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


var GS_KP_CHS = [
        { no: 1, title: '函数、极限和连续', count: 42 },
        { no: 2, title: '一元函数微分学', count: 13 },
        { no: 3, title: '一元函数积分学', count: 16 },
        { no: 4, title: '向量代数与空间解析几何', count: 7 },
        { no: 5, title: '多元函数微积分学', count: 10 },
        { no: 6, title: '无穷级数', count: 8 },
        { no: 7, title: '常微分方程', count: 7 },
        { no: 8, title: '附录　必备公式与难点题型', count: 38 }
      ];

    /* 知识体系：下拉选章节 */
    var knOn = cur === "know";
    h += '<div class="nav-menu" id="mKn">';
    h += '<a class="nav-a' + (knOn ? " on" : "") + '" href="know.html">知识体系<span class="caret">&#9660;</span></a>';
    h += '<div class="dropdown">';
    h += '<a href="know.html">全部章节</a>';
    h += '<div class="dsep"></div>';
    GS_KP_CHS.forEach(function (c) {
      h += '<a href="know.html?ch=' + c.no + '">' + esc(c.title) +
        ' <i style="opacity:.55;font-style:normal">' + c.count + '</i></a>';
    });
    h += "</div></div>";

    h += a("formulas.html", "公式总表", null, cur === "formulas");
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
