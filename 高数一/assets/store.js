/* 高数一学习进度存储（localStorage） */
(function () {
  "use strict";
  var P = "gs1_v1_";

  function load(k, def) {
    try { var v = localStorage.getItem(P + k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function save(k, v) {
    try { localStorage.setItem(P + k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function del(k) { try { localStorage.removeItem(P + k); } catch (e) {} }

  window.GS_STORE = {
    /* 作答：选择/文本统一存这里 */
    getPicked: function () { return load("picked", {}); },
    setPicked: function (id, v) {
      var a = load("picked", {});
      if (v) a[id] = v; else delete a[id];
      save("picked", a);
    },

    /* 是否已展开答案 */
    getShown: function () { return load("shown", {}); },
    setShown: function (id, on) {
      var s = load("shown", {});
      if (on) s[id] = 1; else delete s[id];
      save("shown", s);
    },

    /* 自评 */
    getRates: function () { return load("rates", {}); },
    setRate: function (id, r) {
      var a = load("rates", {});
      if (r) a[id] = r; else delete a[id];
      save("rates", a);
    },

    stats: function () {
      var r = load("rates", {});
      var ok = 0, err = 0;
      for (var k in r) {
        if (r[k] === "ok") ok++;
        else if (r[k] === "err") err++;
      }
      return { ok: ok, err: err, total: ok + err, picked: Object.keys(load("picked", {})).length };
    },

    resetAll: function () {
      ["picked", "shown", "rates"].forEach(function (k) { del(k); });
    }
  };
})();
