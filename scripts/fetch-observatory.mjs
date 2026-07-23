// Fetches the Observatory dataset (AI / productivity / prices) and writes
// content/observatory/observatory.json — the same file the build bakes and the
// Worker serves at /api/observatory.
//
// Two sources, by design:
//   - World Bank (keyless): annual, multi-country baseline. Always runs.
//       FP.CPI.TOTL.ZG    Inflation, consumer prices (annual %)
//       SL.GDP.PCAP.EM.KD GDP per person employed (constant 2021 PPP $)
//   - FRED (needs FRED_API_KEY): US monthly/quarterly enrichment. Skipped if
//     the key is absent, and any individual series that errors is skipped too,
//     so a renamed FRED id never breaks the build.
//
// Run locally:   FRED_API_KEY=xxxx node scripts/fetch-observatory.mjs
// In CI:         the key comes from the FRED_API_KEY secret (see the workflow).

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "content", "observatory", "observatory.json");

const COUNTRIES = ["USA", "GBR", "DEU", "JPN", "SGP"];
const NAMES = {
  USA: "United States", GBR: "United Kingdom", DEU: "Germany",
  JPN: "Japan", SGP: "Singapore",
};
const START_YEAR = 2000;

const AI_EVENTS = [
  { date: "2022-11", label: "ChatGPT launch" },
  { date: "2023-03", label: "GPT-4 release" },
  { date: "2024-05", label: "GPT-4o / multimodal agents" },
];

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "margin-of-error-observatory" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// --- World Bank -----------------------------------------------------------
async function worldBank(indicator) {
  const url = `https://api.worldbank.org/v2/country/${COUNTRIES.join(";")}/indicator/${indicator}?format=json&date=${START_YEAR}:2100&per_page=2000`;
  const data = await getJSON(url);
  const rows = Array.isArray(data) ? data[1] : null;
  const byCountry = {};
  for (const c of COUNTRIES) byCountry[c] = [];
  if (rows) {
    for (const r of rows) {
      const c = r.countryiso3code;
      if (!byCountry[c] || r.value == null) continue;
      byCountry[c].push({ date: r.date, value: round(r.value, 2) });
    }
    for (const c of COUNTRIES) byCountry[c].sort((a, b) => a.date.localeCompare(b.date));
  }
  return byCountry;
}

// --- FRED -----------------------------------------------------------------
const FRED_KEY = process.env.FRED_API_KEY;

async function fredSeries(id) {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${FRED_KEY}&file_type=json&observation_start=2014-01-01`;
  const data = await getJSON(url);
  return (data.observations || [])
    .filter((o) => o.value !== ".")
    .map((o) => ({ date: o.date.slice(0, 7), value: Number(o.value) }));
}

// First candidate id that resolves wins; returns [] if none do.
async function fredFirst(ids) {
  for (const id of ids) {
    try {
      const s = await fredSeries(id);
      if (s.length) { console.log(`  FRED ${id}: ${s.length} obs`); return s; }
    } catch (e) {
      console.warn(`  FRED ${id} skipped: ${e.message}`);
    }
  }
  return [];
}

// 12-month % change of a monthly index series.
function yoy(series) {
  const out = [];
  for (let i = 12; i < series.length; i++) {
    const prev = series[i - 12].value;
    if (prev) out.push({ date: series[i].date, value: round(((series[i].value / prev) - 1) * 100, 2) });
  }
  return out;
}

function round(v, n) { const f = 10 ** n; return Math.round(v * f) / f; }

// --- main -----------------------------------------------------------------
async function main() {
  console.log("Fetching World Bank baseline…");
  const [inflation, prod] = await Promise.all([
    worldBank("FP.CPI.TOTL.ZG"),
    worldBank("SL.GDP.PCAP.EM.KD"),
  ]);

  const series = {};
  for (const c of COUNTRIES) {
    series[c] = {
      annual_inflation: inflation[c],
      gdp_per_worker: prod[c],
    };
  }

  let fredEnriched = false;
  if (FRED_KEY) {
    console.log("Fetching FRED US enrichment…");
    try {
      const [cpi, core, pce, info, soft, earn, itinv] = await Promise.all([
        fredFirst(["CPIAUCSL"]),
        fredFirst(["CPILFESL"]),
        fredFirst(["PCEPILFE"]),
        fredFirst(["USINFO"]),
        fredFirst(["PCU511210511210", "PCU51125112"]),
        fredFirst(["LES1252881600Q"]),
        // Information-processing equipment ($bn). NOT Y033 (that is ALL
        // nonresidential equipment). Fallbacks: software, then IP products.
        fredFirst(["Y034RC1Q027SBEA", "B985RC1Q027SBEA", "Y001RC1Q027SBEA"]),
      ]);
      const us = series.USA;
      if (cpi.length) us.headline_cpi_yoy = yoy(cpi);
      if (core.length) us.core_cpi_yoy = yoy(core);
      if (pce.length) us.core_pce_yoy = yoy(pce);
      if (info.length) us.info_employment = info;
      // Software PPI is an index level (Dec 1997=100); convert to YoY % so it
      // shares the inflation axis sensibly.
      if (soft.length) us.software_ppi = yoy(soft);
      if (earn.length) us.real_median_earnings = earn;
      if (itinv.length) us.it_investment = itinv;
      fredEnriched = Boolean(cpi.length || core.length || pce.length);
    } catch (e) {
      console.warn("FRED enrichment failed wholesale, continuing with World Bank only:", e.message);
    }
  } else {
    console.log("No FRED_API_KEY — World Bank baseline only.");
  }

  const out = {
    generated: new Date().toISOString().slice(0, 10),
    fred_enriched: fredEnriched,
    default_country: "USA",
    countries: COUNTRIES,
    country_names: NAMES,
    ai_events: AI_EVENTS,
    series,
    sources: [
      { name: "World Bank — Inflation, consumer prices (annual %)", id: "FP.CPI.TOTL.ZG", url: "https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" },
      { name: "World Bank — GDP per person employed (constant 2021 PPP $)", id: "SL.GDP.PCAP.EM.KD", url: "https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD" },
      { name: "FRED — Headline CPI (CPIAUCSL), Core CPI (CPILFESL), Core PCE (PCEPILFE)", id: "FRED", url: "https://fred.stlouisfed.org/" },
      { name: "FRED — Information-sector employment (USINFO), Software PPI, IT investment, real median earnings", id: "FRED", url: "https://fred.stlouisfed.org/" },
    ],
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT} (fred_enriched=${fredEnriched})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
