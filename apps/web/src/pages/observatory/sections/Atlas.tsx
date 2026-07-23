import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, Legend,
} from "recharts";
import { Section, Card, Caption, Details } from "../shared";
import { useObservatoryTheme } from "../ObservatoryLayout";
import { annualGrowth, type ObservatoryData, type Point } from "../types";
import { useChartTheme } from "../shared";

const RANGES = [
  { label: "Since 2000", year: 2000 },
  { label: "Since 2010", year: 2010 },
  { label: "Since 2018", year: 2018 },
];

function yearOf(date: string) {
  return parseInt(date.slice(0, 4), 10);
}

// Merge multiple named series on their date key for a multi-line chart.
function mergeSeries(named: { key: string; points: Point[] }[], startYear: number) {
  const map = new Map<string, Record<string, number | string>>();
  for (const { key, points } of named) {
    for (const p of points) {
      if (yearOf(p.date) < startYear) continue;
      const row = map.get(p.date) ?? { date: p.date };
      row[key] = p.value;
      map.set(p.date, row);
    }
  }
  return Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export default function Atlas({
  data,
  country,
  setCountry,
}: {
  data: ObservatoryData | null;
  country: string;
  setCountry: (c: string) => void;
}) {
  const { theme } = useObservatoryTheme();
  const ct = useChartTheme(theme);
  const [startYear, setStartYear] = useState(2000);

  const series = data?.series[country];
  const cName = data?.country_names[country] ?? country;
  const enriched = Boolean(data?.fred_enriched);

  // Reference lines for AI milestones, matched to the chart's date granularity.
  const events = data?.ai_events ?? [];

  // ---- Panel A: prices ----
  const priceData = useMemo(() => {
    if (!series) return [];
    if (enriched && series.headline_cpi_yoy?.length) {
      return mergeSeries(
        [
          { key: "headline", points: series.headline_cpi_yoy },
          { key: "core", points: series.core_cpi_yoy ?? [] },
          { key: "corePce", points: series.core_pce_yoy ?? [] },
          { key: "software", points: series.software_ppi ?? [] },
        ],
        startYear
      );
    }
    return mergeSeries([{ key: "headline", points: series.annual_inflation }], startYear);
  }, [series, enriched, startYear]);

  const priceMonthly = enriched && Boolean(series?.headline_cpi_yoy?.length);

  // ---- Panel B: investment & labour ----
  const investData = useMemo(() => {
    if (!series) return [];
    const named: { key: string; points: Point[] }[] = [];
    if (series.it_investment?.length) named.push({ key: "itInvest", points: series.it_investment });
    if (series.info_employment?.length) named.push({ key: "infoEmp", points: series.info_employment });
    if (!named.length) named.push({ key: "productivity", points: series.gdp_per_worker });
    return mergeSeries(named, startYear);
  }, [series, startYear]);

  const hasInvestDetail = Boolean(series?.it_investment?.length || series?.info_employment?.length);

  // ---- Panel C: distribution ----
  const wageData = useMemo(() => {
    if (!series?.real_median_earnings?.length) return [];
    return mergeSeries([{ key: "realEarnings", points: series.real_median_earnings }], startYear);
  }, [series, startYear]);

  function eventLines(monthly: boolean) {
    return events.map((e) => {
      const x = monthly ? e.date : e.date.slice(0, 4);
      return (
        <ReferenceLine
          key={e.date}
          x={x}
          stroke="var(--obs-accent-2)"
          strokeDasharray="3 3"
          strokeOpacity={0.7}
          label={{ value: e.label, position: "insideTopRight", fontSize: 9, fill: "var(--obs-accent-2)", angle: 0 }}
        />
      );
    });
  }

  return (
    <Section id="atlas" eyebrow="2 · Data atlas" title="What the real series are doing">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--obs-text)" }}>
        Live data for the variables that would move if the channels above were active. Pick a country and a
        time window. US monthly detail (core CPI, core PCE, IT investment, sector employment) appears once a
        FRED key is connected; the World Bank baseline is always here.
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {(data?.countries ?? []).map((c) => {
            const on = c === country;
            return (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className="rounded-md px-2.5 py-1 text-xs font-mono border transition-colors"
                style={{
                  borderColor: on ? "var(--obs-accent)" : "var(--obs-border)",
                  color: on ? "var(--obs-accent)" : "var(--obs-muted)",
                  backgroundColor: on ? "var(--obs-accent-dim)" : "transparent",
                }}
              >
                {data?.country_names[c] ?? c}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5 ml-auto">
          {RANGES.map((r) => {
            const on = r.year === startYear;
            return (
              <button
                key={r.year}
                onClick={() => setStartYear(r.year)}
                className="rounded-md px-2.5 py-1 text-xs font-mono border transition-colors"
                style={{
                  borderColor: on ? "var(--obs-accent)" : "var(--obs-border)",
                  color: on ? "var(--obs-accent)" : "var(--obs-muted)",
                  backgroundColor: on ? "var(--obs-accent-dim)" : "transparent",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Panel A */}
        <Card title={`Prices — ${cName}`} className="lg:col-span-2">
          <p className="text-[0.65rem] font-mono uppercase tracking-wider mb-4 inline-block px-2 py-0.5 rounded" style={{ color: "var(--obs-accent)", backgroundColor: "var(--obs-accent-dim)" }}>
            Cost channel · Relative-price channel
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ top: 8, right: 24, bottom: 4, left: -6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                <XAxis dataKey="date" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} minTickGap={28} />
                <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={ct.tooltip} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
                {priceMonthly && eventLines(true)}
                <Line type="monotone" dataKey="headline" name={priceMonthly ? "Headline CPI (YoY)" : "Inflation (annual %)"} stroke="var(--obs-c1)" strokeWidth={2.2} dot={false} connectNulls />
                {priceMonthly && <Line type="monotone" dataKey="core" name="Core CPI (YoY)" stroke="var(--obs-c2)" strokeWidth={2} dot={false} connectNulls />}
                {priceMonthly && <Line type="monotone" dataKey="corePce" name="Core PCE (YoY)" stroke="var(--obs-c3)" strokeWidth={2} dot={false} connectNulls />}
                {priceMonthly && <Line type="monotone" dataKey="software" name="Software prices (YoY)" stroke="var(--obs-c5)" strokeWidth={1.6} strokeDasharray="4 3" dot={false} connectNulls />}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Caption>
            {priceMonthly
              ? "Year-over-year inflation by measure. Dashed vertical lines mark AI milestones. Core strips out food and energy; PCE is the Fed's preferred gauge."
              : "Annual headline inflation (World Bank). Connect a FRED key to switch this panel to monthly US headline vs core CPI and core PCE, with AI milestone markers."}
          </Caption>
        </Card>

        {/* Panel B */}
        <Card title={hasInvestDetail ? `Investment & tech labour — ${cName}` : `Productivity — ${cName}`}>
          <p className="text-[0.65rem] font-mono uppercase tracking-wider mb-4 inline-block px-2 py-0.5 rounded" style={{ color: "var(--obs-accent)", backgroundColor: "var(--obs-accent-dim)" }}>
            Adoption channel · Demand channel
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investData} margin={{ top: 8, right: 20, bottom: 4, left: -6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                <XAxis dataKey="date" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} minTickGap={28} />
                <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={ct.tooltip} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
                {hasInvestDetail ? (
                  <>
                    <Line type="monotone" dataKey="itInvest" name="Info-processing investment ($bn)" stroke="var(--obs-c1)" strokeWidth={2.2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="infoEmp" name="Information-sector jobs (000s)" stroke="var(--obs-c3)" strokeWidth={2} dot={false} connectNulls />
                  </>
                ) : (
                  <Line type="monotone" dataKey="productivity" name="GDP per person employed (PPP$)" stroke="var(--obs-c1)" strokeWidth={2.2} dot={false} connectNulls />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Caption>
            {hasInvestDetail
              ? "The AI build-out as investment and tech employment (FRED, US)."
              : "Level of labour productivity (World Bank). IT-investment and information-sector employment detail appears for the US once FRED is connected."}
          </Caption>
        </Card>

        {/* Panel C */}
        <Card title={`Distribution & wages — ${cName}`}>
          <p className="text-[0.65rem] font-mono uppercase tracking-wider mb-4 inline-block px-2 py-0.5 rounded" style={{ color: "var(--obs-accent)", backgroundColor: "var(--obs-accent-dim)" }}>
            Who gets the gains · Wages vs profits · Across groups
          </p>
          <div className="h-64 w-full">
            {wageData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wageData} margin={{ top: 8, right: 20, bottom: 4, left: -6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
                  <XAxis dataKey="date" tick={ct.tick} axisLine={{ stroke: ct.grid }} tickLine={false} minTickGap={28} />
                  <YAxis tick={ct.tick} axisLine={false} tickLine={false} width={44} />
                  <Tooltip contentStyle={ct.tooltip} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "ui-monospace, monospace" }} />
                  <Line type="monotone" dataKey="realEarnings" name="Real median weekly earnings ($)" stroke="var(--obs-c4)" strokeWidth={2.2} dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-center px-6">
                <p className="text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
                  Wage-by-group data isn't available for {cName} from the keyless sources. For the US, real median
                  earnings load here once a FRED key is connected. Decile-level wage series generally need
                  national statistical offices and aren't wired in yet.
                </p>
              </div>
            )}
          </div>
          <Caption>Where AI gains land between wages and profits, and across skill groups, is the distributional question Panel C is meant to track.</Caption>
        </Card>
      </div>

      <Details summary="Details · data freshness & coverage">
        <p>
          Baseline data is World Bank (annual, all listed countries). US monthly/quarterly enrichment is FRED and
          appears when a key is configured. Data is fetched on a weekly schedule and baked into the build, so the
          atlas is fast and works offline of the source APIs. Last generated:{" "}
          <span className="font-mono">{data?.generated ?? "—"}</span>; FRED enrichment:{" "}
          <span className="font-mono">{enriched ? "on" : "off"}</span>.
        </p>
      </Details>
    </Section>
  );
}
