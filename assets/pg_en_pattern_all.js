/* 句式全库训练 · 渲染（952 题）
 * 数据：英语/data/pattern_all.js → window.PATTERN_ALL
 * 出题逻辑：有附加结构就问「含什么特殊结构」，没有就问「主干是哪一种」
 * 进度：localStorage gs_patall_v1
 */
(function () {
  'use strict';

  var ALL = window.PATTERN_ALL || [];
  var KEY = 'gs_patall_v1';

  var MAIN_OPTS = ['S+V', 'S+V+O', 'S+V+P', 'S+V+O+O', 'S+V+O+C'];
  var MAIN_CN = {
    'S+V': '主谓', 'S+V+O': '主谓宾', 'S+V+P': '主系表',
    'S+V+O+O': '主谓双宾', 'S+V+O+C': '主谓宾补'
  };
  var EXTRA_OPTS = ['定语从句', '状语从句', '宾语从句', '主语从句',
                    '同位语从句', '非谓语', '并列句', '倒装', '强调句'];

  var state = load();
  var FLT = state.filt || { layer: 'all', main: '', extra: '', g: '' };
  var shown = [];

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- 出题 ---------- */
  function askOf(it) {
    if (it.extra && it.extra.length) {
      return {
        kind: 'extra',
        q: '这句包含哪种特殊结构？',
        opts: EXTRA_OPTS,
        ans: it.extra[0],
        all: it.extra
      };
    }
    return {
      kind: 'main',
      q: '这句的主干是哪种基本句型？',
      opts: MAIN_OPTS,
      ans: it.main,
      all: [it.main]
    };
  }

  function idOf(it) { return it.id; }

  /* ---------- 筛选 ---------- */
  function applyFilter() {
    shown = ALL.filter(function (it) {
      if (FLT.layer !== 'all' && String(it.layer) !== FLT.layer) return false;
      if (FLT.main && it.main !== FLT.main) return false;
      if (FLT.extra && (it.extra || []).indexOf(FLT.extra) < 0) return false;
      if (FLT.g && String(it.g) !== FLT.g) return false;
      return true;
    });
  }

  function renderFilter() {
    var box = document.getElementById('filt');
    if (!box) return;

    var gs = [];
    for (var i = 1; i <= 56; i++) gs.push(i);

    var h = '';
    h += '<div class="frow">';
    h += '<label>层</label><select id="fLayer">';
    [['all', '全部'], ['1', 'L1 简单句'], ['2', 'L2 扩充句'], ['3', 'L3 段落']]
      .forEach(function (o) {
        h += '<option value="' + o[0] + '"' +
          (FLT.layer === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
      });
    h += '</select>';

    h += '<label>主干</label><select id="fMain">';
    h += '<option value="">全部</option>';
    MAIN_OPTS.forEach(function (m) {
      h += '<option value="' + m + '"' + (FLT.main === m ? ' selected' : '') +
        '>' + m + ' ' + MAIN_CN[m] + '</option>';
    });
    h += '</select>';

    h += '<label>结构</label><select id="fExtra">';
    h += '<option value="">全部</option>';
    EXTRA_OPTS.forEach(function (m) {
      h += '<option value="' + m + '"' + (FLT.extra === m ? ' selected' : '') +
        '>' + m + '</option>';
    });
    h += '</select>';

    h += '<label>组</label><select id="fG">';
    h += '<option value="">全部</option>';
    gs.forEach(function (n) {
      h += '<option value="' + n + '"' + (String(FLT.g) === String(n) ? ' selected' : '') +
        '>第 ' + n + ' 组</option>';
    });
    h += '</select>';

    h += '<span class="fcount" id="fCount"></span>';
    h += '<button id="fReset" class="fbtn">清空作答</button>';
    h += '</div>';

    box.innerHTML = h;

    ['fLayer', 'fMain', 'fExtra', 'fG'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.onchange = function () {
        FLT = {
          layer: document.getElementById('fLayer').value,
          main: document.getElementById('fMain').value,
          extra: document.getElementById('fExtra').value,
          g: document.getElementById('fG').value
        };
        state.filt = FLT;
        save();
        render();
      };
    });

    var rs = document.getElementById('fReset');
    if (rs) rs.onclick = function () {
      if (!confirm('清空全部作答记录？')) return;
      Object.keys(state).forEach(function (k) {
        if (k !== 'filt') delete state[k];
      });
      save();
      render();
    };
  }

  /* ---------- 主体 ---------- */
  function render() {
    applyFilter();
    renderFilter();

    var cnt = document.getElementById('fCount');
    if (cnt) cnt.textContent = '共 ' + shown.length + ' 题';

    // 统计
    var done = 0, right = 0;
    shown.forEach(function (it) {
      var a = askOf(it);
      var pick = state[idOf(it)];
      if (pick) {
        done++;
        if (pick === a.ans) right++;
      }
    });

    var stat = document.getElementById('stat');
    if (stat) {
      var pct = shown.length ? Math.round(done * 100 / shown.length) : 0;
      var acc = done ? Math.round(right * 100 / done) : 0;
      stat.innerHTML =
        '<div class="sline">' +
        '<div class="sp-bar"><i style="width:' + pct + '%"></i></div>' +
        '<span>已做 <b>' + done + '</b>/' + shown.length +
        '　正确 <b>' + right + '</b>' +
        (done ? '（' + acc + '%）' : '') + '</span></div>';
    }

    var list = document.getElementById('list');
    if (!list) return;

    if (!shown.length) {
      list.innerHTML = '<div class="empty">没有符合条件的题，换个筛选条件试试。</div>';
      return;
    }

    // 只渲染前 200 题，避免一次插入太多 DOM
    var LIMIT = 200;
    var part = shown.slice(0, LIMIT);
    var h = '';

    part.forEach(function (it, i) {
      var a = askOf(it);
      var pick = state[idOf(it)];
      var answered = !!pick;
      var ok = answered && pick === a.ans;

      h += '<div class="qcard' + (answered ? (ok ? ' ok' : ' no') : '') + '">';
      h += '<div class="qmeta">' + esc(it.id) + ' · 第' + it.g + '组 · ' +
        (it.layer === 1 ? 'L1' : it.layer === 2 ? 'L2' : 'L3') +
        ' · ' + it.n + ' 词</div>';
      h += '<div class="qen">' + esc(it.en) + '</div>';
      h += '<div class="qq">' + esc(a.q) + '</div>';

      h += '<div class="qopts' + (a.kind === 'extra' ? ' many' : '') + '">';
      a.opts.forEach(function (o) {
        var cls = 'opt';
        if (answered) {
          if (a.all.indexOf(o) >= 0) cls += ' right';
          else if (o === pick) cls += ' wrong';
          else cls += ' dim';
        }
        h += '<button class="' + cls + '" data-id="' + esc(it.id) +
          '" data-v="' + esc(o) + '"' + (answered ? ' disabled' : '') + '>' +
          esc(o) + '</button>';
      });
      h += '</div>';

      if (answered) {
        h += '<div class="qans ' + (ok ? 'isok' : 'isno') + '">';
        h += '<div class="qverdict">' +
          (ok ? '✓ 对了' : '✗ 应是「' + esc(a.ans) + '」') + '</div>';
        h += '<div class="qwhy">主干：<b>' + esc(it.main) + '</b>';
        if (it.extra && it.extra.length) {
          h += '　特殊结构：<b>' + esc(it.extra.join('、')) + '</b>';
        }
        h += '</div>';
        if (it.cn) h += '<div class="qcn2">参考译文：' + esc(it.cn) + '</div>';
        h += '</div>';
      }
      h += '</div>';
    });

    if (shown.length > LIMIT) {
      h += '<div class="more">只显示前 ' + LIMIT + ' 题（共 ' + shown.length +
        ' 题）。用上方筛选缩小范围，或切换条件继续练。</div>';
    }

    list.innerHTML = h;

    Array.prototype.forEach.call(list.querySelectorAll('.opt'), function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-id');
        if (state[id]) return;
        state[id] = b.getAttribute('data-v');
        save();
        render();
      };
    });
  }

  // 顶部
  var t = document.getElementById('top');
  if (t) t.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  var hb = document.getElementById('hBadge');
  if (hb) hb.textContent = ALL.length + ' 题 · 全部完成标注';

  render();
})();
