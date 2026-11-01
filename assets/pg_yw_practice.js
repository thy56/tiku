
(function(){
"use strict";

var NAV = window.YUWEN_NAV || {groups:[]};
var QB = window.YUWEN_QUESTIONS || {groups:[]};
var DEEP = window.YW_DEEP || {authors:{}};
var KEY = "";
var GKEY = window.GS_KEY;                    /* ?ch= 原样；null = 目录页 */
var CUR = GKEY === null ? 0 : parseInt(GKEY, 10);
if (isNaN(CUR)) CUR = 0;
if (CUR && !QB.groups.some(function(g){ return g.no === CUR; })) CUR = 0;
var SEL_TYPE = "all";
var PICK = {};
var SHOWN = {};

var $main = document.getElementById("main");
var $q = document.getElementById("q");

/* 标题栏徽标用 manifest 实测数字 */
(function(){
  var S = (NAV.stats || {});
  var b = document.getElementById("hBadge");
  if(b && S.groups) b.textContent = S.groups + " 组 · " + S.questions + " 题";
})();

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

/* ============ 作者档案（深度解析） ============ */
/* 题干注：note 格式“姓名，朝代。”，从 note 取姓名，再去作者表查档案 */
function authorOf(item){
  if(!item || item.src !== "人物→朝代") return null;
  var note = item.note || "";
  var nm = note.split("，")[0].trim();
  if(!nm) nm = note.split(",")[0].trim();
  if(!nm) return null;
  var A = DEEP.authors || {};
  if(A[nm]) return A[nm];
  /* 容错：全称/简称差异，逐个包含比较 */
  for(var k in A){
    if(k && (nm.indexOf(k) !== -1 || k.indexOf(nm) !== -1)) return A[k];
  }
  return null;
}

function nl2(s){
  return esc(s).replace(/\n/g,"<br>");
}

function deepHTML(item){
  var a = authorOf(item);
  if(!a) return "";

  var h = '<div class="yw-deep">';
  h += '<div class="yd-name">'+esc(a.name||"")+'</div>';

  /* 基本信息行 */
  var bits = [];
  if(a.life && a.life !== "—") bits.push(a.life);
  if(a.alias && a.alias !== "—") bits.push(esc(a.alias));
  if(a.place && a.place !== "—") bits.push(esc(a.place));
  if(a.era) bits.push('<b>'+esc(a.era)+'</b>');
  if(bits.length) h += '<div class="yd-meta">'+bits.join(' <i>·</i> ')+'</div>';

  if(a.status){
    h += '<div class="yd-sec"><div class="yd-lbl">文学地位</div>';
    h += '<div class="yd-txt">'+nl2(a.status)+'</div></div>';
  }
  if(a.style){
    h += '<div class="yd-sec"><div class="yd-lbl">风格特点</div>';
    h += '<div class="yd-txt">'+nl2(a.style)+'</div></div>';
  }
  if(a.works){
    h += '<div class="yd-sec"><div class="yd-lbl">代表作品</div>';
    h += '<div class="yd-txt">'+nl2(a.works)+'</div></div>';
  }
  if(a.quote && a.quote !== "—"){
    h += '<div class="yd-sec"><div class="yd-lbl">名句</div>';
    h += '<div class="yd-quote">'+nl2(a.quote)+'</div></div>';
  }
  if(a.keys && a.keys.length){
    h += '<div class="yd-sec yd-keys"><div class="yd-lbl">考点提示</div><ul>';
    a.keys.forEach(function(k){ h += '<li>'+nl2(k)+'</li>'; });
    h += '</ul></div>';
  }
  h += '</div>';
  return h;
}

/* 样式只插一次 */
(function injectDeepStyle(){
  if(document.getElementById("ywDeepStyle")) return;
  var css = ''
    + '.yw-deep{margin-top:12px;padding:14px 16px;border-radius:11px;'
    + 'background:linear-gradient(180deg,#f7fafc,#eef4f8);border:1px solid #d8e3ec}'
    + '.yd-name{font-size:15px;font-weight:700;color:#1f3a52;margin-bottom:6px}'
    + '.yd-meta{font-size:12.5px;color:#5a7085;margin-bottom:11px;line-height:1.7}'
    + '.yd-meta i{color:#a8bccb;font-style:normal;margin:0 2px}'
    + '.yd-sec{margin-top:10px}'
    + '.yd-lbl{display:inline-block;font-size:11.5px;font-weight:700;color:#2d6fa8;'
    + 'background:#e3eef7;border-radius:4px;padding:1px 7px;margin-bottom:5px}'
    + '.yd-txt{font-size:13.5px;line-height:1.85;color:#33495d}'
    + '.yd-quote{font-size:13.5px;line-height:1.9;color:#7a5230;'
    + 'border-left:3px solid #d9b98a;padding-left:10px;background:#fdf8f1;'
    + 'border-radius:0 5px 5px 0;padding-top:5px;padding-bottom:5px}'
    + '.yd-keys ul{margin:4px 0 0;padding-left:19px}'
    + '.yd-keys li{font-size:13px;line-height:1.8;color:#3a5068;margin-bottom:3px}'
    + '.yd-keys li::marker{color:#2d6fa8}';
  var st = document.createElement("style");
  st.id = "ywDeepStyle";
  st.textContent = css;
  document.head.appendChild(st);
})();

/* ============ 组列表 ============ */
function renderGroupList(){
  var list = QB.groups.filter(function(g){
    if(!KEY) return true;
    if(has(g.file)) return true;
    if(("第"+g.no+"组").indexOf(KEY)!==-1) return true;
    if((g.pieces||[]).some(has)) return true;
    var all = [].concat(g.p1||[],g.p2||[],g.p3||[]);
    return all.some(function(x){
      if(has(x.q) || has(x.a) || has(x.atext)) return true;
      return (x.opts||[]).some(has);
    });
  });

  if(!list.length){
    $main.innerHTML = '<div class="empty">没有匹配的组</div>';
    return;
  }
  var items = list.map(function(g){
    var tt = (g.pieces && g.pieces.length) ? g.pieces.join("、") : "综合练习";
    return {
      key: g.no,
      badge: String(g.no).padStart(2,"0"),
      title: tt,
      desc: g.date + "　常识 " + (g.p1||[]).length + " · 词义 " + (g.p2||[]).length +
            " · 翻译 " + (g.p3||[]).length,
      stats: [{ t: " 题", v: (g.p1||[]).length + (g.p2||[]).length + (g.p3||[]).length }]
    };
  });
  window.GS_renderUnitIndex("chapidx", items, "practice.html");
  window.GS_renderUnitBar("chapbar", "practice.html", unitList(), { withAll: false });

  $main.innerHTML = '<div class="stats"><span>共 ' + list.length +
    ' 组 · 点上方任意一组进入答题</span></div>';
}

function unitList(){
  return QB.groups.map(function(g){
    var tt = (g.pieces && g.pieces.length) ? g.pieces.join("、") : "综合练习";
    return {
      key: g.no,
      no: String(g.no).padStart(2, "0"),
      label: tt,
      count: (g.p1||[]).length + (g.p2||[]).length + (g.p3||[]).length
    };
  });
}

/* ============ 单组答题 ============ */
function qid(gno, part, idx){ return "g"+gno+"_"+part+"_"+idx; }

function renderMCQ(gno, part, item, i){
  var id = qid(gno, part, i);
  var picked = PICK[id] || "";
  var shown = SHOWN[id];
  var rightLetter = item.ans;

  var h = '<div class="qbox" data-qid="'+id+'">';
  h += '<div class="qh"><span class="num">'+(i+1)+'.</span><span class="tx">'+hl(item.q)+'</span></div>';
  h += '<div class="opts">';
  (item.opts||[]).forEach(function(o, oi){
    var lt = "ABCD"[oi];
    var cls = "opt";
    if(shown){
      cls += " locked";
      if(lt === rightLetter) cls += " right";
      else if(lt === picked) cls += " wrong";
    }else if(lt === picked){
      cls += " picked";
    }
    h += '<button class="'+cls+'" data-pick="'+id+'" data-lt="'+lt+'">';
    h += '<span class="lt">'+lt+'．</span><span>'+hl(o)+'</span></button>';
  });
  h += '</div>';

  h += '<div class="qfoot">';
  if(shown){
    if(picked === rightLetter) h += '<span class="verdict ok">答对</span>';
    else if(picked) h += '<span class="verdict no">答错，正确答案 '+rightLetter+'</span>';
    else h += '<span class="verdict">正确答案 '+rightLetter+'</span>';
    h += '<button class="revealbtn" data-hide="'+id+'">收起答案</button>';
  }else{
    h += '<span style="font-size:12.5px;color:#5d7080">'+(picked?'已选 '+picked+'，点「看答案」核对':'请选择')+'</span>';
    h += '<button class="revealbtn" data-show="'+id+'">看答案</button>';
  }
  h += '</div>';

  h += '<div class="ansbox'+(shown?' show':'')+'">';
  h += '<span class="lab">答案：'+rightLetter+'．'+esc(item.atext||"")+'</span>';
  if(item.note) h += '\n解析：'+esc(item.note);
  if(item.src) h += '\n来源：常识库 '+esc(item.src);
  h += deepHTML(item);
  h += '</div></div>';
  return h;
}

function renderTranslate(item, i){
  var h = '<div class="qbox">';
  h += '<div class="qh"><span class="num">'+(i+1)+'.</span><span class="tx">翻译下列句子：'+hl(item.q)+'</span></div>';
  h += '<div class="qfoot"><span style="font-size:12.5px;color:#5d7080">先自己译，再对照</span>';
  h += '<button class="revealbtn" data-tg="t'+i+'">看译文</button></div>';
  h += '<div class="ansbox" id="t'+i+'"><span class="lab">译文：'+esc(item.a)+'</span>';
  if(item.note) h += '\n解析：'+esc(item.note);
  h += '</div></div>';
  return h;
}

function renderGroupPage(){
  var g = null;
  for(var i=0;i<QB.groups.length;i++){
    if(QB.groups[i].no === CUR){ g = QB.groups[i]; break; }
  }
  if(!g){ CUR = 0; renderGroupList(); return; }

  var tt = (g.pieces&&g.pieces.length)? g.pieces.join("、") : "综合练习";
  var n1 = SEL_TYPE==="all"||SEL_TYPE==="p1" ? g.p1.length : 0;
  var n2 = SEL_TYPE==="all"||SEL_TYPE==="p2" ? g.p2.length : 0;
  var n3 = SEL_TYPE==="all"||SEL_TYPE==="p3" ? g.p3.length : 0;
  var total = n1+n2+n3;
  var maxNo = QB.groups.length ? QB.groups[QB.groups.length-1].no : 0;

  var h = '';
  h += '<div class="gtitle"><h2>第'+String(g.no).padStart(2,"0")+'组 · '+esc(tt)+'</h2>';
  h += '<div class="m2">'+esc(g.date)+'　|　本组共 '+total+' 题</div></div>';

  function b(key,label,num){
    return '<button class="tbtn2'+(SEL_TYPE===key?' on':'')+'" data-tsel="'+key+'">'+
           label+'<span class="n">'+num+'</span></button>';
  }
  h += '<div class="typebar">'+b("all","全部",g.p1.length+g.p2.length+g.p3.length)+
       b("p1","文学常识单选",g.p1.length)+b("p2","重点词单选",g.p2.length)+
       b("p3","句子翻译",g.p3.length)+'</div>';

  h += '<div class="stats"><span>显示 '+total+' 题</span><span class="acts">'+
       '<button class="mini" id="showAllAns">全部答案</button>'+
       '<button class="mini" id="hideAllAns">收起全部</button></span></div>';

  if(n1){
    h += '<div class="sec">第一部分　文学常识（单选）<span class="cnt">'+g.p1.length+' 题</span></div>';
    g.p1.forEach(function(item,i){ h += renderMCQ(g.no,"p1",item,i); });
  }
  if(n2){
    h += '<div class="sec">第二部分　文言文重点词（单选）<span class="cnt">'+g.p2.length+' 题</span></div>';
    g.p2.forEach(function(item,i){ h += renderMCQ(g.no,"p2",item,i); });
  }
  if(n3){
    h += '<div class="sec">第三部分　重点句翻译<span class="cnt">'+g.p3.length+' 题</span></div>';
    g.p3.forEach(function(item,i){ h += renderTranslate(item,i); });
  }

  $main.innerHTML = h;

  var units = unitList();
  window.GS_renderUnitBar("chapbar", "practice.html", units, { withAll: false });
  window.GS_renderUnitPager("chpager", "practice.html", units);
}

/* ============ 路由 ============ */
function render(){
  var idx = document.getElementById("chapidx");
  var bar = document.getElementById("chapbar");
  var pager = document.getElementById("chpager");
  if(idx) idx.style.display = CUR > 0 ? "none" : "";
  if(pager) pager.style.display = CUR > 0 ? "" : "none";
  if(bar) bar.style.display = "";
  if(CUR > 0) renderGroupPage(); else renderGroupList();
}
function goGroup(n){ location.href = "practice.html?ch=" + n; }
function backToList(){ location.href = "practice.html"; }

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target;

  var go = t.closest("[data-go]");
  if(go){ goGroup(parseInt(go.getAttribute("data-go"),10)); return; }

  if(t.id === "backList"){ backToList(); return; }

  var pv = t.closest("[data-prev]");
  if(pv){ if(CUR>1) goGroup(CUR-1); return; }
  var nx = t.closest("[data-next]");
  if(nx){ goGroup(CUR+1); return; }

  var ts = t.closest("[data-tsel]");
  if(ts){ SEL_TYPE = ts.getAttribute("data-tsel"); render(); return; }

  if(t.id === "showAllAns"){
    var g = QB.groups.filter(function(x){return x.no===CUR;})[0];
    if(g){
      if(SEL_TYPE==="all"||SEL_TYPE==="p1") g.p1.forEach(function(_,i){ SHOWN[qid(g.no,"p1",i)]=1; });
      if(SEL_TYPE==="all"||SEL_TYPE==="p2") g.p2.forEach(function(_,i){ SHOWN[qid(g.no,"p2",i)]=1; });
    }
    render();
    return;
  }
  if(t.id === "hideAllAns"){ SHOWN = {}; render(); return; }

  var pick = t.closest("[data-pick]");
  if(pick){
    var id = pick.getAttribute("data-pick");
    if(SHOWN[id]) return;
    PICK[id] = pick.getAttribute("data-lt");
    render();
    return;
  }

  var sb = t.closest("[data-show]");
  if(sb){ SHOWN[sb.getAttribute("data-show")] = 1; render(); return; }
  var hb = t.closest("[data-hide]");
  if(hb){ delete SHOWN[hb.getAttribute("data-hide")]; render(); return; }

  var tg = t.closest("[data-tg]");
  if(tg){
    var box = document.getElementById(tg.getAttribute("data-tg"));
    if(box){
      box.classList.toggle("show");
      tg.textContent = box.classList.contains("show") ? "收起译文" : "看译文";
    }
    return;
  }
});

var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    KEY = $q.value.trim().toLowerCase();
    render();
  }, 160);
});

/* 组下拉筛选 */
var $fg = document.getElementById("fGrp");
if($fg){
  NAV.groups.forEach(function(g){
    var o = document.createElement("option");
    o.value = g.no;
    o.textContent = "第" + String(g.no).padStart(2,"0") + "组" +
      ((g.pieces||[]).length ? "（"+g.pieces.join("、")+"）" : "（综合）");
    $fg.appendChild(o);
  });
  $fg.addEventListener("change", function(){
    if(this.value) goGroup(parseInt(this.value,10));
    this.value = "";
  });
}

/* 启动 */
render();
})();
