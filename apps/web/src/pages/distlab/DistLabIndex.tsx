import { useEffect, useMemo, useState } from "react";
import {
  fetchDistLab, baseAt, regimeAt, mobilityFor,
  REGIME_KEYS, type DistLabData, type CountryYearBase, type MobilityMatrix,
} from "./types";
import { useLabState, regimeToValues } from "./state";
import { resolve, DEFAULT_CONFIG, type ObservedPoint } from "./mapping";
import { CountryPicker, ModeToggle, RegimeBar, YearScrubber, EvidenceStrip, EvidenceDrawer } from "./controls";
import DistributionPanel from "./panels/DistributionPanel";
import MobilityPanel from "./panels/MobilityPanel";
import MacroPanel from "./panels/MacroPanel";

const OUTCOME_KEYS = [
  "gini", "top10_share", "poverty_headcount", "gdp_per_capita_ppp",
  "gni_per_capita", "education_years", "secondary_enrolment",
  "competitiveness_index", "wellbeing_index",
];

// Most recent cohort for a country (cohorts are decade strings like "1980s").
function latestCohort(ms: MobilityMatrix[]): MobilityMatrix | undefined {
  if (!ms.length) return undefined;
  return [...ms].sort((a, b) => b.cohort.localeCompare(a.cohort))[0];
}

export default function DistLabIndex() {
  const [data, setData] = useState<DistLabData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Arin Jain — The Distribution Lab";
    fetchDistLab().then(setData).catch(() => setError(true));
  }, []);

  if (error) return <LoadState msg="Live data is temporarily unavailable. The Distribution Lab needs its dataset (content/distlab/distlab.json) to be built and deployed." />;
  if (!data) return <LoadState msg="Loading…" />;
  return <Lab data={data} />;
}

function LoadState({ msg }: { msg: string }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <p className="text-sm max-w-md text-center" style={{ color: "var(--dl-muted)" }}>{msg}</p>
    </div>
  );
}

