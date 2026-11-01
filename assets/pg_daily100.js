/* -----------------------------------------------------------
   高数一 · 每日一练 单卷渲染
   页面：daily.html?d=1 .. 100
   数据：window.GS_DAILY100（日期 + 题目 id 列表）
         window.GS_QUESTIONS（题库本体）
   ----------------------------------------------------------- */
(function () {
  "use strict";

  var CH_NAME = {
    "1": "函数、极限和连续",
    "2": "一元函数微分学",
    "3": "一元函数积分学",
    "4": "向量代数与空间解析几何",
    "5": "多元函数微积分学",
    "6": "无穷级数",
    "7": "常微分方程"
  };
  var CH_KEYS = ["1", "2", "3", "4", "5", "6", "7"];

  var SHOW = {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function LT(n) {
    var s = "";
    do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
    return s;
  }
  function qs(k) {
    var m = new RegExp("[?&]" + k + "=([^&]*)").exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function main() {
    var D = window.GS_DAILY100;
    var Q = window.GS_QUESTIONS;
    var $main = document.getElementById("main");
    if (!D || !Q || !$main) return;

    var day = parseInt(qs("d") || "1", 10);
    if (isNaN(day) || day < 1) day = 1;
    if (day > D.days) day = D.days;

    var paper = D.papers[day - 1];
    if (!paper) { $main.innerHTML = '<div class="nodata">没有这一天的练习</div>'; return; }

    /* id -> 题目 */
    var byId = {};
    Q.questions.forEach(function (q) { byId[q.id] = q; });

    /* 还原题目并分组：优先用数据里的 secs（各题型的 id 列表），
       否则回退到按题库自身 type 猜（旧数据兼容） */
    var groups = {};
    var order = [];

    if (paper.secs && paper.secs.length && paper.secs[0] && paper.secs[0].ids) {
      paper.secs.forEach(function (sec) {
        var list = [];
        (sec.ids || []).forEach(function (id) {
          var q = byId[id];
          if (q) list.push(q);
        });
        if (!list.length) return;
        groups[sec.type] = list;
        order.push(sec.type);
      });
    } else {
      paper.ids.forEach(function (id) {
        var q = byId[id];
        if (!q) return;
        if (!groups[q.type]) { groups[q.type] = []; order.push(q.type); }
        groups[q.type].push(q);
      });
    }

    /* 页头 */
    var h1 = document.getElementById("h1");
    if (h1) h1.innerHTML = '第 ' + day + ' 天 <span class="badge">' + (paper.ids ? paper.ids.length : 0) + ' 题</span>';

    var sub = document.getElementById("sub");
    if (sub) sub.textContent = paper.date;

    /* 知识点分布 */
    var h = '<div class="dl-dist"><div class="dl-dist-t">知识点分布</div><div class="dl-chips">';
    CH_KEYS.forEach(function (ch) {
      var n = paper.dist[ch] || 0;
      h += '<span class="dl-chip"' + (n ? '' : ' style="opacity:.4"') + '>'
        + '第' + ch + '章 ' + esc(CH_NAME[ch]) + '<b>' + n + '</b></span>';
    });
    h += '</div></div>';

    /* 各大题 */
    var SEC = [
      { t: "单选", name: "单项选择题", score: "每题 3 分" },
      { t: "填空", name: "填空题", score: "每题 3 分" },
      { t: "计算", name: "计算题", score: "每题 6 分" },
      { t: "应用", name: "应用题", score: "7 分" },
      { t: "证明", name: "证明题", score: "8 分" }
    ];
    var hint = {};
    SEC.forEach(function (x) { hint[x.t] = { name: x.name, score: x.score }; });
    var no = 0;

    order.forEach(function (ty) {
      var items = groups[ty] || [];
      if (!items.length) return;
      var meta = hint[ty] || { name: ty, score: "" };
      h += '<div class="sec">' + meta.name
        + '<span class="cnt">' + items.length + ' 题' + (meta.score ? ' · ' + meta.score : '') + '</span></div>';

      items.forEach(function (q) {
        no++;
        var key = "d" + day + "_" + q.id;
        var shown = SHOW[key];
        var hasAns = String(q.a || "").trim() !== "";

        h += '<div class="qbox">';
        h += '<div class="qh"><span class="num">' + no + '.</span>'
          + '<span class="tx">' + esc(q.t) + '</span></div>';

        if (q.o && q.o.length) {
          h += '<div class="opts">';
          q.o.forEach(function (o, i) {
            var lt = LT(i);
            var cls = "opt locked";
            if (shown && hasAns && lt === String(q.a).trim()) cls += " right";
            h += '<button class="' + cls + '"><span class="lt">' + lt + '．</span>'
              + '<span>' + esc(o) + '</span></button>';
          });
          h += '</div>';
        }

        h += '<div class="qfoot">';
        if (!hasAns) {
          h += '<span style="font-size:12.5px;color:#96591f">答案待补</span>';
        } else if (shown) {
          h += '<span class="verdict ok">答案已展开</span>';
          h += '<button class="revealbtn" data-hide="' + key + '">收起</button>';
        } else {
          h += '<button class="revealbtn" data-show="' + key + '">看答案</button>';
        }
        h += '</div>';

        if (shown && hasAns) {
          h += '<div class="ansbox show">';
          h += '<span class="lab">答案：' + esc(q.a) + '</span>';
          if (q.s) h += '<div class="anline">' + esc(q.s).replace(/\n/g, '<br>') + '</div>';
          h += '</div>';
        }
        h += '</div>';
      });
    });

    $main.innerHTML = h;

    if (window.renderMathInElement) {
      try {
        window.renderMathInElement($main, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false, errorColor: "#b3261e", strict: false
        });
      } catch (e) { }
    }

    /* 翻页 */
    var pv = document.getElementById("pPrev");
    if (pv) {
      pv.href = "daily.html?d=" + Math.max(1, day - 1);
      pv.classList.toggle("dis", day <= 1);
    }
    var nx = document.getElementById("pNext");
    if (nx) {
      nx.href = "daily.html?d=" + Math.min(D.days, day + 1);
      nx.classList.toggle("dis", day >= D.days);
    }
    var back = document.getElementById("pBack");
    if (back) back.href = "每日一练.html";

    document.title = "第 " + day + " 天 · 山东专升本高数一";
  }

  /* 点击展开/收起 */
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-show]");
    if (s) {
      SHOW[s.getAttribute("data-show")] = 1;
      main();
      return;
    }
    var hd = e.target.closest("[data-hide]");
    if (hd) {
      delete SHOW[hd.getAttribute("data-hide")];
      main();
      return;
    }
    var all = e.target.closest("#dlAll");
    if (all) {
      var D = window.GS_DAILY100, Q = window.GS_QUESTIONS;
      var day = parseInt(qs("d") || "1", 10);
      var byId = {};
      Q.questions.forEach(function (q) { byId[q.id] = q; });
      var p = D.papers[day - 1];
      if (p) p.ids.forEach(function (id) {
        var q = byId[id];
        if (q && String(q.a || "").trim()) SHOW["d" + day + "_" + q.id] = 1;
      });
      main();
      return;
    }
    var none = e.target.closest("#dlNone");
    if (none) { SHOW = {}; main(); return; }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
