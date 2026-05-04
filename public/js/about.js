/**
 * Gist-aligned scroll lines: body --strokeDashoffset + --tabletVerticaloffset
 * https://gist.github.com/LampByLit/47392e5516ccc6b094aef2ee2ef29b66
 * (CodePen https://codepen.io/ikrprojects/pen/KwgGBRp, no SplitText here.)
 */

(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    document.body.classList.add("about--reduced-motion");
    var h = window.innerHeight;
    gsap.set("body", {
      "--strokeDashoffset": -2400,
      "--tabletVerticaloffset": -Math.floor(0.65 * h) + "px",
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Match gist: single ScrollTrigger on body, scrub: true, shared dash offset */
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: function (self) {
      var thisProgress = self.progress;
      var tabletVerMovement = 0.65 * window.innerHeight;
      var scrollProgress = -(2400 * thisProgress);
      gsap.set("body", { "--strokeDashoffset": scrollProgress });
      var scrollProgress2 = -Math.floor(tabletVerMovement * thisProgress) + "px";
      gsap.set("body", { "--tabletVerticaloffset": scrollProgress2 });
    },
  });

  var refreshTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        ScrollTrigger.refresh();
      }, 120);
    },
    { passive: true }
  );

  window.addEventListener(
    "load",
    function () {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
