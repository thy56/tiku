/* ===========================================================
   kp_single.js — 单个知识点独立页渲染
   依赖 window.KP_DATA（data/knflat.js）、window.KP_CUR（当前 id）
   内链标记约定（由构建期生成）：
     \x02<目标id>\x02<锚文本>\x03
   =========================================================== */
(function () {
  "use strict";

  var D = window.KP_DATA;
  var CUR = window.KP_CUR;
  if (!D || !CUR) return;

  var ALL = D.items || [];
  var BY = {};
  ALL.forEach(function (x) { BY[x.id] = x; });

  var IT = BY[CUR];
  if (!IT) {
    document.getElementById("main").innerHTML =
      '<div class="empty">没有这个知识点：' + CUR + '</div>';
    return;
  }

  var CH = (D.chapters || []).filter(function (c) { return c.no === IT.ch; })[0] || {};
  var inCh = ALL.filter(function (x) { return x.ch === IT.ch; });
  var pos = inCh.findIndex(function (x) { return x.id === CUR; });

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* 把内链标记还原成 <a>，其余转义 */
  function rich(s) {
    if (!s) return "";
    var out = "";
    var re = /\x02([^\x02]+)\x02([\s\S]*?)\x03/g;
    var last = 0, m;
    while ((m = re.exec(s)) !== null) {
      out += esc(s.slice(last, m.index)).replace(/\n/g, "<br>");
      var tid = m[1], txt = m[2];
      var tgt = BY[tid];
      if (tgt) {
        out += '<a class="kpl" href="' + tid + '.html" title="' + esc(tgt.t) + '">' + esc(txt) + "</a>";
      } else {
        out += esc(txt);
      }
      last = re.lastIndex;
    }
    out += esc(s.slice(last)).replace(/\n/g, "<br>");
    return out;
  }

  /* ---------- 面包屑 ---------- */
  function crumb() {
    var h = '<div class="kcrumb">';
    h += '<a href="know.html">知识体系</a>';
    h += '<i>›</i>';
    h += '<a href="know.html?ch=' + IT.ch + '">第' + IT.ch + '章 ' + esc((CH.title || "").replace(/^第[一二三四五六七八九十\d]+章[\s\u3000]*/, "")) + '</a>';
    h += '<i>›</i>';
    h += '<span>' + esc(IT.t) + '</span>';
    h += '</div>';
    return h;
  }

  /* ---------- 正文 ---------- */
  var h = "";
  h += '<div class="khero">';
  h += '<div class="kh-meta">第 ' + IT.ch + ' 章 · 第 ' + (pos + 1) + ' / ' + inCh.length + ' 个知识点</div>';
  h += '<h1>' + esc(IT.t) + '</h1>';
  if (IT.gTitle) h += '<div class="kh-grp">专题：' + esc(IT.gTitle) + '</div>';
  h += '</div>';

  if (IT.body) {
    h += '<div class="kbody" id="kbody">' + rich(IT.body) + '</div>';
  }

  /* 相关公式（高数一有 formulas 字段） */
  if (IT.formulas && IT.formulas.length) {
    h += '<div class="ksec"><h3>相关公式</h3><div class="kfml">';
    IT.formulas.forEach(function (f) {
      var name = typeof f === "string" ? f : (f.name || "");
      var tex = typeof f === "string" ? f : (f.tex || "");
      /* 数据里的 tex 可能已自带 $...$（甚至一条里有多个内联公式），
         已有 $ 就原样输出；没有才用 $$ 包成独立公式块。 */
      var texHtml = /\$/.test(tex) ? esc(tex) : ('$$' + esc(tex) + '$$');
      h += '<div class="kfrow"><span class="kfname">' + esc(name) + '</span>';
      h += '<span class="kftex">' + texHtml + '</span></div>';
    });
    h += '</div></div>';
  }

  /* 考点与易错 */
  if (IT.points && IT.points.length) {
    h += '<div class="ksec kpts"><h3>考点与易错</h3><ul>';
    IT.points.forEach(function (p) { h += "<li>" + esc(p) + "</li>"; });
    h += "</ul></div>";
  }

  /* 同专题其它知识点 */
  if (IT.sibs && IT.sibs.length) {
    h += '<div class="ksec"><h3>同专题知识点（' + esc(IT.gTitle) + '）</h3><div class="krel">';
    IT.sibs.forEach(function (sid) {
      var t = BY[sid];
      if (!t) return;
      h += '<a class="krl" href="' + sid + '.html"><span class="krl-n">' + t.n + '</span>' + esc(t.t) + "</a>";
    });
    h += "</div></div>";
  }

  /* 本章其它功能页 —— 按科目切换，只链真实存在的页 */
  var SUB = window.KP_SUB || "";
  h += '<div class="ksec"><h3>本章资源</h3><div class="krel">';
  h += '<a class="krl krl-x" href="know.html?ch=' + IT.ch + '">本章知识目录</a>';
  if (SUB === "英语") {
    h += '<a class="krl krl-x" href="专项练习.html">专项练习</a>';
    h += '<a class="krl krl-x" href="题库.html">题库</a>';
    h += '<a class="krl krl-x" href="历年真题.html">历年真题</a>';
    h += '<a class="krl krl-x" href="grammar.html">语法专题</a>';
  } else if (SUB === "语文") {
    h += '<a class="krl krl-x" href="wen.html">课文篇目</a>';
    h += '<a class="krl krl-x" href="专项练习.html">专项练习</a>';
    h += '<a class="krl krl-x" href="题库.html">题库</a>';
    h += '<a class="krl krl-x" href="历年真题.html">历年真题</a>';
  } else {
    h += '<a class="krl krl-x" href="ex-ch' + IT.ch + '.html">本章例题</a>';
    h += '<a class="krl krl-x" href="pr-ch' + IT.ch + '.html">本章练习</a>';
    if (SUB === "高数一") {
      h += '<a class="krl krl-x" href="fm-ch' + IT.ch + '.html">本章公式表</a>';
    }
  }
  h += "</div></div>";

  document.getElementById("main").innerHTML = h;
  document.getElementById("crumb").innerHTML = crumb();

  /* ---------- 上下翻 ---------- */
  var p = '<div class="kpn">';
  var pv = IT.prev ? BY[IT.prev] : null;
  var nx = IT.next ? BY[IT.next] : null;
  p += pv
    ? '<a class="kpn-a prev" href="' + pv.id + '.html"><span>← 上一知识点</span><b>' + esc(pv.t) + "</b></a>"
    : '<span class="kpn-a dis"><span>← 上一知识点</span><b>已是第一个</b></span>';
  p += '<a class="kpn-a mid" href="know.html?ch=' + IT.ch + '">本章目录</a>';
  p += nx
    ? '<a class="kpn-a next" href="' + nx.id + '.html"><span>下一知识点 →</span><b>' + esc(nx.t) + "</b></a>"
    : '<span class="kpn-a dis"><span>下一知识点 →</span><b>已是最后一个</b></span>';
  p += "</div>";
  document.getElementById("kpnav").innerHTML = p;

  /* ---------- 文档标题 ---------- */
  document.title = IT.t + " · 山东专升本" + (window.KP_SUB || "");

  /* ---------- 回到顶部 ---------- */
  var top = document.getElementById("top");
  if (top) top.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
})();
