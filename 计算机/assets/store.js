/* 计算机学习进度存储（localStorage） */
(function () {
  "use strict";
  var P = "js1_v1_";

  function load(k, def) {
    try { var v = localStorage.getItem(P + k); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function save(k, v) {
    try { localStorage.setItem(P + k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }
  function del(k) { try { localStorage.removeItem(P + k); } catch (e) {} }

  window.JS_STORE = {
    getPicked: function () { return load("picked", {}); },
    setPicked: function (id, v) {
      var a = load("picked", {});
      if (v) a[id] = v; else delete a[id];
      save("picked", a);
    },

    getShown: function () { return load("shown", {}); },
    setShown: function (id, on) {
      var s = load("shown", {});
      if (on) s[id] = 1; else delete s[id];
      save("shown", s);
    },

    getRates: function () { return load("rates", {}); },
    setRate: function (id, r) {
      var a = load("rates", {});
      if (r) a[id] = r; else delete a[id];
      save("rates", a);
    },

    /* 章节筛选持久化 */
    getFilter: function () { return load("filter", "all"); },
    setFilter: function (v) { save("filter", v); },

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
