window.GS_SKILL = {
 "updated": "2026-11-03",
 "groups": [
  {
   "id": "lim-eq",
   "name": "0/0 型 · 等价无穷小替换",
   "ch": 1,
   "when": "分子分母同时趋于 0，且出现 sin/cos/tan/ln(1+x)/e^x−1/√(1+x)−1 这些常见因子",
   "steps": [
    "① 确认是 0/0 型（代入分子分母都是 0）",
    "② 把每个因子换成等价无穷小：sin x~x，tan x~x，1−cos x~x²/2，ln(1+x)~x，e^x−1~x，√(1+x)−1~x/2",
    "③ 约分，算出结果",
    "④ 若替换后仍 0/0 → 转【洛必达】，或改用泰勒展开"
   ],
   "warn": "等价无穷小只能在**乘除**中替换，加减中直接替换会错",
   "qids": [
    "1-44",
    "1-49",
    "1-134",
    "1-135",
    "1-136",
    "1-45",
    "1-47",
    "8-06",
    "8-07",
    "8-08",
    "8-09",
    "1-107",
    "G1-lim-eq-01",
    "G1-lim-eq-02",
    "G1-lim-eq-03",
    "G1-lim-eq-04",
    "G1-lim-eq-05",
    "G1-lim-eq-06"
   ]
  },
  {
   "id": "lim-factor",
   "name": "0/0 型 · 因式分解约去零因子",
   "ch": 1,
   "when": "有理式（多项式/多项式），代入后是 0/0，且能分解出共同的 (x−a)",
   "steps": [
    "① 代入确认 0/0",
    "② 分子、分母分别因式分解，找出共同的 (x−a) 因子",
    "③ 约去该因子（这一步消掉了奇点）",
    "④ 再代入求值"
   ],
   "warn": "约分是恒等变形，x≠a；但极限只看 x→a 附近的趋势，不影响结果",
   "qids": [
    "1-41",
    "1-50",
    "G1-lim-factor-01",
    "G1-lim-factor-02",
    "G1-lim-factor-03",
    "G1-lim-factor-04",
    "G1-lim-factor-05",
    "G1-lim-factor-06"
   ]
  },
  {
   "id": "lim-ratio",
   "name": "根式差 · 有理化",
   "ch": 1,
   "when": "出现 √A − √B 或 √A − B，且代入是 0/0 或 ∞−∞",
   "steps": [
    "① 分子分母同乘共轭式 (√A + √B)",
    "② 用平方差公式展开分子，去掉根号",
    "③ 约去产生零的因子",
    "④ 代入求值"
   ],
   "warn": "∞−∞ 型（如 √(x²+x) − x）也走这条路，但要先提出 x 再有理化",
   "qids": [
    "1-42",
    "1-43",
    "1-111",
    "1-112",
    "1-118",
    "G1-lim-ratio-01",
    "G1-lim-ratio-02",
    "G1-lim-ratio-03",
    "G1-lim-ratio-04",
    "G1-lim-ratio-05",
    "G1-lim-ratio-06"
   ]
  },
  {
   "id": "lim-1inf",
   "name": "1^∞ 型 · 第二重要极限",
   "ch": 1,
   "when": "底数趋于 1、指数趋于 ∞（形如 [f(x)]^g(x)，f→1，g→∞）",
   "steps": [
    "① 判定：底数→1，指数→∞",
    "② 变形为标准型：原式 = e^{lim g(x)·[f(x)−1]}",
    "③ 单独算指数部分的极限",
    "④ 结果写成 e^{那个极限}"
   ],
   "warn": "别直接写成 1^∞=1，这是未定式",
   "qids": [
    "1-46",
    "1-120",
    "1-121",
    "1-122",
    "1-124",
    "1-125",
    "G1-lim-1inf-01",
    "G1-lim-1inf-02",
    "G1-lim-1inf-03",
    "G1-lim-1inf-04",
    "G1-lim-1inf-05",
    "G1-lim-1inf-06"
   ]
  },
  {
   "id": "lim-lhopital",
   "name": "洛必达法则（0/0 或 ∞/∞）",
   "ch": 1,
   "when": "0/0 或 ∞/∞ 型，分子分母都可导，且求导后能化简",
   "steps": [
    "① 判定类型是否 0/0 或 ∞/∞",
    "② 分子分母分别求导（不是商的求导法则！）",
    "③ 求导后重新代入",
    "④ 仍是未定式 → 再求一次导（可多次）",
    "⑤ 出现循环 → 移项解方程"
   ],
   "warn": "只有 0/0、∞/∞ 能用；0·∞、∞−∞、1^∞ 要先变形",
   "qids": [
    "2-12",
    "2-13",
    "8-91",
    "1-109",
    "1-110",
    "1-113",
    "G1-lim-lhopital-01",
    "G1-lim-lhopital-02",
    "G1-lim-lhopital-03",
    "G1-lim-lhopital-04",
    "G1-lim-lhopital-05",
    "G1-lim-lhopital-06"
   ]
  },
  {
   "id": "lim-0inf",
   "name": "0·∞ 型 · 下放变形",
   "ch": 1,
   "when": "一个因子→0，另一个因子→∞（如 x·ln x，x→0⁺）",
   "steps": [
    "① 把其中一个因子搬到分母：x·ln x = ln x / (1/x)",
    "② 变成 0/0 或 ∞/∞",
    "③ 用洛必达",
    "④ 化简求值"
   ],
   "warn": "选哪个下放很重要——下放后要变简单，不是变复杂",
   "qids": [
    "2-14",
    "G1-lim-0inf-01",
    "G1-lim-0inf-02",
    "G1-lim-0inf-03",
    "G1-lim-0inf-04",
    "G1-lim-0inf-05",
    "G1-lim-0inf-06"
   ]
  },
  {
   "id": "lim-discont",
   "name": "间断点判定 · 先找点再分类",
   "ch": 1,
   "when": "题目给一个函数，问「在 x=a 处是什么类型的间断点」，或要求「找出全部间断点并分类」",
   "steps": [
    "① 找可疑点：分母为零的点、分段点、ln 的零点、tan 的极点",
    "② 在每个可疑点分别求左极限和右极限",
    "③ 左右极限都存在且相等，但不等于函数值（或函数没定义）→ 可去间断点",
    "④ 左右极限都存在但不相等 → 跳跃间断点（第①类）",
    "⑤ 至少一侧极限为 ∞ 或不存在 → 无穷/振荡间断点（第②类）"
   ],
   "warn": "第①类（可去、跳跃）= 左右极限**都存在**；第②类（无穷、振荡）= 至少一侧**不存在**。判错直接零分",
   "qids": [
    "1-48",
    "1-131",
    "1-132",
    "1-133",
    "G1-lim-discont-01",
    "G1-lim-discont-02",
    "G1-lim-discont-03",
    "G1-lim-discont-04",
    "G1-lim-discont-05",
    "G1-lim-discont-06",
    "G1-lim-discont-07"
   ]
  },
  {
   "id": "lim-cont-param",
   "name": "分段函数连续 · 求参数",
   "ch": 1,
   "when": "分段函数在分界点连续，求其中的待定常数 a",
   "steps": [
    "① 认出分界点 x₀",
    "② 算左极限 lim(x→x₀⁻) f(x)",
    "③ 算右极限 lim(x→x₀⁺) f(x)",
    "④ 算函数值 f(x₀)",
    "⑤ 连续 ⟺ 左极限 = 右极限 = 函数值，列方程解 a"
   ],
   "warn": "三个量必须全部相等，只比两个不够；求极限时常要用等价无穷小或洛必达",
   "qids": [
    "1-127",
    "1-128",
    "1-129",
    "1-130",
    "G1-lim-cont-param-01",
    "G1-lim-cont-param-02",
    "G1-lim-cont-param-03",
    "G1-lim-cont-param-04",
    "G1-lim-cont-param-05",
    "G1-lim-cont-param-06",
    "G1-lim-cont-param-07"
   ]
  },
  {
   "id": "lim-taylor",
   "name": "泰勒展开求极限",
   "ch": 1,
   "when": "0/0 型但洛必达越求越复杂，或分子分母是「一个函数减去它的前几项」",
   "steps": [
    "① 认出特征：x−sin x、eˣ−1−x、tan x−sin x 这类「展开后前几项抵消」",
    "② 记住常用展开：sin x=x−x³/6，tan x=x+x³/3，eˣ=1+x+x²/2+x³/6，ln(1+x)=x−x²/2+x³/3",
    "③ 展开到**分母的阶数**为止（分母是 x³ 就展到 x³）",
    "④ 分子各项相减，只剩最高阶那一项",
    "⑤ 约掉分母，得结果"
   ],
   "warn": "展开阶数不够会得 0；必须展到与分母同阶或更高一阶",
   "qids": [
    "1-108",
    "1-115",
    "1-116",
    "1-117",
    "1-123",
    "1-126",
    "8-10",
    "1-114",
    "G1-lim-taylor-01",
    "G1-lim-taylor-02",
    "G1-lim-taylor-03",
    "G1-lim-taylor-04",
    "G1-lim-taylor-05",
    "G1-lim-taylor-06",
    "G1-lim-taylor-07",
    "G1-lim-taylor-08",
    "G1-lim-taylor-09",
    "G1-lim-taylor-10"
   ]
  },
  {
   "id": "lim-inf-inf",
   "name": "∞−∞ 型 · 通分或提出公因子",
   "ch": 1,
   "when": "两个无穷大相减（如 1/x − 1/(eˣ−1)、1/sin²x − 1/x²），或根式相减",
   "steps": [
    "① 认出是 ∞−∞ 型（分别看两项都趋于无穷）",
    "② 是分式相减 → **通分**，合成一个分数",
    "③ 是根式相减 → 有理化（乘共轭）",
    "④ 合成后通常变成 0/0 型",
    "⑤ 再转等价无穷小或泰勒展开",
    "⑥ 算出结果"
   ],
   "warn": "∞−∞ 不能直接算，必须先合并成一个式子；通分后分母常是 x²，分子要展到 x² 阶",
   "qids": [
    "8-90",
    "1-119",
    "G1-lim-inf-inf-01",
    "G1-lim-inf-inf-02",
    "G1-lim-inf-inf-03",
    "G1-lim-inf-inf-04",
    "G1-lim-inf-inf-05",
    "G1-lim-inf-inf-06",
    "G1-lim-inf-inf-07"
   ]
  },
  {
   "id": "der-def",
   "name": "导数定义求导",
   "ch": 2,
   "when": "题目明说「用导数定义」，或要判断分段点、绝对值点是否可导",
   "steps": [
    "① 写出定义式 f'(x₀) = lim_{Δx→0} [f(x₀+Δx) − f(x₀)] / Δx",
    "② 代入具体函数",
    "③ 化简分子（展开、约分、有理化）",
    "④ 求极限",
    "⑤ 分段点：左右导数分别算，相等才可导"
   ],
   "warn": "分段点必须分左右导数，只说「可导」不算完成",
   "qids": [
    "2-1",
    "G2-der-def-01",
    "G2-der-def-02",
    "G2-der-def-03",
    "G2-der-def-04",
    "G2-der-def-05",
    "G2-der-def-06"
   ]
  },
  {
   "id": "der-chain",
   "name": "复合函数 · 链式法则",
   "ch": 2,
   "when": "函数是「套娃」结构：sin(2x+1)、e^{x²}、ln(cos x)",
   "steps": [
    "① 由外向内拆层：y=f(u)，u=g(x)",
    "② 逐层求导相乘：y' = f'(u)·g'(x)",
    "③ 层数多就继续拆（三层就乘三次）",
    "④ 最后把 u 换回 x"
   ],
   "warn": "最常见的错：漏乘最内层的导数（忘记乘 2、乘 2x）",
   "qids": [
    "2-4",
    "G2-der-chain-01",
    "G2-der-chain-02",
    "G2-der-chain-03",
    "G2-der-chain-04",
    "G2-der-chain-05",
    "G2-der-chain-06",
    "G2-der-chain-07",
    "G2-der-chain-08",
    "G2-der-chain-09"
   ]
  },
  {
   "id": "der-product",
   "name": "乘积 / 商 · 求导法则",
   "ch": 2,
   "when": "两个函数相乘或相除，如 x²e^x、x/(x+1)",
   "steps": [
    "① 认出是乘积还是商",
    "② 乘积：(uv)' = u'v + uv'",
    "③ 商：(u/v)' = (u'v − uv') / v²",
    "④ 展开合并同类项"
   ],
   "warn": "商的分子是「上导下不导 减 上不导下导」，顺序反了符号就错",
   "qids": [
    "2-3",
    "G2-der-product-01",
    "G2-der-product-02",
    "G2-der-product-03",
    "G2-der-product-04",
    "G2-der-product-05",
    "G2-der-product-06",
    "G2-der-product-07",
    "G2-der-product-08",
    "G2-der-product-09"
   ]
  },
  {
   "id": "der-implicit",
   "name": "隐函数求导",
   "ch": 2,
   "when": "方程形式给出（如 x²+y²=25），y 没解出来",
   "steps": [
    "① 方程两边同时对 x 求导（y 看成 x 的函数，链式法则）",
    "② 出现 y' 的项单独留在左边",
    "③ 其余项移到右边",
    "④ 解出 y'（结果含 x、y 都正常）",
    "⑤ 要求某点值 → 把该点坐标代入"
   ],
   "warn": "对 y 求导必须乘 y'，(y²)' = 2y·y'",
   "qids": [
    "2-5",
    "2-133",
    "G2-der-implicit-01",
    "G2-der-implicit-02",
    "G2-der-implicit-03",
    "G2-der-implicit-04",
    "G2-der-implicit-05",
    "G2-der-implicit-06",
    "G2-der-implicit-07"
   ]
  },
  {
   "id": "der-high",
   "name": "高阶导数 · 找规律",
   "ch": 2,
   "when": "求 y''、y''' 或 y^(n)",
   "steps": [
    "① 求一阶导 y'",
    "② 求二阶导 y''",
    "③ 求三阶导 y'''",
    "④ 观察规律，写出 y^(n) 的通式",
    "⑤ 用数学归纳法验证（证明题才需要）"
   ],
   "warn": "常见的 n 阶公式要背：e^{ax}→aⁿe^{ax}，sin x→sin(x+nπ/2)",
   "qids": [
    "2-6",
    "2-7",
    "2-136",
    "8-23",
    "8-25",
    "G2-der-high-01",
    "G2-der-high-02",
    "G2-der-high-03",
    "G2-der-high-04",
    "G2-der-high-05",
    "G2-der-high-06",
    "G2-der-high-07"
   ]
  },
  {
   "id": "der-param",
   "name": "参数方程求导",
   "ch": 2,
   "when": "给出 x=x(t)、y=y(t)",
   "steps": [
    "① 分别求 dx/dt 和 dy/dt",
    "② 一阶导：dy/dx = (dy/dt)/(dx/dt)",
    "③ 二阶导：d²y/dx² = d(dy/dx)/dt ÷ (dx/dt)",
    "④ 化简"
   ],
   "warn": "二阶导**不是**直接把一阶导再对 t 求一次！必须再除以 dx/dt",
   "qids": [
    "2-135",
    "G2-der-param-01",
    "G2-der-param-02",
    "G2-der-param-03",
    "G2-der-param-04",
    "G2-der-param-05",
    "G2-der-param-06"
   ]
  },
  {
   "id": "der-tangent",
   "name": "切线 / 法线方程",
   "ch": 2,
   "when": "求曲线在某点的切线、法线，或「平行于某直线」的切线",
   "steps": [
    "① 求导得斜率函数 y'",
    "② 代入切点横坐标，得切线斜率 k",
    "③ 点斜式：y − y₀ = k(x − x₀)",
    "④ 法线斜率 = −1/k",
    "⑤ 若说「平行于 y=mx+b」→ 令 y' = m 解出切点"
   ],
   "warn": "「平行」给的是斜率条件，「垂直」给的是 k₁k₂=−1",
   "qids": [
    "2-2",
    "2-137",
    "2-141",
    "8-13",
    "8-14",
    "8-15",
    "G2-der-tangent-01",
    "G2-der-tangent-02",
    "G2-der-tangent-03",
    "G2-der-tangent-04",
    "G2-der-tangent-05",
    "G2-der-tangent-06",
    "G2-der-tangent-07",
    "G2-der-tangent-08"
   ]
  },
  {
   "id": "der-diff",
   "name": "微分 / 近似计算",
   "ch": 2,
   "when": "求 dy，或用微分估近似值（如 √1.01）",
   "steps": [
    "① 求导得 y'",
    "② dy = y'·dx",
    "③ 近似：f(x₀+Δx) ≈ f(x₀) + f'(x₀)·Δx",
    "④ 选好 x₀（要好算）和 Δx（要小）"
   ],
   "warn": "x₀ 要选成能精确算的点，如 √1.01 取 x₀=1",
   "qids": [
    "2-8",
    "2-9",
    "G2-der-diff-01",
    "G2-der-diff-02",
    "G2-der-diff-03",
    "G2-der-diff-04",
    "G2-der-diff-05",
    "G2-der-diff-06",
    "G2-der-diff-07"
   ]
  },
  {
   "id": "der-log",
   "name": "幂指函数 · 对数求导",
   "ch": 2,
   "when": "底数和指数都含 x（如 x^sin x），或一长串乘积/商/乘方",
   "steps": [
    "① 两边取对数：ln y = sin x · ln x",
    "② 两边对 x 求导（左边是 y'/y）",
    "③ 右边用乘积法则展开",
    "④ 两边同乘 y",
    "⑤ 把 y 换回原函数表达式"
   ],
   "warn": "幂指函数**不能**直接套 xⁿ 或 aˣ 的公式，必须取对数或写成 e^{sin x·ln x}",
   "qids": [
    "2-134",
    "2-11",
    "G2-der-log-01",
    "G2-der-log-02",
    "G2-der-log-03",
    "G2-der-log-04",
    "G2-der-log-05",
    "G2-der-log-06"
   ]
  },
  {
   "id": "der-monotone",
   "name": "单调区间与极值 · 列表法",
   "ch": 2,
   "when": "求 f(x) 的单调区间、极大值、极小值",
   "steps": [
    "① 定义域",
    "② 求 f'(x)，令 f'(x)=0 解出驻点，找出 f' 不存在的点",
    "③ 用这些点把定义域分成若干区间",
    "④ 每个区间取一个测试点，判断 f' 的正负",
    "⑤ f'>0 增，f'<0 减；正变负 = 极大，负变正 = 极小",
    "⑥ 把极值点的 x 代回 f(x) 求极值"
   ],
   "warn": "「极值」不是「最值」；极值是局部概念，求最值还要比端点",
   "qids": [
    "2-15",
    "2-138",
    "G2-der-monotone-01",
    "G2-der-monotone-02",
    "G2-der-monotone-03",
    "G2-der-monotone-04",
    "G2-der-monotone-05",
    "G2-der-monotone-06"
   ]
  },
  {
   "id": "der-concave",
   "name": "凹凸区间与拐点 · 二阶导",
   "ch": 2,
   "when": "求曲线的凹凸区间、拐点",
   "steps": [
    "① 求 f''(x)",
    "② 令 f''(x)=0 解出候选点",
    "③ 用候选点分区，判 f'' 的符号",
    "④ f''>0 = 凹（上凹/开口向上），f''<0 = 凸",
    "⑤ 符号改变的点才是拐点，代入原函数求纵坐标"
   ],
   "warn": "f''=0 只是**候选**，符号不变就不是拐点（如 y=x⁴ 在 x=0）",
   "qids": [
    "2-18",
    "2-19",
    "2-139",
    "G2-der-concave-01",
    "G2-der-concave-02",
    "G2-der-concave-03",
    "G2-der-concave-04",
    "G2-der-concave-05",
    "G2-der-concave-06"
   ]
  },
  {
   "id": "der-asymptote",
   "name": "渐近线 · 三类分别求",
   "ch": 2,
   "when": "求曲线 y=f(x) 的所有渐近线",
   "steps": [
    "① 铅直渐近线：找 f(x)→∞ 的 x₀（分母零点），x=x₀",
    "② 水平渐近线：算 lim(x→±∞) f(x)=A，则 y=A",
    "③ 斜渐近线：a=lim f(x)/x，b=lim [f(x)−ax]，若都存在则 y=ax+b",
    "④ 三类都查一遍，别只查一类"
   ],
   "warn": "分子次数比分母高一次 → 有斜渐近线；高两次以上 → 没有",
   "qids": [
    "2-20",
    "2-21",
    "2-140",
    "G2-der-asymptote-01",
    "G2-der-asymptote-02",
    "G2-der-asymptote-03",
    "G2-der-asymptote-04",
    "G2-der-asymptote-05",
    "G2-der-asymptote-06"
   ]
  },
  {
   "id": "der-rolle",
   "name": "中值定理验证 · 三步走",
   "ch": 2,
   "when": "「验证 f(x) 在 [a,b] 上满足罗尔/拉格朗日中值定理，并求 ξ」",
   "steps": [
    "① 验条件：在 [a,b] 连续、在 (a,b) 可导（分段说明）",
    "② 罗尔还要验 f(a)=f(b)；拉格朗日不需要",
    "③ 列方程：罗尔 f'(ξ)=0；拉格朗日 f'(ξ)=[f(b)−f(a)]/(b−a)",
    "④ 解出 ξ",
    "⑤ **验算 ξ 落在 (a,b) 内**，不在就说明前面算错"
   ],
   "warn": "求完 ξ 必须检查它在开区间内，这是采分点",
   "qids": [
    "2-10",
    "8-48",
    "8-49",
    "G2-der-rolle-01",
    "G2-der-rolle-02",
    "G2-der-rolle-03",
    "G2-der-rolle-04",
    "G2-der-rolle-05",
    "G2-der-rolle-06"
   ]
  },
  {
   "id": "der-maxmin",
   "name": "闭区间最值 · 驻点与端点比大小",
   "ch": 2,
   "when": "求 f(x) 在闭区间 [a,b] 上的最大值、最小值；或求实际问题的最大/最小值（如容积最大、用料最省）",
   "steps": [
    "① 求 f'(x)，令 f'(x)=0 解出驻点",
    "② 找出区间内的驻点（区间外的不算）",
    "③ 把**所有驻点和两个端点**的 x 值分别代入 f(x)，算出函数值",
    "④ 比大小：最大的就是最大值，最小的就是最小值",
    "⑤ 应用题：先设变量、写出目标函数和定义域，再按上面四步做"
   ],
   "warn": "**端点必须算**——最值可能在端点取得（如 f(x)=x 在 [0,1]）；应用题还要检查驻点是否在实际范围内",
   "qids": [
    "2-16",
    "2-17",
    "G2-der-maxmin-01",
    "G2-der-maxmin-02",
    "G2-der-maxmin-03",
    "G2-der-maxmin-04",
    "G2-der-maxmin-05",
    "G2-der-maxmin-06"
   ]
  },
  {
   "id": "int-basic",
   "name": "直接积分 · 基本公式",
   "ch": 3,
   "when": "被积函数是幂函数、指数、三角的简单组合，能直接套公式",
   "steps": [
    "① 拆成和差：∫(f±g) = ∫f ± ∫g",
    "② 常数提出来：∫kf = k∫f",
    "③ 套基本积分公式",
    "④ 补上 +C"
   ],
   "warn": "不定积分必须写 +C，漏了就扣分",
   "qids": [
    "3-2",
    "3-3",
    "3-4",
    "8-32",
    "G3-int-basic-01",
    "G3-int-basic-02",
    "G3-int-basic-03",
    "G3-int-basic-04",
    "G3-int-basic-05",
    "G3-int-basic-06",
    "G3-int-basic-07",
    "G3-int-basic-08",
    "G3-int-basic-09"
   ]
  },
  {
   "id": "int-sub",
   "name": "凑微分 · 第一换元法（父子法）",
   "ch": 3,
   "when": "被积函数里有 f(φ(x)) 和 φ'(x) 同时出现，如 ∫xe^{x²}dx、∫(2x+1)⁵dx",
   "steps": [
    "① 认「子」：内层函数 φ(x)（如 x²、2x+1）",
    "② 算 dφ = φ'(x)dx，看原式里有没有这个因子",
    "③ 把 φ'(x)dx 整体换成 dφ",
    "④ 原式变成 ∫f(u)du（只有 u 了）",
    "⑤ 套公式积出来，再把 u=φ(x) 换回",
    "⑥ 补 +C"
   ],
   "warn": "关键看「内层导数在不在外面」。缺一个常数就补一个常数，两边配平",
   "qids": [
    "3-5",
    "3-6",
    "8-33",
    "8-34",
    "G3-int-sub-01",
    "G3-int-sub-02",
    "G3-int-sub-03",
    "G3-int-sub-04",
    "G3-int-sub-05",
    "G3-int-sub-06",
    "G3-int-sub-07",
    "G3-int-sub-08",
    "G3-int-sub-09"
   ]
  },
  {
   "id": "int-parts",
   "name": "分部积分（反对幂指三）",
   "ch": 3,
   "when": "被积函数是两类不同函数相乘，如 x·cos x、x·ln x、x·e^x",
   "steps": [
    "① 按「反对幂指三」定谁做 u（排在前面的做 u）：反三角 > 对数 > 幂 > 指数 > 三角",
    "② 剩下的凑成 dv，求出 v",
    "③ 套公式 ∫u dv = uv − ∫v du",
    "④ 算右边那个积分（可能还要再来一次）",
    "⑤ 若出现循环（∫e^x sinx），移项解方程",
    "⑥ 补 +C"
   ],
   "warn": "u 选错会越算越复杂；两次分部时必须选同一类做 u，否则循环不起来",
   "qids": [
    "3-7",
    "3-8",
    "8-35",
    "G3-int-parts-01",
    "G3-int-parts-02",
    "G3-int-parts-03",
    "G3-int-parts-04",
    "G3-int-parts-05",
    "G3-int-parts-06",
    "G3-int-parts-07"
   ]
  },
  {
   "id": "int-rational",
   "name": "有理函数积分 · 拆项",
   "ch": 3,
   "when": "被积函数是多项式/多项式，如 x/(x+1)、1/(x²−4)",
   "steps": [
    "① 分子次数 ≥ 分母 → 先做多项式除法",
    "② 分母因式分解",
    "③ 拆成部分分式（A/(x−a) + B/(x−b) 形式）",
    "④ 待定系数求出 A、B",
    "⑤ 逐项积出（对数 / 反正切）"
   ],
   "warn": "分母是 x²+a² 时积出 arctan，不是 ln",
   "qids": [
    "3-9",
    "3-10",
    "G3-int-rational-01",
    "G3-int-rational-02",
    "G3-int-rational-03",
    "G3-int-rational-04",
    "G3-int-rational-05",
    "G3-int-rational-06"
   ]
  },
  {
   "id": "int-defprop",
   "name": "定积分 · 奇偶性与对称性",
   "ch": 3,
   "when": "积分区间对称 [−a, a]",
   "steps": [
    "① 先判断被积函数奇偶性：f(−x)=f(x) 偶，f(−x)=−f(x) 奇",
    "② 奇函数 → 积分 = 0（直接出答案）",
    "③ 偶函数 → 积分 = 2∫₀^a",
    "④ 拆项后逐项判断（奇+偶要分开）"
   ],
   "warn": "必须是对称区间才成立，[0,a] 不能用",
   "qids": [
    "3-11",
    "3-12",
    "8-38",
    "8-39",
    "G3-int-defprop-01",
    "G3-int-defprop-02",
    "G3-int-defprop-03",
    "G3-int-defprop-04",
    "G3-int-defprop-05",
    "G3-int-defprop-06"
   ]
  },
  {
   "id": "int-varupper",
   "name": "变上限积分求导",
   "ch": 3,
   "when": "求 d/dx ∫ₐ^{φ(x)} f(t)dt",
   "steps": [
    "① 认出是变上限积分",
    "② 套公式：d/dx ∫ₐ^{φ(x)} f(t)dt = f(φ(x))·φ'(x)",
    "③ 上限是复合函数 → 别忘乘 φ'(x)",
    "④ 上下限都是变量 → 两个都要算，后减前"
   ],
   "warn": "最常见错误：忘记乘上限的导数（如 ∫₀^{x²} → 要乘 2x）",
   "qids": [
    "3-14",
    "G3-int-varupper-01",
    "G3-int-varupper-02",
    "G3-int-varupper-03",
    "G3-int-varupper-04",
    "G3-int-varupper-05",
    "G3-int-varupper-06"
   ]
  },
  {
   "id": "int-definite",
   "name": "定积分计算 · 牛顿-莱布尼茨",
   "ch": 3,
   "when": "求具体区间上的定积分值",
   "steps": [
    "① 先求不定积分（原函数 F(x)）",
    "② 套公式 ∫ₐ^b f = F(b) − F(a)",
    "③ 代入上下限相减",
    "④ 换元时**上下限要跟着变**，且不用换回原变量"
   ],
   "warn": "换元后忘记改上下限是最常见的错，会算出完全不同的数",
   "qids": [
    "3-13",
    "3-15",
    "3-16",
    "8-40",
    "8-98",
    "G3-int-definite-01",
    "G3-int-definite-02",
    "G3-int-definite-03",
    "G3-int-definite-04",
    "G3-int-definite-05",
    "G3-int-definite-06",
    "G3-int-definite-07",
    "G3-int-definite-08"
   ]
  },
  {
   "id": "int-improper",
   "name": "反常积分 · 判敛散",
   "ch": 3,
   "when": "积分区间无限，或被积函数在某点无界",
   "steps": [
    "① 认出反常积分（上限/下限是 ∞，或有瑕点）",
    "② 写成极限形式：∫₁^∞ f = lim_{b→∞} ∫₁^b f",
    "③ 先算定积分，再求极限",
    "④ 极限存在且有限 → 收敛；否则发散",
    "⑤ 记住 p 积分：∫₁^∞ 1/x^p 在 p>1 收敛，p≤1 发散"
   ],
   "warn": "只写「收敛」不算完，题目要求值时要算出具体数",
   "qids": [
    "3-17",
    "3-18",
    "G3-int-improper-01",
    "G3-int-improper-02",
    "G3-int-improper-03",
    "G3-int-improper-04",
    "G3-int-improper-05",
    "G3-int-improper-06"
   ]
  },
  {
   "id": "app-area",
   "name": "定积分应用 · 平面图形面积",
   "ch": 3,
   "when": "求两条曲线围成的面积",
   "steps": [
    "① 求交点（联立方程解出 x 的范围）",
    "② 判断上下：在区间内谁在上（取个测试点代入）",
    "③ 写面积式 S = ∫ₐ^b [上 − 下] dx",
    "④ 计算定积分",
    "⑤ 结果是正数（若为负说明上下搞反了）"
   ],
   "warn": "上下限搞反会得负数；曲线交叉要分段积分",
   "qids": [
    "3-19",
    "8-43",
    "G3-app-area-01",
    "G3-app-area-02",
    "G3-app-area-03",
    "G3-app-area-04",
    "G3-app-area-05"
   ]
  },
  {
   "id": "app-volume",
   "name": "定积分应用 · 旋转体体积",
   "ch": 3,
   "when": "平面图形绕坐标轴旋转",
   "steps": [
    "① 确定旋转轴和积分区间",
    "② 绕 x 轴：V = π∫ₐ^b [f(x)]² dx",
    "③ 绕 y 轴（柱壳法）：V = 2π∫ₐ^b x·f(x) dx",
    "④ 两曲线夹的区域：V = π∫[外² − 内²]dx",
    "⑤ 计算"
   ],
   "warn": "公式里是**平方**，别漏；两曲线时是「外半径² − 内半径²」，不是「(外−内)²」",
   "qids": [
    "3-20",
    "8-44",
    "G3-app-volume-01",
    "G3-app-volume-02",
    "G3-app-volume-03",
    "G3-app-volume-04",
    "G3-app-volume-05",
    "G3-app-volume-06"
   ]
  },
  {
   "id": "int-primitive",
   "name": "原函数 · 由初始条件定常数",
   "ch": 3,
   "when": "已知 F(x) 是 f(x) 的原函数，且给了一个函数值，求 F(x)",
   "steps": [
    "① 先积出 F(x)=∫f(x)dx+C（带 C）",
    "② 把已知点代入",
    "③ 解出 C",
    "④ 写回 F(x) 的完整表达式"
   ],
   "warn": "先积再定 C，顺序不能反；C 只加一个",
   "qids": [
    "3-1",
    "G3-int-primitive-01",
    "G3-int-primitive-02",
    "G3-int-primitive-03",
    "G3-int-primitive-04",
    "G3-int-primitive-05",
    "G3-int-primitive-06"
   ]
  },
  {
   "id": "vec-op",
   "name": "向量运算 · 点积叉积模",
   "ch": 4,
   "when": "求向量模、单位向量、夹角、点积、叉积、垂直平行判定",
   "steps": [
    "① 由两点求向量：AB = (x₂−x₁, y₂−y₁, z₂−z₁)",
    "② 模：|a| = √(x²+y²+z²)",
    "③ 单位向量：a/|a|；方向余弦 = 各分量/|a|",
    "④ 点积：a·b = x₁x₂+y₁y₂+z₁z₂（结果为数）",
    "⑤ 叉积：行列式展开（结果为向量）",
    "⑥ 垂直 ⟺ 点积=0；平行 ⟺ 叉积=0"
   ],
   "warn": "点积出数、叉积出向量，别搞混；叉积用右手系，顺序反了要变号",
   "qids": [
    "4-1",
    "4-2",
    "4-3",
    "4-4",
    "4-5",
    "4-6",
    "G47-vec-op-01",
    "G47-vec-op-02",
    "G47-vec-op-03",
    "G47-vec-op-04",
    "G47-vec-op-05",
    "G47-vec-op-06",
    "G47-vec-op-07"
   ]
  },
  {
   "id": "geo-plane",
   "name": "平面方程 · 点法式",
   "ch": 4,
   "when": "求过某点、已知法向量的平面；或过点平行于某平面",
   "steps": [
    "① 找法向量 n = (A,B,C)",
    "② 点法式：A(x−x₀)+B(y−y₀)+C(z−z₀)=0",
    "③ 展开整理成 Ax+By+Cz+D=0",
    "④ 平行于已知平面 → 法向量照抄"
   ],
   "warn": "法向量垂直于平面，不是平面内的方向",
   "qids": [
    "4-7",
    "4-12",
    "8-75",
    "G47-geo-plane-01",
    "G47-geo-plane-02",
    "G47-geo-plane-03",
    "G47-geo-plane-04",
    "G47-geo-plane-05",
    "G47-geo-plane-06"
   ]
  },
  {
   "id": "geo-line",
   "name": "直线方程 · 对称式",
   "ch": 4,
   "when": "求过某点、已知方向向量的直线",
   "steps": [
    "① 找方向向量 s = (m,n,p)",
    "② 对称式：(x−x₀)/m = (y−y₀)/n = (z−z₀)/p",
    "③ 某个分母为 0 → 该项单独写成 x=x₀",
    "④ 垂直于平面 → 方向向量 = 平面法向量"
   ],
   "warn": "分母为 0 不能直接写，要单独列式",
   "qids": [
    "4-9",
    "4-11",
    "G47-geo-line-01",
    "G47-geo-line-02",
    "G47-geo-line-03",
    "G47-geo-line-04",
    "G47-geo-line-05",
    "G47-geo-line-06"
   ]
  },
  {
   "id": "geo-dist",
   "name": "点到平面距离",
   "ch": 4,
   "when": "求点 (x₀,y₀,z₀) 到平面 Ax+By+Cz+D=0 的距离",
   "steps": [
    "① 把平面化成标准形 Ax+By+Cz+D=0",
    "② 套公式 d = |Ax₀+By₀+Cz₀+D| / √(A²+B²+C²)",
    "③ 分子加绝对值（距离为正）",
    "④ 算数值"
   ],
   "warn": "分子必须加绝对值，否则可能得负数",
   "qids": [
    "4-8",
    "G47-geo-dist-01",
    "G47-geo-dist-02",
    "G47-geo-dist-03",
    "G47-geo-dist-04",
    "G47-geo-dist-05",
    "G47-geo-dist-06"
   ]
  },
  {
   "id": "geo-pos",
   "name": "直线与平面位置关系",
   "ch": 4,
   "when": "判断直线与平面是平行、垂直还是相交",
   "steps": [
    "① 取直线的方向向量 s=(m,n,p)，平面的法向量 n=(A,B,C)",
    "② 算点积 s·n",
    "③ s·n=0 → 直线平行于平面或落在平面内（再代一点区分）",
    "④ s∥n（成比例）→ 直线垂直于平面",
    "⑤ 其他 → 斜交"
   ],
   "warn": "「平行」和「在平面内」点积都为 0，要把直线上一点代入平面方程区分",
   "qids": [
    "4-10",
    "G47-geo-pos-01",
    "G47-geo-pos-02",
    "G47-geo-pos-03",
    "G47-geo-pos-04",
    "G47-geo-pos-05",
    "G47-geo-pos-06"
   ]
  },
  {
   "id": "multi-pde",
   "name": "偏导数 · 对谁导谁当变量",
   "ch": 5,
   "when": "z=f(x,y)，求 ∂z/∂x 或 ∂z/∂y",
   "steps": [
    "① 求 ∂z/∂x：把 y 当常数，对 x 正常求导",
    "② 求 ∂z/∂y：把 x 当常数，对 y 正常求导",
    "③ 复合结构用链式法则",
    "④ 求二阶混合偏导 z_xy：先对 x 导，结果再对 y 导"
   ],
   "warn": "对 x 求导时 y 是常数——但 y 若是 x 的函数则不能当常数",
   "qids": [
    "5-3",
    "5-4",
    "8-51",
    "G47-multi-pde-01",
    "G47-multi-pde-02",
    "G47-multi-pde-03",
    "G47-multi-pde-04",
    "G47-multi-pde-05",
    "G47-multi-pde-06"
   ]
  },
  {
   "id": "multi-implicit",
   "name": "隐函数偏导 · 公式法",
   "ch": 5,
   "when": "F(x,y,z)=0 确定 z=z(x,y)，求 ∂z/∂x",
   "steps": [
    "① 令 F(x,y,z) = 原方程左边 − 右边",
    "② 分别求 F_x、F_y、F_z",
    "③ 套公式：∂z/∂x = −F_x/F_z",
    "④ 同理 ∂z/∂y = −F_y/F_z"
   ],
   "warn": "公式前面有**负号**，最容易漏",
   "qids": [
    "5-5",
    "G47-multi-implicit-01",
    "G47-multi-implicit-02",
    "G47-multi-implicit-03",
    "G47-multi-implicit-04",
    "G47-multi-implicit-05",
    "G47-multi-implicit-06"
   ]
  },
  {
   "id": "multi-total",
   "name": "全微分",
   "ch": 5,
   "when": "求 dz",
   "steps": [
    "① 求 ∂z/∂x 和 ∂z/∂y",
    "② 套公式 dz = (∂z/∂x)dx + (∂z/∂y)dy",
    "③ 要某点的值 → 代入该点坐标",
    "④ 近似计算：Δz ≈ dz"
   ],
   "warn": "全微分是两个偏导分别乘 dx、dy 再相加，别漏项",
   "qids": [
    "5-6",
    "5-7",
    "8-52",
    "G47-multi-total-01",
    "G47-multi-total-02",
    "G47-multi-total-03",
    "G47-multi-total-04",
    "G47-multi-total-05",
    "G47-multi-total-06"
   ]
  },
  {
   "id": "multi-extremum",
   "name": "二元函数极值 · 无条件",
   "ch": 5,
   "when": "求 z=f(x,y) 的极值",
   "steps": [
    "① 求 f_x=0、f_y=0，解出驻点",
    "② 求二阶偏导 A=f_xx，B=f_xy，C=f_yy",
    "③ 算 Δ = AC − B²",
    "④ Δ>0 且 A<0 → 极大；Δ>0 且 A>0 → 极小",
    "⑤ Δ<0 → 非极值；Δ=0 → 需另判"
   ],
   "warn": "先解驻点再判，两个条件缺一不可（Δ 和 A 的符号都要看）",
   "qids": [
    "5-8",
    "5-9",
    "G47-multi-extremum-01",
    "G47-multi-extremum-02",
    "G47-multi-extremum-03",
    "G47-multi-extremum-04",
    "G47-multi-extremum-05",
    "G47-multi-extremum-06"
   ]
  },
  {
   "id": "dbl-cart",
   "name": "二重积分 · 直角坐标",
   "ch": 5,
   "when": "区域是矩形、或由直线/抛物线围成",
   "steps": [
    "① 画区域图，确定 x、y 的范围",
    "② 定积分次序（先积哪个更方便）",
    "③ 写累次积分：∫dx∫f dy 或 ∫dy∫f dx",
    "④ 内层积完当代入上下限，再积外层",
    "⑤ 交换次序题：先画图重定限"
   ],
   "warn": "内层上下限可以含外层变量，外层必须是常数",
   "qids": [
    "5-12",
    "5-14",
    "8-106",
    "G47-dbl-cart-01",
    "G47-dbl-cart-02",
    "G47-dbl-cart-03",
    "G47-dbl-cart-04",
    "G47-dbl-cart-05",
    "G47-dbl-cart-06"
   ]
  },
  {
   "id": "dbl-polar",
   "name": "二重积分 · 极坐标",
   "ch": 5,
   "when": "区域是圆、圆环、扇形，或被积函数含 x²+y²",
   "steps": [
    "① 令 x=r cosθ，y=r sinθ，dσ = r dr dθ",
    "② 确定 r、θ 的范围（画图或由方程解出）",
    "③ 被积函数换成 r、θ 的表达式",
    "④ **别忘乘 r**",
    "⑤ 先积 r 再积 θ"
   ],
   "warn": "dσ = r dr dθ，那个 r 是最容易漏的",
   "qids": [
    "5-10",
    "5-11",
    "5-13",
    "G47-dbl-polar-01",
    "G47-dbl-polar-02",
    "G47-dbl-polar-03",
    "G47-dbl-polar-04",
    "G47-dbl-polar-05",
    "G47-dbl-polar-06"
   ]
  },
  {
   "id": "multi-limit",
   "name": "二元函数极限 · 路径法",
   "ch": 5,
   "when": "求 lim(x,y)→(0,0) f(x,y)，或判断二重极限是否存在",
   "steps": [
    "① 先试沿坐标轴 y=0、x=0 逼近",
    "② 再试沿直线 y=kx 逼近",
    "③ 若不同路径得到**不同极限** → 极限不存在（举反例即可）",
    "④ 若各路径都同值 → 还需用夹逼或极坐标证明（sin、有界×无穷小可直接夹逼）"
   ],
   "warn": "沿两条路径得到同一个值**不能**证明极限存在；只有找到两条不同值才能证明不存在",
   "qids": [
    "5-1",
    "5-2",
    "G47-multi-limit-01",
    "G47-multi-limit-02",
    "G47-multi-limit-03",
    "G47-multi-limit-04",
    "G47-multi-limit-05",
    "G47-multi-limit-06"
   ]
  },
  {
   "id": "ser-posit",
   "name": "正项级数 · 判敛",
   "ch": 6,
   "when": "各项都 ≥0，判断收敛还是发散",
   "steps": [
    "① 先看通项是否趋于 0（不趋于 0 → 直接发散）",
    "② 比值法：lim u_{n+1}/u_n = ρ，ρ<1 收敛，ρ>1 发散",
    "③ 比较法：和 1/n^p 比，p>1 收敛",
    "④ 有 n! 或 n^n → 优先比值法"
   ],
   "warn": "必要条件（通项→0）成立**不代表**收敛，只是不成立就一定发散",
   "qids": [
    "6-1",
    "6-3",
    "6-4",
    "G47-ser-posit-01",
    "G47-ser-posit-02",
    "G47-ser-posit-03",
    "G47-ser-posit-04",
    "G47-ser-posit-05",
    "G47-ser-posit-06"
   ]
  },
  {
   "id": "ser-alt",
   "name": "交错级数 · 莱布尼茨判别",
   "ch": 6,
   "when": "各项正负交替（含 (−1)^n）",
   "steps": [
    "① 写出 u_n（取绝对值）",
    "② 验证 u_n 单调递减",
    "③ 验证 lim u_n = 0",
    "④ 两条都满足 → 收敛（条件收敛）",
    "⑤ 再看 ∑|u_n| 是否收敛，判断绝对还是条件"
   ],
   "warn": "「绝对收敛」和「条件收敛」要分别判断，不能只写一个",
   "qids": [
    "6-5",
    "6-6",
    "G47-ser-alt-01",
    "G47-ser-alt-02",
    "G47-ser-alt-03",
    "G47-ser-alt-04",
    "G47-ser-alt-05",
    "G47-ser-alt-06"
   ]
  },
  {
   "id": "ser-radius",
   "name": "幂级数 · 收敛半径与收敛域",
   "ch": 6,
   "when": "求 ∑aₙxⁿ 的收敛半径 R、收敛域",
   "steps": [
    "① 用比值法：ρ = lim |a_{n+1}/a_n|，则 R = 1/ρ",
    "② 或根值法：R = 1/lim ⁿ√|aₙ|",
    "③ 得开区间 (−R, R)",
    "④ **端点单独代入检验**，定开闭",
    "⑤ 收敛域 = 区间 + 端点判定"
   ],
   "warn": "收敛半径只给开区间，端点必须逐个代进去判，这一步最容易漏",
   "qids": [
    "6-7",
    "6-8",
    "8-56",
    "8-57",
    "G47-ser-radius-01",
    "G47-ser-radius-02",
    "G47-ser-radius-03",
    "G47-ser-radius-04",
    "G47-ser-radius-05",
    "G47-ser-radius-06"
   ]
  },
  {
   "id": "ser-sum",
   "name": "幂级数 · 求和函数",
   "ch": 6,
   "when": "求 ∑aₙxⁿ 的和函数 S(x)",
   "steps": [
    "① 认出是等比级数 → 直接套 a₁/(1−q)",
    "② 或先求导/积分，化成等比级数",
    "③ 求和后，再反向积分/求导还原",
    "④ 注明成立范围（收敛域）"
   ],
   "warn": "求导或积分后要还原回去，别停在中间步骤",
   "qids": [
    "6-2",
    "6-9",
    "6-10",
    "G47-ser-sum-01",
    "G47-ser-sum-02",
    "G47-ser-sum-03",
    "G47-ser-sum-04",
    "G47-ser-sum-05",
    "G47-ser-sum-06"
   ]
  },
  {
   "id": "ser-expand",
   "name": "函数展开成幂级数",
   "ch": 6,
   "when": "把 f(x) 展开成麦克劳林级数或幂级数",
   "steps": [
    "① 套现成公式：e^x、sin x、cos x、1/(1−x)、ln(1+x)",
    "② 若 f(2x) → 把公式里的 x 换成 2x",
    "③ 若 f(x)=1/(1+x) → 用 1/(1−x) 把 x 换成 −x",
    "④ 写出通项 + 范围"
   ],
   "warn": "**展开**是写成一串级数，不是「背出前几项」——必须写出通项和成立区间",
   "qids": [
    "6-11",
    "6-12",
    "G47-ser-expand-01",
    "G47-ser-expand-02",
    "G47-ser-expand-03",
    "G47-ser-expand-04",
    "G47-ser-expand-05",
    "G47-ser-expand-06"
   ]
  },
  {
   "id": "ode-sep",
   "name": "可分离变量微分方程",
   "ch": 7,
   "when": "能写成 y' = f(x)·g(y) 的形式",
   "steps": [
    "① 把 y' 写成 dy/dx",
    "② 移项：把含 y 的移到 dy 那边，含 x 的移到 dx 那边",
    "③ 两边积分",
    "④ 整理出通解（+C）",
    "⑤ 有初始条件 → 代入定出 C"
   ],
   "warn": "两边积分时只需在一个 C，别两边都加",
   "qids": [
    "7-3",
    "7-4",
    "G47-ode-sep-01",
    "G47-ode-sep-02",
    "G47-ode-sep-03",
    "G47-ode-sep-04",
    "G47-ode-sep-05",
    "G47-ode-sep-06"
   ]
  },
  {
   "id": "ode-linear1",
   "name": "一阶线性微分方程",
   "ch": 7,
   "when": "形如 y' + P(x)y = Q(x)",
   "steps": [
    "① 化成标准形 y' + P(x)y = Q(x)",
    "② 写出 P(x)、Q(x)",
    "③ 积分因子 e^{∫P dx}",
    "④ 套通解公式 y = e^{−∫P dx}[∫Q·e^{∫P dx}dx + C]",
    "⑤ 有初值 → 定 C"
   ],
   "warn": "必须先化成标准形（y' 系数为 1），否则 P、Q 会取错",
   "qids": [
    "7-5",
    "7-6",
    "G47-ode-linear1-01",
    "G47-ode-linear1-02",
    "G47-ode-linear1-03",
    "G47-ode-linear1-04",
    "G47-ode-linear1-05",
    "G47-ode-linear1-06"
   ]
  },
  {
   "id": "ode-const2",
   "name": "二阶常系数齐次 · 特征方程",
   "ch": 7,
   "when": "y'' + py' + qy = 0",
   "steps": [
    "① 写特征方程 r² + pr + q = 0",
    "② 求根 Δ=p²−4q",
    "③ Δ>0 两个实根 r₁≠r₂ → y = C₁e^{r₁x} + C₂e^{r₂x}",
    "④ Δ=0 重根 r → y = (C₁+C₂x)e^{rx}",
    "⑤ Δ<0 复根 α±βi → y = e^{αx}(C₁cos βx + C₂sin βx)"
   ],
   "warn": "三种情形对应三种形式，别混；复根时 β 是虚部，别漏 e^{αx}",
   "qids": [
    "7-9",
    "7-10",
    "G47-ode-const2-01",
    "G47-ode-const2-02",
    "G47-ode-const2-03",
    "G47-ode-const2-04",
    "G47-ode-const2-05",
    "G47-ode-const2-06"
   ]
  },
  {
   "id": "ode-struct",
   "name": "解的结构 · 通解与特解",
   "ch": 7,
   "when": "验证某函数是不是解、写通解结构、由特解求原方程",
   "steps": [
    "① 验证解：把 y 代入方程，看两边是否相等",
    "② 二阶齐次两个线性无关解 → 通解 = C₁y₁ + C₂y₂",
    "③ 非齐次通解 = 齐次通解 + 一个特解",
    "④ 判线性无关：看比值 y₂/y₁ 是否为常数"
   ],
   "warn": "非齐次通解必须含「齐次通解 + 特解」两部分，只写特解不算",
   "qids": [
    "7-1",
    "7-2",
    "7-7",
    "7-8",
    "8-61",
    "G47-ode-struct-01",
    "G47-ode-struct-02",
    "G47-ode-struct-03",
    "G47-ode-struct-04",
    "G47-ode-struct-05",
    "G47-ode-struct-06"
   ]
  },
  {
   "id": "ode-particular",
   "name": "二阶非齐次 · 待定特解",
   "ch": 7,
   "when": "y'' + py' + qy = f(x)，f(x) 是多项式、指数、三角",
   "steps": [
    "① 先求对应齐次方程的通解",
    "② 按 f(x) 类型设特解形式：f 是 n 次多项式 → 设 y*=Q_n(x)（同次多项式）",
    "③ 若 0 是特征根 → 特解要乘 x（k 重根乘 x^k）",
    "④ 代入原方程比较系数，定出待定系数",
    "⑤ 通解 = 齐次通解 + 特解"
   ],
   "warn": "设特解形式时要检查「f(x) 的指数是否撞上特征根」，撞上就要乘 x",
   "qids": [
    "7-11",
    "G47-ode-particular-01",
    "G47-ode-particular-02",
    "G47-ode-particular-03",
    "G47-ode-particular-04",
    "G47-ode-particular-05",
    "G47-ode-particular-06"
   ]
  },
  {
   "id": "ode-setform",
   "name": "非齐次特解 · 设形式不求",
   "ch": 7,
   "when": "题目要求「写出特解的形式」但不要解出来",
   "steps": [
    "① 求齐次方程的特征根 r₁、r₂",
    "② 看 f(x) 的类型：多项式 → 设同次多项式；e^{λx} → 设 Ae^{λx}；sin/cos → 设 Bcos+Csin",
    "③ 检查 λ（或 0）是不是特征根",
    "④ 是 k 重根 → 特解形式**乘 x^k**",
    "⑤ 把形式写出来（系数用待定字母）"
   ],
   "warn": "最关键的判断：f(x) 里的指数 λ 撞上特征根就必须乘 x，撞几次乘几次",
   "qids": [
    "7-12",
    "G47-ode-setform-01",
    "G47-ode-setform-02",
    "G47-ode-setform-03",
    "G47-ode-setform-04",
    "G47-ode-setform-05",
    "G47-ode-setform-06"
   ]
  }
 ]
};
