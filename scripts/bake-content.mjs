// Bakes filesystem content into a single JSON module that the Worker
// imports at build time. Workers have no filesystem at runtime, so content
// is bundled instead of read on request.
//
// Output: worker/generated/content.json
//   { articles: { "<slug>": "<raw markdown>", ... }, profile: "<raw markdown>" }
//
// Run before `vite build` (see package.json "build" script).

import { readdir, readFile, mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTICLES_DIR = join(ROOT, "content", "articles");
const PROFILE_PATH = join(ROOT, "content", "profile.md");
const OUT_DIR = join(ROOT, "worker", "generated");
const OUT_PATH = join(OUT_DIR, "content.json");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function bake() {
  const out = { articles: {}, profile: "" };

  if (await exists(ARTICLES_DIR)) {
    const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const raw = await readFile(join(ARTICLES_DIR, file), "utf8");
      out.articles[file.replace(/\.md$/, "")] = raw;
    }
  }

  if (await exists(PROFILE_PATH)) {
    out.profile = await readFile(PROFILE_PATH, "utf8");
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out));

  const count = Object.keys(out.articles).length;
  console.log(`[bake] wrote ${OUT_PATH} — ${count} articles, profile ${out.profile ? "yes" : "no"}`);
}

bake().catch((e) => {
  console.error("[bake] failed:", e);
  process.exit(1);
});
