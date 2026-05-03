/**
 * Reads public/favicon.svg and writes PNG sizes + favicon.ico.
 * Run: npm run generate-favicons (requires devDependencies sharp, to-ico).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svg = readFileSync(join(publicDir, "favicon.svg"));

const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();

writeFileSync(join(publicDir, "favicon-16x16.png"), png16);
writeFileSync(join(publicDir, "favicon-32x32.png"), png32);

await sharp(svg).resize(180, 180).png().toFile(join(publicDir, "apple-touch-icon.png"));
await sharp(svg).resize(192, 192).png().toFile(join(publicDir, "android-chrome-192x192.png"));
await sharp(svg).resize(512, 512).png().toFile(join(publicDir, "android-chrome-512x512.png"));

const ico = await toIco([png32, png16]);
writeFileSync(join(publicDir, "favicon.ico"), ico);

console.log("Favicons generated in public/");
