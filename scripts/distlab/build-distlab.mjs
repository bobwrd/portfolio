// Builds content/distlab/distlab.json (the app-ready dataset) from:
//   - content/distlab/raw/wdi.json   (Group A, real World Bank pull; optional)
//   - content/distlab/seed.json      (country config + Group B/C curated inputs)
//
// Group A (WDI) is preferred when raw/wdi.json exists and has values; otherwise
// the build falls back to the benchmark anchors in seed.json. Group B (top
// shares, schooling, HDI, union density, bargaining coverage, social
// expenditure, minimum-wage ratio, top marginal tax rate) and Group C (mobility)
// always come from the seed, since those are not in WDI or are too sparse.
//
// All series are interpolated to annual 1990-2020. Regime indices are built by
// min-max normalising the raw metric across the whole calibration pool, then
// bucketing into 5 display levels. Every field carries a source family and an
// interpolation flag. Construction notes are recorded for the methods page.
//
// Run: node scripts/distlab/build-distlab.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "..", "content", "distlab");
const WDI_PATH = join(DIR, "raw", "wdi.json");
const SEED_PATH = join(DIR, "seed.json");
const OUT = join(DIR, "distlab.json");

const Y0 = 1990, Y1 = 2020;
const YEARS = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);

const REGIME_KEYS = [
  "tax_progressivity", "welfare_generosity", "minimum_wage_strength",
  "labour_power", "education_spending", "trade_openness",
  "informality", "structural",
];

// ---- helpers --------------------------------------------------------------
function lerpSeries(anchors) {
  // anchors: { year: value }. Linear interpolation between known years; no
  // extrapolation beyond the observed span. Returns { year: {value, interp} }.
  const ys = Object.keys(anchors).map(Number).filter((y) => anchors[y] != null).sort((a, b) => a - b);
  const out = {};
  if (!ys.length) return out;
  for (const y of YEARS) {
    if (y < ys[0] || y > ys[ys.length - 1]) continue; // never extrapolate
    if (anchors[y] != null) { out[y] = { value: anchors[y], interp: false }; continue; }
    let lo = ys[0], hi = ys[ys.length - 1];
    for (const k of ys) { if (k <= y) lo = k; if (k >= y) { hi = k; break; } }
    const t = hi === lo ? 0 : (y - lo) / (hi - lo);
    out[y] = { value: anchors[lo] + t * (anchors[hi] - anchors[lo]), interp: true };
  }
  return out;
}

function round(v, n = 3) { const f = 10 ** n; return v == null ? null : Math.round(v * f) / f; }

// ---- load -----------------------------------------------------------------
const SOURCES_PATH = join(DIR, "raw", "sources.json");
const seed = JSON.parse(readFileSync(SEED_PATH, "utf8"));
const wdi = existsSync(WDI_PATH) ? JSON.parse(readFileSync(WDI_PATH, "utf8")) : {};
const parsed = existsSync(SOURCES_PATH) ? JSON.parse(readFileSync(SOURCES_PATH, "utf8")) : { sources: {}, mobility: {} };
const sources = parsed.sources || {};
const hasWdi = (c, field) => wdi[c]?.[field] && Object.keys(wdi[c][field]).length > 0;

const POOL = seed.pool_countries;
const VISIBLE = seed.visible_countries;
const NAMES = seed.country_names;

// Per (country, field): annual {year:{value,interp,src}}.
// Observed-year priority: real parsed sources (sources.json) > live WDI pull
// (wdi.json) > curated seed anchors. Gaps between observed years are linearly
// interpolated and flagged; nothing is extrapolated beyond a country's span.
// Each observed year keeps the source it actually came from, so provenance is
// correct cell by cell (e.g. real OECD 2010-2020 with curated pre-2010 anchors).
function annual(country, field, srcWdi, srcSeed) {
  const observed = {}; // year -> { value, src }
  for (const [y, v] of Object.entries(seed.anchors[country]?.[field] || {})) {
    if (v != null) observed[Number(y)] = { value: v, src: srcSeed };
  }
  if (hasWdi(country, field)) {
    for (const [y, v] of Object.entries(wdi[country][field])) {
      if (v != null) observed[Number(y)] = { value: v, src: srcWdi };
    }
  }
  for (const [y, o] of Object.entries(sources[country]?.[field] || {})) {
    if (o?.value != null) observed[Number(y)] = { value: o.value, src: o.src };
  }
  const ys = Object.keys(observed).map(Number).sort((a, b) => a - b);
  const out = {};
  if (!ys.length) return out;
  for (const y of YEARS) {
    if (y < ys[0] || y > ys[ys.length - 1]) continue; // never extrapolate
    if (observed[y]) { out[y] = { value: observed[y].value, interp: false, src: observed[y].src }; continue; }
    let lo = ys[0], hi = ys[ys.length - 1];
    for (const k of ys) { if (k <= y) lo = k; if (k >= y) { hi = k; break; } }
    const t = hi === lo ? 0 : (y - lo) / (hi - lo);
    out[y] = { value: observed[lo].value + t * (observed[hi].value - observed[lo].value), interp: true, src: "interpolated" };
  }
  return out;
}

