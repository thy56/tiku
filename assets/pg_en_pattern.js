/* 句式分层练习 · 渲染
 * 数据来自 英语/data/pattern.js（window.PATTERN）
 * 交互：点选项判定句式 → 对错即时反馈 → 显示解析
 * 进度存 localStorage: gs_pattern_v1
 */
(function () {
  'use strict';

  var D = window.PATTERN || {};
  var KEY = 'gs_pattern_v1';

  var L1_OPTS = ['S+V', 'S+V+O', 'S+V+P', 'S+V+O+O', 'S+V+O+C'];
  var L1_NAME = {
    'S+V': '主谓',
    'S+V+O': '主谓宾',
    'S+V+P': '主系表',
    'S+V+O+O': '主谓双宾',
    'S+V+O+C': '主谓宾补'
  };
  var L2_OPTS = ['定语从句', '状语从句', '宾语从句', '非谓语', '并列句'];

  var state = load();
  var LAYER = state.layer || 'l1';

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function idOf(layer, i) {
    return layer + '-' + i;
  }

  function getItems(layer) {
    return (D[layer] || []);
  }

  function correctOf(layer, it) {
    return layer === 'l1' ? it.pat : it.dev;
  }

  function optsOf(layer) {
    return layer === 'l1' ? L1_OPTS : L2_OPTS;
  }

  /* ============ 渲染 ============ */
  function renderHead() {
    var h = document.getElementById('h1');
    var s = document.getElementById('sub');
    if (h) h.textContent = '句式分层';
    if (s) {
      s.textContent = (D.meta && D.meta.sub) ||
        '先认出五种基本句型，再看它们怎么被扩充，最后连成段落。';
    }
  }

  function renderTabs() {
    var box = document.getElementById('tabs');
    if (!box) return;
    var tabs = [
      ['l1', 'L1 简单句', '五种基本句型', getItems('l1').length],
      ['l2', 'L2 扩充句', '五种扩充手段', getItems('l2').length],
      ['l3', 'L3 段落', '真题格式', getItems('l3').length]
    ];
    var h = '';
    tabs.forEach(function (t) {
      var on = (LAYER === t[0]) ? ' on' : '';
      h += '<button class="lbtn' + on + '" data-layer="' + t[0] + '">' +
        '<b>' + esc(t[1]) + '</b>' +
        '<span>' + esc(t[2]) + ' · ' + t[3] + ' 题</span>' +
        '</button>';
    });
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('.lbtn'), function (b) {
      b.onclick = function () {
        LAYER = b.getAttribute('data-layer');
        state.layer = LAYER;
        save();
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  }

  function renderStat() {
    var box = document.getElementById('stat');
    if (!box) return;
    var items = getItems(LAYER);
    var done = 0, right = 0;
    items.forEach(function (it, i) {
      var id = idOf(LAYER, i);
      if (state[id]) {
        done++;
        if (state[id] === correctOf(LAYER, it)) right++;
      }
    });
    var pct = items.length ? Math.round(done * 100 / items.length) : 0;
    var acc = done ? Math.round(right * 100 / done) : 0;
    box.innerHTML =
      '<div class="sline">' +
      '<div class="sp-bar"><i style="width:' + pct + '%"></i></div>' +
      '<span>已做 <b>' + done + '</b>/' + items.length +
      '　正确 <b>' + right + '</b>' +
      (done ? '（' + acc + '%）' : '') + '</span>' +
      '</div>';
  }

  function renderL1orL2() {
    var items = getItems(LAYER);
    var opts = optsOf(LAYER);
    var h = '';

    items.forEach(function (it, i) {
      var id = idOf(LAYER, i);
      var picked = state[id] || '';
      var right = correctOf(LAYER, it);
      var answered = !!picked;
      var ok = answered && picked === right;

      h += '<div class="qcard' + (answered ? (ok ? ' ok' : ' no') : '') + '" id="c-' + id + '">';
      h += '<div class="qno">' + (i + 1) + '.</div>';
      h += '<div class="qen">' + esc(it.en) + '</div>';
      h += '<div class="qcn">' + esc(it.cn) + '</div>';

      if (LAYER === 'l1' && it.focus) {
        h += '<div class="qtip">练：' + esc(it.focus) + '</div>';
      }

      h += '<div class="qopts">';
      opts.forEach(function (o) {
        var cls = 'opt';
        if (answered) {
          if (o === right) cls += ' right';
          else if (o === picked) cls += ' wrong';
          else cls += ' dim';
        }
        var label = (LAYER === 'l1')
          ? '<b>' + esc(o) + '</b><span>' + esc(L1_NAME[o] || '') + '</span>'
          : '<b>' + esc(o) + '</b>';
        h += '<button class="' + cls + '" data-id="' + id +
          '" data-v="' + esc(o) + '"' + (answered ? ' disabled' : '') + '>' +
          label + '</button>';
      });
      h += '</div>';

      if (answered) {
        h += '<div class="qans ' + (ok ? 'isok' : 'isno') + '">';
        h += '<div class="qverdict">' + (ok ? '✓ 对了' : '✗ 应是「' + esc(right) + '」') + '</div>';
        h += '<div class="qwhy">' + esc(it.why) + '</div>';
        if (it.tip) h += '<div class="qtk">记：' + esc(it.tip) + '</div>';
        h += '</div>';
      }
      h += '</div>';
    });

    var box = document.getElementById('list');
    box.innerHTML = h;

    Array.prototype.forEach.call(box.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-id');
        if (state[id]) return;
        state[id] = b.getAttribute('data-v');
        save();
        renderAll();
      };
    });
  }

  function renderL3() {
    var items = getItems('l3');
    var h = '';
    items.forEach(function (it, i) {
      var id = idOf('l3', i);
      var open = !!state['open-' + id];
      h += '<div class="pcard">';
      h += '<div class="qno">' + (i + 1) + '.</div>';
      h += '<div class="pen">' + esc(it.en) + '</div>';
      h += '<div class="pbtns"><button class="ptog" data-open="' + id + '">' +
        (open ? '收起参考译文与句式分析' : '先自己译 · 看参考译文与句式分析') + '</button></div>';
      if (open) {
        h += '<div class="pans">';
        h += '<div class="plbl">参考译文</div><div class="ptxt">' + esc(it.cn) + '</div>';
        h += '<div class="plbl">句式分析</div><div class="ptxt">' + esc(it.why) + '</div>';
        if (it.tip) h += '<div class="qtk">记：' + esc(it.tip) + '</div>';
        h += '</div>';
      }
      h += '</div>';
    });
    var box = document.getElementById('list');
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('.ptog'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-open');
        state['open-' + id] = !state['open-' + id];
        save();
        renderAll();
      };
    });
  }

  function renderGuide() {
    var box = document.getElementById('guide');
    if (!box) return;
    var txt = {
      l1: '<b>怎么认五种基本句型</b>：先找谓语动词，再看它后面需要几个成分。' +
        '不及物 → 主谓；及物 + 一个宾语 → 主谓宾；系动词 + 表语 → 主系表；' +
        '接两个宾语 → 主谓双宾；宾语后还有成分说明它 → 主谓宾补。' +
        '<br><b>最容易错</b>：make/take/have + 名词是动宾（make progress = 主谓宾），不是宾补。',
      l2: '<b>五种扩充手段</b>：定语从句（修饰名词）、状语从句（表时间/条件/原因/让步）、' +
        '宾语从句（作宾语）、非谓语（to do / -ing / -ed，不作谓语）、并列句（两个独立分句）。' +
        '<br><b>方法</b>：先把从句或非谓语整体划掉，露出主干，再判主干属于哪种基本句型。',
      l3: '<b>段落题</b>：先逐句找主谓，再判断句与句之间是并列还是主从。' +
        '真题格式为「译文 + 解析」，解析里会点明每句的句式。'
    };
    box.innerHTML = txt[LAYER] || '';
  }

  function renderAll() {
    renderTabs();
    renderStat();
    renderGuide();
    if (LAYER === 'l3') renderL3();
    else renderL1orL2();
  }

  function bindBtns() {
    var r = document.getElementById('btnReset');
    if (r) {
      r.onclick = function () {
        if (!confirm('清空「' + LAYER.toUpperCase() + '」的作答记录？')) return;
        var items = getItems(LAYER);
        items.forEach(function (_, i) {
          delete state[idOf(LAYER, i)];
          delete state['open-' + idOf(LAYER, i)];
        });
        save();
        renderAll();
      };
    }
    var t = document.getElementById('top');
    if (t) {
      t.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }
  }

  renderHead();
  renderAll();
  bindBtns();
})();
