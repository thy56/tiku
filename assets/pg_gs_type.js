/* 高数一 · 题型专项渲染器
 * 按题型（证明/应用）把跨章节的同类题聚合，再按知识点分块。
 * 数据：window.GS_QUESTIONS（题库）、window.GS_KP_TYPE（知识点标签）
 */
(function () {
  "use strict";

  var Q = window.GS_QUESTIONS || { questions: [] };
  var ALLQ = Q.questions || [];
  var KP = window.GS_KP_TYPE || {};
  var ST = window.GS_STORE;

  var TYPE = window.GS_TYPE || "证明";
  var KEY = "";
  var STATE = "all";

  var $main = document.getElementById("main");
  var $q = document.getElementById("q");

  var LET = ["A", "B", "C", "D"];

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
  function nl(s) { return hl(s).replace(/\n/g, "<br>"); }
  function chOf(q) {
    var m = /^(\d+)/.exec(String(q.id || ""));
    return m ? parseInt(m[1], 10) : 0;
  }

  /* 该题型的全部题目，按知识点分组 */
  var POOL = ALLQ.filter(function (q) { return q.type === TYPE; });

  var GROUPS = {};
  var ORDER = [];
  POOL.forEach(function (q) {
    var lb = KP[q.id] || "其他";
    if (!GROUPS[lb]) { GROUPS[lb] = []; ORDER.push(lb); }
    GROUPS[lb].push(q);
  });
  ORDER.sort(function (a, b) {
    if (a === "其他") return 1;
    if (b === "其他") return -1;
    return GROUPS[b].length - GROUPS[a].length;
  });

  function render() {
    var picked = ST.getPicked() || {};
    var shown = ST.getShown() || {};
    var rates = ST.getRates() || {};

    /* 统计 */
    var done = 0, right = 0;
    POOL.forEach(function (q) {
      var p = picked[q.id], r = rates[q.id];
      if (p || r) {
        done++;
        if (r === "ok") right++;
      }
    });
    var pct = POOL.length ? Math.round(right / POOL.length * 100) : 0;

    var h = "";
    h += '<div class="chaphero">';
    h += '<span class="ch-no">题型专项</span>';
    h += '<h2>' + esc(TYPE) + '题</h2>';
    h += '<div class="ch-st">'
      + '<span><b>' + POOL.length + '</b> 道题</span>'
      + '<span><b>' + ORDER.length + '</b> 个知识点</span>'
      + '<span><b>' + done + '</b> 已做</span>'
      + '<span><b>' + pct + '%</b> 正确率</span></div>';
    h += '</div>';

    /* 知识点导航 */
    h += '<div class="tp-nav">';
    ORDER.forEach(function (lb) {
      h += '<a class="tp-chip" href="#g-' + encodeURIComponent(lb) + '">'
        + esc(lb) + '<i>' + GROUPS[lb].length + '</i></a>';
    });
    h += '</div>';

    var anyShown = false;

    ORDER.forEach(function (lb) {
      var items = GROUPS[lb].filter(function (q) {
        if (KEY) {
          var hay = (q.t || "") + " " + (q.s || "") + " " + (q.a || "");
          if (hay.toLowerCase().indexOf(KEY) === -1) return false;
        }
        if (STATE === "todo") {
          if (picked[q.id] || rates[q.id]) return false;
        } else if (STATE === "wrong") {
          if (rates[q.id] !== "err") return false;
        } else if (STATE === "done") {
          if (!(picked[q.id] || rates[q.id])) return false;
        }
        return true;
      });
      if (!items.length) return;
      anyShown = true;

      h += '<div class="tp-sec" id="g-' + encodeURIComponent(lb) + '">'
        + esc(lb) + '<span class="cnt">' + items.length + ' 题</span></div>';

      items.forEach(function (q) {
        var pick = picked[q.id];
        var isShown = !!shown[q.id];
        var rate = rates[q.id];
        var chs = chOf(q);

        h += '<div class="qbox" data-qid="' + q.id + '">';
        h += '<div class="qh"><span class="num">' + esc(q.id) + '</span>'
          + '<span class="tx">' + hl(q.t) + '</span></div>';

        h += '<div class="tp-meta">第 ' + chs + ' 章'
          + (rate === "ok" ? ' · <b style="color:#2e7d32">已掌握</b>' : '')
          + (rate === "err" ? ' · <b style="color:#c62828">待加强</b>' : '')
          + '</div>';

        if (q.type === "单选") {
          h += '<div class="opts">';
          (q.o || []).forEach(function (o, i) {
            var L = LET[i];
            var cls = "opt";
            if (pick) {
              if (L === q.a) cls += " right";
              else if (L === pick) cls += " wrong";
            }
            h += '<button class="' + cls + '" data-opt="' + q.id + '" data-l="' + L + '">';
            h += '<span class="ol">' + L + '</span><span class="ot">' + hl(o) + '</span>';
            h += '</button>';
          });
          h += '</div>';
        } else {
          h += '<div class="answer-zone">';
          h += '<textarea data-aid="' + q.id + '" placeholder="写出完整解题过程…" rows="4">'
            + esc(pick || "") + '</textarea>';
          h += '<div class="az-actions">';
          h += '<button class="az-btn primary" data-cmp="' + q.id + '">对照答案</button>';
          if (isShown) h += '<button class="az-btn" data-close="' + q.id + '">收起</button>';
          h += '</div>';

          if (isShown) {
            h += '<div class="az-cmp open">';
            h += '<div class="lbl">我的作答</div>';
            h += '<div class="my">' + esc(pick || "（未填写）") + '</div>';
            h += '<div class="lbl">参考答案</div>';
            h += '<div class="ref">' + nl(q.a) + '</div>';
            if (q.s) {
              h += '<div class="lbl">解析</div>';
              h += '<div class="note">' + nl(q.s) + '</div>';
            }
            h += '</div>';
          }

          h += '<div class="az-actions" style="margin-top:9px">';
          h += '<button class="az-btn' + (rate === "ok" ? ' primary' : '')
            + '" data-rate="' + q.id + '" data-r="ok">已掌握</button>';
          h += '<button class="az-btn' + (rate === "err" ? ' primary' : '')
            + '" data-rate="' + q.id + '" data-r="err">待加强</button>';
          h += '</div>';
          h += '</div>';
        }

        h += '</div>';
      });
    });

    if (!anyShown) {
      h += '<div class="empty">没有匹配的题目</div>';
    }

    $main.innerHTML = h;

    var bd = document.getElementById("hBadge");
    if (bd) bd.textContent = TYPE + ' · ' + POOL.length + ' 题';
  }

  /* ---------- 事件 ---------- */
  $main.addEventListener("click", function (e) {
    var t = e.target;

    var op = t.closest("[data-opt]");
    if (op) {
      var id = op.getAttribute("data-opt");
      var L = op.getAttribute("data-l");
      var cur = ST.getPicked()[id];
      ST.setPicked(id, cur === L ? "" : L);
      ST.setShown(id, true);
      render();
      return;
    }

    var cmp = t.closest("[data-cmp]");
    if (cmp) {
      var cid = cmp.getAttribute("data-cmp");
      ST.setShown(cid, true);
      render();
      return;
    }

    var cl = t.closest("[data-close]");
    if (cl) {
      ST.setShown(cl.getAttribute("data-close"), false);
      render();
      return;
    }

    var rt = t.closest("[data-rate]");
    if (rt) {
      var rid = rt.getAttribute("data-rate");
      var rv = rt.getAttribute("data-r");
      ST.setRate(rid, ST.getRates()[rid] === rv ? "" : rv);
      render();
      return;
    }

    var nav = t.closest(".tp-chip");
    if (nav) {
      e.preventDefault();
      var target = document.getElementById(nav.getAttribute("href").slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $main.addEventListener("input", function (e) {
    var ta = e.target.closest("textarea[data-aid]");
    if (!ta) return;
    ST.setPicked(ta.getAttribute("data-aid"), ta.value);
  });

  var timer = null;
  if ($q) {
    $q.addEventListener("input", function () {
      var v = this.value;
      clearTimeout(timer);
      timer = setTimeout(function () {
        KEY = v.trim().toLowerCase();
        render();
      }, 170);
    });
  }

  var fState = document.getElementById("fState");
  if (fState) {
    fState.addEventListener("change", function () {
      STATE = this.value || "all";
      render();
    });
  }

  var reset = document.getElementById("btnReset");
  if (reset) {
    reset.addEventListener("click", function () {
      if (!confirm("清空本题型专项的全部作答与自评？")) return;
      POOL.forEach(function (q) {
        ST.setPicked(q.id, "");
        ST.setShown(q.id, false);
        ST.setRate(q.id, "");
      });
      render();
    });
  }

  /* 顶部 tab 切换（证明 / 应用） */
  document.querySelectorAll("[data-gs-type]").forEach(function (a) {
    if (a.getAttribute("data-gs-type") === TYPE) a.classList.add("on");
  });

  render();
})();
