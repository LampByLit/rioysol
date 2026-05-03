/**
 * Scroll-scrubbed “river” SVG paths (inspired by GSAP ScrollTrigger stroke-dash patterns,
 * e.g. https://codepen.io/ikrprojects/pen/KwgGBRp). Respects prefers-reduced-motion.
 */

(function () {
  var shell = document.querySelector(".about__shell");
  var riverBg = document.querySelector(".about__river-bg");
  var riverSvgOuter = document.querySelector(".about__river-svg-outer");
  var uses = document.querySelectorAll(".about__river-use");
  var pathIds = ["aboutRiverPath1", "aboutRiverPath2", "aboutRiverPath3", "aboutRiverPath4"];

  if (!shell || !uses.length) return;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("about--reduced-motion");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var lengths = pathIds.map(function (id) {
    var p = document.getElementById(id);
    return p ? p.getTotalLength() : 0;
  });

  uses.forEach(function (use, i) {
    var len = lengths[i];
    if (!len) return;
    gsap.set(use, { strokeDasharray: len, strokeDashoffset: len });
  });

  var lagPerIndex = 0.055;

  ScrollTrigger.create({
    trigger: shell,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.65,
    onUpdate: function (self) {
      var progress = self.progress;
      uses.forEach(function (use, i) {
        var len = lengths[i];
        if (!len) return;
        var lag = i * lagPerIndex;
        var denom = Math.max(0.001, 1 - lag * 0.65);
        var t = (progress - lag) / denom;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        gsap.set(use, { strokeDashoffset: len * (1 - t) });
      });
      if (riverBg) gsap.set(riverBg, { y: progress * -52 });
      if (riverSvgOuter)
        riverSvgOuter.style.setProperty("--about-river-parallax-y", progress * 36 + "px");
    },
  });

  window.addEventListener(
    "load",
    function () {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
