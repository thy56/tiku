
(function(){
"use strict";

var NAV = window.GS_NAV || {stats:{}};
var F = window.GS_FORMULAS || {chapters:[]};
var ALL = F.chapters || [];
var CH = window.GS_CH;
var CHS = CH === null ? [] : ALL.filter(function(c){ return c.no === CH; });

/* 分组参数 ?g=<序号>：null = 本章分组目录，有值 = 单组页 */
var G = (function(){
  var v = window.GS_QS ? window.GS_QS("g") : null;
  if(v === null) return null;
  var n = parseInt(v, 10);
  return isNaN(n) ? null : n;
})();

var KEY = "";
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

function countOf(ch){
  var n = 0;
  ch.groups.forEach(function(g){ n += g.items.length; });
  return n;
}
function matchItem(it){
  if(!KEY) return true;
  return has(it.name) || has(it.tex) || has(it.note);
}

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = ALL.map(function(c){
    return {
      no: c.no,
      title: c.title,
      desc: "共 " + countOf(c) + " 条公式，分 " + c.groups.length + " 组",
      stats: [
        { t: " 条公式", v: countOf(c) },
        { t: " 组", v: c.groups.length }
      ]
    };
  });

  window.GS_renderChapIndex("chapidx", items, "formulas.html");

  var total = F.total || 0;
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = total + " 条";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + ALL.length + " 章 " + total + " 条公式。按章分开看，一章一页。";
}

/* ============ 本章分组目录（?ch=N，无 g）============ */
function renderGroupIndex(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
    return;
  }

  document.getElementById("bar").style.display = "none";

  var ni = countOf(ch);
  var items = ch.groups.map(function(g, gi){
    return {
      key: gi,
      badge: "第 " + (gi + 1) + " 组",
      title: g.title,
      desc: "本组 " + g.items.length + " 条公式",
      stats: [{ t: " 条", v: g.items.length }]
    };
  });

  /* chapnav 的 hrefOf 只拼 ?ch=，分组页需 ?ch=N&g=M，所以自己拼 */
  var gidx = '<div class="chapidx">';
  gidx += items.map(function(c){
    var h = '<a class="ci-card" href="formulas.html?ch=' + ch.no + '&g=' + c.key + '">';
    h += '<div class="ci-no">' + esc(c.badge) + '</div>';
    h += '<div class="ci-bd"><h3>' + esc(c.title) + '</h3>';
    h += '<p>' + esc(c.desc) + '</p>';
    h += '<div class="ci-st">';
    c.stats.forEach(function(s){ h += '<span><b>' + s.v + '</b>' + esc(s.t) + '</span>'; });
    h += '</div></div><div class="ci-go">→</div></a>';
    return h;
  }).join('');
  gidx += '</div>';

  var host = document.getElementById("chapidx");
  if(host) host.innerHTML = gidx;

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  head += '<div class="ch-st"><span><b>'+ni+'</b> 条公式</span><span><b>'+ch.groups.length+'</b> 分组</span></div>';
  head += '</div>';

  $main.innerHTML = head +
    '<div class="stats"><span>本章分 ' + ch.groups.length +
    ' 组，点上面任意一组进入（每组分页显示）</span></div>';

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 条 / " + ch.groups.length + " 组";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "，共 " + ni +
    " 条公式，分 " + ch.groups.length + " 组。点分组进入，一组一页。";

  window.GS_renderChapBar("chapbar", "formulas.html",
    { count: function(c){ return c.formulas; } });
  window.GS_renderChapPager("chpager", "formulas.html");
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
  var ni = countOf(ch);

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章 · 第 ' + (gi + 1) + ' 组</span>';
  head += '<h2>' + esc(g.title) + '</h2>';
  head += '<div class="ch-st"><span><b>'+g.items.length+'</b> 条</span>';
  head += '<span><b>'+(gi+1)+'/'+ch.groups.length+'</b> 组</span></div>';
  head += '</div>';

  var body = '<div class="stats"><span>本组 ' + g.items.length + ' 条' +
    (KEY ? '，匹配 ' + items.length + ' 条' : '') +
    '<a href="formulas.html?ch=' + ch.no + '" style="margin-left:12px">← 本章分组目录</a></span></div>';

  if(!items.length){
    body += '<div class="empty">本组没有匹配「'+esc(KEY)+'」的公式</div>';
  }else{
    items.forEach(function(it, ii){
      var idx = gi + "_" + ii;
      body += '<div class="frow" id="f'+idx+'">';
      body += '<div class="fhead"><span class="fname">'+hl(it.name)+'</span>';
      body += '<button class="fcp" data-cp="'+idx+'" title="复制公式">复制</button></div>';
      body += '<div class="ftex" data-tex="'+esc(it.tex)+'">$$'+esc(it.tex)+'$$</div>';
      if(it.note) body += '<div class="fnote">'+hl(it.note)+'</div>';
      body += '</div>';
    });
  }

  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · 第 " + (gi+1) + " 组 · " + g.items.length + " 条";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = g.title + "，本组 " + g.items.length + " 条公式。";

  /* 章节条（保持只跳「章」） */
  window.GS_renderChapBar("chapbar", "formulas.html",
    { count: function(c){ return c.formulas; } });

  /* 组内上下翻（自己拼 ?ch=N&g=M） */
  var units = ch.groups.map(function(gg, i){
    return { key: i, label: gg.title, count: gg.items.length };
  });
  var p = '<div class="chpager">';
  if(gi > 0){
    p += '<a class="cp-a prev" href="formulas.html?ch=' + ch.no + '&g=' + (gi - 1) + '">'
       + '<span>← 上一组</span><b>' + esc(units[gi - 1].label) + '</b></a>';
  }else{
    p += '<span class="cp-a dis"><span>← 上一组</span><b>已是第一组</b></span>';
  }
  p += '<a class="cp-a mid" href="formulas.html?ch=' + ch.no + '">本章分组目录</a>';
  if(gi < units.length - 1){
    p += '<a class="cp-a next" href="formulas.html?ch=' + ch.no + '&g=' + (gi + 1) + '">'
       + '<span>下一组 →</span><b>' + esc(units[gi + 1].label) + '</b></a>';
  }else{
    p += '<span class="cp-a dis"><span>下一组 →</span><b>已是最后一组</b></span>';
  }
  p += '</div>';
  var ph = document.getElementById("chpager");
  if(ph) ph.innerHTML = p;
}

