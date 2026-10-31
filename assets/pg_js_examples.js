
(function(){
"use strict";

var NAV = window.JS_NAV || {chapters:[], stats:{}};
var E = window.JS_EXAMPLES || {chapters:[]};
var ALL = E.chapters || [];
var CH = window.GS_CH;
var CHS = CH === null ? [] : ALL.filter(function(c){ return c.no === CH; });

var KEY = "";
var OPEN = {};
var TOPIC = "all";

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

function matchExam(ex){
  if(!KEY) return true;
  return has(ex.q) || has(ex.idea) || has(ex.sol) || has(ex.trap);
}
function countEx(ch){
  var n = 0;
  (ch.topics||[]).forEach(function(t){ n += (t.examples||[]).length; });
  return n;
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = ALL.map(function(c){
    var n = countEx(c);
    var withTrap = 0;
    (c.topics||[]).forEach(function(t){
      (t.examples||[]).forEach(function(e){ if(e.trap) withTrap++; });
    });
    return {
      no: c.no,
      title: c.title,
      desc: (c.topics||[]).map(function(t){
        return String(t.t).replace(/^\d+\.\d+\s*/, "");
      }).join(" · "),
      stats: [
        { t: " 题型", v: (c.topics||[]).length },
        { t: " 例题", v: n },
        { t: " 含易错点", v: withTrap }
      ]
    };
  });

  window.GS_renderChapIndex("chapidx", items, "examples.html");

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.chapters||ALL.length) + " 章 · " + (S.examples||0) + " 例";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + (S.chapters||ALL.length) + " 章、" + (S.topics||0) +
    " 类题型、" + (S.examples||0) + " 道例题。按章分开看，一章一页。";
}

/* ============ 单章页 ============ */
function renderChapter(){
  var ch = CHS[0];
  if(!ch){ $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>'; return; }
  document.getElementById("bar").style.display = "";

  var shown = 0;
  var gh = "";

  (ch.topics||[]).forEach(function(tp, ti){
    if(TOPIC !== "all" && TOPIC !== String(ti)) return;
    var exs = (tp.examples||[]).filter(matchExam);
    if(!exs.length) return;
    shown += exs.length;

    gh += '<div class="sec">'+esc(tp.t)+'<span class="cnt">'+exs.length+' 例</span></div>';
    if(tp.desc) gh += '<div style="font-size:13px;color:#6b7c8d;line-height:1.85;margin:-2px 0 10px 2px">'+hl(tp.desc)+'</div>';

    exs.forEach(function(ex, ei){
      var origIdx = (tp.examples||[]).indexOf(ex);
      var k = "x"+ti+"_"+origIdx;
      var isOpen = OPEN[k] || (KEY && KEY.length > 0);

      gh += '<div class="excard'+(isOpen?'':' closed')+'" id="'+k+'">';
      gh += '<div class="eq"><b>'+(origIdx+1)+'.</b>'+hl(ex.q)+'</div>';

      if(isOpen){
        gh += '<div class="eb">';
        if(ex.idea){
          gh += '<div class="exrow idea"><span class="lb">思路</span><div class="ct">'+nl(ex.idea)+'</div></div>';
        }
        if(ex.sol){
          gh += '<div class="exrow sol"><span class="lb">详解</span><div class="ct">'+nl(ex.sol)+'</div></div>';
        }
        if(ex.trap){
          gh += '<div class="exrow trap"><span class="lb">易错点</span><div class="ct">'+nl(ex.trap)+'</div></div>';
        }
        gh += '</div>';
      }else{
        gh += '<div class="eb" style="padding:0 17px 13px"><button class="az-btn" data-show="'+k+'" style="min-height:34px">查看解析</button></div>';
      }
      gh += '</div>';
    });
  });

  var ni = countEx(ch);
  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  head += '<div class="ch-st"><span><b>'+(ch.topics||[]).length+'</b> 题型</span><span><b>'+ni+'</b> 例题</span></div>';
  head += '</div>';

  var body;
  if(!shown){
    body = '<div class="empty">本章没有匹配的例题</div>';
  }else{
    body = '<div class="stats"><span>显示 '+shown+' / '+ni+' 道例题'+(KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>' + gh;
  }
  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 例";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "。" + (ch.topics||[]).length + " 类题型，每题按「题目 → 思路 → 详解 → 易错点」展开。";

  window.GS_renderChapBar("chapbar", "examples.html", { count: function(c){ return c.examples; } });
  window.GS_renderChapPager("chpager", "examples.html");

  var sel = document.getElementById("fTopic");
  if(sel){
    sel.innerHTML = '<option value="all">全部题型</option>';
    (ch.topics||[]).forEach(function(t, ti){
      var o = document.createElement("option");
      o.value = String(ti);
      o.textContent = String(t.t).replace(/^\d+\.\d+\s*/, "") + "（" + (t.examples||[]).length + "）";
      sel.appendChild(o);
    });
    sel.value = TOPIC;
  }
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var btn = e.target.closest("[data-show]");
  if(btn){
    OPEN[btn.getAttribute("data-show")] = 1;
    renderChapter();
    setTimeout(function(){
      var el = document.getElementById(btn.getAttribute("data-show"));
      if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
    }, 50);
    return;
  }
  var eq = e.target.closest(".eq");
  if(!eq) return;
  var card = eq.closest(".excard");
  if(!card) return;
  var k = card.id;
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

document.getElementById("fTopic").addEventListener("change", function(){
  TOPIC = this.value || "all";
  renderChapter();
});
document.getElementById("expandAll").addEventListener("click", function(){
  var ch = CHS[0];
  if(!ch) return;
  (ch.topics||[]).forEach(function(t, ti){
    (t.examples||[]).forEach(function(ex, ei){ OPEN["x"+ti+"_"+ei] = 1; });
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
  window.GS_renderChapBar("chapbar", "examples.html", { withAll: false, count: function(c){ return c.examples; } });
}else{
  renderChapter();
}
})();
