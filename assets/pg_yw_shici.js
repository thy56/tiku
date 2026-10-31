
(function(){
"use strict";

var D = window.YUWEN_SHICI || {total:0, letters:[], items:[]};
var ALL = D.items || [];
var LETTERS = D.letters || [];
var KEYRAW = window.GS_KEY;

var CUR = null;
if (KEYRAW !== null) {
  var k = String(KEYRAW).toUpperCase();
  if (LETTERS.some(function(x){ return x.l === k; })) CUR = k;
}

var KEY = "";
var OPEN = {};

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

function matchItem(it){
  if(!KEY) return true;
  if(has(it.w) || has(it.m) || has(it.py)) return true;
  return (it.e||[]).some(has);
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = LETTERS.map(function(x){
    var ws = ALL.filter(function(it){ return it.l === x.l; });
    var withEx = ws.filter(function(it){ return (it.e||[]).length; }).length;
    var pys = ws.filter(function(it){ return it.py; }).length;
    return {
      key: x.l,
      badge: x.l,
      title: x.l + " 区（" + x.n + " 词）",
      desc: ws.slice(0, 8).map(function(it){ return it.w; }).join("、") +
            (ws.length > 8 ? " 等" : ""),
      stats: [
        { t: " 词", v: x.n },
        { t: " 带例句", v: withEx },
        { t: " 带注音", v: pys }
      ]
    };
  });

  window.GS_renderUnitIndex("chapidx", items, "shici.html");

  var withExAll = ALL.filter(function(it){ return (it.e||[]).length; }).length;
  document.getElementById("hBadge").textContent = D.total + " 词";
  document.getElementById("hSub").textContent =
    "共 " + D.total + " 个文言实词，分 " + LETTERS.length + " 个字母区，其中 " +
    withExAll + " 个配课文例句。按拼音查词，先看释义再看例句。";
}

/* ============ 单字母区页 ============ */
function renderLetter(){
  var ws = ALL.filter(function(it){ return it.l === CUR; });
  if(!ws.length){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  var shown = ws.filter(matchItem);

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">' + esc(CUR) + ' 区</span>';
  head += '<h2>文言实词 · ' + esc(CUR) + '</h2>';
  head += '<div class="ch-st">';
  head += '<span><b>' + ws.length + '</b> 词</span>';
  head += '<span><b>' + ws.filter(function(x){ return (x.e||[]).length; }).length + '</b> 带例句</span>';
  head += '<span><b>' + ws.filter(function(x){ return x.py; }).length + '</b> 带注音</span>';
  head += '</div></div>';

  var h = head;
  if(!shown.length){
    h += '<div class="empty">本区没有匹配「' + esc(KEY) + '」的词</div>';
  }else{
    if(KEY) h += '<div class="stats"><span>显示 ' + shown.length + ' / ' + ws.length + ' 词（搜索：' + esc(KEY) + '）</span></div>';

    h += '<div class="shici-grid">';
    shown.forEach(function(it){
      var id = "w" + CUR + "_" + it.w;
      var isOpen = OPEN[id] || KEY;
      var exN = (it.e||[]).length;

      h += '<div class="sc-card' + (isOpen ? ' open' : '') + '">';
      h += '<div class="sc-head" data-t="' + esc(id) + '">';
      h += '<span class="sc-w">' + hl(it.w) + '</span>';
      if(it.py) h += '<span class="sc-py">' + esc(it.py) + '</span>';
      if(exN) h += '<span class="sc-n">' + exN + ' 例</span>';
      h += '<span class="sc-ar">▾</span>';
      h += '</div>';
      h += '<div class="sc-body">';
      if(it.m) h += '<div class="sc-m">' + hl(it.m) + '</div>';
      if(exN){
        h += '<div class="sc-ex">';
        (it.e||[]).forEach(function(x){
          h += '<div class="sc-e">' + hl(x) + '</div>';
        });
        h += '</div>';
      }
      h += '</div></div>';
    });
    h += '</div>';
  }
  $main.innerHTML = h;

  document.getElementById("hBadge").textContent = CUR + " 区 · " + ws.length + " 词";
  document.getElementById("hSub").textContent =
    CUR + " 区共 " + ws.length + " 个词，点词条展开看释义与例句。";

  var units = LETTERS.map(function(x){
    return { key: x.l, no: x.l, label: x.l + " 区", count: x.n };
  });
  window.GS_renderUnitBar("chapbar", "shici.html", units, { label: "字母" });
  window.GS_renderUnitPager("chpager", "shici.html", units);
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target.closest("[data-t]");
  if(!t) return;
  var k = t.getAttribute("data-t");
  if(OPEN[k]) delete OPEN[k]; else OPEN[k] = 1;
  renderLetter();
});

var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR) renderLetter(); else renderIndex();
    }, 170);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){
  ALL.filter(function(it){ return it.l === CUR; }).forEach(function(it){
    OPEN["w" + CUR + "_" + it.w] = 1;
  });
  renderLetter();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  OPEN = {};
  renderLetter();
});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = LETTERS.map(function(x){
    return { key: x.l, no: x.l, label: x.l + " 区", count: x.n };
  });
  window.GS_renderUnitBar("chapbar", "shici.html", units0, { label: "字母", withAll: false });
}else{
  renderLetter();
}
})();