/* ============ 整章页（静态 fm-chN.html）—— 所有组一次展开 ============ */
function renderFullChapter(){
  var ch = CHS[0];
  if(!ch){
    $main.innerHTML = '<div class="empty">没有第 ' + CH + ' 章</div>';
    return;
  }

  document.getElementById("bar").style.display = "";

  var ni = countOf(ch);
  var shown = 0;
  var body = "";

  ch.groups.forEach(function(g, gi){
    var items = g.items.filter(matchItem);
    if(!items.length) return;
    shown += items.length;

    body += '<div class="sec">' + esc(g.title) +
            '<span class="cnt">' + items.length + ' 条</span></div>';

    items.forEach(function(it, ii){
      var idx = gi + "_" + ii;
      body += '<div class="frow" id="f'+idx+'">';
      body += '<div class="fhead"><span class="fname">'+hl(it.name)+'</span>';
      body += '<button class="fcp" data-cp="'+idx+'" title="复制公式">复制</button></div>';
      body += '<div class="ftex" data-tex="'+esc(it.tex)+'">$$'+esc(it.tex)+'$$</div>';
      if(it.note) body += '<div class="fnote">'+hl(it.note)+'</div>';
      body += '</div>';
    });
  });

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + ch.no + ' 章</span>';
  head += '<h2>' + esc(window.GS_SHORT(ch.title)) + '</h2>';
  head += '<div class="ch-st"><span><b>'+ni+'</b> 条公式</span>';
  head += '<span><b>'+ch.groups.length+'</b> 分组</span></div>';
  head += '</div>';

  if(!shown){
    $main.innerHTML = head + '<div class="empty">本章没有匹配「'+esc(KEY)+'」的公式</div>';
  }else{
    $main.innerHTML = head +
      '<div class="stats"><span>本页显示 ' + shown + ' / ' + ni + ' 条' +
      (KEY ? '（搜索：'+esc(KEY)+'）' : '') + '</span></div>' + body;
  }

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + ch.no + " 章 · " + ni + " 条";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = window.GS_SHORT(ch.title) + "，本章 " + ni + " 条公式。";

  window.GS_renderChapBar("chapbar", "formulas.html",
    { count: function(c){ return c.formulas; } });
  window.GS_renderChapPager("chpager", "formulas.html");
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target.closest("[data-cp]");
  if(!t) return;
  var id = t.getAttribute("data-cp");
  var el = document.getElementById("f" + id);
  if(!el) return;
  var box = el.querySelector("[data-tex]");
  var tex = box ? box.getAttribute("data-tex") : "";
  var done = function(ok){
    t.textContent = ok ? "已复制" : "复制失败";
    setTimeout(function(){ t.textContent = "复制"; }, 1200);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(tex).then(function(){ done(true); },
                                           function(){ done(false); });
  }else{
    var ta = document.createElement("textarea");
    ta.value = tex;
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch(err) { ok = false; }
    document.body.removeChild(ta);
    done(ok);
  }
});

var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    KEY = this.value.trim().toLowerCase();
    if(window.GS_STATIC_MODE && G === null) renderFullChapter(); else renderGroup();
  }.bind(this), 170);
});

document.getElementById("btnCopyAll").addEventListener("click", function(){
  var ch = CHS[0];
  if(!ch) return;
  var lines = [];
  var scope = (G !== null && G >= 0 && G < ch.groups.length)
    ? [ch.groups[G]] : ch.groups;
  scope.forEach(function(g){
    g.items.forEach(function(it){
      if(!matchItem(it)) return;
      lines.push(it.name + "\t" + it.tex + (it.note ? "\t" + it.note : ""));
    });
  });
  var btn = this;
  var base = (G !== null) ? "复制本组全部" : "复制本章全部";
  var ok = function(good){
    btn.textContent = good ? "已复制 " + lines.length + " 条" : "复制失败";
    setTimeout(function(){ btn.textContent = base; }, 1600);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(lines.join("\n")).then(function(){ ok(true); },
                                                         function(){ ok(false); });
  }
});

/* ============ 启动 ============ */
if(CH === null){
  renderIndex();
  window.GS_renderChapBar("chapbar", "formulas.html",
    { withAll: false, count: function(c){ return c.formulas; } });
}else if(G !== null){
  renderGroup();                 /* ?g=M → 单组页 */
}else if(window.GS_STATIC_MODE){
  renderFullChapter();           /* 静态章页（fm-ch1.html）→ 整章直接展开 */
}else{
  renderGroupIndex();            /* ?ch=N → 分组目录 */
}
})();
