/* -----------------------------------------------------------
   题库拍平（浏览器 / Node 共用）
   把三科异构题库统一成 {id,type,t,o,a,s} 列表
   ID 规则必须稳定，否则生成的 daily100 与页面渲染对不上
   ----------------------------------------------------------- */
(function (global) {
  "use strict";

  /* ---------- 语文 ---------- */
  /* p1 = 选择 219、p2 = 实词 110、p3 = 翻译 220 */
  function yuwen(data) {
    var list = [], gi = 0;
    (data.groups || []).forEach(function (g) {
      var gid = g.no != null ? g.no : ++gi;
      gi++;

      (g.p1 || []).forEach(function (it, i) {
        list.push({
          id: "y1-" + gid + "-" + i,
          type: "单选",
          t: it.q || "",
          o: it.opts || [],
          a: String(it.ans || "").trim(),
          s: it.note || ""
        });
      });
      (g.p2 || []).forEach(function (it, i) {
        list.push({
          id: "y2-" + gid + "-" + i,
          type: "释词",
          t: it.q || "",
          o: it.opts || [],
          a: String(it.ans || "").trim(),
          s: it.note || ""
        });
      });
      (g.p3 || []).forEach(function (it, i) {
        list.push({
          id: "y3-" + gid + "-" + i,
          type: "翻译",
          t: it.q || "",
          o: [],
          a: String(it.a || "").trim(),
          s: it.note || ""
        });
      });
    });
    return list;
  }

  /* ---------- 英语 ---------- */
  /* part 0=汉译英 1=英译汉 2=词根 */
  var EN_TYPE = { 0: "汉译英", 1: "英译汉", 2: "词根" };
  function yingyu(data) {
    var list = [], gi = 0;
    (data.groups || []).forEach(function (g) {
      var gid = g.no != null ? g.no : ++gi;
      gi++;
      (g.items || []).forEach(function (it, i) {
        var p = parseInt(it.part, 10);
        list.push({
          id: "e" + (isNaN(p) ? 9 : p) + "-" + gid + "-" + i,
          type: EN_TYPE[p] || "翻译",
          t: it.q || "",
          o: [],
          a: String(it.a || "").trim(),
          s: ""
        });
      });
    });
    return list;
  }

  /* ---------- 计算机 ---------- */
  function jisuanji(data) {
    return (data.questions || []).map(function (q) {
      return {
        id: q.id,
        type: q.type,
        t: q.t || "",
        o: q.o || [],
        a: String(q.a || "").trim(),
        s: q.s || "",
        c: q.c
      };
    });
  }

  global.BANKFLAT = {
    yuwen: yuwen,
    yingyu: yingyu,
    jisuanji: jisuanji
  };
})(typeof window !== "undefined" ? window : globalThis);
