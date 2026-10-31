
(function(){
"use strict";

var NAV = window.YW_NAV || {chapters:[]};
var G = window.YW_GRAMMAR || {chapters:[]};
var ALL = G.chapters || [];
var KEYRAW = window.GS_KEY;

/* 校验：ch 是章节索引（0 起） */
var CUR = null;
if (KEYRAW !== null && /^\d+$/.test(KEYRAW)) {
  var n = parseInt(KEYRAW, 10);
  if (n >= 0 && n < ALL.length) CUR = n;
}

var KEY = "";
var OPEN_SEC = {};
var INITED = {};   /* 已实体化默认展开的章 */

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
function nl(s){ return hl(s).replace(/\n/g,"<br>"); }

function matchSection(sec){
  if(!KEY) return true;
  if(has(sec.topic) || has(sec.item)) return true;
  if((sec.examples||[]).some(has)) return true;
  if(has(sec.exam)) return true;
  return false;
}
function shortCh(t){
  return String(t||"").replace(/^第[一二三四五]章[\s\u3000]*/, "");
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = ALL.map(function(ch, i){
    var topics = (ch.sections||[]).map(function(s){
      return String(s.topic||"");
    });
    return {
      key: i,
      badge: "第" + (i+1) + "章",
      title: shortCh(ch.title),
      desc: ch.desc || topics.slice(0, 3).join("；"),
      stats: [
        { t: " 节", v: (ch.sections||[]).length }
      ]
    };
  });

  window.GS_renderUnitIndex("chapidx", items, "grammar.html");

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.chapters || ALL.length) + " 章 · " + (S.gsections || 0) + " 节";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + ALL.length + " 章 " + (S.gsections||0) +
    " 节。一章一页，五章递进：句型骨架 → 词法 → 动词体系 → 从句 → 特殊句式。";
}

/* ============ 单章页 ============ */
function renderChapter(){
  var ci = CUR;
  var ch = ALL[ci];
  if(!ch){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  /* 首次进入本章：把「默认全部展开」实体化到 OPEN_SEC，
     否则点开任一小节后 OPEN_SEC 非空，其它小节会连带收起 */
  if(!INITED[ci] && !KEY){
    (ch.sections||[]).forEach(function(s, si){ OPEN_SEC["s"+ci+"_"+si] = 1; });
    INITED[ci] = 1;
  }

  var secs = (ch.sections||[]).filter(matchSection);
  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + (ci+1) + ' 章</span>';
  head += '<h2>' + esc(shortCh(ch.title)) + '</h2>';
  if(ch.desc) head += '<p>' + esc(ch.desc) + '</p>';
  head += '<div class="ch-st"><span><b>' + (ch.sections||[]).length + '</b> 节</span></div>';
  head += '</div>';

  var h = head;
  if(!secs.length){
    h += '<div class="empty">本章没有匹配「' + esc(KEY) + '」的语法点</div>';
  }else{
    if(KEY) h += '<div class="stats"><span>显示 ' + secs.length + ' / ' + (ch.sections||[]).length + ' 节（搜索：' + esc(KEY) + '）</span></div>';

    var allOpen = true;   /* 已实体化，默认展开由 OPEN_SEC 决定 */

    secs.forEach(function(sec, si){
      var origIdx = (ch.sections||[]).indexOf(sec);
      var sid = "s" + ci + "_" + origIdx;
      var secOpen = (OPEN_SEC[sid] === 0) ? false : true;

      h += '<div class="lesson' + (secOpen ? ' open' : '') + '">';
      h += '<div class="lesson-head" data-sec-toggle="' + sid + '">';
      h += '<h3>' + hl(sec.topic) + '</h3>';
      h += '<span class="arrow">▶</span>';
      h += '</div>';
      h += '<div class="lesson-body">';

      if(sec.group) h += '<div style="margin-bottom:8px"><span class="gtag">' + esc(sec.group) + '</span></div>';
      h += '<div class="txt">' + nl(sec.item) + '</div>';
      (sec.examples||[]).forEach(function(ex){
        h += '<div class="ex">' + hl(ex) + '</div>';
      });
      if(sec.exam){
        h += '<div class="exam">' + esc(sec.exam) + '</div>';
      }

      h += '</div></div>';
    });
  }
  $main.innerHTML = h;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + (ci+1) + " 章 · " + (ch.sections||[]).length + " 节";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = shortCh(ch.title) + "。" + (ch.desc || "") +
    "（共 " + (ch.sections||[]).length + " 节）";

  var units = ALL.map(function(x, i){
    return { key: i, no: i+1, label: shortCh(x.title), count: (x.sections||[]).length };
  });
  window.GS_renderUnitBar("chapbar", "grammar.html", units, { label: "章" });
  window.GS_renderUnitPager("chpager", "grammar.html", units);
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var s = e.target.closest("[data-sec-toggle]");
  if(!s) return;
  var sid = s.getAttribute("data-sec-toggle");
  var el = s.parentNode;
  var isOpen = el.classList.contains("open");
  /* 用显式状态覆盖默认展开 */
  OPEN_SEC[sid] = isOpen ? 0 : 1;
  renderChapter();
});

var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR !== null) renderChapter(); else renderIndex();
    }, 160);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){
  var ch = ALL[CUR];
  if(!ch) return;
  (ch.sections||[]).forEach(function(s, si){ OPEN_SEC["s"+CUR+"_"+si] = 1; });
  renderChapter();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  var ch = ALL[CUR];
  if(!ch) return;
  (ch.sections||[]).forEach(function(s, si){ OPEN_SEC["s"+CUR+"_"+si] = 0; });
  renderChapter();
});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = ALL.map(function(x, i){
    return { key: i, no: i+1, label: shortCh(x.title), count: (x.sections||[]).length };
  });
  window.GS_renderUnitBar("chapbar", "grammar.html", units0, { label: "章", withAll: false });
}else{
  renderChapter();
}
})();
