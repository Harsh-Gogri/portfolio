import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "images", "harsh-gogri-profile.png");
const destDir = path.join(root, "public", "assets", "image");
const dest = path.join(destDir, "harsh-gogri-profile.png");

for (const dir of ["image", "work", "icons"]) {
  fs.mkdirSync(path.join(root, "public", "assets", dir), { recursive: true });
}
fs.copyFileSync(src, dest);
fs.writeFileSync(path.join(root, "public", "assets", "work", ".gitkeep"), "");
fs.writeFileSync(path.join(root, "public", "assets", "icons", ".gitkeep"), "");
fs.unlinkSync(src);
