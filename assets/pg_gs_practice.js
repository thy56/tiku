
(function(){
"use strict";

var NAV = window.GS_NAV || {stats:{}};
var Q = window.GS_QUESTIONS || {questions:[]};
var ALLQ = Q.questions || [];
var ST = window.GS_STORE;
var CH = window.GS_CH;

var KEY = "";
var TYPE = "all";
var STATE = "all";

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

/* ============ 完整解题步骤 ============ */
var STEPS = {};
(function(){
  /* 合并各章步骤数据 */
  var parts = [window.GS_STEPS_CH1, window.GS_STEPS_CH2, window.GS_STEPS_CH3,
               window.GS_STEPS_CH4, window.GS_STEPS_CH5, window.GS_STEPS_CH6,
               window.GS_STEPS_CH7, window.GS_STEPS_CH8];
  parts.forEach(function(p){
    if(p && typeof p === "object"){
      for(var k in p){ if(Object.prototype.hasOwnProperty.call(p,k)) STEPS[k] = p[k]; }
    }
  });
})();

/* 注入步骤样式 */
(function(){
  if(document.getElementById("gsStepStyle")) return;
  var st = document.createElement("style");
  st.id = "gsStepStyle";
  st.textContent = [
    "/* 考点 */",
    ".gs-kp{display:inline-block;font-size:12px;font-weight:700;color:#7c5a12;background:#fff6dd;border:1px solid #f0dfae;border-radius:6px;padding:3px 10px;margin-bottom:11px}",
    "/* 思路块 */",
    ".gs-sec{margin-top:12px;border-top:1px dashed #dbe6f0;padding-top:11px}",
    ".gs-sec:first-of-type{border-top:none;padding-top:0;margin-top:4px}",
    ".gs-lbl{font-size:11.5px;font-weight:700;color:#5b7fa3;letter-spacing:.4px;margin-bottom:7px}",
    ".gs-txt{font-size:13.5px;line-height:2;color:#2c3e50}",
    "/* 步骤 */",
    ".gs-steps{margin:0;padding:0;list-style:none;counter-reset:gs}",
    ".gs-steps li{position:relative;padding:8px 0 8px 34px;font-size:13.5px;line-height:2;color:#2c3e50;border-bottom:1px solid #f2f6fa}",
    ".gs-steps li:last-child{border-bottom:none}",
    ".gs-steps li:before{counter-increment:gs;content:counter(gs);position:absolute;left:0;top:9px;width:22px;height:22px;line-height:22px;text-align:center;font-size:11.5px;font-weight:700;color:#fff;background:#4a86b8;border-radius:50%}",
    "/* 易错 */",
    ".gs-trap{background:#fff8f4;border-left:3px solid #e8a878;border-radius:0 8px 8px 0;padding:11px 14px;font-size:13px;line-height:1.95;color:#8a5230}",
    ".gs-trap .gs-lbl{color:#c07a45}",
    "/* 考点块 */",
    ".gs-box{background:#f7fbfe;border:1px solid #dbe9f4;border-radius:10px;padding:13px 16px}",
    "@media(max-width:640px){.gs-txt,.gs-steps li{font-size:13px;line-height:1.9}}"
  ].join("\n");
  document.head.appendChild(st);
})();

/* 渲染完整步骤 */
function gsDetail(q){
  var d = STEPS[q.id];
  if(!d) return "";
  var h = '<div class="gs-box">';
  if(d.kp) h += '<div class="gs-kp">考点 · '+esc(d.kp)+'</div>';
  if(d.idea){
    h += '<div class="gs-sec"><div class="gs-lbl">解题思路</div>';
    h += '<div class="gs-txt">'+nl(d.idea)+'</div></div>';
  }
  if(d.steps && d.steps.length){
    h += '<div class="gs-sec"><div class="gs-lbl">完整步骤</div>';
    h += '<ol class="gs-steps">';
    d.steps.forEach(function(x){ h += '<li>'+nl(x)+'</li>'; });
    h += '</ol></div>';
  }
  if(d.trap){
    h += '<div class="gs-sec"><div class="gs-trap">';
    h += '<div class="gs-lbl">易错提醒</div>'+nl(d.trap);
    h += '</div></div>';
  }
  h += '</div>';
  return h;
}

var LET = ["A","B","C","D"];

/* 题所属章：id 形如 "2-13" */
function chOf(q){
  var m = /^(\d+)/.exec(String(q.id || ""));
  if(m) return parseInt(m[1], 10);
  return q.c != null ? parseInt(q.c, 10) : 0;
}

var QS = CH === null ? [] : ALLQ.filter(function(q){ return chOf(q) === CH; });

/* ============ 目录页 ============ */
function renderIndex(){
  document.getElementById("bar").style.display = "none";

  var CHS = NAV.chapters || [];
  var items = CHS.map(function(c){
    var qs = ALLQ.filter(function(q){ return chOf(q) === c.no; });
    var solo = qs.filter(function(q){ return q.type === "单选"; }).length;
    var fill = qs.filter(function(q){ return q.type === "填空"; }).length;
    var calc = qs.filter(function(q){ return q.type === "计算"; }).length;
    return {
      no: c.no,
      title: c.title,
      desc: "单选 " + solo + " · 填空 " + fill + " · 计算 " + calc,
      stats: [{ t: " 题", v: qs.length }]
    };
  });

  window.GS_renderChapIndex("chapidx", items, "practice.html");

  var S = NAV.stats || {};
  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = (S.questions||0) + " 题";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = "共 " + (S.questions||0) + " 题，分布在 " + CHS.length + " 章。按章分开做，一章一页，做完看本章正确率。";
}

/* ============ 单章页 ============ */
function renderChapter(){
  document.getElementById("bar").style.display = "";

  var picked = ST.getPicked();
  var shown  = ST.getShown();
  var rates  = ST.getRates();

  var list = QS.filter(function(q){
    if(TYPE !== "all" && q.type !== TYPE) return false;
    if(KEY && !(has(q.t) || has(q.s) || (q.o||[]).some(has))) return false;
    if(STATE === "wrong"){
      var r = rates[q.id];
      var p = picked[q.id];
      var isWrong = (r === "err") || (q.type === "单选" && p && p !== q.a);
      if(!isWrong) return false;
    }
    if(STATE === "todo"){
      if(picked[q.id] || rates[q.id]) return false;
    }
    return true;
  });

  /* 本章进度 */
  var done = 0, right = 0;
  QS.forEach(function(q){
    var p = picked[q.id], r = rates[q.id];
    if(p || r){
      done++;
      if(r === "ok" || (q.type === "单选" && p === q.a)) right++;
    }
  });
  var pct = QS.length ? Math.round(right / QS.length * 100) : 0;

  /* 章节头 */
  var ch = (NAV.chapters || []).filter(function(c){ return c.no === CH; })[0];
  var head = '<div class="chaphero">';
  head += '<span class="ch-no">第 ' + CH + ' 章</span>';
  head += '<h2>' + esc(ch ? window.GS_SHORT(ch.title) : '') + '</h2>';
  head += '<div class="ch-st"><span><b>'+QS.length+'</b> 道题</span><span><b>'+done+'</b> 已做</span><span><b>'+right+'</b> 做对</span><span><b>'+pct+'%</b> 正确率</span></div>';
  head += '</div>';

  var h = head;
  h += '<div class="gsummary" style="border-left-color:#3f8f4a;padding:12px 16px;margin-bottom:14px">';
  h += '<div style="height:8px;background:#eef1f5;border-radius:4px;overflow:hidden"><div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#57a35b,#3f8f4a);transition:width .3s"></div></div>';
  h += '</div>';

  if(!QS.length){
    $main.innerHTML = head + '<div class="empty">本章还没有题目</div>';
    return;
  }
  if(!list.length){
    $main.innerHTML = head + '<div class="empty">没有匹配的题目</div>';
    return;
  }

  h += '<div class="stats"><span>显示 '+list.length+' / '+QS.length+' 题'+(KEY?'（搜索：'+esc(KEY)+'）':'')+'</span></div>';

  ["单选","填空","计算","应用","证明"].forEach(function(tp){
    var items = list.filter(function(q){ return q.type === tp; });
    if(!items.length) return;

    h += '<div class="sec">'+tp+'题<span class="cnt">'+items.length+' 题</span></div>';

    items.forEach(function(q){
      var pick = picked[q.id];
      var isShown = !!shown[q.id];
      var rate = rates[q.id];

      h += '<div class="qbox" data-qid="'+q.id+'">';
      h += '<div class="qh"><span class="num">'+esc(q.id)+'</span><span class="tx">'+hl(q.t)+'</span></div>';

      if(q.type === "单选"){
        h += '<div class="opts">';
        (q.o||[]).forEach(function(o, i){
          var L = LET[i];
          var cls = "opt";
          if(pick){
            if(L === q.a) cls += " right";
            else if(L === pick) cls += " wrong";
          }
          h += '<button class="'+cls+'" data-opt="'+q.id+'" data-l="'+L+'">';
          h += '<span class="ol">'+L+'</span><span class="ot">'+hl(o)+'</span>';
          h += '</button>';
        });
        h += '</div>';
      }else{
        h += '<div class="answer-zone">';
        var ph = q.type === "填空" ? "填写答案…" : "写出完整解题过程…";
        var rows = q.type === "填空" ? 2 : 4;
        h += '<textarea data-aid="'+q.id+'" placeholder="'+esc(ph)+'" rows="'+rows+'">'+esc(pick||"")+'</textarea>';
        h += '<div class="az-actions">';
        h += '<button class="az-btn primary" data-cmp="'+q.id+'">对照答案</button>';
        if(isShown) h += '<button class="az-btn" data-close="'+q.id+'">收起</button>';
        h += '</div>';

        if(isShown){
          h += '<div class="az-cmp open">';
          h += '<div class="lbl">我的作答</div>';
          h += '<div class="my">'+esc(pick || "（未填写）")+'</div>';
          h += '<div class="lbl">参考答案</div>';
          h += '<div class="ref">'+hl(q.a)+'</div>';
          h += '<div class="lbl">解析</div>';
          h += '<div class="note">'+nl(q.s)+'</div>';
          h += gsDetail(q);
          h += '<div class="az-rate">';
          h += '<span>自评：</span>';
          h += '<button class="rate-btn'+(rate==="ok"?" on-ok":"")+'" data-rate="'+q.id+'" data-r="ok">答对了</button>';
          h += '<button class="rate-btn'+(rate==="err"?" on-err":"")+'" data-rate="'+q.id+'" data-r="err">答错了</button>';
          h += '</div>';
          h += '</div>';
        }
        h += '</div>';
      }

      if(q.type === "单选"){
        if(isShown){
          h += '<div class="az-cmp open" style="margin-top:10px">';
          h += '<div class="lbl">正确答案</div>';
          h += '<div class="ref">'+esc(q.a)+'</div>';
          h += '<div class="lbl">解析</div>';
          h += '<div class="note">'+nl(q.s)+'</div>';
          h += gsDetail(q);
          h += '</div>';
        }else{
          h += '<div class="az-actions" style="margin-top:9px">';
          h += '<button class="az-btn" data-cmp="'+q.id+'">看解析</button>';
          h += '</div>';
        }
      }

      h += '</div>';
    });
  });

  $main.innerHTML = h;

  var bd = document.getElementById("hBadge");
  if(bd) bd.textContent = "第 " + CH + " 章 · " + QS.length + " 题";
  var sb = document.getElementById("hSub");
  if(sb) sb.textContent = (ch ? window.GS_SHORT(ch.title) : "") + "。" + QS.length +
    " 道题。选择题点选项即判对错；填空和计算先自己写，再对照答案。";

  window.GS_renderChapBar("chapbar", "practice.html", {
    count: function(c){
      return ALLQ.filter(function(q){ return chOf(q) === c.no; }).length;
    }
  });
  window.GS_renderChapPager("chpager", "practice.html");
}

/* ============ 事件 ============ */
$main.addEventListener("click", function(e){
  var t = e.target;

  var op = t.closest("[data-opt]");
  if(op){
    var id = op.getAttribute("data-opt");
    var L = op.getAttribute("data-l");
    var cur = ST.getPicked()[id];
    if(cur === L){
      ST.setPicked(id, "");
      ST.setShown(id, false);
      ST.setRate(id, "");
    }else{
      ST.setPicked(id, L);
      var q = null;
      for(var i=0;i<QS.length;i++){ if(QS[i].id === id){ q = QS[i]; break; } }
      if(q){
        ST.setShown(id, true);
        ST.setRate(id, L === q.a ? "ok" : "err");
      }
    }
    renderChapter();
    return;
  }

  var cm = t.closest("[data-cmp]");
  if(cm){ ST.setShown(cm.getAttribute("data-cmp"), true); renderChapter(); return; }

  var cl = t.closest("[data-close]");
  if(cl){ ST.setShown(cl.getAttribute("data-close"), false); renderChapter(); return; }

  var rt = t.closest("[data-rate]");
  if(rt){
    var rid = rt.getAttribute("data-rate");
    var r = rt.getAttribute("data-r");
    var rates = ST.getRates();
    ST.setRate(rid, rates[rid] === r ? "" : r);
    renderChapter();
    return;
  }
});

var saveTimer = null;
$main.addEventListener("input", function(e){
  var ta = e.target.closest("textarea[data-aid]");
  if(!ta) return;
  var id = ta.getAttribute("data-aid");
  var val = ta.value;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function(){ ST.setPicked(id, val); }, 300);
});

var timer = null;
$q.addEventListener("input", function(){
  clearTimeout(timer);
  timer = setTimeout(function(){
    KEY = this.value.trim().toLowerCase();
    renderChapter();
  }.bind(this), 170);
});

document.getElementById("fType").addEventListener("change", function(){ TYPE = this.value || "all"; renderChapter(); });
document.getElementById("fState").addEventListener("change", function(){ STATE = this.value || "all"; renderChapter(); });

document.getElementById("btnReset").addEventListener("click", function(){
  if(!confirm("清空本章全部作答与自评？")) return;
  QS.forEach(function(q){
    ST.setPicked(q.id, "");
    ST.setShown(q.id, false);
    ST.setRate(q.id, "");
  });
  renderChapter();
});

/* ============ 启动 ============ */
if(CH === null){
  renderIndex();
  window.GS_renderChapBar("chapbar", "practice.html", {
    withAll: false,
    count: function(c){
      return ALLQ.filter(function(q){ return chOf(q) === c.no; }).length;
    }
  });
}else{
  renderChapter();
}
})();
