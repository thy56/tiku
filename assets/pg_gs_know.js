
(function(){
"use strict";

var NAV = window.GS_NAV || {stats:{}};
var K = window.GS_KNOW || {chapters:[]};
var ALL = K.chapters || [];
var CH = window.GS_CH;                              /* null = 目录页 */
var CHS = CH === null ? [] : ALL.filter(function(c){ return c.no === CH; });

/* 分组参数 ?g=<序号>：null = 本章分组目录，有值 = 单组页 */
var G = (function(){
  var v = window.GS_QS ? window.GS_QS("g") : null;
  if(v === null) return null;
  var n = parseInt(v, 10);
  return isNaN(n) ? null : n;
})();

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
  if((it.formulas||[]).some(has)) return true;
  if((it.points||[]).some(has)) return true;
  return false;
}

function countItems(ch){
  if(ch.ni != null && !(ch.groups && ch.groups.length)) return ch.ni;   /* 轻量索引 */
  var n = 0;
  (ch.groups||[]).forEach(function(g){ n += (g.items||[]).length; });
  return n;
}
function countFormulas(ch){
  if(ch.nf != null && !(ch.groups && ch.groups.length)) return ch.nf;
  var n = 0;
  (ch.groups||[]).forEach(function(g){
    (g.items||[]).forEach(function(it){ n += (it.formulas||[]).length; });
  });
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
    var nf = countFormulas(c);
    var npt = countPoints(c);
    return {
      no: c.no,
      title: c.title,
      desc: c.desc,
      stats: [
        { t: " 知识点", v: ni },
        { t: " 公式", v: nf },
        { t: " 考点", v: npt }
      ]
    };
  });

  window.GS_renderChapIndex("chapidx", items, "know.html");

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.chapters||ALL.length) + " 章 · " + (S.items||0) + " 点";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + (S.chapters||ALL.length) + " 章 " + (S.items||0) +
    " 个知识点、 " + (S.formulas||0) + " 条公式。按章分开看，一章一页。";
}

/* ============ 本章分组目录（?ch=N，无 g）============ */
function renderGroupIndex(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
    return;
  }

  document.getElementById("bar").style.display = "none";

  var ni = countItems(ch);

  /* chapnav 的 hrefOf 只拼 ?ch=，分组页需 ?ch=N&g=M，自己拼 */
  var gidx = '<div class="chapidx">';
  gidx += ch.groups.map(function(g, gi){
    var h = '<a class="ci-card" href="know.html?ch=' + ch.no + '&g=' + gi + '">';
    h += '<div class="ci-no">第 ' + (gi + 1) + ' 组</div>';
    h += '<div class="ci-bd"><h3>' + esc(g.title) + '</h3>';
    if(g.desc) h += '<p>' + esc(g.desc) + '</p>';
    h += '<div class="ci-st"><span><b>' + g.items.length + '</b> 个知识点</span></div>';
    h += '</div><div class="ci-go">→</div></a>';
    return h;
  }).join('');
  gidx += '</div>';

  var host = document.getElementById("chapidx");
  if(host) host.innerHTML = gidx;

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  if(ch.desc) head += '<p>' + esc(ch.desc) + '</p>';
  head += '<div class="ch-st"><span><b>'+ni+'</b> 知识点</span>';
  head += '<span><b>'+ch.groups.length+'</b> 分组</span></div>';
  head += '</div>';

  $main.innerHTML = head +
    '<div class="stats"><span>本章分 ' + ch.groups.length +
    ' 组，点上面任意一组进入（每组单独一页）</span></div>';

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 点 / " + ch.groups.length + " 组";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "，共 " + ni +
    " 个知识点，分 " + ch.groups.length + " 组。点分组进入，一组一页。";

  window.GS_renderChapBar("chapbar", "know.html", { count: function(c){ return c.items; } });
  window.GS_renderChapPager("chpager", "know.html");
}

