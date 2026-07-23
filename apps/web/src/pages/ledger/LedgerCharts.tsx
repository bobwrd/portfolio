import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";
import { useLedgerTheme } from "./LedgerLayout";
import { fetchActions, severityColor, type LedgerAction } from "./types";

const VIOLATION_COLORS: Record<string, string> = {
  "AML-CFT": "var(--ledger-sev-2)",
  "market abuse": "var(--ledger-sev-3)",
  "fraud/dishonesty": "var(--ledger-sev-1)",
  "conduct/mis-selling": "var(--ledger-sev-4)",
  "disclosure/reporting": "var(--ledger-accent)",
  "licensing breach": "var(--ledger-sev-5)",
  "other": "var(--ledger-muted)",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-5 mb-8" style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}>
      <div className="text-xs font-mono mb-4 uppercase tracking-wider" style={{ color: "var(--ledger-muted)" }}>{title}</div>
      {children}
    </div>
  );
}

export default function LedgerCharts() {
  const [actions, setActions] = useState<LedgerAction[]>([]);
  const { theme } = useLedgerTheme();

  useEffect(() => { fetchActions().then(setActions); }, []);

  const byYear = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of actions) {
      const y = a.date_published.slice(0, 4);
      m[y] = (m[y] ?? 0) + (a.penalty_amount_sgd ?? 0);
    }
    return Object.entries(m).map(([year, total]) => ({ year, total: total / 1_000_000 })).sort((a, b) => a.year.localeCompare(b.year));
  }, [actions]);

  const byViolation = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of actions) m[a.violation_category] = (m[a.violation_category] ?? 0) + 1;
    return Object.entries(m).map(([violation, count]) => ({ violation, count })).sort((a, b) => b.count - a.count);
  }, [actions]);

  const byActionType = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of actions) m[a.action_type] = (m[a.action_type] ?? 0) + 1;
    return Object.entries(m).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
  }, [actions]);

  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#211c16" : "#fff",
    border: "1px solid var(--ledger-border)",
    borderRadius: 6,
    fontFamily: "monospace",
    fontSize: 12,
    color: "var(--ledger-text)",
  };
  const tick = { fill: "var(--ledger-muted)", fontSize: 10, fontFamily: "monospace" };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--ledger-text)" }}>Charts</h1>
      <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "var(--ledger-muted)" }}>
        Aggregate views over the coded actions. Penalty totals are dominated by a few large cases (the 1MDB-era bank
        penalties and the 2020 Goldman Sachs payment), so read totals alongside action counts.
      </p>

      <ChartCard title="Total monetary penalties by year (S$ millions)">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byYear} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ledger-border)" vertical={false} />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} />
              <YAxis tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} tickFormatter={(v) => `${v}m`} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--ledger-accent-dim)" }} formatter={(v) => [`S$${Number(v).toFixed(2)}m`, "penalties"]} />
              <Bar dataKey="total" fill="var(--ledger-accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Actions by violation category">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byViolation} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ledger-border)" horizontal={false} />
              <XAxis type="number" tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="violation" tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--ledger-accent-dim)" }} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                {byViolation.map((d, i) => <Cell key={i} fill={VIOLATION_COLORS[d.violation] ?? "var(--ledger-muted)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Actions by enforcement instrument">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byActionType} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ledger-border)" horizontal={false} />
              <XAxis type="number" tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="type" tick={tick} axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} width={120} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--ledger-accent-dim)" }} />
              <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                {byActionType.map((d, i) => <Cell key={i} fill={severityColor(d.type)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