// Build annual tables for every field we need.
const FIELD_SRC = {
  gdp_per_capita_ppp: ["WDI", "curated"], gni_per_capita: ["WDI", "curated"],
  gini: ["WDI", "curated"], poverty_headcount: ["WDI", "curated"],
  education_spend_pct_gdp: ["WDI", "curated"], secondary_enrolment: ["WDI", "curated"],
  trade_pct_gdp: ["WDI", "curated"], va_services: ["WDI", "curated"],
  self_employment: ["WDI", "curated"], tax_revenue_pct_gdp: ["WDI", "curated"],
  gdp_per_worker: ["WDI", "curated"],
  // Group B. Real per-year values come from sources.json (HDR/OECD/ICTWSS) and
  // carry their own source label; the second tag below is only used for any
  // curated anchor year not covered by a real source.
  // top10_share and top_marginal_income_rate have NO usable real series in the
  // provided files (WID export is average top-10% income not a share; the OECD
  // tax file is a 2025-only snapshot), so they remain curated estimates.
  top10_share: ["WID", "curated"], education_years: ["UNDP_HDR", "curated"], wellbeing_index: ["UNDP_HDR", "curated"],
  union_density: ["OECD/AIAS ICTWSS", "curated"], bargaining_coverage: ["OECD/AIAS ICTWSS", "curated"],
  social_exp_pct_gdp: ["OECD SOCX", "curated"], minwage_to_median: ["OECD MIN2AVE", "curated"],
  top_marginal_income_rate: ["OECD", "curated"],
};

const tables = {}; // tables[country][field][year] = {value, interp, src}
for (const c of POOL) {
  tables[c] = {};
  for (const [field, [sw, ss]] of Object.entries(FIELD_SRC)) tables[c][field] = annual(c, field, sw, ss);
}

const at = (c, f, y) => tables[c]?.[f]?.[y]?.value ?? null;
const meta = (c, f, y) => { const o = tables[c]?.[f]?.[y]; return o ? { src: o.src, interp: o.interp } : { src: "curated", interp: true }; };

// ---- pool normalisation for regime indices --------------------------------
// Collect all values of a raw metric across the pool, return a winsorised
// min-max normaliser to 0-1.
function normaliser(getter) {
  const vals = [];
  for (const c of POOL) for (const y of YEARS) { const v = getter(c, y); if (v != null && Number.isFinite(v)) vals.push(v); }
  vals.sort((a, b) => a - b);
  if (!vals.length) return () => null;
  const lo = vals[Math.floor(vals.length * 0.02)];
  const hi = vals[Math.floor(vals.length * 0.98)] || vals[vals.length - 1];
  const span = hi - lo || 1;
  return (v) => (v == null ? null : Math.max(0, Math.min(1, (v - lo) / span)));
}

// Raw metric per regime index (some are blends).
const rawGetters = {
  tax_progressivity: (c, y) => {
    const r = at(c, "top_marginal_income_rate", y), t = at(c, "tax_revenue_pct_gdp", y);
    if (r == null && t == null) return null;
    return 0.7 * (r ?? 0) + 0.3 * (t ?? 0) * (r == null ? 1 : 1); // weighted; tax_rev on similar 0-60 scale
  },
  welfare_generosity: (c, y) => at(c, "social_exp_pct_gdp", y),
  minimum_wage_strength: (c, y) => at(c, "minwage_to_median", y),
  labour_power: (c, y) => {
    const u = at(c, "union_density", y), b = at(c, "bargaining_coverage", y);
    if (u == null && b == null) return null;
    return 0.6 * (u ?? b) + 0.4 * (b ?? u);
  },
  education_spending: (c, y) => at(c, "education_spend_pct_gdp", y),
  trade_openness: (c, y) => at(c, "trade_pct_gdp", y),
  informality: (c, y) => at(c, "self_employment", y),
  structural: (c, y) => at(c, "va_services", y),
};
const norms = Object.fromEntries(REGIME_KEYS.map((k) => [k, normaliser(rawGetters[k])]));
const level = (v) => (v == null ? null : Math.max(1, Math.min(5, Math.floor(v * 5) + 1)));

