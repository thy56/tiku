(function(){
"use strict";

/* 数据来源（拆分后）：
     window.YUWEN_DATA.pieces  = 轻量索引（id/title/author/era/source/era_group/chars/paras/words）
     window.YW_PIECE           = 当前单篇全文（仅静态章页加载）
   兼容：若仍在用整份 data.js（未拆分场景），pieces 为全文数组，逻辑同样成立。 */
var NAV = window.YUWEN_NAV || {pieces:[],era_groups:[]};
var KN = window.YUWEN_DATA || {pieces:[],sections:[],zhenti:[],meta:{}};
var IDX = KN.pieces || [];
var FULL = window.YW_PIECE || null;
var KEYRAW = window.GS_KEY;

function has(obj, k){ return obj && typeof obj !== "undefined" && obj[k] != null; }

/* 校验：ch 必须是合法篇目 id */
var CUR = null;
if (KEYRAW !== null) {
  var hit = IDX.filter(function(p){ return String(p.id) === String(KEYRAW); })[0];
  if (hit) CUR = String(hit.id);
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
function nl(s){ return hl(s).replace(/\n/g,'<br>'); }

/* 索引项统计：兼容全文对象与轻量索引 */
function statChars(p){ return has(p,'chars') ? p.chars : (p.original_text||'').length; }
function statParas(p){ return has(p,'paras') ? p.paras : (p.paragraph_translation||[]).length; }
function statWords(p){ return has(p,'words') ? p.words : (p.vocabulary||[]).length; }
function statSents(p){ return has(p,'sents') ? p.sents : (p.key_sentences||[]).length; }

function matchPiece(p){
  if(!KEY) return true;
  var pool = [p.title,p.author,p.source,p.era,p.genre,p.author_info,p.theme,p.artistic_features,
              p.original_text,p.full_translation];
  (p.literary_knowledge||[]).forEach(function(k){pool.push(k.topic);pool.push(k.content);});
  (p.vocabulary||[]).forEach(function(v){pool.push(v.word);pool.push(v.type);pool.push(v.meaning);pool.push(v.example);pool.push(v.note);});
  (p.key_sentences||[]).forEach(function(s){pool.push(s.original);pool.push(s.translation);pool.push(s.analysis);});
  (p.paragraph_translation||[]).forEach(function(x){pool.push(x.orig);pool.push(x.trans);});
  return pool.some(function(x){ return String(x==null?"":x).toLowerCase().indexOf(KEY) !== -1; });
}

/* 统一链接：静态模式走真实文件名，否则回落 ?ch= */
function hrefOf(key){
  if (window.GS_HREF) return window.GS_HREF('wen.html', key);
  return 'wen.html?ch=' + encodeURIComponent(String(key));
}
function homeOf(){
  if (window.GS_HOME) return window.GS_HOME('wen.html');
  return 'wen.html';
}

/* ============ 单篇内容 ============ */
function pieceBody(p){
  var c = '';

  if(p.exam_range) c += '<div class="sec">考查范围</div><div class="txt">'+hl(p.exam_range)+'</div>';
  if(p.author_info) c += '<div class="sec">作者简介</div><div class="txt">'+hl(p.author_info)+'</div>';

  if(p.full_translation){
    c += '<div class="sec">全文翻译</div><div class="txt">'+nl(p.full_translation)+'</div>';
  }
  if(p.original_text){
    c += '<div class="sec">原文</div><div class="orig">'+nl(p.original_text)+'</div>';
  }

  var ptArr = p.paragraph_translation||[];
  if(ptArr.length){
    c += '<div class="sec">逐段对照（原文 / 译文）<span class="cnt">'+ptArr.length+' 段</span></div>';
    c += '<table class="pt"><thead><tr><th style="width:46%">原文</th><th>译文</th></tr></thead><tbody>';
    ptArr.forEach(function(x){
      c += '<tr><td>'+hl(x.orig)+'</td><td>'+hl(x.trans)+'</td></tr>';
    });
    c += '</tbody></table>';
  }

  var kk = p.literary_knowledge||[];
  if(kk.length){
    c += '<div class="sec">文学常识</div>';
    kk.forEach(function(k){ c += '<div class="txt" style="margin-bottom:5px"><b>['+esc(k.topic)+']</b> '+hl(k.content)+'</div>'; });
  }

  var vc = p.vocabulary||[];
  if(vc.length){
    c += '<div class="sec">重点字词（'+vc.length+'）</div>';
    c += '<table class="vt"><thead><tr><th>词</th><th>类型</th><th>释义</th><th>例句</th></tr></thead><tbody>';
    vc.forEach(function(v){
      c += '<tr><td class="w">'+hl(v.word)+'</td><td class="t">'+hl(v.type)+'</td><td>'+hl(v.meaning)+'</td><td>'+hl(v.example)+'</td></tr>';
    });
    c += '</tbody></table>';
  }

  var ss = p.key_sentences||[];
  if(ss.length){
    c += '<div class="sec">重点句翻译（'+ss.length+'）</div>';
    ss.forEach(function(s){
      c += '<div class="sent"><div class="so">'+hl(s.original)+'</div>';
      c += '<div class="st">→ '+hl(s.translation)+'</div>';
      if(s.analysis) c += '<div class="sa">'+hl(s.analysis)+'</div>';
      c += '</div>';
    });
  }

  if(p.theme) c += '<div class="sec">主旨</div><div class="txt">'+hl(p.theme)+'</div>';
  if(p.artistic_features) c += '<div class="sec">艺术特色</div><div class="txt">'+hl(p.artistic_features)+'</div>';
  return c;
}

/* ============ 目录页（按时代分组） ============ */
function renderIndex(){
  var bar = document.getElementById("bar");
  if(bar) bar.style.display = "none";

  var ERA_ORDER = (KN.meta && KN.meta.era_groups) || NAV.era_groups || [];
  var groups = [];
  ERA_ORDER.forEach(function(eg){
    var gl = IDX.filter(function(p){ return p.era_group === eg; });
    if(gl.length) groups.push({ eg: eg, list: gl });
  });
  var rest = IDX.filter(function(p){ return ERA_ORDER.indexOf(p.era_group) === -1; });
  if(rest.length) groups.push({ eg: "其他", list: rest });

  var h = '<div class="chapidx">';
  groups.forEach(function(g){
    h += '<div style="grid-column:1/-1;margin:14px 0 -2px"><div class="home-sec" style="margin:0">'
       + esc(g.eg) + '<span style="font-weight:400;font-size:12.5px;color:#5d7080;margin-left:8px">'
       + g.list.length + ' 篇</span></div></div>';
    g.list.forEach(function(p){
      h += '<a class="ci-card" href="' + hrefOf(p.id) + '">';
      h += '<div class="ci-no">' + esc(p.id) + '</div>';
      h += '<div class="ci-bd">';
      h += '<h3>' + esc(p.title) + '</h3>';
      h += '<p>' + esc(p.author) + ' · ' + esc(p.era) + ' · ' + esc(p.source) + '</p>';
      h += '<div class="ci-st">';
      h += '<span><b>' + statChars(p) + '</b> 字原文</span>';
      h += '<span><b>' + statParas(p) + '</b> 段对照</span>';
      h += '<span><b>' + statWords(p) + '</b> 重点词</span>';
      h += '</div></div>';
      h += '<div class="ci-go">→</div>';
      h += '</a>';
    });
  });
  h += '</div>';

  var host = document.getElementById("chapidx");
  if(host) host.innerHTML = h;

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.pieces || IDX.length) + " 篇";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + IDX.length + " 篇考纲篇目。一篇一页，点进去看原文、译文、逐段对照、重点字词与考点。";
}

/* ============ 单篇页 ============ */
function renderPiece(){
  var p = FULL;
  if(!p){
    /* 兼容：整份数据仍在内存里时从 IDX 取全文 */
    p = IDX.filter(function(x){ return String(x.id) === CUR && x.original_text != null; })[0] || null;
  }
  if(!p){
    /* 只加载了轻量索引却直接带 ?ch= 打开 → 跳到对应的独立页 */
    var target = hrefOf(CUR);
    var here = (location.pathname.split('/').pop() || '');
    if(target && target !== here && target.indexOf('.html') > 0){
      location.replace(target);
      return;
    }
    renderIndex();
    return;
  }

  var bar = document.getElementById("bar");
  if(bar) bar.style.display = "";

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + esc(p.id) + ' 篇</span>';
  head += '<h2>' + hl(p.title) + '</h2>';
  head += '<p>' + hl(p.author) + ' · ' + hl(p.era) + ' · ' + hl(p.source) + ' · ' + hl(p.genre) + '</p>';
  head += '<div class="ch-st">';
  head += '<span><b>' + statChars(p) + '</b> 字原文</span>';
  head += '<span><b>' + statParas(p) + '</b> 段对照</span>';
  head += '<span><b>' + statWords(p) + '</b> 重点词</span>';
  head += '<span><b>' + statSents(p) + '</b> 重点句</span>';
  head += '</div></div>';

  var ok = matchPiece(p);
  var body = ok
    ? '<div class="card open" style="margin-top:0"><div class="cb" style="display:block">' + pieceBody(p) + '</div></div>'
    : '<div class="empty">本篇没有匹配「' + esc(KEY) + '」的内容</div>';

  $main.innerHTML = head + body;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + p.id + " 篇 · " + p.title;
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = p.title + "（" + p.author + ' · ' + p.era + '）。' + (p.exam_range || '');

  /* 篇章导航条 + 翻页 */
  var units = IDX.map(function(x){
    return { key: x.id, no: x.id, label: x.title };
  });
  if(window.GS_renderUnitBar){
    window.GS_renderUnitBar("chapbar", "wen.html", units, { label: "篇目" });
  }
  if(window.GS_renderUnitPager){
    window.GS_renderUnitPager("chpager", "wen.html", units);
  }
}

/* ============ 事件 ============ */
var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR) renderPiece(); else renderIndex();
    }, 170);
  });
}

var ea = document.getElementById("expandAll");
if(ea) ea.addEventListener("click", function(){ /* 单篇页默认全展开 */ });
var ca = document.getElementById("collapseAll");
if(ca) ca.addEventListener("click", function(){ /* 单篇整体为一张卡片 */ });

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  var units0 = IDX.map(function(x){ return { key: x.id, no: x.id, label: x.title }; });
  if(window.GS_renderUnitBar){
    window.GS_renderUnitBar("chapbar", "wen.html", units0, { label: "篇目", withAll: false });
  }
}else{
  renderPiece();
}
})();
