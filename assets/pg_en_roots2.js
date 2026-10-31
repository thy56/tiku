/* 词根专项练习 · 渲染 v2（168 题 + 详细解析）
 * 数据：英语/data/roots_quiz.js → window.ROOTS
 *   detail.roots[]    词根释义 + 同族词串 + 单词表（含记忆线索）
 *   detail.prefixes[] 前缀提示
 *   detail.suffixes[] 后缀提示
 * A 释义 56：选择式自动判分，答完展示词根全族
 * B 构词 56：折叠自评
 * C 派生 56：折叠自评
 * 进度：localStorage gs_roots_v2
 */
(function () {
  'use strict';

  var D = window.ROOTS || { a: [], b: [], c: [] };
  var KEY = 'gs_roots_quiz_v2';

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

  /* ---------- 选项生成 ---------- */
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

  /* ---------- 详细解析块 ---------- */
  function detailHTML(it, limitWords) {
    var d = it.detail;
    if (!d) return '';
    var h = '';

    // 前缀 / 后缀提示
    var pre = d.prefixes || [], suf = d.suffixes || [];
    if (pre.length || suf.length) {
      h += '<div class="dchip">';
      pre.forEach(function (p) {
        h += '<span class="dch"><em>前缀</em><b>' + esc(p.form) + '-</b>' + esc(p.cn) + '</span>';
      });
      suf.forEach(function (s) {
        h += '<span class="dch"><em>后缀</em><b>-' + esc(s) + '</b></span>';
      });
      h += '</div>';
    }

    // 每个词的词根详情
    (d.roots || []).forEach(function (r) {
      h += '<div class="dblock">';
      h += '<div class="dhead"><b class="dro">' + esc(r.root) + '</b>' +
        (r.meaning ? '<span class="dmean">＝ ' + esc(r.meaning) + '</span>' : '') +
        '<span class="dcnt">' + (r.words || []).length + ' 词</span></div>';

      if (r.fam) {
        h += '<div class="dfam"><em>同族</em>' + esc(r.fam) + '</div>';
      }

      var ws = r.words || [];
      var show = limitWords === 0 ? ws : ws.slice(0, limitWords);
      if (show.length) {
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
        if (limitWords > 0 && ws.length > limitWords) {
          h += '<div class="dmore">还有 ' + (ws.length - limitWords) + ' 个词未展开</div>';
        }
      }
      h += '</div>';
    });
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
      a: '<b>A 类怎么练</b>：看到词根，先自己想它的核心义，再选答案。选完会展开这个词根的<b>整个词族</b>——同族词、拆解方式、记忆线索全在里面。',
      b: '<b>B 类怎么练</b>：前缀定方向、词根定含义。先在纸上写出单词，再展开核对，看完解析后按「会／不会」如实自评。',
      c: '<b>C 类怎么练</b>：给一个词根，尽量多写派生词。写完展开对比参考词族，缺哪个补哪个。'
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
        if (it.exp) h += '<div class="qexp">' + esc(it.exp) + '</div>';
        h += detailHTML(it, 6);
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
        (open ? '收起' : '先自己写 · 看答案与词族') + '</button>';
      if (open) {
        h += '<button class="mark' + (mark === 'k' ? ' on' : '') + '" data-mark="k" data-id="' +
          esc(id) + '">会了</button>';
        h += '<button class="mark' + (mark === 'n' ? ' on no' : '') + '" data-mark="n" data-id="' +
          esc(id) + '">还不会</button>';
      }
      h += '</div>';

      if (open) {
        h += '<div class="pans">';
        h += '<div class="plbl">答案</div><div class="ptxt">' + esc(it.ans) + '</div>';
        if (it.exp) {
          h += '<div class="plbl">解析</div><div class="ptxt">' + esc(it.exp) + '</div>';
        }
        h += detailHTML(it, 0);
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
    var w = 0;
    (D.a).forEach(function (x) { if (x.detail) (x.detail.roots || []).forEach(function (r) { w += (r.words || []).length; }); });
    hb.textContent = (D.a.length + D.b.length + D.c.length) + ' 题 · ' + w + ' 词';
  }

  render();
})();
