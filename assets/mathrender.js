/* -----------------------------------------------------------
   KaTeX 公式渲染（2026-10-29）
   依赖：assets/katex/{katex.min.css, katex.min.js, auto-render.min.js}
   做法：页面渲染完 #main 后自动扫描 $...$ 与 $$...$$ 并渲染；
        用 MutationObserver 跟随重新渲染（搜索/翻页后仍生效）。
   ----------------------------------------------------------- */
(function () {
  "use strict";
  var done = new WeakSet();
  var timer = null;

  function base() {
    /* 本文件位于 assets/，从科目页引用时前缀为 ../assets/ */
    var s = document.currentScript;
    if (s && s.src) {
      return s.src.replace(/[^/]*$/, '');
    }
    return "../assets/";
  }

  function loadCss() {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = base() + "katex/katex.min.css";
    document.head.appendChild(l);
  }

  function render() {
    if (!window.renderMathInElement) return;
    var boxes = document.querySelectorAll("#main, .main");
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      /* 签名用「子元素数 + 文本长度」：只看子元素数会漏掉"框内追加内容"的情况
         （例如点开答案、切换题型），导致内容变了却不重渲染。 */
      var sig = box.childElementCount + ':' + (box.textContent || '').length;
      if (done.has(box) && box.__mathSig === sig) continue;
      try {
        window.renderMathInElement(box, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false,
          errorColor: "#b3261e",
          strict: false,
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"]
        });
      } catch (e) { }
      done.add(box);
      box.__mathSig = box.childElementCount + ':' + (box.textContent || '').length;
    }
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 120);
  }

  function boot() {
    loadCss();

    function onLib() {
      render();
      var box = document.getElementById("main");
      if (box && window.MutationObserver) {
        new MutationObserver(schedule).observe(box, { childList: true });
      }
      setInterval(schedule, 1500);
    }

    var s1 = document.createElement("script");
    s1.src = base() + "katex/katex.min.js";
    s1.onload = function () {
      var s2 = document.createElement("script");
      s2.src = base() + "katex/auto-render.min.js";
      s2.onload = onLib;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