// competitiveness 0-100 from gdp_per_worker, normalised across pool
const prodNorm = normaliser((c, y) => at(c, "gdp_per_worker", y));

// ---- assemble base + regime ----------------------------------------------
const base = [], regime = [];
for (const c of POOL) {
  for (const y of YEARS) {
    const compRaw = at(c, "gdp_per_worker", y);
    const comp = compRaw == null ? null : round(prodNorm(compRaw) * 100, 1);
    const b = {
      country: c, year: y,
      gdp_per_capita_ppp: round(at(c, "gdp_per_capita_ppp", y), 0),
      gni_per_capita: round(at(c, "gni_per_capita", y), 0),
      gini: round(at(c, "gini", y), 1),
      top10_share: round(at(c, "top10_share", y), 3),
      poverty_headcount: round(at(c, "poverty_headcount", y), 1),
      education_years: round(at(c, "education_years", y), 1),
      secondary_enrolment: round(at(c, "secondary_enrolment", y), 0),
      education_spend_pct_gdp: round(at(c, "education_spend_pct_gdp", y), 1),
      competitiveness_index: comp,
      wellbeing_index: round(at(c, "wellbeing_index", y), 3),
      meta: {},
    };
    for (const f of ["gdp_per_capita_ppp", "gni_per_capita", "gini", "top10_share", "poverty_headcount", "education_years", "secondary_enrolment", "education_spend_pct_gdp", "wellbeing_index"]) {
      b.meta[f] = meta(c, f, y);
    }
    b.meta.competitiveness_index = { src: meta(c, "gdp_per_worker", y).src, interp: meta(c, "gdp_per_worker", y).interp };
    // drop rows that are entirely empty
    if (Object.values(b).some((v, i) => i > 1 && typeof v === "number")) base.push(b);

    const values = {}, levels = {}, rmeta = {}, raw = {};
    let any = false;
    for (const k of REGIME_KEYS) {
      const rv = rawGetters[k](c, y);
      const v = rv == null ? null : round(norms[k](rv), 3);
      values[k] = v; levels[k] = level(v);
      if (v != null) any = true;
      rmeta[k] = (() => {
        // pick the dominant source/interp for the index
        const primary = { tax_progressivity: "top_marginal_income_rate", welfare_generosity: "social_exp_pct_gdp", minimum_wage_strength: "minwage_to_median", labour_power: "union_density", education_spending: "education_spend_pct_gdp", trade_openness: "trade_pct_gdp", informality: "self_employment", structural: "va_services" }[k];
        return meta(c, primary, y);
      })();
      raw[k] = {};
      const rawFields = { tax_progressivity: ["top_marginal_income_rate", "tax_revenue_pct_gdp"], welfare_generosity: ["social_exp_pct_gdp"], minimum_wage_strength: ["minwage_to_median"], labour_power: ["union_density", "bargaining_coverage"], education_spending: ["education_spend_pct_gdp"], trade_openness: ["trade_pct_gdp"], informality: ["self_employment"], structural: ["va_services"] }[k];
      for (const rf of rawFields) raw[k][rf] = round(at(c, rf, y), 1);
    }
    if (any) {
      regime.push({
        country: c, year: y, values, levels, raw, meta: rmeta,
        sector: { agriculture: null, industry: null, services: round(at(c, "va_services", y), 1) },
      });
    }
  }
}

// ---- mobility -------------------------------------------------------------
// Build a 3x3 row-stochastic education-mobility matrix from two GDIM-style
// numbers: absolute upward mobility (AUM, 0-1) and persistence (P, 0-1).
// Transparent construction (documented in the methods note): higher persistence
// keeps children in their parents' group; higher AUM lifts bottom-origin
// children upward.
function buildMatrix(aum, P) {
  const c = (x) => Math.max(0.02, Math.min(0.96, x));
  const bStay = c(0.25 + 0.55 * P);
  const bUp = c(0.45 * aum);
  const bMid = c(1 - bStay - bUp);
  const tStay = c(0.25 + 0.55 * P);
  const tDown = c(0.35 * (1 - P) * (1 - 0.5 * aum));
  const tMid = c(1 - tStay - tDown);
  const mStay = c(0.40 + 0.15 * P);
  const mUp = c((1 - mStay) * (0.4 + 0.4 * aum));
  const mDown = c(1 - mStay - mUp);
  const norm = (a, b2, d) => { const s = a + b2 + d; return [a / s, b2 / s, d / s]; };
  const [bb, bm, bt] = norm(bStay, bMid, bUp);
  const [mb, mm, mt] = norm(mDown, mStay, mUp);
  const [tb, tm, tt] = norm(tDown, tMid, tStay);
  const mk = (o, arr) => [
    { origin: o, destination: "bottom", probability: round(arr[0], 3) },
    { origin: o, destination: "middle", probability: round(arr[1], 3) },
    { origin: o, destination: "top", probability: round(arr[2], 3) },
  ];
  return [...mk("bottom", [bb, bm, bt]), ...mk("middle", [mb, mm, mt]), ...mk("top", [tb, tm, tt])];
}