function Lab({ data }: { data: DistLabData }) {
  const [state, dispatch] = useLabState(data.visible_countries[0], data.year_max);
  const { mode, country, year, regime, locked } = state;

  // Observed point cloud for the Playground analogue mapping. Coords are the 8
  // regime indices; outcomes come from the matching base row.
  const cloud = useMemo<ObservedPoint[]>(() => {
    const out: ObservedPoint[] = [];
    for (const rv of data.regime) {
      const coords = REGIME_KEYS.map((k) => rv.values[k]);
      if (!coords.every((x) => x != null && Number.isFinite(x))) continue;
      const b = baseAt(data, rv.country, rv.year);
      const outcomes: Record<string, number | null> = {};
      for (const key of OUTCOME_KEYS) outcomes[key] = (b as Record<string, unknown> | undefined)?.[key] as number ?? null;
      out.push({ country: rv.country, year: rv.year, coords: coords as number[], outcomes });
    }
    return out;
  }, [data]);

  // Re-seed the sliders from the current country-year whenever we enter Playground.
  useEffect(() => {
    if (mode === "playground") dispatch({ type: "loadRegime", regime: regimeToValues(regimeAt(data, country, year)) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const historyBase = baseAt(data, country, year);
  const historyRegime = regimeAt(data, country, year);

  // Playground resolution.
  const target = REGIME_KEYS.map((k) => regime[k]);
  const result = useMemo(() => resolve(target, cloud, OUTCOME_KEYS, DEFAULT_CONFIG), [target.join(","), cloud]);
  const topCountry = result.contributors[0]?.country;

  // What the three panels read, by mode.
  const playgroundBase: Partial<CountryYearBase> & { meta?: CountryYearBase["meta"] } = {
    gdp_per_capita_ppp: result.estimates.gdp_per_capita_ppp,
    gni_per_capita: result.estimates.gni_per_capita,
    education_years: result.estimates.education_years,
    secondary_enrolment: result.estimates.secondary_enrolment,
    education_spend_pct_gdp: null,
    competitiveness_index: result.estimates.competitiveness_index,
    wellbeing_index: result.estimates.wellbeing_index,
    meta: {},
  };

  const dist = mode === "history"
    ? { gini: historyBase?.gini ?? null, top10: historyBase?.top10_share ?? null, poverty: historyBase?.poverty_headcount ?? null }
    : { gini: result.estimates.gini, top10: result.estimates.top10_share, poverty: result.estimates.poverty_headcount };

  const mobility = mode === "history"
    ? latestCohort(mobilityFor(data, country))
    : (topCountry ? latestCohort(mobilityFor(data, topCountry)) : undefined);

  const names = data.country_names;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Control strip */}
      <div className="border-b" style={{ borderColor: "var(--dl-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <ModeToggle mode={mode} onChange={(m) => dispatch({ type: "setMode", mode: m })} />
          <CountryPicker countries={data.visible_countries} names={names} value={country} onChange={(c) => dispatch({ type: "setCountry", country: c })} />
        </div>
      </div>

      {/* Regime bar */}
      <div className="border-b" style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.65rem] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--dl-accent)" }}>
              Regime {mode === "playground" ? "controls" : `· ${names[country] || country} ${year}`}
            </span>
            {mode === "playground" && (
              <button onClick={() => dispatch({ type: "loadRegime", regime: regimeToValues(regimeAt(data, country, year)) })} className="text-[0.65rem] font-mono px-2 py-1 rounded" style={{ color: "var(--dl-muted)", backgroundColor: "var(--dl-surface-2)" }}>
                reset to {names[country] || country} {year}
              </button>
            )}
          </div>
          <RegimeBar
            mode={mode}
            row={historyRegime}
            values={regime}
            locked={locked}
            onChange={(k, v) => dispatch({ type: "setRegime", key: k, value: v })}
            onToggleLock={(k) => dispatch({ type: "toggleLock", key: k })}
          />
        </div>
      </div>

      {/* Three panels */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DistributionPanel
            gini={dist.gini} top10={dist.top10} poverty={dist.poverty}
            uncertain={mode === "playground" && result.extrapolating}
            giniSrc={mode === "history" ? historyBase?.meta?.gini?.src : "analogue"}
            giniInterp={mode === "history" ? historyBase?.meta?.gini?.interp : undefined}
            top10Src={mode === "history" ? historyBase?.meta?.top10_share?.src : "analogue"}
            top10Interp={mode === "history" ? historyBase?.meta?.top10_share?.interp : undefined}
            povSrc={mode === "history" ? historyBase?.meta?.poverty_headcount?.src : "analogue"}
            povInterp={mode === "history" ? historyBase?.meta?.poverty_headcount?.interp : undefined}
          />
          <MobilityPanel matrix={mobility} estimatedFrom={mode === "playground" && topCountry ? (names[topCountry] || topCountry) : undefined} />
          <MacroPanel base={mode === "history" ? historyBase : playgroundBase} uncertain={mode === "playground" && result.extrapolating} />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t shrink-0" style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          {mode === "history" ? (
            <YearScrubber year={year} min={data.year_min} max={data.year_max} onChange={(y) => dispatch({ type: "setYear", year: y })} />
          ) : (
            <div className="space-y-2">
              <EvidenceStrip result={result} names={names} />
              <EvidenceDrawer
                result={result}
                names={names}
                outcomeOf={(c, y) => {
                  const b = baseAt(data, c, y);
                  return { gini: b?.gini ?? null, gdp: b?.gdp_per_capita_ppp ?? null, well: b?.wellbeing_index ?? null };
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Download strip */}
      <DownloadBar data={data} />
    </div>
  );
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildCSV(data: DistLabData): string {
  const regimeMap = new Map(data.regime.map((r) => [`${r.country}__${r.year}`, r]));
  const headers = [
    "country", "country_name", "year",
    "gdp_per_capita_ppp", "gni_per_capita", "gini", "top10_share",
    "poverty_headcount", "education_years", "secondary_enrolment",
    "education_spend_pct_gdp", "competitiveness_index", "wellbeing_index",
    "tax_progressivity", "welfare_generosity", "minimum_wage_strength",
    "labour_power", "education_spending", "trade_openness",
    "informality", "structural",
  ];
  const rows = data.base.map((b) => {
    const r = regimeMap.get(`${b.country}__${b.year}`);
    return [
      b.country,
      `"${(data.country_names[b.country] || b.country).replace(/"/g, '""')}"`,
      b.year,
      b.gdp_per_capita_ppp ?? "",
      b.gni_per_capita ?? "",
      b.gini ?? "",
      b.top10_share ?? "",
      b.poverty_headcount ?? "",
      b.education_years ?? "",
      b.secondary_enrolment ?? "",
      b.education_spend_pct_gdp ?? "",
      b.competitiveness_index ?? "",
      b.wellbeing_index ?? "",
      r?.values.tax_progressivity ?? "",
      r?.values.welfare_generosity ?? "",
      r?.values.minimum_wage_strength ?? "",
      r?.values.labour_power ?? "",
      r?.values.education_spending ?? "",
      r?.values.trade_openness ?? "",
      r?.values.informality ?? "",
      r?.values.structural ?? "",
    ].join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

function buildHTML(data: DistLabData): string {
  const regimeMap = new Map(data.regime.map((r) => [`${r.country}__${r.year}`, r]));
  const fmt = (v: number | null | undefined) => (v == null ? "–" : String(v));
  const fmtPct = (v: number | null | undefined) => (v == null ? "–" : `${(v * 100).toFixed(1)}%`);
  const fmtReg = (v: number | null | undefined) => (v == null ? "–" : v.toFixed(3));

  const tableRows = data.base.map((b) => {
    const r = regimeMap.get(`${b.country}__${b.year}`);
    return `<tr>
      <td>${data.country_names[b.country] || b.country}</td>
      <td>${b.country}</td>
      <td>${b.year}</td>
      <td>${fmt(b.gdp_per_capita_ppp)}</td>
      <td>${fmt(b.gni_per_capita)}</td>
      <td>${fmt(b.gini)}</td>
      <td>${fmtPct(b.top10_share)}</td>
      <td>${b.poverty_headcount != null ? b.poverty_headcount.toFixed(1) + "%" : "–"}</td>
      <td>${fmt(b.education_years)}</td>
      <td>${fmt(b.secondary_enrolment)}</td>
      <td>${fmt(b.education_spend_pct_gdp)}</td>
      <td>${fmt(b.competitiveness_index)}</td>
      <td>${fmt(b.wellbeing_index)}</td>
      <td>${fmtReg(r?.values.tax_progressivity)}</td>
      <td>${fmtReg(r?.values.welfare_generosity)}</td>
      <td>${fmtReg(r?.values.minimum_wage_strength)}</td>
      <td>${fmtReg(r?.values.labour_power)}</td>
      <td>${fmtReg(r?.values.education_spending)}</td>
      <td>${fmtReg(r?.values.trade_openness)}</td>
      <td>${fmtReg(r?.values.informality)}</td>
      <td>${fmtReg(r?.values.structural)}</td>
    </tr>`;
  }).join("\n");

  const sourceLinks = data.sources
    .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`)
    .join(" &middot; ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Distribution Lab — Data Export</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b0f1f; color: #e8e6f0; padding: 2rem 1.5rem; }
    h1 { font-size: 1rem; color: #a78bfa; letter-spacing: 0.15em; font-weight: 700; text-transform: uppercase; margin-bottom: 0.4rem; }
    .meta { font-size: 0.75rem; color: #6b6880; margin-bottom: 1.5rem; }
    .wrap { overflow-x: auto; }
    table { border-collapse: collapse; width: 100%; font-size: 0.72rem; white-space: nowrap; }
    thead th { background: #131627; color: #a78bfa; padding: 0.5rem 0.7rem; text-align: left; font-weight: 600; position: sticky; top: 0; border-bottom: 1px solid #2a2d45; }
    tbody td { padding: 0.35rem 0.7rem; border-bottom: 1px solid #161929; color: #ccc8e2; }
    tbody tr:nth-child(even) td { background: #0e1120; }
    tbody tr:hover td { background: #171b2e; }
    .sources { margin-top: 1.5rem; font-size: 0.72rem; color: #6b6880; }
    .sources a { color: #a78bfa; text-decoration: none; }
    .sources a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>The Distribution Lab — Data Export</h1>
  <p class="meta">Generated ${data.generated} &middot; ${data.base.length} rows &middot; ${data.pool_countries.length} countries &middot; ${data.year_min}–${data.year_max} &middot; Regime values are normalised 0–1</p>
  <div class="wrap">
    <table>
      <thead>
        <tr>
          <th>Country</th><th>Code</th><th>Year</th>
          <th>GDP/cap PPP</th><th>GNI/cap</th><th>Gini</th><th>Top-10% share</th>
          <th>Poverty</th><th>Edu years</th><th>2° enrol.</th><th>Edu spend %</th>
          <th>Competitiveness</th><th>Wellbeing</th>
          <th>Tax prog.</th><th>Welfare</th><th>Min wage</th><th>Labour power</th>
          <th>Edu spending</th><th>Trade open.</th><th>Informality</th><th>Structural</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>
  <div class="sources"><strong>Sources:</strong> ${sourceLinks}</div>
</body>
</html>`;
}

function DownloadBar({ data }: { data: DistLabData }) {
  const buttons = [
    {
      label: "CSV",
      title: "Flat table: all country-years with base outcomes + regime index values",
      action: () => triggerDownload("distlab-data.csv", buildCSV(data), "text/csv;charset=utf-8;"),
    },
    {
      label: "JSON",
      title: "Full dataset including mobility matrices, source metadata, and field-level provenance",
      action: () => triggerDownload("distlab-data.json", JSON.stringify(data, null, 2), "application/json"),
    },
    {
      label: "HTML",
      title: "Self-contained styled table for offline reference",
      action: () => triggerDownload("distlab-data.html", buildHTML(data), "text/html;charset=utf-8;"),
    },
  ];

  return (
    <div className="border-t shrink-0" style={{ borderColor: "var(--dl-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="text-[0.6rem] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--dl-muted)", opacity: 0.6 }}>
          Download data
        </span>
        {buttons.map(({ label, title, action }) => (
          <button
            key={label}
            onClick={action}
            title={title}
            className="text-[0.65rem] font-mono px-2.5 py-1 rounded border transition-all duration-150"
            style={{
              borderColor: "var(--dl-border)",
              color: "var(--dl-muted)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dl-accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dl-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-muted)";
            }}
          >
            ↓ {label}
          </button>
        ))}
        <span className="text-[0.6rem] font-mono hidden sm:block" style={{ color: "var(--dl-muted)", opacity: 0.4 }}>
          {data.base.length} rows · {data.pool_countries.length} countries · {data.year_min}–{data.year_max}
        </span>
      </div>
    </div>
  );
}
