/**
 * One-off image optimizer for the Kaelithor website.
 * Converts heavy JPG/PNG sources into right-sized WebP files inside /public.
 * Originals are kept in /assets-source (outside /public, so they are never deployed).
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const jobs = [
  { dir: "public/projects", maxWidth: 1800, quality: 80 },
  { dir: "public/team", maxWidth: 640, quality: 82 },
  { dir: "public/brand", maxWidth: 256, quality: 85 },
];

for (const job of jobs) {
  const absDir = path.join(root, job.dir);
  const backupDir = path.join(root, "assets-source", path.basename(job.dir));
  await mkdir(backupDir, { recursive: true });

  for (const file of await readdir(absDir)) {
    if (!/\.(jpe?g|png|jfif)$/i.test(file)) continue;
    const src = path.join(absDir, file);
    const out = path.join(absDir, file.replace(/\.(jpe?g|png|jfif)$/i, ".webp"));

    const info = await sharp(src)
      .rotate()
      .resize({ width: job.maxWidth, withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 5 })
      .toFile(out);

    const before = (await stat(src)).size;
    await rename(src, path.join(backupDir, file));
    console.log(
      `${job.dir}/${path.basename(out)}  ${info.width}x${info.height}  ` +
        `${Math.round(before / 1024)}KB -> ${Math.round(info.size / 1024)}KB`
    );
  }
}
