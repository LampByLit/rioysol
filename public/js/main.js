/**
 * GSAP full-viewport slider — from https://codepen.io/Nidal95/pen/qENQPBp (Nidal95).
 * Add photos in order in SLIDES. Headlines cycle SLIDE_WORDS (repeats if more photos than words).
 * Background: each transition picks a random color from BRIGHT_BG_COLORS. Optional per slide: `alt` only.
 */

const throttle = (callback, limit) => {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

/** Saturated backdrop colors — each advance picks one at random (not tied to slide index). */
const BRIGHT_BG_COLORS = [
  "#F87171",
  "#FB923C",
  "#FBBF24",
  "#FACC15",
  "#A3E635",
  "#4ADE80",
  "#34D399",
  "#2DD4BF",
  "#22D3EE",
  "#38BDF8",
  "#60A5FA",
  "#818CF8",
  "#A78BFA",
  "#C084FC",
  "#E879F9",
  "#F472B6",
  "#FB7185",
];

function randomBrightBackground(exclude) {
  const pool = BRIGHT_BG_COLORS;
  if (pool.length === 0) return "#444444";
  if (pool.length === 1) return pool[0];
  let pick;
  let guard = 0;
  do {
    pick = pool[Math.floor(Math.random() * pool.length)];
    guard += 1;
  } while (exclude != null && pick === exclude && guard < 24);
  return pick;
}

const SLIDES = [
  { image: "/images/rioysol-l1-06XX.jpg" },
  { image: "/images/rioysol-l1-01XX.jpg" },
  { image: "/images/rioysol-l1-02.jpg" },
  { image: "/images/rioysol-l1-03.jpg" },
  { image: "/images/rioysol-l1-04.jpg" },
  { image: "/images/rioysol-l1-05.jpg" },
  { image: "/images/rioysol-l2-01.jpg" },
  { image: "/images/rioysol-l2-02.jpg" },
  { image: "/images/rioysol-l2-03.jpg" },
  { image: "/images/rioysol-l2-04.jpg" },
  { image: "/images/rioysol-l2-05.jpg" },
  { image: "/images/rioysol-l2-06.jpg" },
  { image: "/images/rioysol-l3-01.jpg" },
];

const AUTOPLAY_DELAY = 4000;

const SLIDE_WORDS = [
  "Conservation",
  "Reforestation",
  "Protection",
  "Restoration",
  "Sustainability",
  "Rewilding",
  "Biodiversity",
  "Stewardship",
  "Sanctuary",
  "Habitat",
  "Heritage",
  "Watershed",
  "Community",
  "Resilience",
];

function slideTitleWord(idx) {
  return SLIDE_WORDS[idx % SLIDE_WORDS.length];
}

function slideAlt(idx) {
  const a = SLIDES[idx].alt;
  if (a != null && a !== "") return a;
  return (
    "Photograph from the Rio y Sol river conservation project near Iquitos, Peru (" +
    (idx + 1) +
    " of " +
    SLIDES.length +
    ")"
  );
}

class Slider {
  constructor() {
    this.current = 0;
    this.animating = false;
    this.total = SLIDES.length;
    this.el = document.querySelector(".slider");
    this.titleEl = document.querySelector(".slider__title");
    this.imagesEl = document.querySelector(".slider__images");
    this.slideEls = [];
    this.currentLine = null;
    this.cursorVisible = false;
    this.autoPlayId = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.currentBgColor = randomBrightBackground(null);

    if (typeof gsap === "undefined") {
      console.warn("GSAP failed to load; slider animations disabled.");
      if (this.el) this.el.style.backgroundColor = this.currentBgColor;
      if (this.titleEl) {
        this.titleEl.textContent = slideTitleWord(0);
        this.syncTitleAria(0);
      }
      return;
    }

    this.preload();
    this.setTitle(slideTitleWord(0));
    this.syncTitleAria(0);
    gsap.set(this.el, { backgroundColor: this.currentBgColor });
    this.buildCarousel();
    this.buildCursor();
    this.bind();
    this.startAutoPlay();

    this.scheduleFitTitle();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.scheduleFitTitle());
    }
  }

  preload() {
    SLIDES.forEach((s) => {
      new Image().src = s.image;
    });
  }

  mod(n) {
    return ((n % this.total) + this.total) % this.total;
  }

  buildCursor() {
    if (this.reducedMotion) return;

    this.cursorEl = document.createElement("div");
    this.cursorEl.className = "slider__cursor";
    this.cursorEl.textContent = "+";
    this.cursorEl.setAttribute("aria-hidden", "true");
    this.el.appendChild(this.cursorEl);
    gsap.set(this.cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });
    this.cursorMoveX = gsap.quickTo(this.cursorEl, "x", {
      duration: 0.5,
      ease: "power3",
    });
    this.cursorMoveY = gsap.quickTo(this.cursorEl, "y", {
      duration: 0.5,
      ease: "power3",
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayId = setInterval(() => {
      if (!this.animating) this.go("next");
    }, AUTOPLAY_DELAY);
  }

  stopAutoPlay() {
    if (this.autoPlayId) {
      clearInterval(this.autoPlayId);
      this.autoPlayId = null;
    }
  }

  syncTitleAria(idx) {
    const word = slideTitleWord(idx);
    this.titleEl.setAttribute(
      "aria-label",
      word + ", photo " + (idx + 1) + " of " + SLIDES.length
    );
  }

  setTitle(text) {
    this.titleEl.innerHTML = "";
    const line = document.createElement("div");
    line.className = "slider__title-line";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      line.appendChild(span);
    });
    this.titleEl.appendChild(line);
    this.currentLine = line;
  }

  /**
   * Keeps the full word on one line; scales the line uniformly if it exceeds the column.
   * Does not change the design font-size clamp — only a transform when needed.
   */
  fitTitleLine(line) {
    if (!line || !this.titleEl) return;
    line.style.transform = "";
    const avail = this.titleEl.clientWidth;
    if (avail < 8) return;

    const sw = line.scrollWidth;
    if (sw <= 0) return;

    const margin = 1;
    let s = (avail - margin) / sw;
    if (s > 1) s = 1;
    if (!(s > 0)) return;

    if (s < 1 - 0.001) {
      line.style.transformOrigin = "left center";
      line.style.transform = "scale(" + s + ")";
    }
  }

  scheduleFitTitle() {
    requestAnimationFrame(() => {
      if (this.currentLine) this.fitTitleLine(this.currentLine);
    });
  }

  animateTitle(newText) {
    if (this.currentLine) {
      this.currentLine.style.transform = "";
    }
    const h = this.titleEl.offsetHeight;
    const oldLine = this.currentLine;

    this.titleEl.style.height = h + "px";
    oldLine.style.cssText = "position:absolute;top:0;left:0;width:100%";

    const newLine = document.createElement("div");
    newLine.className = "slider__title-line";
    newLine.style.cssText = "position:absolute;top:0;left:0;width:100%";
    [...newText].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      newLine.appendChild(span);
    });
    this.titleEl.appendChild(newLine);

    this.fitTitleLine(oldLine);
    this.fitTitleLine(newLine);

    const duration = this.reducedMotion ? 0.01 : 0.85;
    const ease = "power2.inOut";

    gsap.set(oldLine, { opacity: 1 });
    gsap.set(newLine, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        oldLine.remove();
        newLine.style.cssText = "";
        this.titleEl.style.height = "";
        this.currentLine = newLine;
        this.fitTitleLine(newLine);
      },
    });

    tl.to(
      oldLine,
      {
        opacity: 0,
        duration: duration,
        ease: ease,
      },
      0
    );

    tl.to(
      newLine,
      {
        opacity: 1,
        duration: duration,
        ease: ease,
      },
      0
    );

    return tl;
  }

  makeSlide(idx) {
    const div = document.createElement("div");
    div.className = "slider__slide";
    const img = document.createElement("img");
    img.src = SLIDES[idx].image;
    img.alt = slideAlt(idx);
    img.width = 800;
    img.height = 1000;
    div.appendChild(img);
    return div;
  }

  getSlideProps(step) {
    const h = this.imagesEl.offsetHeight;
    const absStep = Math.abs(step);
    const positions = [
      { x: -0.35, y: -0.95, rot: -30, s: 1.35, b: 16, o: 0 },
      { x: -0.18, y: -0.5, rot: -15, s: 1.15, b: 8, o: 0.55 },
      { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },
      { x: -0.06, y: 0.5, rot: 15, s: 0.75, b: 6, o: 0.55 },
      { x: -0.12, y: 0.95, rot: 30, s: 0.55, b: 14, o: 0 },
    ];
    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];

    return {
      x: p.x * h,
      y: p.y * h,
      rotation: p.rot,
      scale: p.s,
      blur: p.b,
      opacity: p.o,
      zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1,
    };
  }

  positionSlide(slide, step) {
    const props = this.getSlideProps(step);
    gsap.set(slide, {
      xPercent: -50,
      yPercent: -50,
      x: props.x,
      y: props.y,
      rotation: props.rotation,
      scale: props.scale,
      opacity: props.opacity,
      filter: "blur(" + props.blur + "px)",
      zIndex: props.zIndex,
    });
  }

  buildCarousel() {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return;
    this.imagesEl.innerHTML = "";
    this.slideEls = [];

    for (let step = -1; step <= 1; step++) {
      const idx = this.mod(this.current + step);
      const slide = this.makeSlide(idx);
      this.imagesEl.appendChild(slide);
      this.positionSlide(slide, step);
      this.slideEls.push({ el: slide, step: step });
    }
  }

  animateCarousel(direction) {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return gsap.timeline();

    const shift = direction === "next" ? -1 : 1;
    const enterStep = direction === "next" ? 2 : -2;
    const newIdx = direction === "next" ? this.mod(this.current + 2) : this.mod(this.current - 2);

    const newSlide = this.makeSlide(newIdx);
    this.imagesEl.appendChild(newSlide);
    this.positionSlide(newSlide, enterStep);
    this.slideEls.push({ el: newSlide, step: enterStep });

    this.slideEls.forEach((s) => {
      s.step += shift;
    });

    const duration = this.reducedMotion ? 0.01 : 1.2;

    const tl = gsap.timeline({
      onComplete: () => {
        this.slideEls = this.slideEls.filter((s) => {
          if (Math.abs(s.step) >= 2) {
            s.el.remove();
            return false;
          }
          return true;
        });
      },
    });

    this.slideEls.forEach((s) => {
      const props = this.getSlideProps(s.step);
      s.el.style.zIndex = props.zIndex;

      tl.to(
        s.el,
        {
          x: props.x,
          y: props.y,
          rotation: props.rotation,
          scale: props.scale,
          opacity: props.opacity,
          filter: "blur(" + props.blur + "px)",
          duration: duration,
          ease: "power3.inOut",
        },
        0
      );
    });

    return tl;
  }

  go(direction) {
    if (this.animating) return;
    this.animating = true;
    this.startAutoPlay();

    const nextIdx = direction === "next" ? this.mod(this.current + 1) : this.mod(this.current - 1);
    const nextBg = randomBrightBackground(this.currentBgColor);

    const master = gsap.timeline({
      onComplete: () => {
        this.current = nextIdx;
        this.animating = false;
        this.currentBgColor = nextBg;
        this.syncTitleAria(nextIdx);
      },
    });

    master.to(
      this.el,
      {
        backgroundColor: nextBg,
        duration: this.reducedMotion ? 0.01 : 1.2,
        ease: "power2.inOut",
      },
      0
    );

    master.add(this.animateTitle(slideTitleWord(nextIdx)), 0);
    master.add(this.animateCarousel(direction), 0);
  }

  bind() {
    const onWheel = throttle((e) => {
      if (this.animating) return;
      this.go(e.deltaY > 0 ? "next" : "prev");
    }, 1800);
    window.addEventListener("wheel", onWheel, { passive: true });

    let touchStartY = 0;
    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    const onTouchEnd = throttle((e) => {
      if (this.animating) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      this.go(diff > 0 ? "next" : "prev");
    }, 1800);
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    window.addEventListener("keydown", (e) => {
      if (this.animating) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") this.go("next");
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") this.go("prev");
    });

    if (this.cursorEl) {
      this.el.addEventListener(
        "mousemove",
        (e) => {
          if (!this.cursorVisible) {
            gsap.to(this.cursorEl, { opacity: 1, duration: 0.3 });
            this.cursorVisible = true;
          }
          this.cursorMoveX(e.clientX);
          this.cursorMoveY(e.clientY);
        },
        { passive: true }
      );

      this.el.addEventListener("mouseleave", () => {
        gsap.to(this.cursorEl, { opacity: 0, duration: 0.3 });
        this.cursorVisible = false;
      });
    }

    const onResize = debounce(() => {
      if (!this.animating && this.imagesEl.offsetHeight > 0) {
        this.slideEls.forEach((s) => {
          this.positionSlide(s.el, s.step);
        });
        if (this.currentLine) this.fitTitleLine(this.currentLine);
      }
    }, 300);
    window.addEventListener("resize", onResize, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.animating = false;
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Slider();
});
