/* ===========================================================
   pg_examples_uni.js — 通用例题精讲渲染器（语文/英语共用）
   与 pg_gs_examples.js 的区别：
     语文/英语的 manifest.chapters 结构不符合 chapnav.js 的约定
     （语文为空数组，英语缺 no 字段），因此章节导航在此自实现，
     不依赖 GS_renderChapBar / GS_renderChapPager / GS_renderChapIndex。

   页面需事先设置：
     window.EX_CFG = {
       data    : window.YUWEN_EXAMPLES,   // 数据（含 chapters）
       subject : "山东专升本语文",
       prefix  : "ex-ch"                  // 分章文件名前缀
     }
     window.EX_FIXED_CH = 3;              // 可选，单章页用
   =========================================================== */
(function(){
"use strict";

var CFG = window.EX_CFG || {};
var E = CFG.data || { chapters: [] };
var ALL = E.chapters || [];
var PREFIX = CFG.prefix || "ex-ch";
var SUBJECT = CFG.subject || "";

var FIXED = (typeof window.EX_FIXED_CH === "number") ? window.EX_FIXED_CH : null;
var CHS = (FIXED === null) ? [] : ALL.filter(function(c){ return c.no === FIXED; });

var KEY = "";
var OPEN = {};
var TOPIC = "all";

var $main = document.getElementById("main");
var $q = document.getElementById("q");
var $fTopic = document.getElementById("fTopic");
var $bar = document.getElementById("bar");

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
function has(s){
  return String(s==null?"":s).toLowerCase().indexOf(KEY) !== -1;
}
function nl(s){ return hl(s).replace(/\n/g,"<br>"); }

function shortTitle(t){
  return String(t||"")
    .replace(/^第[一二三四五六七八九十百零\d]+章[\s\u3000]*/,"");
}

function matchExam(ex){
  if(!KEY) return true;
  return has(ex.q) || has(ex.idea) || has(ex.sol) || has(ex.trap);
}
function countEx(ch){
  var n = 0;
  (ch.topics||[]).forEach(function(t){ n += (t.examples||[]).length; });
  return n;
}
function countTrap(ch){
  var n = 0;
  (ch.topics||[]).forEach(function(t){
    (t.examples||[]).forEach(function(e){ if(e.trap) n++; });
  });
  return n;
}

/* ---------- 章节导航（自实现，不用 chapnav） ---------- */
function hrefOf(no){ return PREFIX + no + ".html"; }

function renderChapBar(cur){
  var host = document.getElementById("chapbar");
  if(!host) return;
  var h = '<div class="chapbar"><span class="cb-lb">目录</span>';
  h += '<a class="cb-a' + (cur === null ? " on" : "") + '" href="examples.html">全部</a>';
  ALL.forEach(function(c){
    var on = (cur !== null && c.no === cur);
    h += '<a class="cb-a' + (on ? " on" : "") + '" href="' + hrefOf(c.no) + '">';
    h += "<b>" + c.no + "</b>" + esc(shortTitle(c.title).substring(0, 6));
    h += "<i>" + countEx(c) + "</i>";
    h += "</a>";
  });
  h += "</div>";
  host.innerHTML = h;
}

function renderChapPager(cur){
  var host = document.getElementById("chpager");
  if(!host || cur === null) return;
  var idx = -1;
  ALL.forEach(function(c,i){ if(c.no === cur) idx = i; });
  if(idx < 0){ host.innerHTML = ""; return; }
  var prev = idx > 0 ? ALL[idx-1] : null;
  var next = idx < ALL.length-1 ? ALL[idx+1] : null;

  var h = '<div class="chpager">';
  h += prev
    ? '<a class="cp-a prev" href="'+hrefOf(prev.no)+'"><span>← 上一</span><b>'+esc(shortTitle(prev.title))+'</b></a>'
    : '<span class="cp-a dis"><span>← 上一</span><b>已是第一个</b></span>';
  h += '<a class="cp-a mid" href="examples.html">返回目录</a>';
  h += next
    ? '<a class="cp-a next" href="'+hrefOf(next.no)+'"><span>下一 →</span><b>'+esc(shortTitle(next.title))+'</b></a>'
    : '<span class="cp-a dis"><span>下一 →</span><b>已是最后一个</b></span>';
  h += "</div>";
  host.innerHTML = h;
}

/* ---------- 目录页 ---------- */
function renderIndex(){
  if($bar) $bar.style.display = "none";

  var host = document.getElementById("chapidx");
  if(host){
    var h = '<div class="chapidx">';
    ALL.forEach(function(c){
      var tps = (c.topics||[]).map(function(t){
        return String(t.t).replace(/^题型[一二三四五六七八九十]+[：:]\s*/,"");
      });
      h += '<a class="ci-card" href="'+hrefOf(c.no)+'">';
      h += '<div class="ci-no">'+c.no+'</div>';
      h += '<div class="ci-bd">';
      h += "<h3>"+esc(shortTitle(c.title))+"</h3>";
      h += "<p>"+esc(tps.join(" · "))+"</p>";
      h += '<div class="ci-st">';
      h += "<span><b>"+(c.topics||[]).length+"</b> 题型</span>";
      h += "<span><b>"+countEx(c)+"</b> 例题</span>";
      h += "<span><b>"+countTrap(c)+"</b> 含易错点</span>";
      h += "</div></div>";
      h += '<div class="ci-go">→</div>';
      h += "</a>";
    });
    h += "</div>";
    host.innerHTML = h;
  }

  var totalT = 0, totalE = 0;
  ALL.forEach(function(c){
    totalT += (c.topics||[]).length;
    totalE += countEx(c);
  });
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = ALL.length + " 章 · " + totalE + " 例";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + ALL.length + " 章、" + totalT +
    " 类题型、" + totalE + " 道例题。按章分开看，一章一页。每题按「题目 → 思路 → 详解 → 易错点」展开。";
}

/* ---------- 单章页 ---------- */
function renderChapter(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + FIXED + ' 章</div>';
    return;
  }
  if($bar) $bar.style.display = "";

  var shown = 0;
  var gh = "";

  (ch.topics||[]).forEach(function(tp, ti){
    if(TOPIC !== "all" && TOPIC !== String(ti)) return;
    var exs = (tp.examples||[]).filter(matchExam);
    if(!exs.length) return;
    shown += exs.length;

    gh += '<div class="sec">'+esc(tp.t)+'<span class="cnt">'+exs.length+' 例</span></div>';
    if(tp.desc){
      gh += '<div style="font-size:13px;color:#6b7c8d;line-height:1.85;margin:-2px 0 10px 2px">'+hl(tp.desc)+'</div>';
    }

    exs.forEach(function(ex){
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
  head += '<span class="ch-no">第 '+ch.no+' 章</span>';
  head += '<h2>'+esc(shortTitle(ch.title))+'</h2>';
  head += '<div class="ch-st"><span><b>'+(ch.topics||[]).length+'</b> 题型</span>'+
          '<span><b>'+ni+'</b> 例题</span></div>';
  head += '</div>';

  var body;
  if(!shown){
    body = '<div class="empty">本章没有匹配的例题</div>';
  }else{
    body = '<div class="stats"><span>显示 '+shown+' / '+ni+' 道例题'+
      (KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>' + gh;
  }
  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 例";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = shortTitle(ch.title) + "。" + (ch.topics||[]).length +
    " 类题型，每题按「题目 → 思路 → 详解 → 易错点」展开。";

  renderChapBar(ch.no);
  renderChapPager(ch.no);

  if($fTopic){
    var opt = '<option value="all">全部题型</option>';
    (ch.topics||[]).forEach(function(t, ti){
      opt += '<option value="'+ti+'">'+
        esc(String(t.t).replace(/^题型[一二三四五六七八九十]+[：:]\s*/,""))+
        '（'+(t.examples||[]).length+'）</option>';
    });
    $fTopic.innerHTML = opt;
    $fTopic.value = TOPIC;
  }
}

/* ---------- 事件 ---------- */
if($main){
  $main.addEventListener("click", function(e){
    var btn = e.target.closest("[data-show]");
    if(btn){
      OPEN[btn.getAttribute("data-show")] = 1;
      renderChapter();
      var k = btn.getAttribute("data-show");
      setTimeout(function(){
        var el = document.getElementById(k);
        if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
      }, 50);
      return;
    }
    var eq = e.target.closest(".eq");
    if(!eq) return;
    var card = eq.closest(".excard");
    if(!card) return;
    var kk = card.id;
    if(OPEN[kk]) delete OPEN[kk]; else OPEN[kk] = 1;
    renderChapter();
  });
}

if($q){
  var timer = null;
  $q.addEventListener("input", function(){
    var v = this.value;
    clearTimeout(timer);
    timer = setTimeout(function(){
      KEY = String(v||"").trim().toLowerCase();
      renderChapter();
    }, 170);
  });
}

if($fTopic){
  $fTopic.addEventListener("change", function(){
    TOPIC = this.value || "all";
    renderChapter();
  });
}

var $exp = document.getElementById("expandAll");
if($exp){
  $exp.addEventListener("click", function(){
    var ch = CHS[0];
    if(!ch) return;
    (ch.topics||[]).forEach(function(t, ti){
      (t.examples||[]).forEach(function(ex, ei){ OPEN["x"+ti+"_"+ei] = 1; });
    });
    renderChapter();
  });
}
var $col = document.getElementById("collapseAll");
if($col){
  $col.addEventListener("click", function(){
    OPEN = {};
    renderChapter();
  });
}

/* ---------- 启动 ---------- */
if(FIXED === null){
  renderIndex();
  renderChapBar(null);
}else{
  renderChapter();
}
})();
