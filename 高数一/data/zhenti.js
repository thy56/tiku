/* 高数一 历年真题（回忆版） */
window.GS_ZHENTI =  [
  {
   "year": "2020",
   "source": "考生回忆版（山东考试院不公布官方原题）",
   "hasAnswer": true,
   "note": "回忆版，题型与考点与当年试卷一致；答案与简解为整理补充。",
   "sections": [
    {
     "name": "一、单项选择题",
     "type": "choice",
     "score": "每题 3 分，共 15 分",
     "items": [
      {
       "no": 1,
       "q": "当 $x \\to 0$ 时，以下函数是无穷小量的是",
       "opts": [
        "$e^{x}$",
        "$\\ln(x+2)$",
        "$\\sin x$",
        "$\\cos x$"
       ],
       "ans": "C",
       "an": "$x\\to0$ 时 $\\sin x\\to0$，是无穷小；$e^{x}\\to1$、$\\ln(x+2)\\to\\ln2$、$\\cos x\\to1$ 均不是无穷小。"
      },
      {
       "no": 2,
       "q": "平面 $2x-3y+4z=8$ 与直线 $\\dfrac{x-1}{2}=\\dfrac{y+2}{-3}=\\dfrac{z}{4}$ 的位置关系是",
       "opts": [
        "平行",
        "垂直",
        "相交但不垂直",
        "直线在平面上"
       ],
       "ans": "B",
       "an": "平面法向量 $\\vec n=(2,-3,4)$，直线方向向量 $\\vec s=(2,-3,4)$。$\\vec n \\parallel \\vec s$，故直线与平面垂直。"
      },
      {
       "no": 3,
       "q": "微分方程 $y''+7y'-8y=0$ 的通解为",
       "opts": [
        "$y=C_1e^{-x}+C_2e^{8x}$",
        "$y=C_1e^{-x}+C_2e^{-8x}$",
        "$y=C_1e^{x}+C_2e^{8x}$",
        "$y=C_1e^{x}+C_2e^{-8x}$"
       ],
       "ans": "D",
       "an": "特征方程 $r^{2}+7r-8=0$，即 $(r+8)(r-1)=0$，得 $r_1=1,\\ r_2=-8$，故 $y=C_1e^{x}+C_2e^{-8x}$。"
      },
      {
       "no": 4,
       "q": "曲线 $y=2x^{3}+3x^{2}-1$ 的拐点是",
       "opts": [
        "$\\left(-\\dfrac{1}{2},-\\dfrac{1}{2}\\right)$",
        "$\\left(-\\dfrac{1}{2},\\dfrac{1}{2}\\right)$",
        "$(-1,0)$",
        "$(0,-1)$"
       ],
       "ans": "A",
       "an": "$y'=6x^{2}+6x$，$y''=12x+6$。令 $y''=0$ 得 $x=-\\dfrac{1}{2}$；$y\\left(-\\dfrac{1}{2}\\right)=2\\cdot\\left(-\\dfrac{1}{8}\\right)+3\\cdot\\dfrac{1}{4}-1=-\\dfrac{1}{2}$。且 $y''$ 在该点两侧变号，故拐点为 $\\left(-\\dfrac{1}{2},-\\dfrac{1}{2}\\right)$。"
      },
      {
       "no": 5,
       "q": "以下级数收敛的为",
       "opts": [
        "$\\sum\\limits_{n=1}^{\\infty}\\dfrac{n^{2}-1}{n^{3}+2n^{2}}$",
        "$\\sum\\limits_{n=1}^{\\infty}\\sin\\dfrac{n\\pi}{3}$",
        "$\\sum\\limits_{n=1}^{\\infty}\\ln\\left(1+\\dfrac{1}{n^{2}}\\right)$",
        "$\\sum\\limits_{n=1}^{\\infty}\\dfrac{3^{n}}{2n^{2}+1}$"
       ],
       "ans": "C",
       "an": "C：$\\ln\\left(1+\\dfrac{1}{n^{2}}\\right)\\sim\\dfrac{1}{n^{2}}$，$p=2>1$，收敛。A：通项 $\\sim\\dfrac{1}{n}$，发散；B：通项不趋于 0，发散；D：通项 $\\to\\infty$，发散。"
      }
     ]
    },
    {
     "name": "二、填空题",
     "type": "fill",
     "score": "每题 3 分，共 15 分",
     "items": [
      {
       "no": 6,
       "q": "函数 $f(x)=\\sqrt{\\dfrac{x}{3}-1}$ 的定义域为 ________。",
       "ans": "$[3,+\\infty)$",
       "an": "根号内非负：$\\dfrac{x}{3}-1\\ge0$，得 $x\\ge3$。"
      },
      {
       "no": 7,
       "q": "曲线 $y=\\dfrac{1}{x}+2\\ln x$ 在点 $(1,1)$ 处的切线方程为 ________。",
       "ans": "$y=x$",
       "an": "$y'=-\\dfrac{1}{x^{2}}+\\dfrac{2}{x}$，$y'(1)=-1+2=1$。切线：$y-1=1\\cdot(x-1)$，即 $y=x$。"
      },
      {
       "no": 8,
       "q": "若 $\\displaystyle\\int_{a}^{b}f(x)dx=1$，$\\displaystyle\\int_{a}^{b}[2f(x)+3g(x)]dx=8$，则 $\\displaystyle\\int_{a}^{b}g(x)dx=$ ________。",
       "ans": "$2$",
       "an": "$2\\displaystyle\\int_{a}^{b}f+3\\displaystyle\\int_{a}^{b}g=8$，即 $2\\times1+3\\displaystyle\\int_{a}^{b}g=8$，得 $\\displaystyle\\int_{a}^{b}g=2$。"
      },
      {
       "no": 9,
       "q": "已知两点 $A(-1,2,0)$ 和 $B(2,-3,\\sqrt{2})$，则与向量 $\\overrightarrow{AB}$ 同方向的单位向量为 ________。",
       "ans": "$\\left(\\dfrac{1}{2},-\\dfrac{5}{6},\\dfrac{\\sqrt{2}}{6}\\right)$",
       "an": "$\\overrightarrow{AB}=(3,-5,\\sqrt{2})$，$|\\overrightarrow{AB}|=\\sqrt{9+25+2}=6$，单位向量 $=\\dfrac{1}{6}(3,-5,\\sqrt{2})$。"
      },
      {
       "no": 10,
       "q": "已知 $f(x,y)$ 连续，$I=\\displaystyle\\int_{0}^{1}dx\\int_{0}^{\\sqrt{x}}f(x,y)dy+\\int_{1}^{2}dx\\int_{0}^{2-x}f(x,y)dy$，交换积分次序后 $I=$ ________。",
       "ans": "$\\displaystyle\\int_{0}^{1}dy\\int_{y^{2}}^{2-y}f(x,y)dx$",
       "an": "积分区域由 $y=\\sqrt{x}$（即 $x=y^{2}$）与 $y=2-x$（即 $x=2-y$）围成，两条曲线交于 $(1,1)$。改写为先对 $x$：$y$ 从 $0$ 到 $1$，$x$ 从 $y^{2}$ 到 $2-y$。"
      }
     ]
    },
    {
     "name": "三、解答题",
     "type": "answer",
     "score": "共 70 分",
     "items": [
      {
       "no": 11,
       "score": "6 分",
       "q": "求极限：$\\displaystyle\\lim_{x\\to\\infty}\\left(\\dfrac{x^{3}+3x^{2}}{x^{2}+x+2}-x\\right)$",
       "ans": "$2$",
       "an": "通分：$\\dfrac{x^{3}+3x^{2}-x(x^{2}+x+2)}{x^{2}+x+2}=\\dfrac{2x^{2}-2x}{x^{2}+x+2}$，分子分母同除 $x^{2}$，极限为 $\\dfrac{2}{1}=2$。"
      },
      {
       "no": 12,
       "score": "6 分",
       "q": "求极限：$\\displaystyle\\lim_{x\\to0}\\dfrac{\\int_{0}^{x}\\sin t^{2}dt}{x^{3}}$",
       "ans": "$\\dfrac{1}{3}$",
       "an": "$\\dfrac{0}{0}$ 型，洛必达：$\\dfrac{\\sin x^{2}}{3x^{2}}$，而 $\\sin x^{2}\\sim x^{2}$，故极限 $=\\dfrac{x^{2}}{3x^{2}}=\\dfrac{1}{3}$。"
      },
      {
       "no": 13,
       "score": "6 分",
       "q": "求不定积分：$\\displaystyle\\int\\dfrac{\\sqrt{x}+\\ln x}{x}dx$",
       "ans": "$2\\sqrt{x}+\\dfrac{1}{2}(\\ln x)^{2}+C$",
       "an": "拆成两项：$\\displaystyle\\int x^{-\\frac{1}{2}}dx+\\int\\dfrac{\\ln x}{x}dx=2\\sqrt{x}+\\dfrac{1}{2}(\\ln x)^{2}+C$。"
      },
      {
       "no": 14,
       "score": "6 分",
       "q": "求过点 $(1,-2,2)$ 且与两平面 $x+2y-z=1$、$2x+y+3z=2$ 都垂直的平面方程。",
       "ans": "$7x-5y-3z=11$",
       "an": "所求平面法向量 $\\vec n=\\vec n_1\\times\\vec n_2=(1,2,-1)\\times(2,1,3)=(2\\times3-(-1)\\times1,\\ (-1)\\times2-1\\times3,\\ 1\\times1-2\\times2)=(7,-5,-3)$。过点 $(1,-2,2)$：$7(x-1)-5(y+2)-3(z-2)=0$，整理得 $7x-5y-3z=11$。"
      },
      {
       "no": 15,
       "score": "6 分",
       "q": "已知 $z=x\\sin\\dfrac{y}{x}$，求 $\\dfrac{\\partial^{2}z}{\\partial x\\partial y}$",
       "ans": "$\\dfrac{y}{x^{2}}\\sin\\dfrac{y}{x}$",
       "an": "先对 $y$ 求偏导：$\\dfrac{\\partial z}{\\partial y}=x\\cos\\dfrac{y}{x}\\cdot\\dfrac{1}{x}=\\cos\\dfrac{y}{x}$；再对 $x$ 求偏导：$\\dfrac{\\partial}{\\partial x}\\cos\\dfrac{y}{x}=-\\sin\\dfrac{y}{x}\\cdot\\left(-\\dfrac{y}{x^{2}}\\right)=\\dfrac{y}{x^{2}}\\sin\\dfrac{y}{x}$。"
      },
      {
       "no": 16,
       "score": "7 分",
       "q": "计算二重积分 $\\displaystyle\\iint_{D}\\cos(x^{2}+y^{2})dxdy$，$D$ 由 $y=\\dfrac{\\sqrt{3}}{3}x$，$y=\\sqrt{3}x$，$x^{2}+y^{2}=\\dfrac{\\pi}{2}$ 在第一象限围成。",
       "ans": "$\\dfrac{\\pi}{12}$",
       "an": "极坐标：$y=\\dfrac{\\sqrt{3}}{3}x$ 对应 $\\theta=\\dfrac{\\pi}{6}$，$y=\\sqrt{3}x$ 对应 $\\theta=\\dfrac{\\pi}{3}$，$r$ 从 $0$ 到 $\\sqrt{\\dfrac{\\pi}{2}}$。$I=\\displaystyle\\int_{\\pi/6}^{\\pi/3}d\\theta\\int_{0}^{\\sqrt{\\pi/2}}\\cos(r^{2})\\,r\\,dr$。内层 $=\\dfrac{1}{2}\\left[\\sin(r^{2})\\right]_{0}^{\\sqrt{\\pi/2}}=\\dfrac{1}{2}\\sin\\dfrac{\\pi}{2}=\\dfrac{1}{2}$。故 $I=\\dfrac{1}{2}\\cdot\\dfrac{\\pi}{6}=\\dfrac{\\pi}{12}$。"
      },
      {
       "no": 17,
       "score": "7 分",
       "q": "求微分方程 $y'+y=e^{x}+x$ 的通解。",
       "ans": "$y=Ce^{-x}+\\dfrac{1}{2}e^{x}+x-1$",
       "an": "一阶线性，$P(x)=1$，$Q(x)=e^{x}+x$。积分因子 $e^{\\int1dx}=e^{x}$，通解 $y=e^{-x}\\left(\\displaystyle\\int e^{x}(e^{x}+x)dx+C\\right)$。其中 $\\displaystyle\\int e^{2x}dx=\\dfrac{1}{2}e^{2x}$，$\\displaystyle\\int xe^{x}dx=xe^{x}-e^{x}$。故 $y=e^{-x}\\left(\\dfrac{1}{2}e^{2x}+xe^{x}-e^{x}+C\\right)=\\dfrac{1}{2}e^{x}+x-1+Ce^{-x}$。"
      },
      {
       "no": 18,
       "score": "8 分",
       "q": "求幂级数 $\\displaystyle\\sum_{n=0}^{\\infty}\\dfrac{x^{n+2}}{n+1}$ 的收敛域及和函数。",
       "ans": "收敛域 $[-1,1)$；和函数 $S(x)=-x\\ln(1-x)$",
       "an": "提出 $x$：$S(x)=x\\displaystyle\\sum_{n=0}^{\\infty}\\dfrac{x^{n+1}}{n+1}$。由 $\\ln(1-x)=-\\displaystyle\\sum_{n=1}^{\\infty}\\dfrac{x^{n}}{n}$ 得 $\\sum_{n=0}^{\\infty}\\dfrac{x^{n+1}}{n+1}=-\\ln(1-x)$，故 $S(x)=-x\\ln(1-x)$。端点：$x=1$ 时级数为调和的（发散）；$x=-1$ 时为交错级数 $\\sum\\dfrac{(-1)^{n+2}}{n+1}$，收敛。收敛域 $[-1,1)$。"
      },
      {
       "no": 19,
       "score": "7 分",
       "q": "求曲线 $y=-x^{2}+4$ 与直线 $y=-2x+4$ 围成图形的面积。",
       "ans": "$\\dfrac{4}{3}$",
       "an": "交点：$-x^{2}+4=-2x+4$，得 $x^{2}-2x=0$，$x=0$ 或 $x=2$。面积 $=\\displaystyle\\int_{0}^{2}\\left[(-x^{2}+4)-(-2x+4)\\right]dx=\\int_{0}^{2}(-x^{2}+2x)dx=\\left[-\\dfrac{x^{3}}{3}+x^{2}\\right]_{0}^{2}=-\\dfrac{8}{3}+4=\\dfrac{4}{3}$。"
      },
      {
       "no": 20,
       "score": "7 分",
       "q": "证明：当 $x>1$ 时，$x+\\ln x>4\\sqrt{x}-3$。",
       "ans": "见解析",
       "an": "构造 $F(x)=x+\\ln x-4\\sqrt{x}+3$（$x\\ge1$）。$F(1)=1+0-4+3=0$。$F'(x)=1+\\dfrac{1}{x}-\\dfrac{2}{\\sqrt{x}}=\\dfrac{x\\left(1+\\frac{1}{x}-\\frac{2}{\\sqrt{x}}\\right)}{x}=\\dfrac{(\\sqrt{x}-1)^{2}}{x}\\ge0$。故 $F$ 在 $[1,+\\infty)$ 单调递增，$x>1$ 时 $F(x)>F(1)=0$，即 $x+\\ln x>4\\sqrt{x}-3$。"
      },
      {
       "no": 21,
       "score": "8 分",
       "q": "设 $f(x)$ 在 $[0,1]$ 上连续，$f(1)=1$，证明：对任意 $\\lambda\\in(0,1)$，存在 $\\xi\\in(0,1)$，使得 $f(\\xi)=\\dfrac{\\lambda}{\\xi^{2}}$。",
       "ans": "见解析",
       "an": "构造辅助函数 $F(x)=x^{2}f(x)-\\lambda$，$F$ 在 $[0,1]$ 上连续。$F(0)=0-\\lambda=-\\lambda<0$；$F(1)=1\\cdot f(1)-\\lambda=1-\\lambda>0$（因 $\\lambda\\in(0,1)$）。由零点定理，存在 $\\xi\\in(0,1)$ 使 $F(\\xi)=0$，即 $\\xi^{2}f(\\xi)=\\lambda$，故 $f(\\xi)=\\dfrac{\\lambda}{\\xi^{2}}$。"
      }
     ]
    }
   ]
  },
  {
   "year": "2025",
   "source": "考生回忆版片段（山东考试院不公布官方原题）",
   "hasAnswer": true,
   "partial": true,
   "note": "仅收录第 18–21 题。第 1–16 题回忆内容缺失；第 17 题仅存答案 [2,8)（R=3），题干缺失，未收录。",
   "sections": [
    {
     "name": "三、计算题（片段）",
     "type": "answer",
     "score": "第 17 题题干缺失",
     "items": [
      {
       "no": 18,
       "score": "8 分",
       "q": "计算二重积分 $\\displaystyle\\iint_{D}x\\,dxdy$，其中 $D$ 由曲线 $y=|x^{2}-4|$ 与直线 $y=3x$ 所围成的闭区域。",
       "ans": "$\\dfrac{99}{4}$",
       "an": "先求交点：$x^{2}-4\\ge0$ 时 $x^{2}-4=3x$，即 $(x-4)(x+1)=0$，取 $x=4$；$x^{2}-4<0$ 时 $4-x^{2}=3x$，即 $(x+4)(x-1)=0$，取 $x=1$。故两曲线交于 $x=1$ 与 $x=4$，且在 $[1,4]$ 上恒有 $3x\\ge|x^{2}-4|$。以 $x=2$ 分段：\n\n$I=\\displaystyle\\int_{1}^{2}x\\left[3x-(4-x^{2})\\right]dx+\\int_{2}^{4}x\\left[3x-(x^{2}-4)\\right]dx$\n\n第一段 $=\\displaystyle\\int_{1}^{2}(x^{3}+3x^{2}-4x)dx=\\left[\\dfrac{x^{4}}{4}+x^{3}-2x^{2}\\right]_{1}^{2}=4-\\left(-\\dfrac{3}{4}\\right)=\\dfrac{19}{4}$\n\n第二段 $=\\displaystyle\\int_{2}^{4}(-x^{3}+3x^{2}+4x)dx=\\left[-\\dfrac{x^{4}}{4}+x^{3}+2x^{2}\\right]_{2}^{4}=32-12=20$\n\n故 $I=\\dfrac{19}{4}+20=\\dfrac{99}{4}$。"
      }
     ]
    },
    {
     "name": "四、应用题",
     "type": "answer",
     "score": "每题 7 分，共 14 分",
     "items": [
      {
       "no": 19,
       "score": "7 分",
       "q": "设区域 $D$ 由 $y=e^{x}$ 与 $y=\\sqrt{2x-x^{2}}$ 及直线 $x=1$、$x=0$ 围成，求 $D$ 绕 $x$ 轴旋转一周所得旋转体的体积。",
       "ans": "$\\pi\\left(\\dfrac{e^{2}}{2}-\\dfrac{7}{6}\\right)$",
       "an": "$y=\\sqrt{2x-x^{2}}$ 即 $(x-1)^{2}+y^{2}=1$ 的上半圆，在 $[0,1]$ 上由 $0$ 单调增到 $1$；而 $e^{x}$ 在 $[0,1]$ 上由 $1$ 增到 $e$，故 $e^{x}\\ge\\sqrt{2x-x^{2}}$。\n\n$V=\\pi\\displaystyle\\int_{0}^{1}\\left[(e^{x})^{2}-(2x-x^{2})\\right]dx=\\pi\\left[\\dfrac{e^{2x}}{2}-x^{2}+\\dfrac{x^{3}}{3}\\right]_{0}^{1}$\n\n$=\\pi\\left[\\left(\\dfrac{e^{2}}{2}-1+\\dfrac{1}{3}\\right)-\\dfrac{1}{2}\\right]=\\pi\\left(\\dfrac{e^{2}}{2}-\\dfrac{7}{6}\\right)$。"
      },
      {
       "no": 20,
       "score": "7 分",
       "q": "求函数 $f(x)=x+\\ln(1+x^{2})-4\\arctan x$ 的极值，并判断是极大值还是极小值。",
       "ans": "极大值 $f(-3)=-3+\\ln 10+4\\arctan 3$；极小值 $f(1)=1+\\ln 2-\\pi$",
       "an": "$f'(x)=1+\\dfrac{2x}{1+x^{2}}-\\dfrac{4}{1+x^{2}}=\\dfrac{(1+x^{2})+2x-4}{1+x^{2}}=\\dfrac{x^{2}+2x-3}{1+x^{2}}=\\dfrac{(x+3)(x-1)}{1+x^{2}}$。\n\n令 $f'(x)=0$ 得驻点 $x=-3$、$x=1$。分母 $1+x^{2}>0$，故 $f'$ 的符号由 $(x+3)(x-1)$ 决定：$x<-3$ 时为正，$-3<x<1$ 时为负，$x>1$ 时为正。\n\n所以 $x=-3$ 为极大值点，$x=1$ 为极小值点。\n\n$f(-3)=-3+\\ln(1+9)-4\\arctan(-3)=-3+\\ln 10+4\\arctan 3$（极大值）；\n\n$f(1)=1+\\ln 2-4\\cdot\\dfrac{\\pi}{4}=1+\\ln 2-\\pi$（极小值）。"
      }
     ]
    },
    {
     "name": "五、证明题",
     "type": "answer",
     "score": "8 分",
     "items": [
      {
       "no": 21,
       "score": "8 分",
       "q": "已知 $f(x)$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内可导。求证：存在 $\\xi\\in(0,1)$，使 $$\\int_{0}^{1}f(x)dx=f(0)+f'(\\xi)(1-\\xi)$$",
       "ans": "见解析",
       "an": "对 $\\displaystyle\\int_{0}^{1}(1-x)f'(x)dx$ 分部积分（取 $u=1-x$，$dv=f'(x)dx$）：\n\n$\\displaystyle\\int_{0}^{1}(1-x)f'(x)dx=\\Big[(1-x)f(x)\\Big]_{0}^{1}+\\int_{0}^{1}f(x)dx=0-f(0)+\\int_{0}^{1}f(x)dx$\n\n即 $\\displaystyle\\int_{0}^{1}(1-x)f'(x)dx=\\int_{0}^{1}f(x)dx-f(0)$。\n\n又 $(1-x)f'(x)$ 在 $[0,1]$ 上连续，由积分中值定理，存在 $\\xi\\in(0,1)$ 使\n\n$\\displaystyle\\int_{0}^{1}(1-x)f'(x)dx=(1-\\xi)f'(\\xi)\\cdot(1-0)=(1-\\xi)f'(\\xi)$。\n\n两式联立得 $\\displaystyle\\int_{0}^{1}f(x)dx-f(0)=f'(\\xi)(1-\\xi)$，即\n\n$\\displaystyle\\int_{0}^{1}f(x)dx=f(0)+f'(\\xi)(1-\\xi)$。证毕。\n\n（注：分部积分与积分中值定理要求 $f'$ 在 $[0,1]$ 上连续，这是教材通行假设。）"
      }
     ]
    }
   ]
  }
 ];