/* ============ 单组页（?ch=N&g=M）============ */
function renderGroup(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
    return;
  }
  var gi = G;
  if(gi === null || gi < 0 || gi >= ch.groups.length){ renderGroupIndex(); return; }

  document.getElementById("bar").style.display = "";

  var g = ch.groups[gi];
  var items = g.items.filter(matchItem);
  var ni = countItems(ch);
  var gh = "";

  items.forEach(function(it, ii){
    var sid = "k"+gi+"_"+ii;
    var isOpen = OPEN[sid] || (KEY && KEY.length > 0);

    gh += '<div class="kcard'+(isOpen?' open':'')+'" id="'+sid+'">';
    gh += '<div class="kh" data-t="'+sid+'"><h4>'+hl(it.t)+'</h4><span class="ar">▶</span></div>';
    gh += '<div class="kb">';
    if(it.body) gh += '<div class="txt">'+nl(it.body)+'</div>';
    (it.formulas||[]).forEach(function(f){
      gh += '<div class="fml">'+hl(f)+'</div>';
    });
    if(it.points && it.points.length){
      gh += '<div class="pt"><span class="ptl">考点与易错</span><ul>';
      it.points.forEach(function(p){ gh += '<li>'+hl(p)+'</li>'; });
      gh += '</ul></div>';
    }
    gh += '</div></div>';
  });

  var nf = 0, npt = 0;
  g.items.forEach(function(it){
    nf += (it.formulas||[]).length;
    npt += (it.points||[]).length;
  });

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章 · 第 ' + (gi + 1) + ' 组</span>';
  head += '<h2>' + esc(g.title) + '</h2>';
  if(g.desc) head += '<p>' + esc(g.desc) + '</p>';
  head += '<div class="ch-st"><span><b>'+g.items.length+'</b> 知识点</span>';
  head += '<span><b>'+nf+'</b> 公式</span>';
  head += '<span><b>'+npt+'</b> 考点</span>';
  head += '<span><b>'+(gi+1)+'/'+ch.groups.length+'</b> 组</span></div>';
  head += '</div>';

  var body;
  if(!items.length){
    body = '<div class="empty">本组没有匹配的知识点</div>';
  }else{
    body = '<div class="stats"><span>本组 ' + g.items.length + ' 个知识点' +
      (KEY ? '，匹配 ' + items.length + ' 个' : '') +
      '<a href="know.html?ch=' + ch.no + '" style="margin-left:12px">← 本章分组目录</a></span></div>' + gh;
  }

  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · 第 " + (gi+1) + " 组 · " + g.items.length + " 点";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = g.title + "，本组 " + g.items.length +
    " 个知识点。点标题展开，含定义、公式与考点提示。";

  window.GS_renderChapBar("chapbar", "know.html", { count: function(c){ return c.items; } });

  /* 组内上下翻（自己拼 ?ch=N&g=M） */
  var units = ch.groups.map(function(gg, i){
    return { key: i, label: gg.title, count: gg.items.length };
  });
  var p = '<div class="chpager">';
  if(gi > 0){
    p += '<a class="cp-a prev" href="know.html?ch=' + ch.no + '&g=' + (gi - 1) + '">'
       + '<span>← 上一组</span><b>' + esc(units[gi - 1].label) + '</b></a>';
  }else{
    p += '<span class="cp-a dis"><span>← 上一组</span><b>已是第一组</b></span>';
  }
  p += '<a class="cp-a mid" href="know.html?ch=' + ch.no + '">本章分组目录</a>';
  if(gi < units.length - 1){
    p += '<a class="cp-a next" href="know.html?ch=' + ch.no + '&g=' + (gi + 1) + '">'
       + '<span>下一组 →</span><b>' + esc(units[gi + 1].label) + '</b></a>';
  }else{
    p += '<span class="cp-a dis"><span>下一组 →</span><b>已是最后一组</b></span>';
  }
  p += '</div>';
  var ph = document.getElementById("chpager");
  if(ph) ph.innerHTML = p;
}

