
(function(){
"use strict";

var NAV = window.YW_NAV || {vcats:[]};
var V = window.YW_VOCAB || {categories:[], phrases:[], confusables:[]};
var CATS = V.categories || [];
var PHRASES = V.phrases || [];
var CONFUS = V.confusables || [];

/* 单元表：c0..cN + phrase + confus */
var UNITS = CATS.map(function(c, i){
  return { key: "c"+i, no: null, label: c.title, kind: "cat", idx: i, count: c.items.length };
});
UNITS.push({ key: "phrase", no: null, label: "常考词组", kind: "phrase", count: PHRASES.length });
UNITS.push({ key: "confus", no: null, label: "形近辨析", kind: "confus", count: CONFUS.length });

var KEYRAW = window.GS_KEY;
var CUR = null;
if (KEYRAW !== null) {
  var hit = UNITS.filter(function(u){ return u.key === KEYRAW; })[0];
  if (hit) CUR = hit.key;
}

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

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var items = CATS.map(function(c, i){
    return {
      key: "c"+i,
      badge: c.icon || "•",
      title: c.title,
      desc: c.desc,
      stats: [{ t: " 词", v: c.items.length }]
    };
  });
  items.push({
    key: "phrase",
    badge: "词组",
    title: "常考词组",
    desc: "动词短语、介词短语、固定搭配，配例句与易错提示。",
    stats: [{ t: " 条", v: PHRASES.length }]
  });
  items.push({
    key: "confus",
    badge: "辨析",
    title: "形近词辨析",
    desc: "长得像、意思不同的词成组对比，一次分清。",
    stats: [{ t: " 组", v: CONFUS.length }]
  });

  window.GS_renderUnitIndex("chapidx", items, "vocab.html");

  var S = NAV.stats || {};
  var tot = 0;
  CATS.forEach(function(c){ tot += c.items.length; });
  document.getElementById("hBadge").textContent = (S.vocab || tot) + " 词 · " +
    (S.phrases || PHRASES.length) + " 词组";
  document.getElementById("hSub").textContent =
    "共 " + tot + " 个核心词、 " + PHRASES.length + " 条词组、 " + CONFUS.length +
    " 组形近辨析。一类一页，点进去看该类的全部条目。";
}

/* ============ 单类页 ============ */
function renderUnit(){
  var u = UNITS.filter(function(x){ return x.key === CUR; })[0];
  if(!u){ renderIndex(); return; }
  document.getElementById("bar").style.display = "";

  var head = '<div class="chaphero">';
  head += '<span class="ch-no">' + (u.kind === "cat" ? "词汇" : (u.kind === "phrase" ? "词组" : "辨析")) + '</span>';
  head += '<h2>' + esc(u.label) + '</h2>';
  if(u.kind === "cat" && CATS[u.idx] && CATS[u.idx].desc) head += '<p>' + esc(CATS[u.idx].desc) + '</p>';
  head += '<div class="ch-st"><span><b>' + u.count + '</b> ' +
          (u.kind === "cat" ? "词" : (u.kind === "phrase" ? "条" : "组")) + '</span></div>';
  head += '</div>';

  var h = head;
  var body = "";

  if(u.kind === "cat"){
    body = renderVocab(CATS[u.idx]);
  }else if(u.kind === "phrase"){
    body = renderPhrase();
  }else{
    body = renderConfus();
  }
  $main.innerHTML = h + body;

  document.getElementById("hBadge").textContent = u.label + " · " + u.count +
    (u.kind === "cat" ? " 词" : (u.kind === "phrase" ? " 条" : " 组"));
  var desc = (u.kind === "cat" && CATS[u.idx] && CATS[u.idx].desc) ? CATS[u.idx].desc + "。" : "";
  document.getElementById("hSub").textContent = desc + "共 " + u.count +
    (u.kind === "cat" ? " 个词。" : (u.kind === "phrase" ? " 条词组。" : " 组辨析。"));

  window.GS_renderUnitBar("chapbar", "vocab.html", UNITS, { label: "类别" });
  window.GS_renderUnitPager("chpager", "vocab.html", UNITS);
}

function renderVocab(cat){
  if(!cat) return '<div class="empty">类别不存在</div>';
  var items = (cat.items||[]).filter(function(it){
    if(!KEY) return true;
    return has(it.w) || has(it.cn) || has(it.ex) || has(it.tip) || has(it.pos);
  });
  if(!items.length) return '<div class="empty">本类没有匹配「' + esc(KEY) + '」的词</div>';

  var h = '<div class="stats"><span>' + esc(cat.title) + ' · ' + items.length + ' 个</span></div>';
  items.forEach(function(it){
    h += '<div class="vcard">';
    h += '<div class="vh">';
    h += '<span class="vw">' + hl(it.w) + '</span>';
    if(it.pos) h += '<span class="vpos">' + esc(it.pos) + '</span>';
    if(it.ipa) h += '<span class="vipa">' + esc(it.ipa) + '</span>';
    h += '</div>';
    h += '<div class="vcn">' + hl(it.cn) + '</div>';
    if(it.ex) h += '<div class="vex">' + hl(it.ex) + '</div>';
    if(it.tip) h += '<div class="vtip">' + hl(it.tip) + '</div>';
    h += '</div>';
  });
  return h;
}

function renderPhrase(){
  var items = PHRASES.filter(function(it){
    if(!KEY) return true;
    return has(it.p) || has(it.cn) || has(it.ex) || has(it.tip);
  });
  if(!items.length) return '<div class="empty">没有匹配的词组</div>';

  var h = '<div class="stats"><span>常考词组 · ' + items.length + ' 条</span></div>';
  items.forEach(function(it){
    h += '<div class="pcard">';
    h += '<div class="pp">' + hl(it.p) + '</div>';
    h += '<div class="pcn">' + hl(it.cn) + '</div>';
    if(it.ex) h += '<div class="pex">' + hl(it.ex) + '</div>';
    if(it.tip) h += '<div class="ptip">' + hl(it.tip) + '</div>';
    h += '</div>';
  });
  return h;
}

function renderConfus(){
  var items = CONFUS.filter(function(it){
    if(!KEY) return true;
    return has(it.group) || has(it.diff) || has(it.note);
  });
  if(!items.length) return '<div class="empty">没有匹配的辨析</div>';

  var h = '<div class="stats"><span>形近词辨析 · ' + items.length + ' 组</span></div>';
  items.forEach(function(it){
    h += '<div class="ccard">';
    h += '<div class="cg">' + hl(it.group) + '</div>';
    h += '<div class="cd">' + hl(it.diff) + '</div>';
    if(it.note) h += '<div class="cn">' + hl(it.note) + '</div>';
    h += '</div>';
  });
  return h;
}

/* ============ 事件 ============ */
var timer = null;
if($q){
  $q.addEventListener("input", function(){
    clearTimeout(timer);
    var v = this.value;
    timer = setTimeout(function(){
      KEY = v.trim().toLowerCase();
      if(CUR !== null) renderUnit(); else renderIndex();
    }, 160);
  });
}

document.getElementById("expandAll").addEventListener("click", function(){});
document.getElementById("collapseAll").addEventListener("click", function(){});

/* ============ 启动 ============ */
if(CUR === null){
  renderIndex();
  window.GS_renderUnitBar("chapbar", "vocab.html", UNITS, { label: "类别", withAll: false });
}else{
  renderUnit();
}
})();
