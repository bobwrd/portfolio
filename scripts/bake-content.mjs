// Bakes filesystem content into a single JSON module that the Worker
// imports at build time. Workers have no filesystem at runtime, so content
// is bundled instead of read on request.
//
// Output: worker/generated/content.json
//   {
//     articles: { "<slug>": "<raw markdown>", ... },
//     profile:  "<raw markdown>",
//     verdictCases, ledgerActions, ledgerCsv, ledgerCodebook, observatory, distlab
//   }
//
// Run before `vite build` (see package.json "build" script).

import { readdir, readFile, mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ARTICLES_DIR = join(ROOT, "content", "articles");
const PROFILE_PATH = join(ROOT, "content", "profile.md");
const VERDICT_CASES_PATH = join(ROOT, "content", "verdict", "verdict_cases.json");
const LEDGER_ACTIONS_PATH = join(ROOT, "content", "ledger", "ledger_actions.json");
const LEDGER_CSV_PATH = join(ROOT, "content", "ledger", "enforcement_actions.csv");
const LEDGER_CODEBOOK_PATH = join(ROOT, "content", "ledger", "codebook.md");
const OBSERVATORY_PATH = join(ROOT, "content", "observatory", "observatory.json");
const DISTLAB_PATH = join(ROOT, "content", "distlab", "distlab.json");
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
  const out = {
    articles: {},
    profile: "",
    verdictCases: [],
    ledgerActions: [],
    ledgerCsv: "",
    ledgerCodebook: "",
    observatory: null,
    distlab: null,
  };

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

  if (await exists(VERDICT_CASES_PATH)) {
    try {
      out.verdictCases = JSON.parse(await readFile(VERDICT_CASES_PATH, "utf8"));
    } catch (e) {
      console.warn("[bake] verdict_cases.json is not valid JSON, skipping:", e.message);
    }
  }

  if (await exists(LEDGER_ACTIONS_PATH)) {
    try {
      out.ledgerActions = JSON.parse(await readFile(LEDGER_ACTIONS_PATH, "utf8"));
    } catch (e) {
      console.warn("[bake] ledger_actions.json is not valid JSON, skipping:", e.message);
    }
  }
  if (await exists(LEDGER_CSV_PATH)) out.ledgerCsv = await readFile(LEDGER_CSV_PATH, "utf8");
  if (await exists(LEDGER_CODEBOOK_PATH)) out.ledgerCodebook = await readFile(LEDGER_CODEBOOK_PATH, "utf8");

  if (await exists(OBSERVATORY_PATH)) {
    try {
      out.observatory = JSON.parse(await readFile(OBSERVATORY_PATH, "utf8"));
    } catch (e) {
      console.warn("[bake] observatory.json is not valid JSON, skipping:", e.message);
    }
  }

  if (await exists(DISTLAB_PATH)) {
    try {
      out.distlab = JSON.parse(await readFile(DISTLAB_PATH, "utf8"));
    } catch (e) {
      console.warn("[bake] distlab.json is not valid JSON, skipping:", e.message);
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out));

  const count = Object.keys(out.articles).length;
  console.log(
    `[bake] wrote ${OUT_PATH} — ${count} articles, profile ${out.profile ? "yes" : "no"}, ` +
      `${out.verdictCases.length} verdict cases, ${out.ledgerActions.length} ledger actions, ` +
      `observatory ${out.observatory ? "yes" : "no"}, distlab ${out.distlab ? "yes" : "no"}`,
  );
}

bake().catch((e) => {
  console.error("[bake] failed:", e);
  process.exit(1);
});