/* ============ 旧单章页（保留兼容）============ */
function renderChapter(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
    return;
  }

  document.getElementById("bar").style.display = "";

  var shown = 0;
  var gh = "";

  ch.groups.forEach(function(g, gi){
    if(GRPF !== "all" && GRPF !== String(gi)) return;
    var items = g.items.filter(matchItem);
    if(!items.length) return;
    shown += items.length;

    gh += '<div class="sec">'+esc(g.title)+'<span class="cnt">'+items.length+' 个知识点</span></div>';
    if(g.desc) gh += '<div style="font-size:13px;color:#6b7c8d;line-height:1.85;margin:-2px 0 10px 2px">'+hl(g.desc)+'</div>';

    items.forEach(function(it, ii){
      var sid = "k"+gi+"_"+ii;
      var isOpen = OPEN[sid] || (KEY && KEY.length > 0);

      gh += '<div class="kcard'+(isOpen?' open':'')+'" id="'+sid+'">';
      gh += '<div class="kh" data-t="'+sid+'"><h4>'+hl(it.t)+'</h4><span class="ar">▶</span></div>';
      gh += '<div class="kb">';
      if(it.body) gh += '<div class="txt">'+nl(it.body)+'</div>';
      (it.formulas||[]).forEach(function(f){
        gh += '<div class="fml">'+hl(f)+'</div>';
      });
      if(it.points && it.points.length){
        gh += '<div class="pt"><span class="ptl">考点与易错</span><ul>';
        it.points.forEach(function(p){ gh += '<li>'+hl(p)+'</li>'; });
        gh += '</ul></div>';
      }
      gh += '</div></div>';
    });
  });

  /* 章节头 */
  var ni = countItems(ch);
  var nf = 0, npt = 0;
  ch.groups.forEach(function(g){
    g.items.forEach(function(it){
      nf += (it.formulas||[]).length;
      npt += (it.points||[]).length;
    });
  });

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  if(ch.desc) head += '<p>' + esc(ch.desc) + '</p>';
  head += '<div class="ch-st"><span><b>'+ni+'</b> 知识点</span><span><b>'+nf+'</b> 公式</span><span><b>'+npt+'</b> 考点</span><span><b>'+ch.groups.length+'</b> 分组</span></div>';
  head += '</div>';

  var body = "";
  if(!shown){
    body = '<div class="empty">本章没有匹配的知识点</div>';
  }else{
    var all = ni;
    body = '<div class="stats"><span>显示 '+shown+' / '+all+' 个知识点'+(KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>' + gh;
  }

  $main.innerHTML = head + body;

  /* 标题栏 */
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 个知识点";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "。按「概念 → 性质 → 计算 → 应用」展开，每条含定义、公式与考点提示。";

  /* 章节条 + 翻页 */
  window.GS_renderChapBar("chapbar", "know.html", { count: function(c){ return c.items; } });
  window.GS_renderChapPager("chpager", "know.html");

  /* 分组下拉 */
  var sel = document.getElementById("fGrp");
  if(sel){
    sel.innerHTML = '<option value="all">全部分组</option>';
    ch.groups.forEach(function(g, gi){
      var o = document.createElement("option");
      o.value = gi;
      o.textContent = g.title + "（" + g.items.length + "）";
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
  renderGroup();
});

var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    KEY = this.value.trim().toLowerCase();
    renderGroup();
  }.bind(this), 170);
});

document.getElementById("fGrp").addEventListener("change", function(){
  GRPF = this.value || "all";
  renderGroup();
});
document.getElementById("expandAll").addEventListener("click", function(){
  var ch = CHS[0];
  if(!ch) return;
  var gi = (G === null ? 0 : G);
  var g = ch.groups[gi];
  if(!g) return;
  g.items.forEach(function(it, ii){ OPEN["k"+gi+"_"+ii] = 1; });
  renderGroup();
});
document.getElementById("collapseAll").addEventListener("click", function(){
  OPEN = {};
  renderGroup();
});

/* ============ 启动 ============ */
if(CH === null){
  renderIndex();
  window.GS_renderChapBar("chapbar", "know.html", { withAll: false, count: function(c){ return c.items; } });
}else if(G !== null){
  renderGroup();                 /* ?g=M → 单组页 */
}else if(window.GS_STATIC_MODE){
  renderChapter();               /* 静态章页（kn-ch1.html）→ 整章直接展开 */
}else{
  renderGroupIndex();            /* ?ch=N → 分组目录 */
}
})();
