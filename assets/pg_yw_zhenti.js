
(function(){
"use strict";


/* 选项字母：0->A ... 25->Z ... 26->AA（LT(i) 超过 4 个会变成 undefined） */
function LT(n){
  var s = '';
  n = Number(n) || 0;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}
var KN = window.YUWEN_DATA || {zhenti:[]};
var PAPERS = KN.zhenti || [];
var KEYRAW = window.GS_KEY;

/* 校验 ch 必须是合法年份 */
var CUR = null;
if (KEYRAW !== null && /^\d{4}$/.test(KEYRAW)) {
  var hit = PAPERS.filter(function(p){ return String(p.year) === KEYRAW; })[0];
  if (hit) CUR = String(hit.year);
}

var KEY = "";
var SHOW = {};

var $main = document.getElementById("main");
var $q = document.getElementById("q");

function esc(s){
  return String(s==null?"":s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function hl(s){
  var t = esc(s);
  if(!KEY) return t;
  var re = new RegExp("("+KEY.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");
  return t.replace(re,'<span class="hl">$1</span>');
}
function has(s){ return String(s==null?"":s).toLowerCase().indexOf(KEY) !== -1; }

function paperCount(p){
  return (p.sections||[]).reduce(function(a,s){ return a + (s.items||[]).length; }, 0);
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = PAPERS.map(function(p){
    var n = paperCount(p);
    var ansN = 0;
    (p.sections||[]).forEach(function(sec){
      (sec.items||[]).forEach(function(it){ if(String(it.ans||'').trim()) ansN++; });
    });
    return {
      key: p.year,
      badge: p.year,
      title: p.year + " 年真题",
      desc: "来源：" + (p.source || "") + (p.note ? "。" + p.note : "") +
            (p.hasAnswer ? "" : "（源站未公开答案）"),
      stats: [
        { t: " 题", v: n },
        { t: " 含答案", v: ansN },
        { t: " 大题", v: (p.sections||[]).length }
      ]
    };
  });

  window.GS_renderUnitIndex("chapidx", items, "zhenti.html");

  var all = 0;
  PAPERS.forEach(function(p){ all += paperCount(p); });
  document.getElementById("hBadge").textContent = all + " 题";
  document.getElementById("hSub").textContent =
    "共 " + PAPERS.length + " 套、 " + all + " 题。一年一页，先自己做再对答案。";
}

/* ============ 单年页 ============ */
function renderPaper(){
  var paper = PAPERS.filter(function(p){ return String(p.year) === CUR; })[0];
  if(!paper){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  var n = paperCount(paper);
  var ansN = 0;
  (paper.sections||[]).forEach(function(sec){
    (sec.items||[]).forEach(function(it){ if(String(it.ans||'').trim()) ansN++; });
  });

  /* 搜索过滤：若无匹配则整体提示 */
  var matchAny = !KEY || (paper.sections||[]).some(function(sec){
    return (sec.items||[]).some(function(it){
      return has(it.q) || has(it.ans) || has(it.an) || (it.opts||[]).some(has);
    });
  });

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">' + paper.year + ' 年</span>';
  head += '<h2>山东专升本大学语文真题</h2>';
  head += '<p>来源：' + esc(paper.source || '') + (paper.note ? '。' + esc(paper.note) : '') + '</p>';
  head += '<div class="ch-st">';
  head += '<span><b>' + n + '</b> 题</span>';
  head += '<span><b>' + (paper.sections||[]).length + '</b> 大题</span>';
  head += '<span><b>' + ansN + '</b> 含答案</span>';
  head += '<span>' + (paper.hasAnswer ? '含参考答案' : '源站未公开答案') + '</span>';
  head += '</div></div>';

  var h = head;
  if(!matchAny){
    h += '<div class="empty">本套没有匹配「' + esc(KEY) + '」的题目</div>';
  }else{
    if(KEY) h += '<div class="stats"><span>搜索：' + esc(KEY) + '（仅高亮，未过滤）</span></div>';

    (paper.sections||[]).forEach(function(sec){
      var ansCnt = (sec.items||[]).filter(function(it){ return String(it.ans||'').trim(); }).length;
      h += '<div class="sec">' + esc(sec.name) +
           '<span class="cnt">' + (sec.items||[]).length + ' 题 · ' + esc(sec.score||'') +
           (ansCnt ? ' · 有答案 ' + ansCnt : '') + '</span></div>';

      (sec.items||[]).forEach(function(it){
        var id = 'z' + paper.year + '_' + it.no;
        var shown = SHOW[id];
        var hasAns = String(it.ans||'').trim() !== '';

        h += '<div class="qbox">';
        h += '<div class="qh"><span class="num">' + it.no + '.</span><span class="tx">' + hl(it.q) + '</span></div>';

        if(it.opts && it.opts.length){
          h += '<div class="opts">';
          it.opts.forEach(function(o, i){
            var lt = LT(i);
            var cls = 'opt locked';
            if(shown && hasAns && lt === it.ans) cls += ' right';
            h += '<button class="' + cls + '"><span class="lt">' + lt + '．</span><span>' + hl(o) + '</span></button>';
          });
          h += '</div>';
        }

        h += '<div class="qfoot">';
        if(!hasAns){
          h += '<span style="font-size:12.5px;color:#96591f">答案未公开</span>';
        }else if(shown){
          h += '<span class="verdict ok">答案已展开</span>';
          h += '<button class="revealbtn" data-hide="' + id + '">收起</button>';
        }else{
          h += '<span style="font-size:12.5px;color:#5d7080">先自己做，再看答案</span>';
          h += '<button class="revealbtn" data-show="' + id + '">看答案</button>';
        }
        h += '</div>';

        if(shown && hasAns){
          h += '<div class="ansbox show"><span class="lab">答案：' + esc(it.ans||'') +
               (it.an ? '　' + esc(it.an) : '') + '</span></div>';
        }
        h += '</div>';
      });
    });
  }
  $main.innerHTML = h;

  document.getElementById("hBadge").textContent = paper.year + " 年 · " + n + " 题";
  document.getElementById("hSub").textContent =
    paper.year + " 年真题，共 " + n + " 题、" + (paper.sections||[]).length + " 个大题。先自己做，再点「看答案」核对。";

  var units = PAPERS.map(function(p){
    return { key: p.year, no: p.year, label: p.year + " 年", count: paperCount(p) };
  });
  window.GS_renderUnitBar("chapbar", "zhenti.html", units, { label: "年份" });
  window.GS_renderUnitPager("chpager", "zhenti.html", units);
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var s = e.target.closest("[data-show]");
  if(s){ SHOW[s.getAttribute("data-show")] = 1; renderPaper(); return; }
  var hd = e.target.closest("[data-hide]");
  if(hd){ delete SHOW[hd.getAttribute("data-hide")]; renderPaper(); return; }
});

var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR) renderPaper(); else renderIndex();
    }, 160);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){
  var paper = PAPERS.filter(function(p){ return String(p.year) === CUR; })[0];
  if(!paper) return;
  (paper.sections||[]).forEach(function(sec){
    (sec.items||[]).forEach(function(it){
      if(String(it.ans||'').trim()) SHOW['z' + paper.year + '_' + it.no] = 1;
    });
  });
  renderPaper();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  SHOW = {};
  renderPaper();
});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = PAPERS.map(function(p){
    return { key: p.year, no: p.year, label: p.year + " 年", count: paperCount(p) };
  });
  window.GS_renderUnitBar("chapbar", "zhenti.html", units0, { label: "年份", withAll: false });
}else{
  renderPaper();
}
})();
