// Harvester to SCALE The Ledger from the curated v1 to the full MAS set.
//
// Why this exists: the MAS enforcement page is client-rendered, so it can't be
// scraped with a plain fetch. OpenSanctions already parses that page daily and
// publishes a static FollowTheMoney (FtM) export. This script pulls that export
// and turns each enforcement "Article" (one MAS notice) into a stub Ledger row,
// linking the People/Companies named in it as respondents.
//
// IMPORTANT: this produces STUBS, not finished rows. It fills what the source
// exposes reliably (date, title, source URL, respondent names/types). It does
// NOT invent penalty amounts, violation categories, or statutes — those still
// require reading each MAS notice and hand-coding (that hand-coding is the whole
// value of the dataset). New stubs are written to a separate file so they never
// overwrite verified rows; you review, code, and merge them by hand.
//
// Licensing note: OpenSanctions data is CC BY-NC 4.0. The underlying facts are
// public MAS records; attribute MAS as the primary source and OpenSanctions as
// the harvest aid. This is fine for a non-commercial research project.
//
// Run locally (needs network):
//   node scripts/harvest_ledger.mjs
//
// Output: content/ledger/_harvested_stubs.json  (review, code, then merge)

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const EXISTING_PATH = join(ROOT, "content", "ledger", "ledger_actions.json");
const OUT_PATH = join(ROOT, "content", "ledger", "_harvested_stubs.json");

const FTM_URL =
  "https://data.opensanctions.org/datasets/latest/sg_mas_enforcement_actions/entities.ftm.json";

function firstProp(props, key) {
  const v = props?.[key];
  return Array.isArray(v) ? v[0] : v;
}

async function main() {
  console.log(`[harvest] fetching ${FTM_URL} ...`);
  const res = await fetch(FTM_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();

  // FtM export is newline-delimited JSON (one entity per line).
  const entities = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  const byId = new Map(entities.map((e) => [e.id, e]));
  const articles = entities.filter((e) => e.schema === "Article");

  // Map existing source URLs so we only emit genuinely new notices.
  const existing = JSON.parse(await readFile(EXISTING_PATH, "utf8"));
  const knownUrls = new Set(existing.map((a) => a.source_url));
  let nextId = Math.max(...existing.map((a) => a.action_id)) + 1;

  const stubs = [];
  for (const art of articles) {
    const url = firstProp(art.properties, "sourceUrl") || firstProp(art.properties, "alephUrl");
    const title = firstProp(art.properties, "title") || "";
    const date =
      firstProp(art.properties, "publishedAt") || firstProp(art.properties, "date") || "";
    if (!url || knownUrls.has(url)) continue;

    // Respondents = entities this article 'documents' / mentions.
    const mentionIds = [
      ...(art.properties?.documents || []),
      ...(art.properties?.mentions || []),
    ];
    const respondents = mentionIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((e) => ({
        name: firstProp(e.properties, "name") || e.caption || "",
        is_individual: e.schema === "Person",
        fi_type: null,
      }));

    stubs.push({
      action_id: nextId++,
      date_published: date.slice(0, 10),
      respondents,
      respondent_type: respondents.every((r) => r.is_individual)
        ? "individual"
        : respondents.some((r) => r.is_individual)
          ? "both"
          : "FI",
      fi_subtype: null,
      action_type: "TODO",
      violation_category: "TODO",
      penalty_amount_sgd: null,
      prohibition_years: null,
      statutes: [],
      conduct_start: null,
      conduct_end: null,
      enforcement_lag_days: null,
      repeat_offender: false,
      joint_action_with: [],
      group: null,
      source_url: url,
      summary: title,
      coding_confidence: 0,
    });
  }

  stubs.sort((a, b) => (b.date_published || "").localeCompare(a.date_published || ""));
  await writeFile(OUT_PATH, JSON.stringify(stubs, null, 2) + "\n");
  console.log(`[harvest] ${articles.length} notices in source, ${stubs.length} new stubs`);
  console.log(`[harvest] wrote ${OUT_PATH} — code the TODO fields, then merge into ledger_actions.json`);
}

main().catch((e) => {
  console.error("[harvest] failed:", e);
  process.exit(1);
});
