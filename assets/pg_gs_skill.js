/* pg_gs_skill.js — 题型专项渲染（按解题方法组织） */
(function () {
  "use strict";

  var SK = window.GS_SKILL;
  var QS = (window.GS_QUESTIONS || {}).questions || [];
  var QB = {};
  QS.forEach(function (q) { QB[q.id] = q; });

  var CHNAME = {
    1: "函数、极限与连续",
    2: "一元函数微分学",
    3: "一元函数积分学",
    4: "向量代数与空间解析几何",
    5: "多元函数微积分",
    6: "无穷级数",
    7: "常微分方程"
  };

  var PICKED = {};
  try { PICKED = JSON.parse(localStorage.getItem("gs_skill_picked") || "{}"); } catch (e) {}
  function save() {
    try { localStorage.setItem("gs_skill_picked", JSON.stringify(PICKED)); } catch (e) {}
  }

  if (!SK || !SK.groups) {
    document.getElementById("main").innerHTML = '<div class="empty">题型数据未加载</div>';
    return;
  }

  var groups = SK.groups;

  /* ========== 列表页 ========== */
  function renderIndex() {
    var byCh = {};
    groups.forEach(function (g) {
      (byCh[g.ch] = byCh[g.ch] || []).push(g);
    });

    var totalQ = 0;
    groups.forEach(function (g) { totalQ += (g.qids || []).length; });

    var h = "";
    h += '<div class="chaphero">';
    h += '<span class="ch-no">题型专项</span>';
    h += '<h2>按解题方法练</h2>';
    h += '<div class="ch-st">'
      + '<span><b>' + groups.length + '</b> 个题型</span>'
      + '<span><b>' + totalQ + '</b> 道配套题</span>'
      + '<span><b>7</b> 章覆盖</span>'
      + '</div>';
    h += '<p style="margin:12px 0 0;color:#8a8f98;font-size:14px;line-height:1.7">'
      + '每个题型给三样东西：<b>什么特征用它</b> → <b>固定几步做完</b> → <b>套用的题</b>。'
      + '不背概念，只练方法。</p>';
    h += '</div>';

    [1, 2, 3, 4, 5, 6, 7].forEach(function (no) {
      var list = byCh[no];
      if (!list || !list.length) return;
      h += '<div class="sec">第 ' + no + ' 章　' + (CHNAME[no] || "") + '</div>';
      list.forEach(function (g) {
        var n = 0, done = 0;
        (g.qids || []).forEach(function (id) {
          n++;
          if (PICKED[g.id + ":" + id]) done++;
        });
        h += '<a class="sk-card" href="skill-single.html?id=' + g.id + '">';
        h += '<div class="sk-head"><b>' + esc(g.name) + '</b>';
        if (n) h += '<span class="sk-cnt">' + done + '/' + n + '</span>';
        h += '</div>';
        h += '<div class="sk-when">' + mdBold(g.when) + '</div>';
        h += '<div class="sk-steps-pv">' + (g.steps || []).length + ' 步</div>';
        h += '</a>';
      });
    });

    document.getElementById("main").innerHTML = h;
  }

  /* ========== 单题型页 ========== */
  function renderSingle(id) {
    var g = null;
    groups.forEach(function (x) { if (x.id === id) g = x; });
    if (!g) {
      document.getElementById("main").innerHTML = '<div class="empty">没有这个题型：' + esc(id) + '</div>';
      return;
    }

    document.title = g.name + " · 题型专项 · 高数一";

    var h = "";
    h += '<div class="chaphero">';
    h += '<span class="ch-no">第 ' + g.ch + ' 章 · 题型</span>';
    h += '<h2>' + esc(g.name) + '</h2>';
    h += '</div>';

    /* 识别特征 */
    h += '<div class="sk-box sk-whenbox">';
    h += '<div class="sk-lab">什么时候用它</div>';
    h += '<div class="sk-body">' + mdBold(g.when) + '</div>';
    h += '</div>';

    /* 固定步骤 */
    h += '<div class="sk-box sk-stepsbox">';
    h += '<div class="sk-lab">固定步骤</div>';
    h += '<ol class="sk-steps">';
    (g.steps || []).forEach(function (s) {
      h += '<li>' + mdBold(s) + '</li>';
    });
    h += '</ol></div>';

    /* 易错点 */
    if (g.warn) {
      h += '<div class="sk-box sk-warnbox">';
      h += '<div class="sk-lab">⚠ 易错点</div>';
      h += '<div class="sk-body">' + mdBold(g.warn) + '</div>';
      h += '</div>';
    }

    /* 套用题 */
    var ids = g.qids || [];
    var done = 0;
    ids.forEach(function (id2) { if (PICKED[g.id + ":" + id2]) done++; });

    h += '<div class="sec">用这套步骤做的题 <span class="cnt">' + done + ' / ' + ids.length + '</span></div>';

    if (!ids.length) {
      h += '<div class="empty">这个题型暂无配套题</div>';
    } else {
      ids.forEach(function (qid, idx) {
        var q = QB[qid];
        if (!q) {
          h += '<div class="qbox"><div class="qh">' + (idx + 1) + '</div>'
            + '<div class="qtxt" style="color:#c33">题目 ' + qid + ' 未找到</div></div>';
          return;
        }
        var ok = PICKED[g.id + ":" + qid];
        h += '<div class="qbox' + (ok ? " is-done" : "") + '" data-qid="' + qid + '">';
        h += '<div class="qh">' + (idx + 1) + '<span class="qid">' + qid + '</span></div>';
        h += '<div class="qtxt">' + q.t + '</div>';
        h += '<div class="qacts">';
        h += '<button class="btn-ans" data-ans="' + idx + '">对照答案</button>';
        h += '<button class="btn-ok' + (ok ? " on" : "") + '" data-ok="' + idx + '">'
          + (ok ? "✓ 已掌握" : "标记掌握") + '</button>';
        h += '</div>';
        h += '<div class="qans" id="ans-' + idx + '" style="display:none">';
        h += '<div class="ans-t">答案</div><div class="ans-c">' + (q.a || "见解析") + '</div>';
        if (q.s) h += '<div class="ans-t">解析</div><div class="ans-c">' + q.s + '</div>';
        h += '</div>';
        h += '</div>';
      });
    }

    document.getElementById("main").innerHTML = h;

    /* 事件 */
    document.getElementById("main").addEventListener("click", function (ev) {
      var t = ev.target;
      if (t.classList.contains("btn-ans")) {
        var i = t.getAttribute("data-ans");
        var box = document.getElementById("ans-" + i);
        if (box) {
          var show = box.style.display === "none";
          box.style.display = show ? "block" : "none";
          t.textContent = show ? "收起答案" : "对照答案";
          if (show && window.renderMath) window.renderMath(box);
        }
      }
      if (t.classList.contains("btn-ok")) {
        var j = t.getAttribute("data-ok");
        var qb = t.closest(".qbox");
        var qid2 = qb.getAttribute("data-qid");
        var key = g.id + ":" + qid2;
        if (PICKED[key]) {
          delete PICKED[key];
          t.classList.remove("on");
          t.textContent = "标记掌握";
          qb.classList.remove("is-done");
        } else {
          PICKED[key] = 1;
          t.classList.add("on");
          t.textContent = "✓ 已掌握";
          qb.classList.add("is-done");
        }
        save();
        /* 更新计数 */
        var cnt = 0;
        ids.forEach(function (x) { if (PICKED[g.id + ":" + x]) cnt++; });
        var el = document.querySelector(".sec .cnt");
        if (el) el.textContent = cnt + " / " + ids.length;
      }
    });

    if (window.renderMath) window.renderMath(document.getElementById("main"));
  }

  /* 先转义 HTML，再把 **粗体** 变成 <strong> */
  function mdBold(s) {
    var t = esc(s);
    return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ========== 路由 ========== */
  var qid = new URLSearchParams(location.search).get("id");
  if (qid) renderSingle(qid);
  else renderIndex();
})();
