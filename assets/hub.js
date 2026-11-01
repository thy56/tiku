/* ===========================================================
   hub.js — 全局导航（21 页共用）
   作用：
     1. 在每个页面顶部注入统一「全局条」：总站 + 四科下拉（可跨科跳转）
     2. 统一各科导航条的外观（四科原本两套 CSS，观感不一致）
     3. 数据内嵌，页面无需再引其它脚本
   引用：科目页 <script src="../../assets/hub.js"></script>
        总站   <script src="assets/hub.js"></script>
   =========================================================== */
(function () {
  "use strict";

  /* ---------- 全站页面清单（唯一数据源） ---------- */
  var SITE = [
    {
      key: "yuwen", name: "语文", short: "语文", color: "#b9793a",
      pages: [
        ["index.html", "首页"],
        ["know.html", "知识体系", "374点"],
        ["daily.html", "每日一题", "549题"],
        ["wen.html", "文言文", "25篇"],
        ["changshi.html", "文学常识", "1292条"],
        ["shici.html", "文言实词", "293词"],
        ["历年真题.html", "历年真题", "160题"]
      ]
    },
    {
      key: "yingyu", name: "英语", short: "英语", color: "#3f8f4a",
      pages: [
        ["index.html", "首页"],
        ["know.html", "知识体系", "509点"],
        ["专项练习.html", "翻译练习", "1120题"],
        ["grammar.html", "语法体系", "94节"],
        ["tenses.html", "时态体系", "16节"],
        ["vocab.html", "高频词汇", "271词"],
        ["roots.html", "词根词缀", "1367词"],
        ["历年真题.html", "历年真题", "540题"]
      ]
    },
    {
      key: "gaoshu", name: "高数一", short: "高数", color: "#2e74b5",
      pages: [
        ["index.html", "首页"],
        ["know.html", "知识体系", "141点"],
        ["formulas.html", "公式总表", "409条"],
        ["examples.html", "例题精讲", "134例"],
        ["题库.html", "题库", "321题"],
      ]
    },
    {
      key: "jisuanji", name: "计算机", short: "计基", color: "#7a5aa8",
      pages: [
        ["index.html", "首页"],
        ["know.html", "知识体系", "227点"],
        ["examples.html", "例题精讲", "115例"],
        ["题库.html", "题库", "312题"],
        ["历年真题.html", "历年真题", "195题"],
      ]
    }
  ];

  /* ---------- 环境判定 ---------- */
  var FULL = location.pathname;
  var DEPTH = 0;              /* 0 = 总站根；2 = 科目目录内 */
  var CUR_KEY = "";
  var CUR_PAGE = (FULL.split("/").pop() || "index.html");

  for (var i = 0; i < SITE.length; i++) {
    if (FULL.indexOf("/" + SITE[i].key + "/") !== -1 ||
        FULL.indexOf(encodeURIComponent(SITE[i].name)) !== -1 ||
        FULL.indexOf(SITE[i].name) !== -1) {
      /* 兼容中文目录：语文/英语/高数一/计算机 与 key 不同名 */
      CUR_KEY = SITE[i].key;
      break;
    }
  }
  /* 中文目录名映射（真实目录是中文） */
  var DIRMAP = { yuwen: "语文", yingyu: "英语", gaoshu: "高数一", jisuanji: "计算机" };
  if (!CUR_KEY) {
    for (var j = 0; j < SITE.length; j++) {
      var d = DIRMAP[SITE[j].key];
      if (decodeURIComponent(FULL).indexOf("/" + d + "/") !== -1) { CUR_KEY = SITE[j].key; break; }
    }
  }
  DEPTH = CUR_KEY ? 2 : 0;
  var P = DEPTH === 2 ? "../" : "";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- 样式（全局条 + 四科导航统一皮肤） ---------- */
  function style() {
    if (document.getElementById("hub-style")) return;
    var css = [
      /* ===== 全局条 ===== */
      "#gbar{",
      "  position:sticky;top:0;z-index:500;",
      "  background:#16375a;",
      "  border-bottom:1px solid rgba(255,255,255,.08);",
      "}",
      "#gbar .g-in{",
      "  max-width:1160px;margin:0 auto;",
      "  display:flex;align-items:center;gap:2px;",
      "  padding:0 22px;height:38px;",
      "  overflow-x:auto;overflow-y:visible;",
      "  scrollbar-width:none;",
      "}",
      "#gbar .g-in::-webkit-scrollbar{display:none}",
      "#gbar .g-brand{",
      "  display:flex;align-items:center;gap:6px;",
      "  font-size:13px;font-weight:700;color:#fff;",
      "  white-space:nowrap;margin-right:10px;flex:none;",
      "  letter-spacing:.02em;opacity:.97;",
      "}",
      "#gbar .g-brand:hover{opacity:1}",
      "#gbar .g-brand i{",
      "  font-style:normal;font-size:11px;font-weight:400;",
      "  color:rgba(255,255,255,.5);letter-spacing:.04em;",
      "}",
      "#gbar .g-sep{width:1px;height:15px;background:rgba(255,255,255,.14);margin:0 8px;flex:none}",
      "#gbar .g-item{position:relative;flex:none}",
      "#gbar .g-a{",
      "  display:flex;align-items:center;gap:4px;",
      "  padding:5px 10px;border-radius:6px;",
      "  font-size:13px;color:rgba(255,255,255,.88);",
      "  white-space:nowrap;cursor:pointer;",
      "  transition:background .14s,color .14s;",
      "  line-height:1.5;",
      "}",
      "#gbar .g-a:hover{background:rgba(255,255,255,.10);color:#fff}",
      "#gbar .g-a.on{background:rgba(255,255,255,.16);color:#fff;font-weight:600}",
      "#gbar .g-a .g-c{font-size:8px;opacity:.6;margin-left:1px;transition:transform .16s}",
      "#gbar .g-item.open .g-a .g-c{transform:rotate(180deg)}",
      "#gbar .g-drop{",
      "  position:absolute;top:calc(100% + 7px);left:0;",
      "  min-width:186px;",
      "  background:#fff;border:1px solid #e6ecf2;border-radius:9px;",
      "  box-shadow:0 6px 22px rgba(20,40,70,.17);",
      "  padding:5px;display:none;z-index:600;",
      "}",
      "#gbar .g-item.open .g-drop{display:block}",
      "#gbar .g-drop a{",
      "  display:flex;justify-content:space-between;align-items:center;gap:12px;",
      "  padding:7px 10px;border-radius:6px;",
      "  font-size:13px;color:#41525f;white-space:nowrap;",
      "  transition:background .12s,color .12s;",
      "}",
      "#gbar .g-drop a:hover{background:#f0f5fa;color:#1f4e79}",
      "#gbar .g-drop a.cur{background:#1f4e79;color:#fff}",
      "#gbar .g-drop a .gd-n{font-size:12px;color:#637585;font-variant-numeric:tabular-nums}",
      "#gbar .g-drop a.cur .gd-n{color:rgba(255,255,255,.72)}",
      "#gbar .g-drop .g-head{",
      "  padding:6px 10px 5px;font-size:11.5px;font-weight:700;",
      "  color:#637585;letter-spacing:.06em;",
      "}",

      /* ===== 三层定位（gbar 38 + nav 52 = 90） ===== */
      "header.top{top:38px !important}",
      ".nav{top:38px !important;z-index:300 !important}",
      ".bar{top:90px !important;z-index:200 !important}",
      ".nav-in{",
      "  max-width:1160px !important;",
      "  height:52px !important;",
      "  padding:0 22px !important;",
      "  gap:4px !important;",
      "  display:flex;align-items:center;",
      "}",
      ".nav-brand{",
      "  font-size:14.5px !important;font-weight:700 !important;",
      "  color:#1f4e79 !important;",
      "  margin-right:12px !important;",
      "  display:flex !important;align-items:baseline !important;gap:6px !important;",
      "  letter-spacing:.01em;white-space:nowrap;",
      "}",
      ".nav-brand span{font-size:12px !important;font-weight:400 !important;color:#637585 !important}",
      ".nav-links{display:flex !important;align-items:center !important;gap:2px !important;flex:1}",
      ".nav-a{",
      "  padding:7px 12px !important;",
      "  border-radius:7px !important;",
      "  font-size:13px !important;",
      "  color:#41525f !important;",
      "  display:flex !important;align-items:center !important;gap:5px !important;",
      "  white-space:nowrap;cursor:pointer;",
      "  transition:background .15s,color .15s !important;",
      "  line-height:1.5;",
      "}",
      ".nav-a:hover{background:#f0f5fa !important;color:#1f4e79 !important}",
      ".nav-a.on{background:#1f4e79 !important;color:#fff !important;font-weight:600 !important}",
      ".nav-a .n{font-size:12px !important;opacity:.72 !important;font-variant-numeric:tabular-nums}",
      ".nav-a.on .n{opacity:.78 !important}",
      ".nav-a .caret{font-size:8px !important;opacity:.5 !important;margin-left:1px}",
      ".nav-menu{position:relative}",
      ".dropdown{",
      "  position:absolute;top:calc(100% + 7px);left:0;",
      "  min-width:210px;max-height:min(68vh,500px);overflow-y:auto;",
      "  background:#fff;border:1px solid #e6ecf2;border-radius:9px;",
      "  box-shadow:0 6px 22px rgba(20,40,70,.15);",
      "  padding:5px;display:none;z-index:400;",
      "}",
      ".nav-menu.open .dropdown{display:block}",
      ".dropdown a{",
      "  display:flex;justify-content:space-between;align-items:center;gap:10px;",
      "  padding:7px 10px !important;border-radius:6px !important;",
      "  font-size:13px !important;color:#41525f !important;",
      "  transition:background .12s,color .12s !important;",
      "}",
      ".dropdown a:hover{background:#f0f5fa !important;color:#1f4e79 !important}",
      ".dropdown a .dn{font-size:12px !important;color:#637585 !important;flex-shrink:0}",
      ".dropdown .dsep{height:1px;background:#eef2f6;margin:4px 3px !important}",

      /* ===== 移动端 ===== */
      "@media (max-width:820px){",
      "  #gbar .g-in{padding:0 14px;height:36px}",
      "  #gbar .g-brand i{display:none}",
      "  header.top{top:36px !important}",
      "  .nav{top:36px !important}",
      "  .bar{top:86px !important}",
      "  .nav-in{height:50px !important;padding:0 14px !important}",
      "  .nav-brand{font-size:13.5px !important;margin-right:8px !important}",
      "  .nav-brand span{display:none}",
      "  .nav-a{padding:6px 10px !important;font-size:13px !important}",
      "}",
      "@media (max-width:560px){",
      "  #gbar .g-in{padding:0 10px}",
      "  #gbar .g-brand{font-size:12.5px;margin-right:4px}",
      "  #gbar .g-sep{margin:0 4px}",
      "  #gbar .g-a{padding:4px 7px;font-size:12.5px}",
      "  .nav-in{padding:0 10px !important}",
      "  .nav-brand{font-size:13px !important}",
      "  .nav-a{padding:5px 8px !important;font-size:12.5px !important}",
      "  .nav-a .n{display:none}",
      "}"
    ].join("\n");

    var st = document.createElement("style");
    st.id = "hub-style";
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---------- 构建全局条 ---------- */
  function buildBar() {
    if (document.getElementById("gbar")) return;

    var bar = document.createElement("div");
    bar.id = "gbar";

    var h = '<div class="g-in">';
    h += '<a class="g-brand" href="' + P + 'index.html">专升本学习站<i>四科</i></a>';
    h += '<span class="g-sep"></span>';

    for (var i = 0; i < SITE.length; i++) {
      var s = SITE[i];
      var dir = DIRMAP[s.key];
      var isCur = (s.key === CUR_KEY);

      h += '<div class="g-item" data-k="' + s.key + '">';
      h += '<a class="g-a' + (isCur ? " on" : "") + '" href="' + P + encodeURI(dir) + '/index.html">' +
           esc(s.short) + '<span class="g-c">▼</span></a>';
      h += '<div class="g-drop">';
      h += '<div class="g-head">' + esc(s.name) + '</div>';
      for (var k = 0; k < s.pages.length; k++) {
        var pg = s.pages[k];
        var cur = (isCur && pg[0] === CUR_PAGE) ? " cur" : "";
        h += '<a class="' + cur.trim() + '" href="' + P + encodeURI(dir) + '/' + pg[0] + '">' +
             esc(pg[1]) + (pg[2] ? '<span class="gd-n">' + esc(pg[2]) + '</span>' : '') + '</a>';
      }
      h += '</div></div>';
    }

    h += '</div>';
    bar.innerHTML = h;

    var body = document.body;
    body.insertBefore(bar, body.firstChild);

    /* 下拉交互：桌面 hover，移动 click */
    var items = bar.querySelectorAll(".g-item");
    function closeAll(except) {
      for (var n = 0; n < items.length; n++) {
        if (items[n] !== except) items[n].classList.remove("open");
      }
    }
    function isTouch() {
      return window.matchMedia("(max-width:820px)").matches;
    }

    for (var m = 0; m < items.length; m++) {
      (function (it) {
        var trig = it.querySelector(".g-a");
        trig.addEventListener("click", function (e) {
          /* 点击展开 / 再点收起；桌面上不再"划过就开、移开就关" */
          if (it.classList.contains("open")) {
            it.classList.remove("open");
            return;
          }
          e.preventDefault();
          closeAll(it);
          it.classList.add("open");
        });
      })(items[m]);
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest("#gbar .g-item")) closeAll(null);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll(null);
    });
  }

  function run() {
    style();
    buildBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

/* ===========================================================
   长列表分批显示（2026-10-29 新增）
   依据实测：6 个页面一次渲染 40~106 条，需分批。
   接管 #main 内的长列表；页面重新渲染后自动重算。
   =========================================================== */
(function () {
  "use strict";

  var STEP = 30;
  var SEL = [".qbox", ".gcard", ".kcard", ".excard", ".lesson", ".sc-card",
             ".cs-item", ".vcard", ".ccard", ".pcard", ".wordrow"].join(",");

  var memo = new WeakMap();   /* container -> {shown, total} */
  var ctrl = new WeakMap();   /* container -> observer */

  function isTop(el) {
    var p = el.parentElement;
    while (p) {
      if (p.matches && p.matches(SEL)) return false;
      p = p.parentElement;
    }
    return true;
  }

  function collect(box) {
    var out = [];
    var nodes = box.querySelectorAll(SEL);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest(".rm-bar")) continue;
      if (!isTop(el)) continue;
      out.push(el);
    }
    return out;
  }

  function killBar(box) {
    var bars = box.querySelectorAll(".rm-bar");
    for (var i = 0; i < bars.length; i++) {
      if (bars[i].parentElement === box) bars[i].parentElement.removeChild(bars[i]);
    }
  }

  function makeBtn(text, primary) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = primary ? "rm-btn rm-btn-main" : "rm-btn";
    b.textContent = text;
    return b;
  }

  function drawBar(box, total, shown, setShown) {
    killBar(box);
    if (total <= STEP) return;

    var bar = document.createElement("div");
    bar.className = "rm-bar";

    var info = document.createElement("span");
    info.className = "rm-info";
    info.innerHTML = "共 <b>" + total + "</b> 条 · 已显示 <b>" + shown + "</b> 条";
    bar.appendChild(info);

    if (shown < total) {
      var more = makeBtn("继续显示 " + Math.min(STEP, total - shown) + " 条", true);
      more.addEventListener("click", function () {
        setShown(Math.min(shown + STEP, total));
      });
      bar.appendChild(more);

      var all = makeBtn("全部显示", false);
      all.addEventListener("click", function () { setShown(total); });
      bar.appendChild(all);
    } else {
      var fold = makeBtn("收起", false);
      fold.addEventListener("click", function () { setShown(STEP); });
      bar.appendChild(fold);
    }

    box.appendChild(bar);
  }

  function paint(box) {
    var items = collect(box);
    var total = items.length;
    var rec = memo.get(box);

    if (total <= STEP) {
      for (var i = 0; i < total; i++) items[i].style.display = "";
      killBar(box);
      memo.set(box, { shown: STEP, total: total });
      return;
    }

    if (!rec || rec.total !== total) rec = { shown: STEP, total: total };
    var shown = Math.min(rec.shown, total);
    rec.shown = shown;
    memo.set(box, rec);

    for (var j = 0; j < total; j++) {
      items[j].style.display = (j < shown) ? "" : "none";
    }

    drawBar(box, total, shown, function (n) {
      var r = memo.get(box) || { shown: STEP, total: total };
      r.shown = n;
      r.total = total;
      memo.set(box, r);
      paint(box);
    });
  }

  function safePaint(box) {
    var mo = ctrl.get(box);
    if (mo) mo.disconnect();
    try { paint(box); } catch (e) {}
    if (mo) mo.observe(box, { childList: true });
  }

  function attach(box) {
    if (!box || ctrl.has(box)) return;
    var timer = null;
    var mo = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () { safePaint(box); }, 180);
    });
    mo.observe(box, { childList: true });
    ctrl.set(box, mo);
    safePaint(box);
  }

  /* 只接管一个容器：优先 #main，其次 #list，最后 .main
     避免页面同时存在 class="main" 与 id="main" 时生成两条分批条 */
  function target() {
    var el = document.getElementById("main");
    if (el) return el;
    el = document.getElementById("list");
    if (el) return el;
    el = document.querySelector(".main");
    return el;
  }

  function dropStray() {
    var bars = document.querySelectorAll(".rm-bar");
    var box = target();
    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];
      if (!box || b.closest("#main") !== box && b.closest(".main") !== box) {
        if (b.parentElement) b.parentElement.removeChild(b);
      }
    }
  }

  function scan() {
    var box = target();
    if (box) attach(box);
  }

  function repaint() {
    var box = target();
    if (!box) return;
    dropStray();
    safePaint(box);
  }

  function boot() {
    scan();
    setTimeout(scan, 400);
    setTimeout(repaint, 1200);
    setTimeout(repaint, 2600);
    warm();
  }

  /* ============ 预加载：空闲时预取相邻页面，消除切换卡顿 ============ */
  function prefetch(href) {
    if (!href) return;
    if (/^(https?:)?\/\//.test(href)) return;
    if (href.charAt(0) === "#") return;
    try {
      var l = document.createElement("link");
      l.rel = "prefetch";
      l.as = "document";
      l.href = href;
      document.head.appendChild(l);
    } catch (e) { /* 忽略 */ }
  }

  function warm() {
    var run = function () {
      var hrefs = [];
      // 1) 章节条 / 翻页条里的相邻链接
      ["chapbar", "chpager"].forEach(function (id) {
        var box = document.getElementById(id);
        if (!box) return;
        Array.prototype.forEach.call(box.querySelectorAll("a[href]"), function (a) {
          hrefs.push(a.getAttribute("href"));
        });
      });
      // 2) 科目内导航的顶层入口
      var nav = document.getElementById("nav");
      if (nav) {
        Array.prototype.forEach.call(nav.querySelectorAll("a[href$='.html']"), function (a) {
          hrefs.push(a.getAttribute("href"));
        });
      }
      // 3) 图卡索引（目录页）
      var idx = document.getElementById("chapidx");
      if (idx) {
        Array.prototype.forEach.call(idx.querySelectorAll("a[href$='.html']"), function (a) {
          hrefs.push(a.getAttribute("href"));
        });
      }

      // 去重 + 去掉当前页 + 限制数量
      var here = location.pathname.split("/").pop() || "";
      var seen = {}, list = [];
      hrefs.forEach(function (h) {
        if (!h || seen[h]) return;
        if (h.split("/").pop() === here) return;
        seen[h] = 1;
        list.push(h);
      });
      list.slice(0, 6).forEach(prefetch);
    };

    // 首屏稳定后再预热，不抢带宽
    setTimeout(function () {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(run, { timeout: 2000 });
      } else {
        run();
      }
    }, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
