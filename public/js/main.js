import { animate, scroll, cubicBezier } from "https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let didInit = false;

const scrollOpts = (target, offset) => ({
  target,
  offset,
  trackContentSize: true,
});

/** Wait for every mosaic image so row tracks / scaler cell match the final photo wall. */
function whenGridImagesReady(grid, onReady) {
  const imgs = grid.querySelectorAll("img");
  if (imgs.length === 0) {
    onReady();
    return;
  }
  let pending = imgs.length;
  const done = () => {
    pending -= 1;
    if (pending <= 0) onReady();
  };
  imgs.forEach((img) => {
    if (img.complete) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

/** End size for the scaler animation: the grid cell (.scaler), so the hero lands in the wall. */
function scalerEndSize(img) {
  const cell = img.closest(".scaler");
  if (cell) {
    const rw = cell.getBoundingClientRect();
    const cw = Math.round(rw.width);
    const ch = Math.round(rw.height);
    if (cw > 0 && ch > 0) return { w: cw, h: ch };
  }

  let w = img.offsetWidth;
  let h = img.offsetHeight;
  if (!w || !h) {
    const rw = img.getBoundingClientRect();
    w = Math.round(rw.width);
    h = Math.round(rw.height);
  }
  if (!w || !h) {
    w = img.naturalWidth || Number(img.getAttribute("width")) || 400;
    h = img.naturalHeight || Number(img.getAttribute("height")) || 500;
  }
  return { w, h };
}

function initScrollEffects() {
  if (didInit) return;

  const image = document.querySelector(".scaler img");
  const firstSection = document.querySelector("main section:first-of-type");
  const layers = document.querySelectorAll(".grid > .layer");

  if (!image || !firstSection) return;

  didInit = true;

  const { w: naturalWidth, h: naturalHeight } = scalerEndSize(image);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  scroll(
    animate(
      image,
      {
        width: [viewportWidth, naturalWidth],
        height: [viewportHeight, naturalHeight],
      },
      {
        width: { easing: cubicBezier(0.65, 0, 0.35, 1) },
        height: { easing: cubicBezier(0.42, 0, 0.58, 1) },
      }
    ),
    scrollOpts(firstSection, ["start start", "80% end end"])
  );

  const scaleEasings = [
    cubicBezier(0.42, 0, 0.58, 1),
    cubicBezier(0.76, 0, 0.24, 1),
    cubicBezier(0.87, 0, 0.13, 1),
  ];

  layers.forEach((layer, index) => {
    const endOffset = `${1 - index * 0.05} end`;

    scroll(
      animate(
        layer,
        { opacity: [0, 0, 1] },
        {
          offset: [0, 0.55, 1],
          easing: cubicBezier(0.61, 1, 0.88, 1),
        }
      ),
      scrollOpts(firstSection, ["start start", endOffset])
    );

    scroll(
      animate(
        layer,
        { scale: [0, 0, 1] },
        {
          offset: [0, 0.3, 1],
          easing: scaleEasings[index] ?? scaleEasings[0],
        }
      ),
      scrollOpts(firstSection, ["start start", endOffset])
    );
  });
}

function scheduleInitScrollEffects() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => initScrollEffects());
  });
}

function boot() {
  if (prefersReducedMotion) return;

  const grid = document.querySelector(".grid");
  if (!grid) return;

  whenGridImagesReady(grid, () => scheduleInitScrollEffects());
}

boot();
