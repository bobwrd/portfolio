// Data types for The Distribution Lab. The shapes here are the contract between
// the ETL (scripts/distlab/build-distlab.mjs) and the app. One annual row per
// country-year for the base and regime tables; mobility is per country-cohort.

export type SourceFamily =
  | "WDI" | "WID" | "OECD" | "OECD/AIAS ICTWSS" | "OECD SOCX"
  | "UNDP" | "GDIM" | "LIS" | "curated" | "interpolated";

// Per-field provenance: where the number came from and whether it was filled in.
export interface FieldMeta {
  src: SourceFamily;
  interp: boolean;
}

export interface CountryYearBase {
  country: string;
  year: number;
  gdp_per_capita_ppp: number | null;
  gni_per_capita: number | null;
  gini: number | null;                 // 0-100 index
  top10_share: number | null;          // 0-1
  poverty_headcount: number | null;    // % at $2.15/day
  education_years: number | null;
  secondary_enrolment: number | null;  // gross %
  education_spend_pct_gdp: number | null;
  competitiveness_index: number | null; // 0-100, from GDP per worker
  wellbeing_index: number | null;       // 0-1, HDI basis
  meta: Record<string, FieldMeta>;
}

// The eight regime keys. structural is the distance coordinate for sector mix;
// the three sector shares are carried for display only.
export type RegimeKey =
  | "tax_progressivity"
  | "welfare_generosity"
  | "minimum_wage_strength"
  | "labour_power"
  | "education_spending"
  | "trade_openness"
  | "informality"
  | "structural";

export const REGIME_KEYS: RegimeKey[] = [
  "tax_progressivity", "welfare_generosity", "minimum_wage_strength",
  "labour_power", "education_spending", "trade_openness",
  "informality", "structural",
];

// Label, short description, and the raw metric(s) behind each index. Used by the
// regime bar tooltips and the methods page.
export const REGIME_META: Record<RegimeKey, { label: string; blurb: string; rawLabel: string }> = {
  tax_progressivity:      { label: "Tax progressivity",  blurb: "How much the tax system leans on higher incomes.", rawLabel: "top marginal rate, tax revenue % GDP" },
  welfare_generosity:     { label: "Welfare generosity",  blurb: "Scale of social transfers and benefits.",          rawLabel: "social expenditure % GDP" },
  minimum_wage_strength:  { label: "Minimum wage",        blurb: "Statutory floor relative to the median wage.",     rawLabel: "minimum-to-median ratio (Kaitz)" },
  labour_power:           { label: "Labour power",        blurb: "Union density and bargaining coverage.",           rawLabel: "union density %, bargaining coverage %" },
  education_spending:     { label: "Education spending",  blurb: "Public spending on education.",                     rawLabel: "education spend % GDP" },
  trade_openness:         { label: "Trade openness",      blurb: "Exports plus imports over GDP.",                    rawLabel: "trade % GDP" },
  informality:            { label: "Informality",         blurb: "Share of work outside formal wage employment.",    rawLabel: "self-employment % of employment" },
  structural:             { label: "Structural mix",      blurb: "Tilt from agriculture toward services.",           rawLabel: "services value-added share" },
};

export interface RegimeVector {
  country: string;
  year: number;
  // continuous normalised value 0-1 (distance space) per key
  values: Record<RegimeKey, number | null>;
  // discrete display level 1..5 per key
  levels: Record<RegimeKey, number | null>;
  // raw underlying metric(s) per key, for tooltips
  raw: Record<RegimeKey, Record<string, number | null>>;
  meta: Record<RegimeKey, FieldMeta>;
  // sector shares (display only)
  sector: { agriculture: number | null; industry: number | null; services: number | null };
}

export type MobilityGroup = "bottom" | "middle" | "top";

export interface MobilityCell {
  origin: MobilityGroup;
  destination: MobilityGroup;
  probability: number;
}

export interface MobilityMatrix {
  country: string;
  cohort: string;                 // e.g. "1980s"
  cells: MobilityCell[];          // 3x3, rows (origin) sum to 1
  source_family: SourceFamily;
  notes: string;                  // e.g. "education-based; built from GDIM upward-mobility + persistence"
  sparse: boolean;                // true => panel shows a data-sparse state
}

export interface DistLabData {
  generated: string;
  visible_countries: string[];     // the 5 shown in the UI
  pool_countries: string[];        // all countries used for analogue mapping
  country_names: Record<string, string>;
  year_min: number;
  year_max: number;
  base: CountryYearBase[];
  regime: RegimeVector[];
  mobility: MobilityMatrix[];
  sources: { name: string; id: string; url: string }[];
  // ETL-recorded construction notes, keyed by index/field.
  construction: Record<string, string>;
}

export async function fetchDistLab(): Promise<DistLabData> {
  const res = await fetch("/api/distlab");
  if (!res.ok) throw new Error(`Distribution Lab data unavailable (${res.status})`);
  return res.json();
}

// --- lookups ---------------------------------------------------------------

export function baseAt(data: DistLabData, country: string, year: number): CountryYearBase | undefined {
  return data.base.find((r) => r.country === country && r.year === year);
}

export function regimeAt(data: DistLabData, country: string, year: number): RegimeVector | undefined {
  return data.regime.find((r) => r.country === country && r.year === year);
}

export function mobilityFor(data: DistLabData, country: string): MobilityMatrix[] {
  return data.mobility.filter((m) => m.country === country);
}
