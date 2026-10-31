
(function(){
"use strict";

var NAV = window.YW_NAV || {groups:[]};
var DATA = window.YW_DATA || {groups:[]};
var META = window.YW_GROUPMETA || {groups:[]};
var ST = window.YW_STORE;

/* 分片数据：静态单组页会加载 data/g_N.js → window.YW_GROUP = {group, meta}
   目录页只加载 data/e_index.js（轻量索引，无 items） */
var GRP = window.YW_GROUP || null;
var GROUPS = GRP ? [GRP.group] : (DATA.groups || []);
var META_BY_NO = {};
(GRP && GRP.meta ? [GRP.meta] : (META.groups||[])).forEach(function(m){ META_BY_NO[m.no] = m; });

/* 组内题数（索引页用 n，详情页用 items.length） */
function gCount(g){ return (g.items && g.items.length) || g.n || 0; }

var GKEY = window.GS_KEY;                 /* ?ch= 原样；null = 目录页 */
var CUR = GKEY === null ? 0 : parseInt(GKEY, 10);
if(isNaN(CUR)) CUR = 0;
if(CUR && !GROUPS.some(function(g){ return g.no === CUR; })) CUR = 0;
var PART = "all";
var KEY = "";
var VIEW = "list";   /* list | detail | wrong */

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

/* 拆分答案：译文 + 解析 */
function splitAns(a){
  var s = String(a||"");
  var m = s.match(/^译文[：:]\s*([\s\S]*?)(?:[　\s]*\|[　\s]*解析[：:]\s*([\s\S]*))?$/);
  if(m) return {tr:(m[1]||"").trim(), note:(m[2]||"").trim()};
  var i = s.indexOf("|");
  if(i > 0){
    return {tr: s.slice(0,i).replace(/^译文[：:]\s*/,"").trim(),
            note: s.slice(i+1).replace(/^\s*解析[：:]\s*/,"").trim()};
  }
  return {tr: s.trim(), note: ""};
}

function qid(gno, part, num){ return "g"+gno+"_"+part+"_"+num; }

function partName(p){ return {"0":"汉译英","1":"英译汉","2":"词根"}[String(p)] || "练习"; }

function grammarTags(m){
  var gs = (m && m.grammar) || [];
  if(!gs.length) return "";
  return gs.map(function(x){
    var cls = {"S+V":"sv","S+V+O":"svo","S+V+O+O":"svoo","S+V+O+C":"svoc","S+V+P":"svp"}[x.k] || "";
    return '<span class="gtag '+cls+'">'+esc(x.cn)+' <b>'+x.n+'</b></span>';
  }).join("");
}

/* ============ 进度条 ============ */
function progressBar(){
  var s = ST.stats();
  if(!s.total && !s.wrong) return "";
  var pct = s.total ? Math.round(s.ok / s.total * 100) : 0;
  var h = '<div class="gsummary" style="border-left-color:#3f8f4a">';
  h += '<h3>学习进度</h3>';
  h += '<div class="row">已做 <b>'+s.total+'</b> 题　·　答对 <b style="color:#3f8f4a">'+s.ok+'</b>　·　差不多 <b style="color:#b9793a">'+s.so+'</b>　·　答错 <b style="color:#c0504d">'+s.err+'</b>　·　错题本 <b>'+s.wrong+'</b> 条</div>';
  h += '<div class="gstat" style="margin-top:9px"><div style="flex:1;min-width:160px;height:8px;background:#eef1f5;border-radius:4px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#57a35b,#3f8f4a);transition:width .3s"></div></div><span style="font-size:12.5px;color:#6b7c8d">正确率 '+pct+'%</span></div>';
  h += '</div>';
  return h;
}

/* ============ 列表 ============ */
function renderList(){
  var list = GROUPS.filter(function(g){
    if(!KEY) return true;
    if(has(g.theme)) return true;
    if(("第"+g.no+"组").indexOf(KEY) !== -1) return true;
    return (g.items||[]).some(function(it){ return has(it.q) || has(it.a); });
  });

  if(!list.length){
    $main.innerHTML = '<div class="empty">没有匹配的组</div>';
    return;
  }

  var rates = ST.getRates();
  var items = list.map(function(g){
    var m = META_BY_NO[g.no] || {};
    var its = g.items || [];
    var done = 0, okc = 0;
    its.forEach(function(it){
      var id = qid(g.no, it.part, it.num);
      if(rates[id]){ done++; if(rates[id]==="ok") okc++; }
    });
    var cnt = gCount(g);
    var desc = cnt + " 题";
    if(done) desc += "　已做 " + done + "/" + cnt + "　对 " + okc;
    else if(g.n != null && !its.length) desc += "　点进去看本组语法与词汇";
    else desc += "　词根 " + (m.rootWords||[]).length + " · 核心词 " + (m.coreWords||[]).length;
    return {
      key: g.no,
      badge: String(g.no).padStart(2,"0"),
      title: g.theme,
      desc: desc,
      stats: [{ t: " 题", v: cnt }]
    };
  });

  window.GS_renderUnitIndex("chapidx", items, "practice.html");
  window.GS_renderUnitBar("chapbar", "practice.html", unitList(), { withAll: false });

  $main.innerHTML = '<div class="stats"><span>共 ' + list.length +
    ' 组 · 点上方任意一组进入练习</span></div>';
}

function unitList(){
  return GROUPS.map(function(g){
    return {
      key: g.no,
      no: String(g.no).padStart(2, "0"),
      label: g.theme,
      count: gCount(g)
    };
  });
}

/* ============ 错题本 ============ */
function renderWrong(){
  var w = ST.getWrong();
  var ids = Object.keys(w);
  var h = '<div class="gnav2"><button class="backbtn" id="backList">← 返回组列表</button>';
  if(ids.length) h += '<button class="pnbtn" id="clearWrong">清空错题本</button>';
  h += '</div>';

  h += '<div class="gsummary" style="border-left-color:#c0504d">';
  h += '<h3>错题本（'+ids.length+' 条）</h3>';
  h += '<div class="row">自评「答错了」的题目会自动收进来。重新做对后可以在题上删除。</div>';
  h += '</div>';

  if(!ids.length){
    $main.innerHTML = h + '<div class="empty">还没有错题。做题时自评「答错了」的题目会出现在这里。</div>';
    return;
  }

  /* 按组号排序 */
  ids.sort(function(a,b){
    var ga = (w[a].g||0), gb = (w[b].g||0);
    if(ga !== gb) return ga - gb;
    return (w[a].ts||0) - (w[b].ts||0);
  });

  ids.forEach(function(id){
    var it = w[id];
    var ans = splitAns(it.a);
    h += '<div class="qbox">';
    h += '<div class="qh"><span class="num">'+esc(it.num)+'.</span><span class="tx">'+hl(it.q)+'</span></div>';
    h += '<div style="font-size:12.5px;color:#5d7080;margin-top:6px">第'+String(it.g).padStart(2,"0")+'组 · '+esc(it.theme||"")+' · '+partName(it.part)+'</div>';
    h += '<div class="az-cmp open" style="margin-top:10px">';
    if(it.my){
      h += '<div class="lbl">我的译文</div><div class="my">'+esc(it.my)+'</div>';
    }
    h += '<div class="lbl">参考答案</div><div class="ref">'+esc(ans.tr)+'</div>';
    if(ans.note) h += '<div class="lbl">解析</div><div class="note">'+esc(ans.note)+'</div>';
    h += '</div>';
    h += '<div class="az-actions">';
    h += '<button class="az-btn" data-goto="'+it.g+'">重做本组</button>';
    h += '<button class="az-btn" data-delwrong="'+esc(id)+'">从错题本移除</button>';
    h += '</div>';
    h += '</div>';
  });

  $main.innerHTML = h;
}

/* ============ 详情 ============ */
function renderDetail(){
  var g = null;
  for(var i=0;i<GROUPS.length;i++){ if(GROUPS[i].no === CUR){ g = GROUPS[i]; break; } }
  if(!g){ CUR = 0; VIEW = "list"; renderList(); return; }

  /* 只加载了索引却要渲染详情 → 跳到该组的独立页 */
  if(!g.items){
    var fname = 'pr-' + g.no + '.html';
    var here = (location.pathname.split('/').pop() || '');
    if(fname !== here){ location.replace(fname); return; }
    CUR = 0; VIEW = "list"; renderList(); return;
  }
  var m = META_BY_NO[g.no] || {};
  var answers = ST.getAnswers();
  var shown = ST.getShown();
  var rates = ST.getRates();

  var maxNo = GROUPS.length ? GROUPS[GROUPS.length-1].no : 0;

  var h = '';

  /* 组摘要 */
  h += '<div class="gsummary">';
  h += '<h3>第'+String(g.no).padStart(2,"0")+'组 · '+esc(g.theme)+'</h3>';

  var gas = (m.grammar||[]);
  if(gas.length){
    h += '<div class="row"><b>本组语法结构</b>：'+gas.map(function(x){ return x.cn+' '+x.n+'题'; }).join(' · ')+'</div>';
    h += '<div class="gstat">'+grammarTags(m)+'</div>';
  }

  var rw = (m.rootWords||[]);
  var cw = (m.coreWords||[]);
  h += '<div class="row" style="margin-top:9px"><b>词根词</b> '+rw.length+' 个　|　<b>核心词汇</b> '+cw.length+' 个　|　共 '+g.items.length+' 题</div>';
  h += '</div>';

  /* 词汇速览 */
  if(rw.length || cw.length){
    h += '<details class="vquick"><summary>本组词汇速览（词根词 '+rw.length+' + 核心词 '+cw.length+'）</summary><div class="vbody">';
    if(rw.length){
      h += '<div class="vgrp"><h4>词根词 · 同根成串</h4><div class="vlist">';
      rw.forEach(function(w){
        h += '<span class="vitem"><b>'+esc(w.w)+'</b> '+(w.pos?esc(w.pos)+' ':'')+esc(w.m)+'</span>';
      });
      h += '</div></div>';
    }
    if(cw.length){
      h += '<div class="vgrp"><h4>核心词汇 · 本组高频</h4><div class="vlist">';
      cw.forEach(function(w){
        h += '<span class="vitem"><b>'+esc(w.w)+'</b> '+(w.pos?esc(w.pos)+' ':'')+esc(w.m)+'</span>';
      });
      h += '</div></div>';
    }
    h += '</div></details>';
  }

  /* 题型筛选 */
  function pb(key,label,num){
    return '<button class="tbtn2'+(PART===key?' on':'')+'" data-part="'+key+'">'+
           label+'<span class="n">'+num+'</span></button>';
  }
  var n0 = g.items.filter(function(x){return String(x.part)==="0";}).length;
  var n1 = g.items.filter(function(x){return String(x.part)==="1";}).length;
  var n2 = g.items.filter(function(x){return String(x.part)==="2";}).length;
  h += '<div class="typebar">'+pb("all","全部",g.items.length)+
       pb("0","汉译英",n0)+pb("1","英译汉",n1)+pb("2","词根",n2)+'</div>';

  /* 题目 */
  var parts = [["0","一、汉译英","把中文译成英文"],["1","二、英译汉","把英文译成中文"],["2","三、词根练习","写出词义或同根词"]];
  var shownCnt = 0;
  parts.forEach(function(p){
    if(PART !== "all" && PART !== p[0]) return;
    var items = g.items.filter(function(it){ return String(it.part) === p[0]; });
    if(!items.length) return;

    h += '<div class="sec">'+p[1]+'<span class="cnt">'+items.length+' 题 · '+p[2]+'</span></div>';

    items.forEach(function(it){
      if(KEY && !has(it.q) && !has(it.a)) return;
      shownCnt++;
      var id = qid(g.no, it.part, it.num);
      var ans = splitAns(it.a);
      var my = answers[id] || "";
      var isShown = !!shown[id];
      var rate = rates[id] || "";

      h += '<div class="qbox" data-qid="'+id+'">';
      h += '<div class="qh"><span class="num">'+it.num+'.</span><span class="tx">'+hl(it.q)+'</span></div>';

      var ph = String(it.part)==="0" ? "把上面的中文译成英文，写在这里…"
             : (String(it.part)==="1" ? "把上面的英文译成中文，写在这里…"
             : "写出这个词的含义或同根词…");

      h += '<div class="answer-zone">';
      h += '<textarea id="az_'+id+'" data-aid="'+id+'" placeholder="'+esc(ph)+'" rows="2">'+esc(my)+'</textarea>';
      h += '<div class="az-actions">';
      h += '<button class="az-btn primary" data-cmp="'+id+'">对照答案</button>';
      if(isShown) h += '<button class="az-btn" data-close="'+id+'">收起</button>';
      if(rate === "ok") h += '<span style="font-size:12.5px;color:#3f8f4a;font-weight:600">已掌握</span>';
      if(rate === "so") h += '<span style="font-size:12.5px;color:#b9793a;font-weight:600">差不多</span>';
      if(rate === "err") h += '<span style="font-size:12.5px;color:#c0504d;font-weight:600">已进错题本</span>';
      if(!isShown) h += '<span style="font-size:12.5px;color:#647689">先自己译，再对照</span>';
      h += '</div>';

      if(isShown){
        h += '<div class="az-cmp open" id="azc_'+id+'">';
        h += '<div class="lbl">我的译文</div>';
        h += '<div class="my">'+esc(my || "（未填写）")+'</div>';
        h += '<div class="lbl">参考答案</div>';
        h += '<div class="ref">'+esc(ans.tr)+'</div>';
        if(ans.note){
          h += '<div class="lbl">解析</div>';
          h += '<div class="note">'+esc(ans.note)+'</div>';
        }
        h += '<div class="az-rate">';
        h += '<span>自评：</span>';
        h += '<button class="rate-btn'+(rate==="ok"?" on-ok":"")+'" data-rate="'+id+'" data-r="ok">答对了</button>';
        h += '<button class="rate-btn'+(rate==="so"?" on-so":"")+'" data-rate="'+id+'" data-r="so">差不多</button>';
        h += '<button class="rate-btn'+(rate==="err"?" on-err":"")+'" data-rate="'+id+'" data-r="err">答错了</button>';
        h += '</div>';
        h += '</div>';
      }
      h += '</div>';   /* answer-zone */
      h += '</div>';   /* qbox */
    });
  });

  if(!shownCnt){
    h += '<div class="empty">没有匹配的题目</div>';
  }else{
    h = '<div class="stats"><span>当前显示 '+shownCnt+' 题'+(KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>' + h;
  }

  $main.innerHTML = h;

  var units = unitList();
  window.GS_renderUnitBar("chapbar", "practice.html", units, { withAll: false });
  window.GS_renderUnitPager("chpager", "practice.html", units);
}

/* ============ 渲染 ============ */
function render(){
  if(VIEW === "wrong"){ renderWrong(); return; }
  if(CUR > 0) renderDetail(); else renderList();
}

/* ============ 收集答案（防抖保存）============ */
var saveTimer = null;
function saveAnswer(id, val){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function(){ ST.setAnswer(id, val); }, 300);
}

/* ============ 事件 ============ */
$main.addEventListener("input", function(e){
  var ta = e.target.closest("textarea[data-aid]");
  if(!ta) return;
  saveAnswer(ta.getAttribute("data-aid"), ta.value);
});

$main.addEventListener("click", function(e){
  var t = e.target;

  var go = t.closest("[data-go]");
  if(go){ VIEW = "detail"; goGroup(parseInt(go.getAttribute("data-go"),10)); return; }

  if(t.id === "backList"){ VIEW = "list"; backList(); return; }

  var g2 = t.closest("[data-goto]");
  if(g2){ VIEW = "detail"; goGroup(parseInt(g2.getAttribute("data-goto"),10)); return; }

  var pv = t.closest("[data-prev]");
  if(pv){ if(CUR>1) goGroup(CUR-1); return; }
  var nx = t.closest("[data-next]");
  if(nx){ goGroup(CUR+1); return; }

  var pt = t.closest("[data-part]");
  if(pt){ PART = pt.getAttribute("data-part"); render(); return; }

  /* 对照答案 */
  var cm = t.closest("[data-cmp]");
  if(cm){
    var id = cm.getAttribute("data-cmp");
    var ta = document.getElementById("az_"+id);
    var my = ta ? ta.value.trim() : "";
    if(!my){ if(ta) ta.focus(); return; }
    ST.setAnswer(id, my);
    ST.setShown(id, true);
    render();
    return;
  }

  /* 收起对照 */
  var cl = t.closest("[data-close]");
  if(cl){ ST.setShown(cl.getAttribute("data-close"), false); render(); return; }

  /* 自评 */
  var rt = t.closest("[data-rate]");
  if(rt){
    var rid = rt.getAttribute("data-rate");
    var r = rt.getAttribute("data-r");
    var rates = ST.getRates();
    var next = (rates[rid] === r) ? "" : r;
    ST.setRate(rid, next);

    if(next === "err"){
      /* 收进错题本 */
      var parts = rid.split("_");
      var gno = parseInt(parts[0].replace("g",""),10);
      var pno = parts[1];
      var num = parts[2];
      var grp = null;
      for(var i=0;i<GROUPS.length;i++){ if(GROUPS[i].no===gno){ grp=GROUPS[i]; break; } }
      if(grp){
        var item = null;
        for(var j=0;j<grp.items.length;j++){
          if(String(grp.items[j].part)===pno && String(grp.items[j].num)===String(num)){ item=grp.items[j]; break; }
        }
        if(item){
          ST.addWrong(rid, {
            g: gno, theme: grp.theme, part: pno, num: item.num,
            q: item.q, a: item.a, my: ST.getAnswers()[rid] || "",
            rate: "err", ts: Date.now()
          });
        }
      }
    }else{
      /* 改成对/差不多 → 从错题本移除 */
      ST.delWrong(rid);
    }
    render();
    return;
  }

  /* 错题本操作 */
  var dw = t.closest("[data-delwrong]");
  if(dw){ ST.delWrong(dw.getAttribute("data-delwrong")); renderWrong(); return; }

  if(t.id === "clearWrong"){
    if(!confirm("清空全部错题记录？")) return;
    ST.clearWrong(); renderWrong(); return;
  }
});

/* 顶部按钮 */
document.getElementById("btnStats").addEventListener("click", function(){
  VIEW = "list"; CUR = 0;
  history.replaceState(null,"",location.pathname.split("/").pop());
  render();
  window.scrollTo({top:0,behavior:"smooth"});
});

document.getElementById("btnWrong").addEventListener("click", function(){
  VIEW = "wrong"; CUR = 0;
  history.replaceState(null,"",location.pathname.split("/").pop()+"#wrong");
  render();
  window.scrollTo({top:0,behavior:"smooth"});
});

document.getElementById("btnReset").addEventListener("click", function(){
  if(!CUR){ alert("请先进入某一组再重置"); return; }
  if(!confirm("清空第"+CUR+"组的作答与自评？（错题本不受影响）")) return;
  var g = null;
  for(var i=0;i<GROUPS.length;i++){ if(GROUPS[i].no===CUR){ g=GROUPS[i]; break; } }
  if(!g) return;
  if(!g.items){ alert("请先进入本组页面再重置"); return; }
  g.items.forEach(function(it){
    var id = qid(g.no, it.part, it.num);
    ST.delAnswer(id);
    ST.setShown(id, false);
    ST.setRate(id, "");
  });
  render();
});

/* 搜索 */
var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    KEY = $q.value.trim().toLowerCase();
    render();
  }, 160);
});

/* 下拉 */
var $fg = document.getElementById("fGrp");
if($fg){
  NAV.groups.forEach(function(g){
    var o = document.createElement("option");
    o.value = g.no;
    o.textContent = "第"+String(g.no).padStart(2,"0")+"组（"+g.theme+"）";
    $fg.appendChild(o);
  });
  $fg.addEventListener("change", function(){
    if(this.value){ VIEW="detail"; goGroup(parseInt(this.value,10)); }
    this.value = "";
  });
}

var $fp = document.getElementById("fPart");
if($fp){
  $fp.addEventListener("change", function(){ PART = this.value || "all"; render(); });
}

/* 导航 */
function goGroup(n){
  location.href = "practice.html?ch=" + n;
}
function backList(){
  location.href = "practice.html";
}

/* ============ 启动 ============ */
(function init(){
  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd && S.groups) bd.textContent = S.groups + " 组 · " + S.questions + " 题";

  var hm = (location.hash || "").match(/^#wrong$/);
  if(hm){ VIEW = "wrong"; CUR = 0; render(); return; }

  if(CUR > 0) VIEW = "detail"; else VIEW = "list";
  render();
})();
})();
