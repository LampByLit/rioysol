const path = require("path");
const express = require("express");

const app = express();
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT) || 3000;

app.use(
  express.static(publicDir, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Rio y Sol listening on http://0.0.0.0:${port}`);
});
