import { execFileSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const media = JSON.parse(await readFile(path.join(root, "src/data/landing-media.json"), "utf8"));
const output = path.join(root, "public/assets/unispot/landing");
const cache = "/tmp/opencode";
await mkdir(output, { recursive: true });
await mkdir(cache, { recursive: true });

const local = src => path.join(root, "public", src);
const sourceFile = story => path.join(cache, `landing-${story.label.toLowerCase()}-source.mp4`);
const encoders = execFileSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" });
const h264 = encoders.includes("libx264")
  ? ["-c:v", "libx264", "-preset", "slow", "-crf", "26"]
  : ["-c:v", "libopenh264", "-b:v", "2500k", "-maxrate", "3500k", "-bufsize", "5000k"];
const ffmpeg = args => {
  const destination = args.at(-1);
  const temporary = `${destination}.working${path.extname(destination)}`;
  try {
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args.slice(0, -1), temporary], { stdio: "inherit" });
    renameSync(temporary, destination);
  } finally {
    rmSync(temporary, { force: true });
  }
};

// Existing output is deliberately kept, including images supplied by the designer.
// To rebuild a particular asset, remove only that output file before running this script.
for (const story of media.stories) {
  const source = sourceFile(story);
  if (!existsSync(local(story.src)) && !existsSync(source)) {
    execFileSync("curl", ["-fL", "--retry", "2", "--max-time", "120", story.download, "-o", source], { stdio: "inherit" });
  }
  if (!existsSync(local(story.src))) {
    ffmpeg([
      "-ss", String(story.start), "-i", source, "-t", String(story.duration),
      "-vf", "scale='if(gte(iw,ih),1920,1080)':'if(gte(iw,ih),1080,1920)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1,fps=24",
      "-an", "-map_metadata", "-1", ...h264,
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", local(story.src),
    ]);
  }
  if (!existsSync(local(story.poster))) {
    ffmpeg(["-i", local(story.src), "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", local(story.poster)]);
  }
  console.log(`${story.label}: ${((await stat(local(story.src))).size / 1024).toFixed(0)} KiB`);
}

for (const [key, image] of Object.entries(media.images)) {
  if (existsSync(local(image.src))) continue;
  if (key === "mission") {
    const original = path.join(cache, "landing-mission-campus-student-source.jpg");
    if (!existsSync(original)) {
      execFileSync("curl", ["-fL", "--retry", "2", "--max-time", "120", image.download, "-o", original], { stdio: "inherit" });
    }
    ffmpeg(["-i", original, "-frames:v", "1", "-vf", "scale=1600:1600:force_original_aspect_ratio=decrease:force_divisible_by=2", "-c:v", "libwebp", "-quality", "85", local(image.src)]);
  } else if (image.download) {
    const source = path.join(cache, `${path.basename(image.src, ".webp")}.jpg`);
    if (!existsSync(source)) {
      execFileSync("curl", ["-fL", "--retry", "2", "--max-time", "120", image.download, "-o", source], { stdio: "inherit" });
    }
    ffmpeg(["-i", source, "-frames:v", "1", "-vf", "scale=1600:1600:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1", "-c:v", "libwebp", "-quality", "85", local(image.src)]);
  } else {
    ffmpeg([
      "-i", local(image.interimSource), "-frames:v", "1", "-vf", "scale=1200:900:force_original_aspect_ratio=decrease",
      "-c:v", "libwebp", "-quality", "85", local(image.src),
    ]);
  }
  console.log(`Prepared interim image: ${key}`);
}
