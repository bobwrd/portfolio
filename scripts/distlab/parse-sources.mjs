// Parses the curated raw source files in content/distlab/raw/sources/ into a
// compact, app-ready content/distlab/raw/sources.json that build-distlab.mjs
// overlays on the curated seed anchors (real values win per year).
//
// Sources actually used (1990-2020 window):
//   HDRFull.csv        -> gni_per_capita (gnipc), wellbeing_index (hdi),
//                         education_years (mys); all 15 countries, full annual.
//   OECD_SOCX.csv      -> social_exp_pct_gdp; OECD members, 2010-2020.
//   OECD_ICTWSS.csv    -> union_density (UD), bargaining_coverage (AdjCov);
//                         OECD members, long annual series.
//   OECD_minwage.csv   -> minwage_to_median (MIN2AVE / 100); OECD, 2015-2020.
//   GDIM_2023_03.csv   -> mobility (MU050 upward mobility, COR persistence);
//                         birth cohorts 1960/1970/1980.
//
// NOT used here, with reasons:
//   WID export is the AVERAGE top-10% income (aptinc, level), not the top-10%
//     SHARE the app needs, and the export has no national-income total to derive
//     a share. top10_share therefore stays on its curated anchor.
//   OECD_tax.csv is a single 2025 snapshot (top statutory PIT rate), outside the
//     1990-2020 window, so top_marginal_income_rate stays on its curated anchor.
//
// Run: node scripts/distlab/parse-sources.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "..", "content", "distlab", "raw", "sources");
const OUT = join(__dirname, "..", "..", "content", "distlab", "raw", "sources.json");

const POOL = ["USA","SWE","IND","BRA","NGA","DNK","NOR","FRA","DEU","GBR","KOR","JPN","MEX","ZAF","POL"];
const Y0 = 1990, Y1 = 2020;
const inWindow = (y) => Number.isFinite(y) && y >= Y0 && y <= Y1;

// Minimal RFC-4180-ish CSV line splitter (handles quoted fields with commas).
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
const num = (s) => { const v = parseFloat(s); return Number.isFinite(v) ? v : null; };

// sources[country][field] = { year: { value, src } }
const sources = {};
const put = (c, field, year, value, src) => {
  if (!POOL.includes(c) || value == null || !inWindow(year)) return;
  (sources[c] ??= {});
  (sources[c][field] ??= {});
  sources[c][field][year] = { value: Math.round(value * 1000) / 1000, src };
};

// ---- HDR: wide format, one row per country, latin-1 ------------------------
{
  const rows = parseCSV(readFileSync(join(SRC, "HDRFull.csv"), "latin1"));
  const h = rows[0];
  const col = Object.fromEntries(h.map((c, i) => [c, i]));
  const map = { gni_per_capita: "gnipc", wellbeing_index: "hdi", education_years: "mys" };
  for (const r of rows.slice(1)) {
    const iso = r[col.iso3];
    if (!POOL.includes(iso)) continue;
    for (const [field, prefix] of Object.entries(map)) {
      for (let y = Y0; y <= Y1; y++) {
        const idx = col[`${prefix}_${y}`];
        if (idx == null) continue;
        put(iso, field, y, num(r[idx]), "UNDP_HDR");
      }
    }
  }
}

// ---- OECD SOCX: social expenditure % of GDP, public, total -----------------
{
  const rows = parseCSV(readFileSync(join(SRC, "OECD_SOCX.csv"), "utf8"));
  const h = rows[0];
  const REF = h.indexOf("REF_AREA"), TP = h.indexOf("TIME_PERIOD"), OV = h.indexOf("OBS_VALUE");
  for (const r of rows.slice(1)) {
    put(r[REF], "social_exp_pct_gdp", parseInt(r[TP], 10), num(r[OV]), "OECD SOCX");
  }
}

// ---- OECD ICTWSS: union density + adjusted bargaining coverage -------------
{
  const rows = parseCSV(readFileSync(join(SRC, "OECD_ICTWSS.csv"), "utf8"));
  const h = rows[0];
  const ISO = h.indexOf("iso3"), YR = h.indexOf("year"), UD = h.indexOf("UD"), AC = h.indexOf("AdjCov");
  const clean = (s) => (s === "" || s === "-99" ? null : num(s));
  for (const r of rows.slice(1)) {
    const y = parseInt(r[YR], 10);
    put(r[ISO], "union_density", y, clean(r[UD]), "OECD/AIAS ICTWSS");
    put(r[ISO], "bargaining_coverage", y, clean(r[AC]), "OECD/AIAS ICTWSS");
  }
}

// ---- OECD minwage: minimum relative to average wage (-> ratio 0-1) ---------
{
  const rows = parseCSV(readFileSync(join(SRC, "OECD_minwage.csv"), "utf8"));
  const h = rows[0];
  const REF = h.indexOf("REF_AREA"), TP = h.indexOf("TIME_PERIOD"), OV = h.indexOf("OBS_VALUE");
  for (const r of rows.slice(1)) {
    const v = num(r[OV]);
    put(r[REF], "minwage_to_median", parseInt(r[TP], 10), v == null ? null : v / 100, "OECD MIN2AVE");
  }
}

// ---- GDIM: education mobility per birth cohort -----------------------------
// MU050 (0-100) = share of children of below-median-educated parents who exceed
// the median -> absolute upward mobility (aum, 0-1). COR (0-1) = intergenerational
// education correlation -> persistence.
const mobility = {};
{
  const rows = parseCSV(readFileSync(join(SRC, "GDIM_2023_03.csv"), "utf8"));
  const h = rows[0];
  const c = Object.fromEntries(h.map((x, i) => [x, i]));
  const cohorts = { "1960": "1960s", "1970": "1970s", "1980": "1980s" };
  for (const r of rows.slice(1)) {
    const iso = r[c.code];
    if (!POOL.includes(iso)) continue;
    if (r[c.parent] !== "avg" || r[c.child] !== "all") continue;
    const label = cohorts[r[c.cohort]];
    if (!label) continue;
    const aum = num(r[c.MU050_randomtiebreak]);
    const cor = num(r[c.COR]);
    if (aum == null && cor == null) continue;
    (mobility[iso] ??= {});
    mobility[iso][label] = {
      aum: aum == null ? null : Math.round((aum / 100) * 1000) / 1000,
      persistence: cor == null ? null : Math.round(cor * 1000) / 1000,
      src: "GDIM",
    };
  }
}

const out = { generated: new Date().toISOString().slice(0, 10), sources, mobility };
writeFileSync(OUT, JSON.stringify(out, null, 0));

// ---- console summary -------------------------------------------------------
const summary = {};
for (const c of POOL) summary[c] = Object.keys(sources[c] || {}).length;
console.log("Wrote", OUT);
console.log("fields per country:", summary);
console.log("mobility countries:", Object.keys(mobility).length, Object.keys(mobility).join(","));
