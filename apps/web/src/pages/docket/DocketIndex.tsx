import { useEffect } from "react";
import Intro from "./sections/Intro";
import BacklogMap from "./sections/BacklogMap";
import Bottlenecks from "./sections/Bottlenecks";
import Tracker from "./sections/Tracker";
import IndoSing from "./sections/IndoSing";
import Methodology from "./sections/Methodology";
import {
  statePending, trendData, courtLevels, bottleneckData,
  comparisonData, delaysCost,
} from "./model";

// ─── Download helpers ──────────────────────────────────────────────────────────

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildCSV(): string {
  const rows: string[] = [];

  // State pending cases + bottleneck scores merged
  rows.push("## State-Level Data (pending cases + bottleneck scores)");
  rows.push([
    "state", "region",
    "pending_thousands", "civil_pct", "criminal_pct", "avg_years_pending",
    "bsi_composite", "bsi_tier",
    "bsi_vacancy", "bsi_digital", "bsi_adjournment", "bsi_pendency", "bsi_infra",
  ].join(","));
  for (const s of statePending) {
    const b = bottleneckData.find((x) => x.state === s.state);
    rows.push([
      `"${s.state}"`, s.region,
      s.pending, s.civilPct, s.criminalPct, s.avgYears,
      b?.composite ?? "", b ? `"${b.tier}"` : "",
      b?.vacancyScore ?? "", b?.digitalScore ?? "", b?.adjournScore ?? "",
      b?.pendencyScore ?? "", b?.infraScore ?? "",
    ].join(","));
  }

  rows.push("");
  rows.push("## Annual Trend — All Courts (millions, except Supreme Court = thousands)");
  rows.push("year,total_millions,district_millions,high_court_millions,supreme_thousands");
  for (const t of trendData) {
    rows.push([t.year, t.total, t.district, t.highCourt, t.supreme].join(","));
  }

  rows.push("");
  rows.push("## Court Levels");
  rows.push([
    "level", "pending", "pending_unit",
    "judges_sanctioned", "judges_actual", "vacancy_pct",
    "avg_disposal_years", "annual_filing_m", "annual_disposal_m", "disposal_rate_pct",
  ].join(","));
  for (const c of courtLevels) {
    rows.push([
      `"${c.level}"`, c.pending, c.pendingUnit,
      c.judgesSanctioned, c.judgesActual, c.vacancyPct,
      c.avgDisposalYears, c.annualFiling, c.annualDisposal, c.disposalRate,
    ].join(","));
  }

  rows.push("");
  rows.push("## India–Singapore Comparison (scores 0–100, higher = better)");
  rows.push([
    "dimension", "india_description", "singapore_description",
    "india_score", "singapore_score", "note",
  ].join(","));
  for (const c of comparisonData) {
    rows.push([
      `"${c.dimension}"`,
      `"${c.india.replace(/"/g, '""')}"`,
      `"${c.singapore.replace(/"/g, '""')}"`,
      c.indiaRaw, c.singaporeRaw,
      c.note ? `"${c.note.replace(/"/g, '""')}"` : "",
    ].join(","));
  }

  rows.push("");
  rows.push("## Cost of Delays");
  rows.push(["label", "cost_estimate", "source"].join(","));
  for (const d of delaysCost) {
    rows.push([
      `"${d.label.replace(/"/g, '""')}"`,
      `"${d.cost.replace(/"/g, '""')}"`,
      `"${d.source.replace(/"/g, '""')}"`,
    ].join(","));
  }

  return rows.join("\n");
}

function buildJSON(): string {
  return JSON.stringify({
    meta: {
      title: "The Docket — Indian Court Backlogs",
      source: "Arin Jain (/mini/docket)",
      generated: new Date().toISOString().slice(0, 10),
      primarySources: [
        "NJDG (njdg.gov.in) — pending case counts",
        "Ministry of Law & Justice Annual Report 2022-23",
        "DAKSH India Judicial Efficiency Study 2019",
        "Supreme Court Annual Report 2022-23",
        "Singapore Judiciary Statistics 2023 / eLitigation Annual Report 2023",
      ],
      note: "State-level figures are approximate as of late 2023/early 2024. Exact current figures should be verified at njdg.gov.in.",
    },
    statePending,
    trendData,
    courtLevels,
    bottleneckData,
    comparisonData,
    delaysCost,
  }, null, 2);
}

