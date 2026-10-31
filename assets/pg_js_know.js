
(function(){
"use strict";

var NAV = window.JS_NAV || {chapters:[], stats:{}};
var K = window.JS_KNOW || {chapters:[]};
var ALL = K.chapters || [];
var CH = window.GS_CH;
var CHS = CH === null ? [] : ALL.filter(function(c){ return c.no === CH; });

var KEY = "";
var OPEN = {};
var GRPF = "all";

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

function matchItem(it){
  if(!KEY) return true;
  if(has(it.t) || has(it.body)) return true;
  if((it.points||[]).some(has)) return true;
  return false;
}
function countItems(ch){
  if(ch.ni != null && !(ch.groups && ch.groups.length)) return ch.ni;   /* 轻量索引 */
  var n = 0;
  (ch.groups||[]).forEach(function(g){ n += (g.items||[]).length; });
  return n;
}
function countPoints(ch){
  if(ch.npt != null && !(ch.groups && ch.groups.length)) return ch.npt;
  var n = 0;
  (ch.groups||[]).forEach(function(g){
    (g.items||[]).forEach(function(it){ n += (it.points||[]).length; });
  });
  return n;
}
function countGroups(ch){
  if(ch.ng != null && !(ch.groups && ch.groups.length)) return ch.ng;
  return (ch.groups||[]).length;
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = ALL.map(function(c){
    var ni = countItems(c);
    var npt = countPoints(c);
    return {
      no: c.no,
      title: c.title,
      desc: c.desc,
      stats: [
        { t: " 知识点", v: ni },
        { t: " 考点", v: npt },
        { t: " 专题", v: countGroups(c) }
      ]
    };
  });

  window.GS_renderChapIndex("chapidx", items, "know.html");

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.chapters||ALL.length) + " 章 · " + (S.items||0) + " 点";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + (S.chapters||ALL.length) + " 章 " + (S.items||0) +
    " 个知识点、 " + (S.points||0) + " 条考点。按章分开看，一章一页。";
}

/* ============ 单章页 ============ */
function renderChapter(){
  var ch = CHS[0];
  if(!ch){ $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>'; return; }
  document.getElementById("bar").style.display = "";

  var shown = 0;
  var gh = "";

  (ch.groups||[]).forEach(function(g, gi){
    if(GRPF !== "all" && GRPF !== String(gi)) return;
    var items = (g.items||[]).filter(matchItem);
    if(!items.length) return;
    shown += items.length;

    gh += '<div class="sec">'+esc(g.title)+'<span class="cnt">'+items.length+' 个知识点</span></div>';

    items.forEach(function(it, ii){
      var sid = "k"+gi+"_"+ii;
      var isOpen = OPEN[sid] || (KEY && KEY.length > 0);

      gh += '<div class="kcard'+(isOpen?' open':'')+'" id="'+sid+'">';
      gh += '<div class="kh" data-t="'+sid+'"><h4>'+hl(it.t)+'</h4><span class="ar">▶</span></div>';
      gh += '<div class="kb">';
      if(it.body) gh += '<div class="txt">'+nl(it.body)+'</div>';
      if(it.points && it.points.length){
        gh += '<div class="pt"><span class="ptl">考点与易错</span><ul>';
        it.points.forEach(function(p){ gh += '<li>'+hl(p)+'</li>'; });
        gh += '</ul></div>';
      }
      gh += '</div></div>';
    });
  });

  var ni = countItems(ch);
  var npt = 0;
  (ch.groups||[]).forEach(function(g){
    (g.items||[]).forEach(function(it){ npt += (it.points||[]).length; });
  });

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  if(ch.desc) head += '<p>' + esc(ch.desc) + '</p>';
  head += '<div class="ch-st"><span><b>'+ni+'</b> 知识点</span><span><b>'+npt+'</b> 考点</span><span><b>'+(ch.groups||[]).length+'</b> 专题</span></div>';
  head += '</div>';

  var body;
  if(!shown){
    body = '<div class="empty">本章没有匹配的知识点</div>';
  }else{
    body = '<div class="stats"><span>显示 '+shown+' / '+ni+' 个知识点'+(KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>' + gh;
  }
  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 个知识点";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "。每章按专题分组，每条知识点含定义、对比要点与考点提示。";

  window.GS_renderChapBar("chapbar", "know.html", { count: function(c){ return c.items; } });
  window.GS_renderChapPager("chpager", "know.html");

  var sel = document.getElementById("fGrp");
  if(sel){
    sel.innerHTML = '<option value="all">全部专题</option>';
    (ch.groups||[]).forEach(function(g, gi){
      var o = document.createElement("option");
      o.value = String(gi);
      o.textContent = g.title + "（" + (g.items||[]).length + "）";
      sel.appendChild(o);
    });
    sel.value = GRPF;
  }
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target.closest("[data-t]");
  if(!t) return;
  var k = t.getAttribute("data-t");
  if(OPEN[k]) delete OPEN[k]; else OPEN[k] = 1;
  renderChapter();
});

var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  var v = this.value;
  timer = setTimeout(function(){
    KEY = v.trim().toLowerCase();
    renderChapter();
  }, 170);
});

document.getElementById("fGrp").addEventListener("change", function(){
  GRPF = this.value || "all";
  renderChapter();
});
document.getElementById("expandAll").addEventListener("click", function(){
  var ch = CHS[0];
  if(!ch) return;
  (ch.groups||[]).forEach(function(g, gi){
    (g.items||[]).forEach(function(it, ii){ OPEN["k"+gi+"_"+ii] = 1; });
  });
  renderChapter();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  OPEN = {};
  renderChapter();
});

/* ============ 启动 ============ */
if(CH === null){
  renderIndex();
  window.GS_renderChapBar("chapbar", "know.html", { withAll: false, count: function(c){ return c.items; } });
}else{
  renderChapter();
}
})();
