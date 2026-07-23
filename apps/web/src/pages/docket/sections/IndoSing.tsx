import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Section, Card, Details, Caption, useChartTheme } from "../shared";
import { useDocketTheme } from "../DocketLayout";
import { comparisonData, delaysCost } from "../model";

export default function IndoSing() {
  const { theme } = useDocketTheme();
  const ct = useChartTheme(theme);
  const [selected, setSelected] = useState<number>(0);

  const selectedRow = comparisonData[selected];

  // Chart data: India vs Singapore scores
  const chartData = comparisonData.map((r) => ({
    name: r.dimension.length > 22 ? r.dimension.slice(0, 22) + "…" : r.dimension,
    India: r.indiaRaw,
    Singapore: r.singaporeRaw,
  }));

  return (
    <Section
      id="indosing"
      eyebrow="Chapter 4 · The Docket"
      title="India vs Singapore: the digital court gap"
    >
      <p className="text-sm sm:text-base mb-6 max-w-2xl" style={{ color: "var(--docket-muted)" }}>
        I'm an Indian student in Singapore. The legal systems share a common law heritage — both
        inherited from British rule. The infrastructure gap between them is not about legal culture;
        it is about what both systems have chosen to build in the last 25 years.
      </p>
      <p className="text-sm sm:text-base mb-8 max-w-2xl" style={{ color: "var(--docket-muted)" }}>
        Singapore built a unified digital court infrastructure starting in 2000: eLitigation for
        online filing and tracking, Singpass for identity, and automated hearing notifications. India
        launched eCourts in 2007 but implementation remains fragmented by state. The ten dimensions
        below show where the gap is widest.
      </p>

      {/* Bar chart comparison */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--docket-text)" }}>
          Digital justice score (0 = none, 100 = full deployment)
        </h3>
        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 140 }}
            >
              <XAxis type="number" domain={[0, 100]} tick={ct.tick} />
              <YAxis type="category" dataKey="name" tick={{ ...ct.tick, fontSize: 9.5 }} width={138} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#121e12" : "#fff",
                  border: "1px solid var(--docket-border)",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "var(--docket-text)",
                }}
              />
              <Bar dataKey="India" name="India" radius={[0, 3, 3, 0]} maxBarSize={10}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--docket-high)" fillOpacity={0.75} />
                ))}
              </Bar>
              <Bar dataKey="Singapore" name="Singapore" radius={[0, 3, 3, 0]} maxBarSize={10}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--docket-accent)" fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Caption>
          Scores are qualitative indices constructed from official reports (see methods). India's
          scores reflect national average; performance varies significantly by state.
        </Caption>
      </div>

      {/* Detail cards — click to expand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div>
          <div className="text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--docket-muted)" }}>
            Select a dimension
          </div>
          <div className="flex flex-col gap-1">
            {comparisonData.map((row, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className="text-left px-3 py-2 rounded-lg border text-xs transition-all"
                style={{
                  borderColor: selected === i ? "var(--docket-accent)" : "var(--docket-border)",
                  backgroundColor: selected === i ? "var(--docket-accent-dim)" : "var(--docket-surface)",
                  color: selected === i ? "var(--docket-accent)" : "var(--docket-text)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{row.dimension}</span>
                  <span
                    className="font-mono shrink-0"
                    style={{
                      color:
                        row.indiaRaw < 20
                          ? "var(--docket-crit)"
                          : row.indiaRaw < 40
                          ? "var(--docket-high)"
                          : "var(--docket-mod)",
                    }}
                  >
                    {row.indiaRaw}/100
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <div className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: "var(--docket-accent)" }}>
              {selectedRow.dimension}
            </div>

            <div className="space-y-3 mb-4">
              {[
                { label: "India", val: selectedRow.india, score: selectedRow.indiaRaw, color: "var(--docket-high)" },
                { label: "Singapore", val: selectedRow.singapore, score: selectedRow.singaporeRaw, color: "var(--docket-accent)" },
              ].map(({ label, val, score, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--docket-muted)" }}>{label}</span>
                    <span className="font-mono" style={{ color }}>{score}/100</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden mb-1"
                    style={{ backgroundColor: "var(--docket-surface-2)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${score}%`, backgroundColor: color, opacity: 0.85 }}
                    />
                  </div>
                  <div className="text-xs" style={{ color: "var(--docket-text)" }}>
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {selectedRow.note && (
              <div
                className="rounded px-3 py-2 text-xs leading-relaxed"
                style={{ backgroundColor: "var(--docket-surface-2)", color: "var(--docket-muted)" }}
              >
                {selectedRow.note}
              </div>
            )}
          </Card>

          {/* Cross-cutting argument */}
          <Card>
            <div className="text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--docket-muted)" }}>
              The gap in one sentence
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--docket-text)" }}>
              Singapore treats a court case the way UPS treats a parcel: every event is logged,
              every status visible, every notification automated. India still runs most courts as if
              the parcel exists only when you physically go to the warehouse and ask.
            </p>
          </Card>
        </div>
      </div>

      {/* Cost of delays */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--docket-text)" }}>
          Economic and social cost of delays
        </h3>
        <div className="flex flex-col gap-2">
          {delaysCost.map((row) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border rounded-lg px-4 py-3 text-sm"
              style={{ borderColor: "var(--docket-border)", backgroundColor: "var(--docket-surface)" }}
            >
              <div className="flex-1 font-medium" style={{ color: "var(--docket-text)" }}>
                {row.label}
              </div>
              <div className="shrink-0 font-mono text-xs" style={{ color: "var(--docket-crit)" }}>
                {row.cost}
              </div>
              <div className="shrink-0 text-xs" style={{ color: "var(--docket-muted)" }}>
                {row.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What India could adopt */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--docket-text)" }}>
          Three things India could adopt from Singapore, in order of feasibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              rank: "1",
              title: "Standardised case IDs across courts",
              effort: "Low-effort, high-impact",
              body: "A national standard for case identifiers — one alphanumeric schema that works across all district and high courts. Currently each state uses its own format, making transfer and tracking impossible. No new technology required; only a policy mandate from the Department of Justice.",
              effortColor: "var(--docket-low)",
            },
            {
              rank: "2",
              title: "Mandatory digital cause lists + SMS notification",
              effort: "Medium-effort",
              body: "Publish tomorrow's cause list as a machine-readable file 24 hours before each session, and send an SMS to registered parties. Singapore has done this since 2013. India's eCourts CMS already generates cause lists; the gap is the last-mile delivery to parties.",
              effortColor: "var(--docket-mod)",
            },
            {
              rank: "3",
              title: "Unified Aadhaar-linked court login",
              effort: "Complex, high payoff",
              body: "Extend Aadhaar / DigiLocker as a universal identity for court access — filing, tracking, and accessing judgments — across all courts. Singpass does this for all Singapore government services including courts. India has the identity infrastructure; the gap is integration and political will.",
              effortColor: "var(--docket-high)",
            },
          ].map(({ rank, title, effort, body, effortColor }) => (
            <Card key={rank}>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold font-mono shrink-0"
                  style={{ backgroundColor: "var(--docket-accent-dim)", color: "var(--docket-accent)" }}
                >
                  {rank}
                </div>
                <div>
                  <div className="font-medium text-sm leading-snug" style={{ color: "var(--docket-text)" }}>
                    {title}
                  </div>
                  <div className="text-xs mt-0.5 font-mono" style={{ color: effortColor }}>
                    {effort}
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--docket-muted)" }}>
                {body}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <Details summary="Singapore data sources">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Singapore Judiciary: <em>Statistics 2023</em> — caseload, disposal rates, court levels</li>
          <li>eLitigation: <em>Annual Report 2023</em> — e-filing rates, system usage</li>
          <li>Ministry of Law Singapore: Digitalisation of legal services reports</li>
          <li>Ministry of Manpower / Singapore Statutes: judge per capita calculation uses 2023 census data</li>
        </ul>
        <p className="mt-2 text-xs" style={{ color: "var(--docket-muted)" }}>
          Comparison scores are constructed indices, not official rankings. India figures represent
          national averages; individual state systems (e.g. Delhi, Tamil Nadu) perform better than
          the mean on some dimensions.
        </p>
      </Details>
    </Section>
  );
}
