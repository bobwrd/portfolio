// Computes derived fields for The Ledger dataset and emits a flat CSV.
//
//   - enforcement_lag_days: days from end of conduct (conduct_end) to the
//     published action date. Null when conduct_end is unknown.
//   - Validates: unique action_ids, ISO dates, non-negative penalties.
//   - Emits content/ledger/enforcement_actions.csv (one row per respondent,
//     so multi-party actions expand) for researchers who want tabular data.
//
// Run after editing ledger_actions.json:
//   node scripts/compute_ledger.mjs

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const JSON_PATH = join(ROOT, "content", "ledger", "ledger_actions.json");
const CSV_PATH = join(ROOT, "content", "ledger", "enforcement_actions.csv");

const dayMs = 24 * 60 * 60 * 1000;

function daysBetween(a, b) {
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (Number.isNaN(da) || Number.isNaN(db)) return null;
  return Math.round((db - da) / dayMs);
}

function csvCell(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const raw = await readFile(JSON_PATH, "utf8");
  const actions = JSON.parse(raw);

  const seen = new Set();
  let penaltyTotal = 0;
  const byYear = {};

  for (const a of actions) {
    if (seen.has(a.action_id)) throw new Error(`Duplicate action_id ${a.action_id}`);
    seen.add(a.action_id);

    // Derive enforcement lag
    a.enforcement_lag_days = a.conduct_end
      ? daysBetween(a.conduct_end, a.date_published)
      : null;

    if (typeof a.penalty_amount_sgd === "number") {
      if (a.penalty_amount_sgd < 0) throw new Error(`Negative penalty on ${a.action_id}`);
      penaltyTotal += a.penalty_amount_sgd;
    }
    const yr = (a.date_published || "").slice(0, 4);
    byYear[yr] = (byYear[yr] || 0) + 1;
  }

  // Write the computed JSON back (lag filled in)
  await writeFile(JSON_PATH, JSON.stringify(actions, null, 2) + "\n");

  // Flat CSV — one row per respondent
  const cols = [
    "action_id", "date_published", "respondent_name", "is_individual",
    "respondent_type", "fi_subtype", "action_type", "violation_category",
    "penalty_amount_sgd", "prohibition_years", "statutes", "conduct_start",
    "conduct_end", "enforcement_lag_days", "repeat_offender", "joint_action_with",
    "group", "source_url", "coding_confidence",
  ];
  const lines = [cols.join(",")];
  for (const a of actions) {
    for (const r of a.respondents) {
      lines.push([
        a.action_id, a.date_published, r.name, r.is_individual,
        a.respondent_type, a.fi_subtype ?? "", a.action_type, a.violation_category,
        a.penalty_amount_sgd ?? "", a.prohibition_years ?? "",
        (a.statutes || []).join("; "), a.conduct_start ?? "", a.conduct_end ?? "",
        a.enforcement_lag_days ?? "", a.repeat_offender,
        (a.joint_action_with || []).join("; "), a.group ?? "", a.source_url,
        a.coding_confidence,
      ].map(csvCell).join(","));
    }
  }
  await writeFile(CSV_PATH, lines.join("\n") + "\n");

  console.log(`[ledger] ${actions.length} actions`);
  console.log(`[ledger] total monetary penalties: S$${penaltyTotal.toLocaleString()}`);
  console.log(`[ledger] by year:`, byYear);
  console.log(`[ledger] wrote ${CSV_PATH}`);
}

main().catch((e) => {
  console.error("[ledger] failed:", e);
  process.exit(1);
});
