import PaperHeader from "@/components/PaperHeader";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { useVerdictTheme } from "./VerdictLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { fetchCases, TIER_COLORS, TIER_BG, type VerdictCase } from "./types";
import VerdictMap from "./VerdictMap";

function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className="font-sans text-[0.8125rem] font-semibold px-1.5 py-px rounded-sm"
      style={{
        color: TIER_COLORS[tier] ?? "var(--verdict-muted)",
        backgroundColor: TIER_BG[tier] ?? "transparent",
        border: `1px solid ${TIER_COLORS[tier] ?? "var(--verdict-border)"}`,
      }}
    >
      {tier}
    </span>
  );
}

function CompactTimeline({ cases }: { cases: VerdictCase[] }) {
  const { theme } = useVerdictTheme();

  const data = cases.map((c) => ({
    x: new Date(c.date).getTime(),
    y: c.computed.EDI,
    tier: c.computed.tier,
    title: c.title,
    id: c.case_id,
  }));

  // Month tick positions: first day of each month in the data range. Avoids the
  // "every case in 2026 renders a 2026 tick" overlap the old per-data tick had.
  const monthTicks = useMemo(() => {
    if (data.length === 0) return [] as number[];
    const min = Math.min(...data.map((d) => d.x));
    const max = Math.max(...data.map((d) => d.x));
    const ticks: number[] = [];
    const cursor = new Date(min);
    cursor.setUTCDate(1);
    cursor.setUTCHours(0, 0, 0, 0);
    while (cursor.getTime() <= max) {
      ticks.push(cursor.getTime());
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return ticks;
  }, [data]);

  // "Mar 2026" for non-January months, "2026" only for January — keeps the axis
  // readable when the data is concentrated in a single year.
  const tickFormatter = (v: number) => {
    const d = new Date(v);
    const isJanuary = d.getUTCMonth() === 0;
    return isJanuary
      ? d.getUTCFullYear().toString()
      : d.toLocaleDateString("en-SG", { month: "short", timeZone: "UTC" });
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded border p-3 text-xs"
        style={{
          backgroundColor: "#fff",
          borderColor: "var(--verdict-border)",
          color: "var(--verdict-text)",
        }}
      >
        <div style={{ color: TIER_COLORS[d.tier] }} className="font-bold mb-1">{d.tier}</div>
        <div className="text-[0.8125rem] mb-1 max-w-[180px] leading-snug">{d.title}</div>
        <div>EDI: <span style={{ color: "var(--verdict-accent)" }}>{d.y.toFixed(1)}</span></div>
        <div style={{ color: "var(--verdict-muted)" }}>{new Date(d.x).toLocaleDateString("en-SG", { year: "numeric", month: "short" })}</div>
      </div>
    );
  };

  if (data.length === 0) return null;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 30 }}>
          <XAxis
            dataKey="x"
            type="number"
            domain={["auto", "auto"]}
            ticks={monthTicks}
            tickFormatter={tickFormatter}
            tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "var(--font-sans-face)" }}
            axisLine={{ stroke: "var(--verdict-border)" }}
            tickLine={false}
            scale="time"
            name="Date"
          />
          <YAxis
            dataKey="y"
            domain={[1, 10]}
            tick={{ fill: "var(--verdict-muted)", fontSize: 10, fontFamily: "var(--font-sans-face)" }}
            axisLine={{ stroke: "var(--verdict-border)" }}
            tickLine={false}
            name="EDI"
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} isAnimationActive>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={TIER_COLORS[entry.tier] ?? "var(--verdict-accent)"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function CaseCard({ c }: { c: VerdictCase }) {
  const { computed } = c;
  const band = computed.uncertainty_band;

  return (
    <Link
      to={`/mini/verdict/${c.case_id}`}
      className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 border-b py-5"
      style={{ borderColor: "var(--verdict-border)" }}
    >
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[0.875rem]" style={{ color: "var(--verdict-muted)" }}>
          <TierBadge tier={computed.tier} />
          <span>{c.decision_type}</span>
          <time dateTime={c.date}>
            {new Date(c.date).toLocaleDateString("en-SG", { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <span>{c.jurisdiction}</span>
        </p>
        <h3
          className="mt-2 font-serif text-xl leading-snug decoration-1 underline-offset-4 group-hover:underline"
          style={{ color: "var(--verdict-text)" }}
        >
          {c.title}
        </h3>
        <p className="mt-1.5 max-w-[42rem] font-serif text-[1rem] leading-relaxed line-clamp-3" style={{ color: "var(--verdict-text)" }}>
          {c.summary}
        </p>
      </div>
      <div className="text-right">
        <div className="font-serif text-3xl leading-none tabular-nums" style={{ color: "var(--verdict-accent)" }}>
          {computed.EDI.toFixed(1)}
        </div>
        <div className="mt-1 font-sans text-[0.8125rem] tabular-nums" style={{ color: "var(--verdict-muted)" }}>
          EDI, range {band[0].toFixed(1)} to {band[1].toFixed(1)}
        </div>
      </div>
    </Link>
  );
}

type SortKey = "date" | "edi";
type FilterState = { type: string; jurisdiction: string; tier: string };

export default function VerdictIndex() {
  const [cases, setCases] = useState<VerdictCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("date");
  const [filters, setFilters] = useState<FilterState>({ type: "", jurisdiction: "", tier: "" });
  const { theme } = useVerdictTheme();

  useEffect(() => {
    fetchCases().then((data) => { setCases(data); setLoading(false); });
  }, []);

  const types = useMemo(() => [...new Set(cases.map((c) => c.decision_type))], [cases]);
  const jurisdictions = useMemo(() => [...new Set(cases.map((c) => c.jurisdiction))], [cases]);
  const tiers = useMemo(() => [...new Set(cases.map((c) => c.computed.tier))], [cases]);

  const filtered = useMemo(() => {
    let result = [...cases];
    if (filters.type) result = result.filter((c) => c.decision_type === filters.type);
    if (filters.jurisdiction) result = result.filter((c) => c.jurisdiction === filters.jurisdiction);
    if (filters.tier) result = result.filter((c) => c.computed.tier === filters.tier);
    if (sort === "date") result.sort((a, b) => b.date.localeCompare(a.date));
    else result.sort((a, b) => b.computed.EDI - a.computed.EDI);
    return result;
  }, [cases, filters, sort]);

  const stats = useMemo(() => {
    const total = cases.length;
    const avgEDI = total > 0 ? cases.reduce((s, c) => s + c.computed.EDI, 0) / total : 0;
    const byTier = cases.reduce((acc, c) => {
      acc[c.computed.tier] = (acc[c.computed.tier] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, avgEDI, byTier };
  }, [cases]);

  const selectClass = "bg-transparent border rounded-sm px-2 py-1 text-xs appearance-none cursor-pointer";
  const selectStyle = {
    borderColor: "var(--verdict-border)",
    color: "var(--verdict-muted)",
    backgroundColor: "var(--verdict-surface)",
  };

  return (
    <div>
      {/* Cover sheet */}
      <div className="mb-10">
        <PaperHeader
          series="Working Paper Series, No. 02.1"
          meta="Updated weekly"
          color="var(--verdict-accent)"
          ink="var(--verdict-text)"
          muted="var(--verdict-muted)"
          rule="var(--verdict-border)"
          title="The Verdict"
          byline="An index of AI regulation, scored case by case."
          keywords={
            !loading && cases.length > 0 ? (
              <>
                {stats.total} cases, average EDI {stats.avgEDI.toFixed(2)}.{" "}
                {Object.entries(stats.byTier)
                  .map(([tier, count]) => `${tier} ${count}`)
                  .join(", ")}
                .
              </>
            ) : undefined
          }
          abstract={
            <p>
              An index of AI-related court rulings, regulatory decisions and
              major corporate actions. Each case is scored on five factors to
              produce an Enforcement-Driven Index (EDI). The scoring framework
              is documented in full, and scores are normalised across the whole
              database, so they shift as cases are added. The EDI is built for
              comparing jurisdictions: it ranks decisions by consequence rather
              than by press coverage.
            </p>
          }
        />
      </div>

      {/* Map — plain SVG, light enough to render inline (no load-on-demand needed) */}
      {!loading && cases.length > 0 && (
        <div
          className="rounded-sm border p-4 mb-8"
          style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
        >
          <div className="text-xs mb-3" style={{ color: "var(--verdict-muted)" }}>
            Global distribution. Click a point to open its case.
          </div>
          <ErrorBoundary
            fallback={
              <div className="h-80 flex flex-col items-center justify-center gap-2 rounded text-center px-4" style={{ backgroundColor: "var(--verdict-surface-2)", color: "var(--verdict-muted)" }}>
                <span className="text-xs">The map couldn’t load in this browser.</span>
                <span className="text-xs">All cases are available in the timeline and list below.</span>
              </div>
            }
          >
            <VerdictMap cases={filtered} />
          </ErrorBoundary>
        </div>
      )}

      {/* Timeline */}
      {!loading && cases.length > 0 && (
        <div
          className="rounded-sm border p-4 mb-8 mt-12"
          style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
        >
          <div className="text-xs mb-3" style={{ color: "var(--verdict-muted)" }}>
            Timeline: EDI by date
          </div>
          <CompactTimeline cases={filtered} />
        </div>
      )}

      {/* Filters + Sort */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filters.jurisdiction}
          onChange={(e) => setFilters((f) => ({ ...f, jurisdiction: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All jurisdictions</option>
          {jurisdictions.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>

        <select
          value={filters.tier}
          onChange={(e) => setFilters((f) => ({ ...f, tier: e.target.value }))}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">All tiers</option>
          {tiers.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-1">
          {(["date", "edi"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="px-2.5 py-1 rounded text-xs transition-colors duration-150"
              style={{
                color: sort === s ? "var(--verdict-accent)" : "var(--verdict-muted)",
                backgroundColor: sort === s ? "var(--verdict-accent-dim)" : "transparent",
                border: `1px solid ${sort === s ? "var(--verdict-accent)" : "var(--verdict-border)"}`,
              }}
            >
              {s === "date" ? "By date" : "By EDI"}
            </button>
          ))}
        </div>
      </div>

      {/* Cases */}
      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: "var(--verdict-muted)" }}>
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm" style={{ color: "var(--verdict-muted)" }}>
          No cases match the current filters.
        </div>
      ) : (
        <div className="border-t" style={{ borderColor: "var(--verdict-border)" }}>
          {filtered.map((c) => <CaseCard key={c.case_id} c={c} />)}
        </div>
      )}

      {/* Cross-links */}
      <div
        className="mt-16 pt-8 border-t text-sm"
        style={{ borderColor: "var(--verdict-border)", color: "var(--verdict-muted)" }}
      >
        <p className="mb-2">Related work:</p>
        <div className="flex flex-wrap gap-4">
          <a href="/mini/observatory" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
            The Observatory — how AI adoption flows through to prices and wages
          </a>
          <a href="/others/access-to-justice-the-gap-nobody-measures" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
            Access to Justice — The Gap Nobody Measures
          </a>
          <a href="/why" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
            Why this question
          </a>
        </div>
      </div>
    </div>
  );
}
