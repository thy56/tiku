/* 词根专项练习 · 渲染 v3（168 题 + 词根详解）
 * 数据：
 *   英语/data/roots_quiz.js → window.ROOTS（题目 + 词表）
 *   英语/data/root_deep.js  → window.ROOT_DEEP（68 词根详解）
 * 详解结构：词源 / 构词逻辑 / 前缀词族 / 固定搭配 / 易混辨析 / 记忆诀窍 / 考点提示
 * A 释义 56：选择式自动判分
 * B 构词 56：折叠自评
 * C 派生 56：折叠自评
 */
(function () {
  'use strict';

  var D = window.ROOTS || { a: [], b: [], c: [] };
  var DEEP = window.ROOT_DEEP || {};
  var KEY = 'gs_roots_quiz_v3';

  var state = load();
  var MODE = (function () {
    var h = (location.hash || '').replace('#', '').toLowerCase();
    if (h === 'a' || h === 'b' || h === 'c') return h;
    return state.mode || 'a';
  })();

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  /* vers(t) / duce/duct / sens(t) → vers / duce / sens */
  function normRoot(r) {
    return String(r).replace(/\([a-z]*\)/g, '').split('/')[0].trim().toLowerCase();
  }

  /* ---------- 选项 ---------- */
  function buildOptions(item, pool) {
    var right = item.pairs[item.roots[0]] || '';
    var opts = [right];
    var bag = [];
    pool.forEach(function (x) {
      Object.keys(x.pairs || {}).forEach(function (k) {
        var v = x.pairs[k];
        if (v && v !== right && bag.indexOf(v) < 0) bag.push(v);
      });
    });
    shuffle(bag).slice(0, 3).forEach(function (v) {
      if (opts.indexOf(v) < 0) opts.push(v);
    });
    return shuffle(opts);
  }

  /* ---------- 词根详解块 ---------- */
  function deepBlock(rootRaw) {
    var k = normRoot(rootRaw);
    var g = DEEP[k];
    if (!g) return '';

    var h = '<div class="dcard">';

    /* 标题 */
    h += '<div class="dhd">';
    h += '<b class="droot">' + esc(g.lemma || k) + '</b>';
    h += '<span class="dcore">＝ ' + esc(g.core) + '</span>';
    h += '</div>';

    /* 词源 */
    if (g.origin) {
      h += '<div class="dsec"><div class="dsk">词源来历</div>' +
        '<div class="dst">' + esc(g.origin) + '</div></div>';
    }

    /* 构词逻辑 */
    if (g.logic) {
      h += '<div class="dsec"><div class="dsk">构词逻辑</div>' +
        '<div class="dst">' + esc(g.logic) + '</div></div>';
    }

    /* 前缀词族表 */
    if (g.fam && g.fam.length) {
      h += '<div class="dsec"><div class="dsk">前缀词族 · ' + g.fam.length + ' 个</div>';
      h += '<table class="dfam"><tbody>';
      g.fam.forEach(function (f) {
        h += '<tr>' +
          '<td class="fc-pre">' + esc(f.pre) + '</td>' +
          '<td class="fc-w">' + esc(f.word) + '</td>' +
          '<td class="fc-pos">' + esc(f.pos || '') + '</td>' +
          '<td class="fc-cn">' + esc(f.cn) + '</td>' +
          '</tr>';
        if (f.why) {
          h += '<tr><td></td><td colspan="3" class="fc-why">' + esc(f.why) + '</td></tr>';
        }
      });
      h += '</tbody></table></div>';
    }

    /* 固定搭配 */
    if (g.col && g.col.length) {
      h += '<div class="dsec"><div class="dsk">固定搭配 · ' + g.col.length + ' 条</div>';
      h += '<ul class="dcol">';
      g.col.forEach(function (c) {
        h += '<li>' + esc(c) + '</li>';
      });
      h += '</ul></div>';
    }

    /* 易混辨析 */
    if (g.conf && g.conf.length) {
      h += '<div class="dsec"><div class="dsk">易混辨析 · ' + g.conf.length + ' 组</div>';
      g.conf.forEach(function (c) {
        h += '<div class="dconf">';
        var names = [c.a, c.b, c.c].filter(Boolean);
        h += '<div class="dconf-h">' + names.map(function (x) {
          return '<b>' + esc(x) + '</b>';
        }).join(' <span class="vs">vs</span> ') + '</div>';
        h += '<div class="dconf-t">' + esc(c.note) + '</div>';
        h += '</div>';
      });
      h += '</div>';
    }

    /* 记忆诀窍 */
    if (g.mnem) {
      h += '<div class="dsec dmnem"><div class="dsk">记忆诀窍</div>' +
        '<div class="dst">' + esc(g.mnem) + '</div></div>';
    }

    /* 考点提示 */
    if (g.exam) {
      h += '<div class="dsec dexam"><div class="dsk">考点提示</div>' +
        '<div class="dst">' + esc(g.exam) + '</div></div>';
    }

    h += '</div>';
    return h;
  }

  /* ---------- 同族词表（来自 roots_quiz 的 detail.words） ---------- */
  function wordsBlock(it, limit) {
    var d = it.detail;
    if (!d || !d.roots || !d.roots.length) return '';
    var h = '';
    d.roots.forEach(function (r) {
      var ws = r.words || [];
      if (!ws.length) return;
      var show = limit === 0 ? ws : ws.slice(0, limit);
      h += '<div class="dwords">';
      h += '<div class="dsk">' + esc(r.root) + ' 词族词汇 · ' + ws.length + ' 词</div>';
      h += '<table class="dtab">';
      show.forEach(function (w) {
        h += '<tr><td class="dw">' + esc(w.word) + '</td>' +
          '<td class="dp">' + esc(w.pos || '') + '</td>' +
          '<td class="dm">' + esc(w.meaning || '') + '</td></tr>';
        if (w.memory) {
          h += '<tr><td></td><td></td><td class="dmem">' + esc(w.memory) + '</td></tr>';
        }
      });
      h += '</table>';
      if (limit > 0 && ws.length > limit) {
        h += '<div class="dmore">还有 ' + (ws.length - limit) + ' 个词未展开</div>';
      }
      h += '</div>';
    });
    return h;
  }

  /* ---------- 组合完整解析 ---------- */
  function analysisHTML(it, wordLimit) {
    var h = '<div class="dwrap">';
    var roots = it.roots || [];
    if (!roots.length) return h + '</div>';
    roots.forEach(function (r) {
      h += deepBlock(r);
    });
    h += wordsBlock(it, wordLimit);
    if (it.exp) {
      h += '<div class="dexp"><span>原题解析</span>' + esc(it.exp) + '</div>';
    }
    h += '</div>';
    return h;
  }

  /* ---------- 标签页 ---------- */
  function renderTabs() {
    var box = document.getElementById('tabs');
    if (!box) return;
    var tabs = [
      ['a', 'A 词根释义', '看词根说意思', D.a.length],
      ['b', 'B 构词推理', '前缀＋词根', D.b.length],
      ['c', 'C 派生词族', '一个词根串一串', D.c.length]
    ];
    var h = '';
    tabs.forEach(function (t) {
      h += '<button class="mbtn' + (MODE === t[0] ? ' on' : '') +
        '" data-m="' + t[0] + '"><b>' + esc(t[1]) + '</b><span>' +
        esc(t[2]) + ' · ' + t[3] + ' 题</span></button>';
    });
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('.mbtn'), function (b) {
      b.onclick = function () {
        MODE = b.getAttribute('data-m');
        state.mode = MODE;
        save();
        try { history.replaceState(null, '', '#' + MODE); } catch (e) {}
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  function renderGuide() {
    var box = document.getElementById('guide');
    if (!box) return;
    var t = {
      a: '<b>A 类怎么练</b>：看到词根先自己想核心义，再选答案。答完展开的是这个词根的<b>完整档案</b>——词源、构词逻辑、前缀词族、固定搭配、易混辨析、记忆诀窍、考点提示。',
      b: '<b>B 类怎么练</b>：前缀定方向、词根定含义。先在纸上写出单词，再展开核对，然后读一遍词根档案，按「会／不会」自评。',
      c: '<b>C 类怎么练</b>：给一个词根，尽量多写派生词。写完展开对比，读词族表补齐缺口。'
    };
    box.innerHTML = t[MODE] || '';
  }

  function renderStat() {
    var box = document.getElementById('stat');
    if (!box) return;
    var items = D[MODE] || [];
    var done = 0, right = 0, known = 0;
    items.forEach(function (it) {
      var v = state[MODE + ':' + it.id];
      if (v) {
        done++;
        if (v === '1') right++;
        if (v === 'k') known++;
      }
    });
    var pct = items.length ? Math.round(done * 100 / items.length) : 0;
    box.innerHTML =
      '<div class="sline"><div class="sp-bar"><i style="width:' + pct + '%"></i></div>' +
      '<span>已做 <b>' + done + '</b>/' + items.length +
      (MODE === 'a'
        ? '　正确 <b>' + right + '</b>' + (done ? '（' + Math.round(right * 100 / done) + '%）' : '')
        : '　会 <b>' + known + '</b>') +
      '</span></div>';
  }

  /* ---------- A 类 ---------- */
  function renderA() {
    var items = D.a;
    var h = '';
    items.forEach(function (it) {
      var id = it.id;
      var pick = state['a:' + id] || '';
      var root = it.roots[0];
      var right = it.pairs[root] || '';
      var more = it.roots.slice(1);
      var opts = buildOptions(it, items);
      var answered = !!pick;
      var ok = answered && pick === right;

      h += '<div class="qcard' + (answered ? (ok ? ' ok' : ' no') : '') + '">';
      h += '<div class="qmeta">' + esc(id) + ' · 第' + it.g + '组 · ' + esc(it.theme || '') + '</div>';
      h += '<div class="qroot">' + esc(root) + '</div>';
      h += '<div class="qq">它的核心义是？</div>';
      h += '<div class="qopts">';
      opts.forEach(function (o) {
        var cls = 'opt';
        if (answered) {
          if (o === right) cls += ' right';
          else if (o === pick) cls += ' wrong';
          else cls += ' dim';
        }
        h += '<button class="' + cls + '" data-v="' + esc(o) + '" data-id="' + esc(id) + '"' +
          (answered ? ' disabled' : '') + '>' + esc(o) + '</button>';
      });
      h += '</div>';

      if (answered) {
        h += '<div class="qans ' + (ok ? 'isok' : 'isno') + '">';
        h += '<div class="qverdict">' + (ok ? '✓ 对了' : '✗ 应是「' + esc(right) + '」') + '</div>';
        if (more.length) {
          h += '<div class="qwhy">同题还有：' +
            more.map(function (r) {
              return '<b>' + esc(r) + '</b> = ' + esc(it.pairs[r] || '');
            }).join('　') + '</div>';
        }
        h += analysisHTML(it, 8);
        h += '</div>';
      }
      h += '</div>';
    });
    document.getElementById('list').innerHTML = h;

    Array.prototype.forEach.call(document.querySelectorAll('#list .opt'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-id');
        if (state['a:' + id]) return;
        var it = null;
        for (var i = 0; i < D.a.length; i++) if (D.a[i].id === id) { it = D.a[i]; break; }
        if (!it) return;
        var right = it.pairs[it.roots[0]] || '';
        state['a:' + id] = (b.getAttribute('data-v') === right) ? '1' : '0';
        save();
        render();
      };
    });
  }

  /* ---------- B / C 类 ---------- */
  function renderSelf(mode) {
    var items = D[mode] || [];
    var h = '';
    items.forEach(function (it) {
      var id = it.id;
      var open = !!state['open:' + mode + ':' + id];
      var mark = state[mode + ':' + id] || '';
      var roots = (it.roots || []).join(' / ');

      h += '<div class="qcard">';
      h += '<div class="qmeta">' + esc(id) + ' · 第' + it.g + '组 · ' + esc(it.theme || '') +
        (roots ? ' · 词根 ' + esc(roots) : '') + '</div>';
      h += '<div class="qstem">' + esc(it.q) + '</div>';

      if (mode === 'b' && it.pre && it.pre.length) {
        h += '<div class="chiprow">';
        it.pre.forEach(function (p) {
          h += '<span class="chip"><b>' + esc(p.p) + '</b>' + esc(p.cn) + '</span>';
        });
        h += '</div>';
      }

      h += '<div class="pbtns">';
      h += '<button class="ptog" data-open="' + esc(id) + '">' +
        (open ? '收起解析' : '先自己写 · 看答案与词根档案') + '</button>';
      if (open) {
        h += '<button class="mark' + (mark === 'k' ? ' on' : '') + '" data-mark="k" data-id="' +
          esc(id) + '">会了</button>';
        h += '<button class="mark' + (mark === 'n' ? ' on no' : '') + '" data-mark="n" data-id="' +
          esc(id) + '">还不会</button>';
      }
      h += '</div>';

      if (open) {
        h += '<div class="pans">';
        h += '<div class="dans"><span>答案</span>' + esc(it.ans) + '</div>';
        h += analysisHTML(it, 0);
        h += '</div>';
      }
      h += '</div>';
    });
    document.getElementById('list').innerHTML = h;

    Array.prototype.forEach.call(document.querySelectorAll('#list .ptog'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-open');
        var k = 'open:' + mode + ':' + id;
        state[k] = !state[k];
        save();
        render();
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll('#list .mark'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-id');
        var m = b.getAttribute('data-mark');
        state[mode + ':' + id] = m;
        save();
        render();
      };
    });
  }

  function render() {
    renderTabs();
    renderGuide();
    renderStat();
    if (MODE === 'a') renderA(); else renderSelf(MODE);
  }

  var r = document.getElementById('btnReset');
  if (r) r.onclick = function () {
    if (!confirm('清空本模式的记录？')) return;
    Object.keys(state).forEach(function (k) {
      if (k.indexOf(MODE + ':') === 0 || k.indexOf('open:' + MODE + ':') === 0) delete state[k];
    });
    save();
    render();
  };

  var t = document.getElementById('top');
  if (t) t.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  var hb = document.getElementById('hBadge');
  if (hb) {
    hb.textContent = (D.a.length + D.b.length + D.c.length) + ' 题 · ' +
      Object.keys(DEEP).length + ' 词根详解';
  }

  render();
})();