// Real GDIM (parsed sources.json) is preferred per (country, cohort); any cohort
// the real file does not cover falls back to the curated seed estimate.
const mobInputs = {};
for (const [c, cohorts] of Object.entries(seed.mobility || {})) {
  mobInputs[c] = {};
  for (const [cohort, m] of Object.entries(cohorts)) mobInputs[c][cohort] = { ...m, src: "curated" };
}
for (const [c, cohorts] of Object.entries(parsed.mobility || {})) {
  mobInputs[c] ??= {};
  for (const [cohort, m] of Object.entries(cohorts)) {
    if (m.aum != null || m.persistence != null) mobInputs[c][cohort] = { aum: m.aum, persistence: m.persistence, src: m.src || "GDIM" };
  }
}

const mobility = [];
for (const [c, cohorts] of Object.entries(mobInputs)) {
  for (const [cohort, m] of Object.entries(cohorts)) {
    if (m.aum == null || m.persistence == null) {
      mobility.push({ country: c, cohort, cells: [], source_family: m.src || "GDIM", notes: "Insufficient mobility coverage for this cohort.", sparse: true });
      continue;
    }
    const real = m.src === "GDIM";
    mobility.push({
      country: c, cohort,
      cells: buildMatrix(m.aum, m.persistence),
      source_family: m.src || "GDIM",
      notes: real
        ? "Education-based intergenerational mobility; 3x3 matrix built from GDIM absolute upward mobility (MU050) and intergenerational correlation (COR). See methods."
        : "Education-based intergenerational mobility; curated estimate (3x3 matrix from upward-mobility and persistence). See methods.",
      sparse: false,
    });
  }
}

// ---- write ----------------------------------------------------------------
const out = {
  generated: new Date().toISOString().slice(0, 10),
  visible_countries: VISIBLE,
  pool_countries: POOL,
  country_names: NAMES,
  year_min: Y0, year_max: Y1,
  base, regime, mobility,
  sources: seed.sources || [],
  construction: {
    regime_indices: "Each index is the min-max normalisation (winsorised at the 2nd/98th percentile across the full country pool) of its raw metric, bucketed into 5 display levels. tax_progressivity = 0.7*top marginal rate + 0.3*tax revenue %GDP; labour_power = 0.6*union density + 0.4*bargaining coverage; others are single-metric.",
    competitiveness: "GDP per person employed (WDI SL.GDP.PCAP.EM.KD) min-max normalised across the pool to 0-100.",
    interpolation: "Linear between benchmark years; never extrapolated beyond a country's observed span. Interpolated cells are flagged and rendered hollow.",
    mobility: "Education-based. A 3x3 row-stochastic matrix is constructed from GDIM absolute-upward-mobility and persistence; it is an approximation, not a directly observed transition matrix.",
    data_status: [
      "GNI per capita, the wellbeing (HDI) index and mean years of schooling are observed UNDP Human Development Report series (1990-2020, all countries).",
      "Social expenditure (OECD SOCX, 2010-2020), union density and bargaining coverage (OECD/AIAS ICTWSS) and the minimum-to-average wage ratio (OECD MIN2AVE, 2015-2020) are observed for OECD members; years and countries outside that coverage fall back to curated anchors.",
      "Mobility matrices are built from observed GDIM (MU050 upward mobility, COR persistence) for all five visible countries.",
      "Top-10% income SHARE and the top marginal tax rate remain curated estimates: the provided WID export is average top-10% income rather than a share, and the OECD tax file is a 2025-only snapshot.",
      hasWdi(VISIBLE[0], "gini")
        ? "GDP per capita PPP, Gini, poverty, trade, sector and self-employment shares come from a live World Bank WDI pull."
        : "GDP per capita PPP, Gini, poverty headcount, trade openness, sector shares and self-employment are curated benchmark anchors; run `npm run distlab:fetch` on a networked machine to replace them with live World Bank WDI values.",
    ].join(" "),
  },
};

mkdirSync(DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote ${OUT}: ${base.length} base rows, ${regime.length} regime rows, ${mobility.length} mobility matrices, pool ${POOL.length}, wdi=${hasWdi(VISIBLE[0], "gini")}`);
