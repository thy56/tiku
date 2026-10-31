/* -----------------------------------------------------------
   高数一 历年真题引擎（2026-10-31 新建）
   数据：window.GS_ZHENTI = [ {year, source, hasAnswer, note, sections:[...]} ]
   公式：题干/选项/答案里的 $...$ 由 assets/mathrender.js 渲染
   ----------------------------------------------------------- */
(function () {
  "use strict";

  /* 选项字母 0->A ... 25->Z */
  function LT(n) {
    var s = '';
    n = Number(n) || 0;
    do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
    return s;
  }

  var PAPERS = window.GS_ZHENTI || [];
  var KEYRAW = window.GS_KEY;
  var CUR = null;
  if (KEYRAW !== null && /^\d{4}$/.test(KEYRAW)) {
    var hit = PAPERS.filter(function (p) { return String(p.year) === KEYRAW; })[0];
    if (hit) CUR = String(hit.year);
  }

  var KEY = "";
  var SHOW = {};

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

  function paperCount(p) {
    return (p.sections || []).reduce(function (a, s) { return a + (s.items || []).length; }, 0);
  }
  function paperAnsCount(p) {
    var n = 0;
    (p.sections || []).forEach(function (sec) {
      (sec.items || []).forEach(function (it) { if (String(it.ans || '').trim()) n++; });
    });
    return n;
  }

  /* ============ 目录页 ============ */
  function renderIndex() {
    var bar = document.getElementById("bar");
    if (bar) bar.style.display = "none";

    var items = PAPERS.map(function (p) {
      var n = paperCount(p);
      var ansN = paperAnsCount(p);
      return {
        key: p.year,
        badge: p.year,
        title: p.year + " 年真题",
        desc: "来源：" + (p.source || "") + (p.note ? "。" + p.note : ""),
        stats: [
          { t: " 题", v: n },
          { t: " 含答案", v: ansN },
          { t: " 大题", v: (p.sections || []).length }
        ]
      };
    });

    if (window.GS_renderUnitIndex) {
      window.GS_renderUnitIndex("chapidx", items, "zhenti.html");
    }

    var all = 0;
    PAPERS.forEach(function (p) { all += paperCount(p); });
    var badge = document.getElementById("hBadge");
    if (badge) badge.textContent = all + " 题";
    var sub = document.getElementById("hSub");
    if (sub) sub.textContent = "共 " + PAPERS.length + " 套、" + all + " 题。一年一页，先自己做再对答案。";
  }

  /* ============ 单年页 ============ */
  function renderPaper() {
    var paper = PAPERS.filter(function (p) { return String(p.year) === CUR; })[0];
    if (!paper) { renderIndex(); return; }

    var bar = document.getElementById("bar");
    if (bar) bar.style.display = "";
    var tabs = document.getElementById("tabsAns");
    if (tabs) tabs.style.display = paperAnsCount(paper) > 0 ? "" : "none";

    var n = paperCount(paper);
    var ansN = paperAnsCount(paper);

    var matchAny = !KEY || (paper.sections || []).some(function (sec) {
      return (sec.items || []).some(function (it) {
        return has(it.q) || has(it.ans) || has(it.an) || (it.opts || []).some(has);
      });
    });

    var head = '<div class="chaphero">';
    head += '<span class="ch-no">' + paper.year + ' 年</span>';
    head += '<h2>山东专升本高数一真题</h2>';
    head += '<p>来源：' + esc(paper.source || '') + (paper.note ? '。' + esc(paper.note) : '') + '</p>';
    head += '<div class="ch-st">';
    head += '<span><b>' + n + '</b> 题</span>';
    head += '<span><b>' + (paper.sections || []).length + '</b> 大题</span>';
    head += '<span><b>' + ansN + '</b> 含答案</span>';
    head += '<span>' + (paper.hasAnswer ? '含参考答案' : '答案待补') + '</span>';
    head += '</div></div>';

    var h = head;
    if (!matchAny) {
      h += '<div class="empty">本套没有匹配「' + esc(KEY) + '」的题目</div>';
    } else {
      if (KEY) h += '<div class="stats"><span>搜索：' + esc(KEY) + '（仅高亮，未过滤）</span></div>';

      (paper.sections || []).forEach(function (sec) {
        var ansCnt = (sec.items || []).filter(function (it) { return String(it.ans || '').trim(); }).length;
        var meta = [(sec.items || []).length + ' 题'];
        if (sec.score) meta.push(sec.score);
        if (ansCnt) meta.push('有答案 ' + ansCnt);
        h += '<div class="sec">' + esc(sec.name) +
             '<span class="cnt">' + esc(meta.join(' · ')) + '</span></div>';

        (sec.items || []).forEach(function (it) {
          var id = 'z' + paper.year + '_' + it.no;
          var shown = SHOW[id];
          var hasAns = String(it.ans || '').trim() !== '';

          h += '<div class="qbox">';
          h += '<div class="qh"><span class="num">' + it.no + '.</span><span class="tx">' + hl(it.q) + '</span></div>';

          if (it.opts && it.opts.length) {
            h += '<div class="opts">';
            it.opts.forEach(function (o, i) {
              var lt = LT(i);
              var cls = 'opt locked';
              if (shown && hasAns && lt === it.ans) cls += ' right';
              h += '<button class="' + cls + '"><span class="lt">' + lt + '．</span><span>' + hl(o) + '</span></button>';
            });
            h += '</div>';
          }

          h += '<div class="qfoot">';
          if (!hasAns) {
            h += '<span style="font-size:12.5px;color:#96591f">答案待补</span>';
          } else if (shown) {
            h += '<span class="verdict ok">答案 ' + esc(it.ans || '') + '</span>';
            h += '<button class="revealbtn" data-hide="' + id + '">收起</button>';
          } else {
            h += '<span style="font-size:12.5px;color:#5d7080">先自己做，再看答案</span>';
            h += '<button class="revealbtn" data-show="' + id + '">看答案</button>';
          }
          if (it.score) h += '<span class="qscore">' + esc(it.score) + '</span>';
          h += '</div>';

          if (shown && hasAns) {
            h += '<div class="ansbox show">';
            h += '<span class="lab">答案：' + esc(it.ans || '') + '</span>';
            if (it.an) h += '<div class="anline">' + esc(it.an).replace(/\n/g, '<br>') + '</div>';
            h += '</div>';
          }
          h += '</div>';
        });
      });
    }
    $main.innerHTML = h;

    var badge = document.getElementById("hBadge");
    if (badge) badge.textContent = paper.year + " 年 · " + n + " 题";
    var sub = document.getElementById("hSub");
    if (sub) {
      sub.textContent = paper.year + " 年真题，共 " + n + " 题、" +
        (paper.sections || []).length + " 个大题。先自己做，再点「看答案」核对。";
    }

    var units = PAPERS.map(function (p) {
      /* no 留空：label 已含年份，再给 no 会渲染成「2020 2020 年」 */
      return { key: p.year, no: null, label: p.year + " 年", count: paperCount(p) };
    });
    if (window.GS_renderUnitBar) {
      window.GS_renderUnitBar("chapbar", "zhenti.html", units, { label: "年份" });
    }
    if (window.GS_renderUnitPager) {
      window.GS_renderUnitPager("chpager", "zhenti.html", units);
    }
  }

  /* ============ 事件 ============ */
  if ($main) {
    $main.addEventListener("click", function (e) {
      var s = e.target.closest("[data-show]");
      if (s) { SHOW[s.getAttribute("data-show")] = 1; renderPaper(); return; }
      var hd = e.target.closest("[data-hide]");
      if (hd) { delete SHOW[hd.getAttribute("data-hide")]; renderPaper(); return; }
    });
  }

  var timer = null;
  if ($q) {
    $q.addEventListener("input", function () {
      clearTimeout(timer);
      var v = this.value;
      timer = setTimeout(function () {
        KEY = v.trim().toLowerCase();
        if (CUR) renderPaper(); else renderIndex();
      }, 160);
    });
  }

  var btnEx = document.getElementById("expandAll");
  if (btnEx) btnEx.addEventListener("click", function () {
    var paper = PAPERS.filter(function (p) { return String(p.year) === CUR; })[0];
    if (!paper) return;
    (paper.sections || []).forEach(function (sec) {
      (sec.items || []).forEach(function (it) {
        if (String(it.ans || '').trim()) SHOW['z' + paper.year + '_' + it.no] = 1;
      });
    });
    renderPaper();
  });
  var btnCo = document.getElementById("collapseAll");
  if (btnCo) btnCo.addEventListener("click", function () {
    SHOW = {};
    renderPaper();
  });

  /* ============ 启动 ============ */
  if (CUR === null) {
    renderIndex();
    var units0 = PAPERS.map(function (p) {
      return { key: p.year, no: null, label: p.year + " 年", count: paperCount(p) };
    });
    if (window.GS_renderUnitBar) {
      window.GS_renderUnitBar("chapbar", "zhenti.html", units0, { label: "年份", withAll: false });
    }
  } else {
    renderPaper();
  }
})();
