/* ===========================================================
   山东专升本 · 总站数据
   四科统计与页面清单（数值均取自各科 assets/manifest.js，勿手改）
   =========================================================== */
window.HUB = {
  stats: {
    subjects: 4,
    questions: 3723,   /* 2813 + 1120 + 321 + 312 */
    items: 368,        /* 高数一 141 + 计算机 227 */
    examples: 249,     /* 134 + 115 */
    pieces: 25,
    changshi: 1292,
    zhenti: 160,
    vocab: 271,
    roots: 1367
  },

  subjects: [
    {
      key: "yuwen",
      name: "语文",
            icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><path d='M4.6 4.9c0-.9.7-1.5 1.6-1.5h13.2v15.2H6.2c-.9 0-1.6.7-1.6 1.5V4.9z'/><path d='M8.6 8.2h6.4M8.6 11.6h6.4'/></svg>",
      color: "#b9793a",
      dir: "语文/",
      desc: "文言文 25 篇全文对照翻译 · 文学常识 1292 条4板块 · 真题 4 套。练习按 11 组编排，每题标配解析。",
      nums: [
        { t: "题库", v: "549 题" },
        { t: "文言文", v: "25 篇" },
        { t: "常识", v: "1292 条" },
        { t: "真题", v: "160 题" }
      ],
      pages: [
        { f: "index.html",    n: "首页",       d: "四入口总览",   c: "11 组" },
        { f: "practice.html", n: "每日一题",   d: "549 题",      c: "11 组" },
        { f: "wen.html",      n: "文言文",     d: "25 篇对照",    c: "209 段" },
        { f: "changshi.html", n: "文学常识",   d: "4 板块",       c: "1292 条" },
        { f: "zhenti.html",   n: "历年真题",   d: "2021—2024",    c: "160 题" }
      ]
    },
    {
      key: "yingyu",
      name: "英语",
            icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='8.4'/><path d='M3.6 12h16.8'/><path d='M12 3.6c2.3 2.3 3.5 5.2 3.5 8.4s-1.2 6.1-3.5 8.4c-2.3-2.3-3.5-5.2-3.5-8.4s1.2-6.1 3.5-8.4z'/></svg>",
      color: "#3f8f4a",
      dir: "英语/",
      desc: "翻译练习 56 组共 1120 题 · 语法 94 节 · 时态 16 节 · 高频词汇 271 词 · 词根词缀 1367 词。",
      nums: [
        { t: "题库", v: "1120 题" },
        { t: "语法", v: "94 节" },
        { t: "时态", v: "16 节" },
        { t: "词汇", v: "271 词" },
        { t: "词根", v: "1367 词" }
      ],
      pages: [
        { f: "index.html",    n: "首页",       d: "五入口总览",   c: "56 组" },
        { f: "practice.html", n: "翻译练习",   d: "1120 题",      c: "56 组" },
        { f: "grammar.html",  n: "语法体系",   d: "5 章 16 类",   c: "94 节" },
        { f: "tenses.html",   n: "时态体系",   d: "5 层递进",     c: "16 节" },
        { f: "vocab.html",    n: "高频词汇",   d: "4 大类",       c: "271 词" },
        { f: "roots.html",    n: "词根词缀",   d: "56 组",        c: "1367 词" }
      ]
    },
    {
      key: "gaoshu",
      name: "高数一",
            icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round'><path d='M14.4 3.6c-1.9 0-2.9 1.2-2.9 3.2v10.4c0 2-1 3.2-2.9 3.2'/></svg>",
      color: "#2e74b5",
      dir: "高数一/",
      desc: "8章全覆盖：141 个知识点 · 220 条公式 · 36 类题型 134 例 · 321 道练习。",
      nums: [
        { t: "知识点", v: "141 点" },
        { t: "公式", v: "220 条" },
        { t: "例题", v: "134 例" },
        { t: "题库", v: "321 题" }
      ],
      pages: [
        { f: "index.html",    n: "首页",       d: "三分册总览",   c: "8 章" },
        { f: "know.html",     n: "知识体系",   d: "8 章 29 组",   c: "141 点" },
        { f: "examples.html", n: "例题精讲",   d: "36 类题型",    c: "134 例" },
        { f: "practice.html", n: "题库",       d: "单选 132 + 填空 88 + 计算 101", c: "321 题" }
      ]
    },
    {
      key: "jisuanji",
      name: "计算机",
            icon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'><rect x='3.2' y='4.4' width='17.6' height='11.6' rx='1.8'/><path d='M9 20h6M12 16v4'/></svg>",
      color: "#7a5aa8",
      dir: "计算机/",
      desc: "考纲10章全覆盖：227 个知识点 · 87 条考点 · 41 类题型 115 例 · 312 道练习。",
      nums: [
        { t: "知识点", v: "227 点" },
        { t: "考点", v: "87 条" },
        { t: "例题", v: "115 例" },
        { t: "题库", v: "312 题" }
      ],
      pages: [
        { f: "index.html",    n: "首页",       d: "三分册总览",   c: "10 章" },
        { f: "know.html",     n: "知识体系",   d: "10 章 53 组",   c: "227 点" },
        { f: "examples.html", n: "例题精讲",   d: "41 类题型",    c: "115 例" },
        { f: "practice.html", n: "题库",       d: "单选 236 + 填空 41 + 判断 35", c: "312 题" }
      ]
    }
  ],

  /* 推荐学习路径 */
  path: [
    { n: "1", t: "先建框架", d: "语文看文言文 25 篇与文学常识四板块，计算机、高数先过知识体系。先把「有哪些考点」摸清。" },
    { n: "2", t: "再看例题", d: "高数 134 例按题型讲思路，计算机 115 例按题型讲易错。计算机题重辨析，易错点就是考点。" },
    { n: "3", t: "然后刷题", d: "四科共 3723 题。选择题点选项立即判对错，填空先写再对照，错题自动进「只看错题」。" },
    { n: "4", t: "最后模拟", d: "语文做 2021—2024 四套真题（160 题），限时完成，对照正确率找薄弱章节。" }
  ]
};
