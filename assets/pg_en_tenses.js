
(function(){
"use strict";

var NAV = window.YW_NAV || {layers:[]};
var T = window.YW_TENSES || {layers:[]};
var LAYERS = T.layers || [];
var KEYRAW = window.GS_KEY;

var CUR = null;
if (KEYRAW !== null && /^\d+$/.test(KEYRAW)) {
  var n = parseInt(KEYRAW, 10);
  if (n >= 0 && n < LAYERS.length) CUR = n;
}

var KEY = "";
var OPEN_SEC = {};
var INITED = {};   /* 已实体化默认展开的层 */

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

function matchSec(s){
  if(!KEY) return true;
  if(has(s.tense) || has(s.form) || has(s.usage) || has(s.markers) || has(s.note)) return true;
  return (s.examples||[]).some(has);
}
function shortLay(t){
  return String(t||"").replace(/^第[一二三四五]层[\s\u3000]*/, "");
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = LAYERS.map(function(Ly, i){
    var topics = (Ly.sections||[]).map(function(s){ return s.tense; });
    return {
      key: i,
      badge: "第" + (i+1) + "层",
      title: shortLay(Ly.title),
      desc: (Ly.desc || "") + (topics.length ? "（" + topics.slice(0,4).join("、") + (topics.length>4?" 等":"") + "）" : ""),
      stats: [{ t: " 节", v: (Ly.sections||[]).length }]
    };
  });

  var core = '';
  if(T.core_idea){
    core = '<div class="gsummary" style="border-left-color:#2e74b5;margin-bottom:16px">'
         + '<h3>一句话记住</h3>'
         + '<div class="row" style="font-size:13.5px;line-height:1.85">' + esc(T.core_idea) + '</div></div>';
  }
  var host = document.getElementById("chapidx");
  window.GS_renderUnitIndex("chapidx", items, "tenses.html");
  if(core) host.innerHTML = core + host.innerHTML;

  var S = NAV.stats || {};
  var total = 0;
  LAYERS.forEach(function(l){ total += (l.sections||[]).length; });
  document.getElementById("hBadge").textContent = LAYERS.length + " 层 · " + (S.tsections || total) + " 节";
  document.getElementById("hSub").textContent =
    "共 " + LAYERS.length + " 层 " + total + " 节，从「时间 × 状态」的逻辑讲起。";
}

/* ============ 单层页 ============ */
function renderLayer(){
  var Ly = LAYERS[CUR];
  if(!Ly){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  /* 首次进入本层：把「默认全部展开」实体化 */
  if(!INITED[CUR] && !KEY){
    (Ly.sections||[]).forEach(function(s, si){ OPEN_SEC["ts"+CUR+"_"+si] = 1; });
    INITED[CUR] = 1;
  }

  var secs = (Ly.sections||[]).filter(matchSec);
  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + (CUR+1) + ' 层</span>';
  head += '<h2>' + esc(shortLay(Ly.title)) + '</h2>';
  if(Ly.desc) head += '<p>' + esc(Ly.desc) + '</p>';
  head += '<div class="ch-st"><span><b>' + (Ly.sections||[]).length + '</b> 节</span></div>';
  head += '</div>';

  var h = head;
  if(!secs.length){
    h += '<div class="empty">本层没有匹配「' + esc(KEY) + '」的内容</div>';
  }else{
    if(KEY) h += '<div class="stats"><span>显示 ' + secs.length + ' / ' + (Ly.sections||[]).length + ' 节</span></div>';

    secs.forEach(function(s){
      var origIdx = (Ly.sections||[]).indexOf(s);
      var sid = "ts" + CUR + "_" + origIdx;
      var so = (OPEN_SEC[sid] === 0) ? false : true;

      h += '<div class="lesson' + (so ? ' open' : '') + '">';
      h += '<div class="lesson-head" data-sec-toggle="' + sid + '">';
      h += '<h3>' + hl(s.tense) + '</h3>';
      h += '<span class="arrow">▶</span>';
      h += '</div>';
      h += '<div class="lesson-body">';

      if(s.form){
        h += '<div style="margin-bottom:10px"><span class="gtag">构成</span> <b style="font-size:14px;color:#1f4e79">' + hl(s.form) + '</b></div>';
      }
      if(s.usage) h += '<div class="txt">' + nl(s.usage) + '</div>';
      if(s.markers && s.markers !== "无"){
        h += '<div style="font-size:13px;color:#6b7c8d;margin-bottom:9px"><b>标志词：</b>' + hl(s.markers) + '</div>';
      }
      (s.examples||[]).forEach(function(ex){
        h += '<div class="ex">' + hl(ex) + '</div>';
      });
      if(s.note) h += '<div class="exam">' + esc(s.note) + '</div>';

      h += '</div></div>';
    });
  }
  $main.innerHTML = h;

  document.getElementById("hBadge").textContent = "第 " + (CUR+1) + " 层 · " + (Ly.sections||[]).length + " 节";
  document.getElementById("hSub").textContent = shortLay(Ly.title) + "。" + (Ly.desc || "");

  var units = LAYERS.map(function(x, i){
    return { key: i, no: i+1, label: shortLay(x.title), count: (x.sections||[]).length };
  });
  window.GS_renderUnitBar("chapbar", "tenses.html", units, { label: "层" });
  window.GS_renderUnitPager("chpager", "tenses.html", units);
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var s = e.target.closest("[data-sec-toggle]");
  if(!s) return;
  var sid = s.getAttribute("data-sec-toggle");
  var isOpen = s.parentNode.classList.contains("open");
  OPEN_SEC[sid] = isOpen ? 0 : 1;
  renderLayer();
});

var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR !== null) renderLayer(); else renderIndex();
    }, 160);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){
  var Ly = LAYERS[CUR];
  if(!Ly) return;
  (Ly.sections||[]).forEach(function(s, si){ OPEN_SEC["ts"+CUR+"_"+si] = 1; });
  renderLayer();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  var Ly = LAYERS[CUR];
  if(!Ly) return;
  (Ly.sections||[]).forEach(function(s, si){ OPEN_SEC["ts"+CUR+"_"+si] = 0; });
  renderLayer();
});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = LAYERS.map(function(x, i){
    return { key: i, no: i+1, label: shortLay(x.title), count: (x.sections||[]).length };
  });
  window.GS_renderUnitBar("chapbar", "tenses.html", units0, { label: "层", withAll: false });
}else{
  renderLayer();
}
})();
