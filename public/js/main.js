import { animate, scroll, cubicBezier } from "https://cdn.jsdelivr.net/npm/motion@11.11.16/+esm";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initScrollEffects() {
  const image = document.querySelector(".scaler img");
  const firstSection = document.querySelector("main section:first-of-type");
  const layers = document.querySelectorAll(".grid > .layer");

  if (!image || !firstSection) return;

  const naturalWidth = image.offsetWidth;
  const naturalHeight = image.offsetHeight;
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
    {
      target: firstSection,
      offset: ["start start", "80% end end"],
    }
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
      {
        target: firstSection,
        offset: ["start start", endOffset],
      }
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
      {
        target: firstSection,
        offset: ["start start", endOffset],
      }
    );
  });
}

function boot() {
  if (prefersReducedMotion) return;
  const scalerImg = document.querySelector(".scaler img");
  if (scalerImg && !scalerImg.complete) {
    scalerImg.addEventListener("load", initScrollEffects, { once: true });
    return;
  }
  initScrollEffects();
}

boot();
