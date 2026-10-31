/* 学习进度存储：localStorage 封装（作答 / 自评 / 错题本） */
(function () {
  "use strict";
  var P = "yw_en_v3_";

  function load(k, def) {
    try { var v = localStorage.getItem(P + k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function save(k, v) {
    try { localStorage.setItem(P + k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function del(k) {
    try { localStorage.removeItem(P + k); } catch (e) {}
  }

  window.YW_STORE = {
    /* 作答内容 {id: "文本"} */
    getAnswers: function () { return load("answers", {}); },
    setAnswer: function (id, t) {
      var a = load("answers", {});
      if (t) a[id] = t; else delete a[id];
      save("answers", a);
    },
    delAnswer: function (id) { this.setAnswer(id, ""); },

    /* 已展开对照 {id: 1} */
    getShown: function () { return load("shown", {}); },
    setShown: function (id, on) {
      var s = load("shown", {});
      if (on) s[id] = 1; else delete s[id];
      save("shown", s);
    },

    /* 自评 {id: "ok"|"so"|"err"} */
    getRates: function () { return load("rates", {}); },
    setRate: function (id, r) {
      var a = load("rates", {});
      if (r) a[id] = r; else delete a[id];
      save("rates", a);
    },

    /* 错题本 {id: {g, theme, q, a, rate, ts}} */
    getWrong: function () { return load("wrong", {}); },
    addWrong: function (id, info) {
      var w = load("wrong", {});
      w[id] = info;
      save("wrong", w);
    },
    delWrong: function (id) {
      var w = load("wrong", {});
      delete w[id];
      save("wrong", w);
    },
    clearWrong: function () { save("wrong", {}); },

    /* 统计 */
    stats: function () {
      var r = load("rates", {});
      var ok = 0, so = 0, err = 0;
      for (var k in r) {
        if (r[k] === "ok") ok++;
        else if (r[k] === "so") so++;
        else if (r[k] === "err") err++;
      }
      var w = load("wrong", {});
      return {
        ok: ok, so: so, err: err, total: ok + so + err,
        wrong: Object.keys(w).length,
        answers: Object.keys(load("answers", {})).length
      };
    },

    /* 重置全部 */
    resetAll: function () {
      ["answers", "shown", "rates", "wrong"].forEach(function (k) { del(k); });
    }
  };
})();