function buildHTML(): string {
  const esc = (s: string | number) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const stateRows = statePending.map((s) => {
    const b = bottleneckData.find((x) => x.state === s.state);
    const tierColor: Record<string, string> = {
      Critical: "#f87171", High: "#fb923c", Moderate: "#fbbf24", Low: "#34d399",
    };
    const tier = b?.tier ?? "";
    const tStyle = tier ? `color:${tierColor[tier]};font-weight:600` : "";
    return `<tr>
      <td>${esc(s.state)}</td><td>${esc(s.region)}</td>
      <td>${esc(s.pending.toLocaleString())}k</td>
      <td>${esc(s.civilPct)}%</td><td>${esc(s.criminalPct)}%</td>
      <td>${esc(s.avgYears)} yrs</td>
      <td>${b ? esc(b.composite.toFixed(1)) : "–"}</td>
      <td style="${tStyle}">${esc(tier)}</td>
    </tr>`;
  }).join("\n");

  const trendRows = trendData.map((t) =>
    `<tr><td>${t.year}</td><td>${t.total}M</td><td>${t.district}M</td><td>${t.highCourt}M</td><td>${t.supreme}k</td></tr>`
  ).join("\n");

  const levelRows = courtLevels.map((c) =>
    `<tr>
      <td>${esc(c.level)}</td>
      <td>${c.pending}${c.pendingUnit === "M" ? "M" : "k"}</td>
      <td>${c.judgesActual}/${c.judgesSanctioned} <span style="color:#f87171">(${c.vacancyPct}% vacant)</span></td>
      <td>${c.avgDisposalYears} yrs</td>
      <td>${c.disposalRate}%</td>
    </tr>`
  ).join("\n");

  const compRows = comparisonData.map((c) => {
    const diff = c.singaporeRaw - c.indiaRaw;
    return `<tr>
      <td>${esc(c.dimension)}</td>
      <td>${esc(c.india)}</td>
      <td>${esc(c.singapore)}</td>
      <td style="color:#fb923c">${c.indiaRaw}</td>
      <td style="color:#34d399">${c.singaporeRaw}</td>
      <td style="color:#f87171">+${diff} gap</td>
    </tr>`;
  }).join("\n");

  const costRows = delaysCost.map((d) =>
    `<tr><td>${esc(d.label)}</td><td>${esc(d.cost)}</td><td style="color:#6b7280">${esc(d.source)}</td></tr>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>The Docket — Data Export</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',system-ui,sans-serif;background:#090f0a;color:#e4f5ef;padding:2rem 1.5rem}
    h1{font-size:1.05rem;color:#34d399;letter-spacing:.15em;font-weight:700;text-transform:uppercase;margin-bottom:.3rem}
    .meta{font-size:.72rem;color:#6fa882;margin-bottom:2rem}
    h2{font-size:.75rem;color:#34d399;letter-spacing:.15em;text-transform:uppercase;margin:2rem 0 .75rem;font-weight:700}
    .wrap{overflow-x:auto;margin-bottom:.5rem}
    table{border-collapse:collapse;width:100%;font-size:.71rem;white-space:nowrap}
    thead th{background:#111e12;color:#34d399;padding:.45rem .7rem;text-align:left;font-weight:600;border-bottom:1px solid rgba(52,211,153,.16)}
    tbody td{padding:.32rem .7rem;border-bottom:1px solid rgba(52,211,153,.07);color:#c8e8d8}
    tbody tr:nth-child(even) td{background:#0c1a0d}
    tbody tr:hover td{background:#122113}
    .src{margin-top:2rem;font-size:.7rem;color:#4b7a5f;border-top:1px solid rgba(52,211,153,.16);padding-top:.75rem}
    a{color:#34d399}
  </style>
</head>
<body>
  <h1>The Docket — Indian Court Backlogs · Data Export</h1>
  <p class="meta">
    Source: <a href="https://arinjain.arinjain-mail.workers.dev/mini/docket" target="_blank">Arin Jain / The Docket</a>
    &middot; Generated ${new Date().toISOString().slice(0, 10)}
    &middot; Primary sources: NJDG, Ministry of Law &amp; Justice 2022-23, DAKSH India, SC Annual Reports, Singapore Judiciary 2023
  </p>

  <h2>State-level data — pending cases + bottleneck scores</h2>
  <div class="wrap"><table>
    <thead><tr>
      <th>State</th><th>Region</th><th>Pending</th>
      <th>Civil %</th><th>Criminal %</th><th>Avg Age</th>
      <th>BSI</th><th>Tier</th>
    </tr></thead>
    <tbody>${stateRows}</tbody>
  </table></div>

  <h2>Annual trend — all courts</h2>
  <div class="wrap"><table>
    <thead><tr><th>Year</th><th>Total</th><th>District</th><th>High Courts</th><th>Supreme Court</th></tr></thead>
    <tbody>${trendRows}</tbody>
  </table></div>

  <h2>Court levels</h2>
  <div class="wrap"><table>
    <thead><tr><th>Level</th><th>Pending</th><th>Judges (actual/sanctioned)</th><th>Avg disposal</th><th>Disposal rate</th></tr></thead>
    <tbody>${levelRows}</tbody>
  </table></div>

  <h2>India–Singapore comparison (0–100, higher = better)</h2>
  <div class="wrap"><table>
    <thead><tr><th>Dimension</th><th>India</th><th>Singapore</th><th>India score</th><th>SG score</th><th>Gap</th></tr></thead>
    <tbody>${compRows}</tbody>
  </table></div>

  <h2>Cost of delays</h2>
  <div class="wrap"><table>
    <thead><tr><th>Indicator</th><th>Estimate</th><th>Source</th></tr></thead>
    <tbody>${costRows}</tbody>
  </table></div>

  <div class="src">Data compiled for research purposes. Verify current figures at <a href="https://njdg.gov.in" target="_blank">njdg.gov.in</a>.</div>
</body>
</html>`;
}

// ─── Download strip ────────────────────────────────────────────────────────────

function DownloadStrip() {
  const today = new Date().toISOString().slice(0, 10);
  const buttons = [
    {
      label: "CSV",
      title: "Five flat tables: state pending + bottleneck scores, trend, court levels, India-Singapore comparison, delays cost",
      action: () => triggerDownload("docket-data.csv", buildCSV(), "text/csv;charset=utf-8;"),
    },
    {
      label: "JSON",
      title: "Full structured dataset with all arrays and source metadata",
      action: () => triggerDownload("docket-data.json", buildJSON(), "application/json"),
    },
    {
      label: "HTML",
      title: "Self-contained styled reference with all five tables — open in any browser",
      action: () => triggerDownload("docket-data.html", buildHTML(), "text/html;charset=utf-8;"),
    },
  ];

  return (
    <div className="border-b" style={{ borderColor: "var(--docket-border)", backgroundColor: "var(--docket-surface)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap">
        <span
          className="text-[0.6rem] font-mono uppercase tracking-[0.2em]"
          style={{ color: "var(--docket-muted)", opacity: 0.7 }}
        >
          Download raw data
        </span>
        {buttons.map(({ label, title, action }) => (
          <button
            key={label}
            onClick={action}
            title={title}
            className="text-[0.65rem] font-mono px-2.5 py-1 rounded border transition-all duration-150"
            style={{ borderColor: "var(--docket-border)", color: "var(--docket-muted)", backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--docket-accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--docket-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--docket-border)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--docket-muted)";
            }}
          >
            ↓ {label}
          </button>
        ))}
        <span
          className="text-[0.6rem] font-mono hidden sm:block ml-auto"
          style={{ color: "var(--docket-muted)", opacity: 0.4 }}
        >
          {statePending.length} states · {trendData.length} years · {today}
        </span>
      </div>
    </div>
  );
}

export default function DocketIndex() {
  useEffect(() => {
    document.title = "The Docket — Indian Court Backlogs · Arin Jain";
  }, []);

  return (
    <>
      <DownloadStrip />
      <Intro />
      <BacklogMap />
      <Bottlenecks />
      <Tracker />
      <IndoSing />
      <Methodology />

      {/* Cross-links */}
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-4 border-t"
        style={{ borderColor: "var(--docket-border)" }}
      >
        <p className="text-xs mb-3" style={{ color: "var(--docket-muted)" }}>
          Related work:
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/mini/verdict" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            The Verdict — AI regulation as it happens →
          </a>
          <a href="/mini/ledger" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            The Ledger — MAS enforcement actions →
          </a>
          <a href="/others/access-to-justice-the-gap-nobody-measures" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            Access to Justice — the gap nobody measures →
          </a>
          <a href="/why" className="hover:underline" style={{ color: "var(--docket-accent)" }}>
            Why this question →
          </a>
        </div>
      </div>
    </>
  );
}
