// Fetches the World Bank WDI series that back The Distribution Lab and writes
// content/distlab/raw/wdi.json. Keyless, annual, 1990-2020, for the full
// calibration pool (the 5 visible countries plus internal calibration countries
// that populate the Playground analogue space but are not shown in the UI).
//
// Defensive, like scripts/fetch-observatory.mjs: any indicator that errors is
// skipped rather than breaking the build. Run: node scripts/distlab/fetch-wdi.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "..", "content", "distlab", "raw", "wdi.json");

// Visible 5 first, then the calibration pool. iso3 codes.
export const COUNTRIES = [
  "USA", "SWE", "IND", "BRA", "NGA",          // visible
  "DNK", "NOR", "FIN", "FRA", "DEU", "GBR",   // calibration
  "NLD", "CAN", "KOR", "JPN", "MEX", "CHL",
  "ZAF", "IDN", "POL", "TUR", "ESP", "ITA",
];

const START = 1990;
const END = 2020;

// WDI indicator code -> field name in the raw output.
const INDICATORS = {
  "NY.GDP.PCAP.PP.KD": "gdp_per_capita_ppp",   // GDP per capita, PPP (constant 2021 intl $)
  "NY.GNP.PCAP.PP.CD": "gni_per_capita",        // GNI per capita, PPP (current intl $)
  "SI.POV.GINI": "gini",                        // Gini index
  "SI.POV.DDAY": "poverty_headcount",           // Poverty headcount $2.15/day (% pop)
  "SE.XPD.TOTL.GD.ZS": "education_spend_pct_gdp",
  "SE.SEC.ENRR": "secondary_enrolment",         // gross %
  "NE.TRD.GNFS.ZS": "trade_pct_gdp",            // trade openness raw
  "NV.AGR.TOTL.ZS": "va_agriculture",
  "NV.IND.TOTL.ZS": "va_industry",
  "NV.SRV.TOTL.ZS": "va_services",
  "SL.EMP.SELF.ZS": "self_employment",          // informality proxy
  "GC.TAX.TOTL.GD.ZS": "tax_revenue_pct_gdp",
  "SL.GDP.PCAP.EM.KD": "gdp_per_worker",        // productivity / competitiveness proxy
};

async function getJSON(url) {
  const res = await fetch(url, { headers: { "User-Agent": "margin-of-error-distlab" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function wdi(indicator) {
  const url = `https://api.worldbank.org/v2/country/${COUNTRIES.join(";")}/indicator/${indicator}?format=json&date=${START}:${END}&per_page=20000`;
  const data = await getJSON(url);
  const rows = Array.isArray(data) ? data[1] : null;
  const byCountry = {};
  for (const c of COUNTRIES) byCountry[c] = {};
  if (rows) {
    for (const r of rows) {
      const c = r.countryiso3code;
      if (!byCountry[c] || r.value == null) continue;
      byCountry[c][r.date] = Math.round(r.value * 1000) / 1000;
    }
  }
  return byCountry;
}

async function main() {
  console.log(`Fetching ${Object.keys(INDICATORS).length} WDI indicators for ${COUNTRIES.length} countries...`);
  const out = {};
  for (const c of COUNTRIES) out[c] = {};

  const entries = Object.entries(INDICATORS);
  const results = await Promise.allSettled(entries.map(([code]) => wdi(code)));

  results.forEach((res, i) => {
    const [code, field] = entries[i];
    if (res.status !== "fulfilled") {
      console.warn(`  ${code} (${field}) skipped: ${res.reason?.message || res.reason}`);
      return;
    }
    let n = 0;
    for (const c of COUNTRIES) {
      out[c][field] = res.value[c] || {};
      n += Object.keys(out[c][field]).length;
    }
    console.log(`  ${code} -> ${field}: ${n} obs`);
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 0));
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
