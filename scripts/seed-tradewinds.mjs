// Seeds the 7 launch Tradewinds puzzles by POSTing each one to the running
// local worker's password-gated admin endpoint — the exact same code path a
// human author uses from /tradewinds/admin, just scripted.
//
// Requires `npm run dev:worker` (wrangler dev) running in another terminal,
// and TRADEWINDS_PASSWORD set — either exported in the shell or present in
// the repo-root .dev.vars (gitignored; copy from .dev.vars.example).
//
// Usage: node scripts/seed-tradewinds.mjs [--base http://localhost:8787]

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SEED_PATH = join(ROOT, "content", "tradewinds", "seed-puzzles.json");

function parseArgs(argv) {
  const args = { base: "http://localhost:8787" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base") args.base = argv[++i];
  }
  return args;
}

async function readDevVarsPassword() {
  try {
    const raw = await readFile(join(ROOT, ".dev.vars"), "utf-8");
    const match = raw.match(/^TRADEWINDS_PASSWORD=(.*)$/m);
    return match ? match[1].trim() : undefined;
  } catch {
    return undefined;
  }
}

async function main() {
  const { base } = parseArgs(process.argv.slice(2));
  const password = process.env.TRADEWINDS_PASSWORD || (await readDevVarsPassword());

  if (!password) {
    console.error(
      "TRADEWINDS_PASSWORD is not set. Export it, or add it to .dev.vars (see .dev.vars.example).",
    );
    process.exit(1);
  }

  const puzzles = JSON.parse(await readFile(SEED_PATH, "utf-8"));

  for (const puzzle of puzzles) {
    const res = await fetch(`${base}/api/tradewinds/admin/puzzle`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-tradewinds-password": password },
      body: JSON.stringify(puzzle),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Failed to seed ${puzzle.runDate} (${puzzle.shipName}): ${res.status} ${body}`);
      process.exitCode = 1;
      continue;
    }
    console.log(`Seeded ${puzzle.runDate} — ${puzzle.shipName}`);
  }
}

main();
