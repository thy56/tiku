/* -----------------------------------------------------------
   每日一练 单卷渲染（语文 / 英语 / 计算机 共用）
   页面需先设置 window.GS_PAGE
     { subject:"语文"|"英语"|"计算机", globalName:"YUWEN_QUESTIONS"|..., flat:"yuwen"|"yingyu"|"jisuanji" }
   依赖：bankflat.js  daily100.js  题库本体
   ----------------------------------------------------------- */
(function () {
  "use strict";

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

  function getBank() {
    var cfg = window.GS_PAGE || {};
    var raw = window[cfg.globalName];
    if (!raw || !window.BANKFLAT) return null;
    var fn = window.BANKFLAT[cfg.flat];
    if (!fn) return null;
    return fn(raw);
  }

  function main() {
    var D = window.GS_DAILY100;
    var cfg = window.GS_PAGE || {};
    var $main = document.getElementById("main");
    if (!D || !$main) return;

    var bank = getBank();
    if (!bank) {
      $main.innerHTML = '<div class="nodata">题库加载失败</div>';
      return;
    }

    var day = parseInt(qs("d") || "1", 10);
    if (isNaN(day) || day < 1) day = 1;
    if (day > D.days) day = D.days;

    var paper = D.papers[day - 1];
    if (!paper) { $main.innerHTML = '<div class="nodata">没有这一天的练习</div>'; return; }

    var byId = {};
    bank.forEach(function (q) { byId[q.id] = q; });

    /* 按题型分组，保持论文顺序 */
    var order = [];
    var groups = {};
    paper.ids.forEach(function (id) {
      var q = byId[id];
      if (!q) return;
      if (!groups[q.type]) { groups[q.type] = []; order.push(q.type); }
      groups[q.type].push(q);
    });
    /* 若数据里带 secs，按它的大题顺序排列 */
    if (paper.secs && paper.secs.length) {
      var ord2 = [];
      paper.secs.forEach(function (x) {
        if (groups[x.type] && ord2.indexOf(x.type) < 0) ord2.push(x.type);
      });
      order.forEach(function (t) { if (ord2.indexOf(t) < 0) ord2.push(t); });
      order = ord2;
    }

    var h1 = document.getElementById("h1");
    if (h1) h1.innerHTML = '第 ' + day + ' 天 <span class="badge">' + paper.ids.length + ' 题</span>';
    var sub = document.getElementById("sub");
    if (sub) sub.textContent = paper.date;

    /* 题型分布条 */
    var h = '<div class="dl-dist"><div class="dl-dist-t">题型分布</div><div class="dl-chips">';
    order.forEach(function (t) {
      h += '<span class="dl-chip">' + esc(t) + '<b>' + groups[t].length + '</b></span>';
    });
    h += '</div></div>';

    var no = 0;
    var SCORE = { "单项选择题": "每题 1 分", "释词题": "每题 1 分", "翻译题": "共 10 分",
                  "判断题": "每题 1 分", "填空题": "每题 1 分",
                  "计算题": "每题 6 分", "应用题": "7 分", "证明题": "8 分",
                  "汉译英": "每题 2 分", "英译汉": "每题 2 分", "词根词缀默写": "每题 1 分" };
    var LABEL = { "单选": "单项选择题", "释词": "释词题", "翻译": "翻译题",
                  "判断": "判断题", "填空": "填空题",
                  "计算": "计算题", "应用": "应用题", "证明": "证明题",
                  "汉译英": "汉译英", "英译汉": "英译汉", "词根": "词根词缀默写" };

    order.forEach(function (type) {
      var items = groups[type];
      var label = LABEL[type] || type;
      h += '<div class="sec">' + esc(label)
        + '<span class="cnt">' + items.length + ' 题' +
        (SCORE[label] ? ' · ' + SCORE[label] : '') + '</span></div>';

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
            if (shown && hasAns && lt === String(q.a).trim().toUpperCase()) cls += " right";
            h += '<button class="' + cls + '"><span class="lt">' + lt + '．</span>'
              + '<span>' + esc(o) + '</span></button>';
          });
          h += '</div>';
        }

        h += '<div class="qfoot">';
        if (!hasAns) {
          h += '<span style="font-size:12.5px;color:#96591f">答案待补</span>';
        } else if (shown) {
          h += '<span class="verdict ok">答案 ' + esc(q.a) + '</span>';
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

    document.title = "第 " + day + " 天 · 山东专升本" + (cfg.subject || "");
  }

  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-show]");
    if (s) { SHOW[s.getAttribute("data-show")] = 1; main(); return; }
    var hd = e.target.closest("[data-hide]");
    if (hd) { delete SHOW[hd.getAttribute("data-hide")]; main(); return; }

    var all = e.target.closest("#dlAll");
    if (all) {
      var D = window.GS_DAILY100, bank = getBank();
      var day = parseInt(qs("d") || "1", 10);
      var byId = {};
      bank.forEach(function (q) { byId[q.id] = q; });
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
