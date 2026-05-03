const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const publicDir = path.join(__dirname, "public");
const imagesDir = path.join(publicDir, "images");
const port = Number(process.env.PORT) || 3000;

/** First slide when this file exists; then every .jpg / .jpeg / .webp in public/images (sorted). */
const FIRST_SLIDE = "rioysol-l1-06XX.jpg";

app.get("/api/slide-images.json", (req, res) => {
  try {
    const names = fs
      .readdirSync(imagesDir, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => /\.(jpe?g|webp)$/i.test(n));

    names.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const ordered = [];
    if (names.includes(FIRST_SLIDE)) {
      ordered.push(FIRST_SLIDE);
      for (const n of names) {
        if (n !== FIRST_SLIDE) ordered.push(n);
      }
    } else {
      ordered.push(...names);
    }

    res.setHeader("Cache-Control", "no-store");
    res.json(ordered.map((n) => "/images/" + n));
  } catch (err) {
    console.error("slide-images:", err);
    res.status(500).json([]);
  }
});

app.use(
  express.static(publicDir, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (
        filePath.endsWith("index.html") ||
        filePath.endsWith("about.html") ||
        filePath.endsWith("site.webmanifest")
      ) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Rio y Sol listening on http://0.0.0.0:${port}`);
});
