
(function(){
"use strict";

var NAV = window.YW_NAV || {roots:[]};
var R = window.YW_ROOTS || {groups:[], meta:{}};
var GROUPS = R.groups || [];
var KEYRAW = window.GS_KEY;

/* 校验 ch 必须是合法组号 */
var CUR = null;
if (KEYRAW !== null && /^\d+$/.test(KEYRAW)) {
  var n = parseInt(KEYRAW, 10);
  if (GROUPS.some(function(g){ return g.no === n; })) CUR = n;
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

function wordCount(g){
  return (g.roots||[]).reduce(function(a, rt){ return a + (rt.new_words||[]).length; }, 0);
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = GROUPS.map(function(g){
    var roots = (g.roots||[]).map(function(rt){
      return String(rt.root||"").replace(/——.*$/, "");
    }).join(" · ");
    return {
      key: g.no,
      badge: String(g.no).padStart(2, "0"),
      title: g.theme,
      desc: "词根：" + roots,
      stats: [
        { t: " 词根", v: (g.roots||[]).length },
        { t: " 派生词", v: wordCount(g) }
      ]
    };
  });

  window.GS_renderUnitIndex("chapidx", items, "roots.html");

  /* 前后缀表放目录页底部 */
  $main.innerHTML = affixBlock();

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.rootgroups || GROUPS.length) + " 组 · " + (S.rootwords || 0) + " 词";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + GROUPS.length + " 组词根、 " + (S.rootwords||0) +
    " 个派生词。一组一页，点进去记该组同源词。";
}

function affixBlock(){
  var meta = R.meta || {};
  var pre = meta.prefixes || [];
  var suf = meta.suffixes || [];
  if(!pre.length && !suf.length) return "";

  var inner = "";
  if(pre.length){
    inner += '<div class="sec">常用前缀<span class="cnt">' + pre.length + ' 个</span></div>';
    pre.forEach(function(p){
      inner += '<div class="wordrow"><span class="ww">' + esc(p.forms) + "</span>" +
               '<span class="wm">' + esc(p.meaning) + "</span>" +
               '<span class="wmem">例：' + esc(p.example) + "</span></div>";
    });
  }
  if(suf.length){
    inner += '<div class="sec">常用后缀<span class="cnt">' + suf.length + ' 个</span></div>';
    suf.forEach(function(s){
      inner += '<div class="wordrow"><span class="ww">' + esc(s.forms || s.suffix || "") + "</span>" +
               '<span class="wm">' + esc(s.meaning || "") + "</span>" +
               '<span class="wmem">例：' + esc(s.example || "") + "</span></div>";
    });
  }
  return '<div class="card open" style="margin-top:22px"><div class="ch"><div>' +
         '<h3>常用前缀与后缀</h3>' +
         '<div class="meta">前缀 ' + pre.length + ' 个 · 后缀 ' + suf.length + ' 个</div>' +
         '</div></div><div class="cb" style="display:block">' + inner + "</div></div>";
}

/* ============ 单组页 ============ */
function renderGroup(){
  var g = GROUPS.filter(function(x){ return x.no === CUR; })[0];
  if(!g){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  var wn = wordCount(g);

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + String(g.no).padStart(2,"0") + ' 组</span>';
  head += '<h2>' + hl(g.theme) + '</h2>';
  head += '<div class="ch-st">';
  head += '<span><b>' + (g.roots||[]).length + '</b> 词根</span>';
  head += '<span><b>' + wn + '</b> 派生词</span>';
  head += '</div></div>';

  var h = head;
  var anyShown = 0;

  (g.roots||[]).forEach(function(rt, ri){
    var rk = "r" + g.no + "_" + ri;
    var isOpen = OPEN[rk] !== 0;   /* 单组页默认展开 */
    var ws = (rt.new_words||[]).filter(function(w){
      if(!KEY) return true;
      return has(w.word) || has(w.meaning) || has(w.memory);
    });
    if(KEY && !ws.length) return;
    anyShown++;

    h += '<div class="card open" id="' + rk + '">';
    h += '<div class="ch" data-toggle="' + rk + '"><div>';
    h += '<h3><b style="color:#2e74b5">【' + hl(rt.root) + '】</b></h3>';
    h += '<div class="meta">' + ws.length + ' 个派生词</div>';
    h += '</div><span class="arrow">▶</span></div>';
    h += '<div class="cb" style="display:block">';

    if(rt.fam){
      h += '<div style="font-size:13px;color:#6b7c8d;line-height:1.85;margin-bottom:10px;padding:9px 12px;background:#f8fafc;border-radius:6px;border-left:3px solid #cfe0f0">家族词：' + hl(rt.fam) + '</div>';
    }

    ws.forEach(function(w){
      h += '<div class="wordrow">';
      h += '<span class="ww">' + hl(w.word) + '</span>';
      if(w.pos) h += '<span class="wp">' + esc(w.pos) + '</span>';
      h += '<span class="wm">' + hl(w.meaning||"") + '</span>';
      if(w.memory) h += '<span class="wmem">' + hl(w.memory) + '</span>';
      h += '</div>';
    });

    h += '</div></div>';
  });

  if(!anyShown){
    h += '<div class="empty">本组没有匹配「' + esc(KEY) + '」的单词</div>';
  }
  $main.innerHTML = h;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + String(g.no).padStart(2,"0") + " 组 · " + wn + " 词";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = g.theme + "。"
    + (g.roots||[]).length + " 个词根，带出 " + wn + " 个派生词。";

  var units = GROUPS.map(function(x){
    return { key: x.no, no: String(x.no).padStart(2,"0"), label: x.theme, count: wordCount(x) };
  });
  window.GS_renderUnitBar("chapbar", "roots.html", units, { label: "组" });
  window.GS_renderUnitPager("chpager", "roots.html", units);
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target.closest("[data-toggle]");
  if(!t) return;
  var k = t.getAttribute("data-toggle");
  if(OPEN[k] === 0){ delete OPEN[k]; } else { OPEN[k] = 0; }
  renderGroup();
});

var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR !== null) renderGroup(); else renderIndex();
    }, 160);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){
  OPEN = {};
  renderGroup();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  OPEN = {};
  var g = GROUPS.filter(function(x){ return x.no === CUR; })[0];
  if(g) (g.roots||[]).forEach(function(rt, ri){ OPEN["r"+g.no+"_"+ri] = 0; });
  renderGroup();
});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = GROUPS.map(function(x){
    return { key: x.no, no: String(x.no).padStart(2,"0"), label: x.theme, count: wordCount(x) };
  });
  window.GS_renderUnitBar("chapbar", "roots.html", units0, { label: "组", withAll: false });
}else{
  renderGroup();
}
})();
