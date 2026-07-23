import { useState, useEffect, useMemo } from "react";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useLedgerTheme } from "./LedgerLayout";
import { fetchActions, severityColor, formatSGD, fmtDate, type LedgerAction } from "./types";

function SeverityDot({ actionType }: { actionType: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: severityColor(actionType) }}
    />
  );
}

function PenaltyTimeline({ actions }: { actions: LedgerAction[] }) {
  const { theme } = useLedgerTheme();

  const data = actions
    .filter((a) => a.penalty_amount_sgd && a.penalty_amount_sgd > 0)
    .map((a) => ({
      x: new Date(a.date_published).getTime(),
      y: (a.penalty_amount_sgd as number) / 1_000_000,
      label: a.respondents.map((r) => r.name).join(", "),
      type: a.action_type,
      id: a.action_id,
    }));

  const monthTicks = useMemo(() => {
    if (data.length === 0) return [] as number[];
    const min = Math.min(...data.map((d) => d.x));
    const max = Math.max(...data.map((d) => d.x));
    const ticks: number[] = [];
    const cursor = new Date(min);
    cursor.setUTCMonth(0, 1);
    cursor.setUTCHours(0, 0, 0, 0);
    while (cursor.getTime() <= max) {
      ticks.push(cursor.getTime());
      cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
    }
    return ticks;
  }, [data]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0] }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded border p-3 text-xs font-mono max-w-[220px]"
        style={{
          backgroundColor: theme === "dark" ? "#211c16" : "#fff",
          borderColor: "var(--ledger-border)",
          color: "var(--ledger-text)",
        }}
      >
        <div className="font-bold mb-1 leading-snug" style={{ color: "var(--ledger-accent)" }}>{d.label}</div>
        <div style={{ color: "var(--ledger-muted)" }}>{d.type}</div>
        <div>S${d.y.toFixed(2)}m</div>
        <div style={{ color: "var(--ledger-muted)" }}>
          {new Date(d.x).toLocaleDateString("en-SG", { year: "numeric", month: "short", timeZone: "UTC" })}
        </div>
      </div>
    );
  };

  if (data.length === 0) return null;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 36 }}>
          <XAxis
            dataKey="x" type="number" domain={["auto", "auto"]} ticks={monthTicks}
            tickFormatter={(v) => new Date(v).getUTCFullYear().toString()}
            tick={{ fill: "var(--ledger-muted)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false} scale="time"
          />
          <YAxis
            dataKey="y" type="number"
            tickFormatter={(v) => `${v}m`}
            tick={{ fill: "var(--ledger-muted)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={{ stroke: "var(--ledger-border)" }} tickLine={false}
          />
          <ZAxis range={[40, 40]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "var(--ledger-border)" }} />
          <Scatter data={data}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={severityColor(entry.type)} fillOpacity={0.85} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

type SortKey = "date" | "penalty";
type FilterState = { action: string; violation: string; respondent: string };

export default function LedgerIndex() {
  const [actions, setActions] = useState<LedgerAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("date");
  const [filters, setFilters] = useState<FilterState>({ action: "", violation: "", respondent: "" });
  const { theme } = useLedgerTheme();

  useEffect(() => {
    fetchActions().then((data) => { setActions(data); setLoading(false); });
  }, []);

  const actionTypes = useMemo(() => [...new Set(actions.map((a) => a.action_type))].sort(), [actions]);
  const violations = useMemo(() => [...new Set(actions.map((a) => a.violation_category))].sort(), [actions]);
  const respondentTypes = useMemo(() => [...new Set(actions.map((a) => a.respondent_type))].sort(), [actions]);

  const filtered = useMemo(() => {
    let result = [...actions];
    if (filters.action) result = result.filter((a) => a.action_type === filters.action);
    if (filters.violation) result = result.filter((a) => a.violation_category === filters.violation);
    if (filters.respondent) result = result.filter((a) => a.respondent_type === filters.respondent);
    if (sort === "date") result.sort((a, b) => b.date_published.localeCompare(a.date_published));
    else result.sort((a, b) => (b.penalty_amount_sgd ?? -1) - (a.penalty_amount_sgd ?? -1));
    return result;
  }, [actions, filters, sort]);

  const stats = useMemo(() => {
    const total = actions.length;
    const totalPenalty = actions.reduce((s, a) => s + (a.penalty_amount_sgd ?? 0), 0);
    const indiv = actions.filter((a) => a.respondent_type !== "FI").length;
    const years = actions.map((a) => a.date_published.slice(0, 4)).filter(Boolean);
    const span = years.length ? `${Math.min(...years.map(Number))}–${Math.max(...years.map(Number))}` : "—";
    return { total, totalPenalty, indiv, span };
  }, [actions]);

  const selectClass = "bg-transparent border rounded px-2 py-1 text-xs font-mono appearance-none cursor-pointer";
  const selectStyle = {
    borderColor: "var(--ledger-border)",
    color: "var(--ledger-muted)",
    backgroundColor: "var(--ledger-surface)",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--ledger-text)" }}>
          The Ledger
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--ledger-muted)" }}>
          A hand-built database of formal enforcement actions taken by the Monetary Authority of Singapore —
          penalties, prohibition orders, criminal referrals, and licence revocations, coded by sector, violation
          category, statute, and penalty size. Built from MAS's own notices; all entries are citable and auditable.
          The structure is what makes it novel: it surfaces patterns over time in who gets penalised for what —
          analysis that is not possible from the raw press releases. Coverage is a curated set, not yet the full
          register.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && actions.length > 0 && (
        <div
          className="flex items-center gap-6 flex-wrap rounded-lg border p-4 mb-8 text-xs font-mono"
          style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}
        >
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--ledger-accent)" }}>{stats.total}</div>
            <div style={{ color: "var(--ledger-muted)" }}>actions</div>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: "var(--ledger-border)" }} />
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--ledger-accent)" }}>{formatSGD(stats.totalPenalty)}</div>
            <div style={{ color: "var(--ledger-muted)" }}>total penalties</div>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: "var(--ledger-border)" }} />
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--ledger-accent)" }}>{stats.indiv}</div>
            <div style={{ color: "var(--ledger-muted)" }}>against individuals</div>
          </div>
          <div className="w-px h-8 self-center" style={{ backgroundColor: "var(--ledger-border)" }} />
          <div>
            <div className="text-lg font-bold" style={{ color: "var(--ledger-accent)" }}>{stats.span}</div>
            <div style={{ color: "var(--ledger-muted)" }}>coverage</div>
          </div>
        </div>
      )}

      {/* Penalty timeline */}
      {!loading && actions.length > 0 && (
        <div
          className="rounded-lg border p-4 mb-8"
          style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}
        >
          <div className="text-xs font-mono mb-3" style={{ color: "var(--ledger-muted)" }}>
            MONETARY PENALTIES OVER TIME (S$ millions, log-free scale)
          </div>
          <PenaltyTimeline actions={filtered} />
        </div>
      )}

      {/* Download buttons */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { href: "/api/ledger/download/json", label: "JSON", sub: "full nested dataset" },
          { href: "/api/ledger/download/csv", label: "CSV", sub: "flat, one row per respondent" },
          { href: "/api/ledger/download/codebook", label: "Codebook", sub: "full data dictionary" },
        ].map(({ href, label, sub }) => (
          <a
            key={label}
            href={href} download
            className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
            style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ledger-accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--ledger-border)")}
          >
            <Download className="h-4 w-4 shrink-0" style={{ color: "var(--ledger-accent)" }} />
            <div>
              <div className="text-sm font-mono" style={{ color: "var(--ledger-text)" }}>{label}</div>
              <div className="text-[0.65rem] font-mono" style={{ color: "var(--ledger-muted)" }}>{sub}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <select value={filters.action} onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))} className={selectClass} style={selectStyle}>
          <option value="">All action types</option>
          {actionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.violation} onChange={(e) => setFilters((f) => ({ ...f, violation: e.target.value }))} className={selectClass} style={selectStyle}>
          <option value="">All violations</option>
          {violations.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.respondent} onChange={(e) => setFilters((f) => ({ ...f, respondent: e.target.value }))} className={selectClass} style={selectStyle}>
          <option value="">All respondents</option>
          {respondentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1">
          {(["date", "penalty"] as SortKey[]).map((s) => (
            <button
              key={s} onClick={() => setSort(s)}
              className="px-2.5 py-1 rounded text-xs font-mono transition-colors duration-150"
              style={{
                color: sort === s ? "var(--ledger-accent)" : "var(--ledger-muted)",
                backgroundColor: sort === s ? "var(--ledger-accent-dim)" : "transparent",
                border: `1px solid ${sort === s ? "var(--ledger-accent)" : "var(--ledger-border)"}`,
              }}
            >
              {s === "date" ? "By date" : "By penalty"}
            </button>
          ))}
        </div>
      </div>

      {/* Register table */}
      {loading ? (
        <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--ledger-muted)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--ledger-muted)" }}>No actions match the current filters.</div>
      ) : (
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}
        >
          {/* header row */}
          <div
            className="hidden sm:grid grid-cols-[88px_1fr_140px_120px_90px] gap-3 px-4 py-2.5 text-[0.65rem] font-mono uppercase tracking-wider border-b"
            style={{ color: "var(--ledger-muted)", borderColor: "var(--ledger-border)" }}
          >
            <span>Date</span><span>Respondent</span><span>Action</span><span>Violation</span><span className="text-right">Penalty</span>
          </div>
          {filtered.map((a) => (
            <Link
              key={a.action_id}
              to={`/ledger/${a.action_id}`}
              className="grid grid-cols-1 sm:grid-cols-[88px_1fr_140px_120px_90px] gap-1 sm:gap-3 px-4 py-3 border-b last:border-b-0 transition-colors group"
              style={{ borderColor: "var(--ledger-border)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ledger-surface-2)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <span className="text-xs font-mono whitespace-nowrap" style={{ color: "var(--ledger-muted)" }}>
                {fmtDate(a.date_published)}
              </span>
              <span className="text-sm leading-snug flex items-start gap-2" style={{ color: "var(--ledger-text)" }}>
                <SeverityDot actionType={a.action_type} />
                <span>
                  {a.respondents.map((r) => r.name).join(", ")}
                  {a.repeat_offender && (
                    <span className="ml-1.5 text-[0.6rem] font-mono align-middle px-1 py-0.5 rounded" style={{ color: "var(--ledger-sev-1)", border: "1px solid var(--ledger-sev-1)" }}>
                      repeat
                    </span>
                  )}
                </span>
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--ledger-muted)" }}>{a.action_type}</span>
              <span className="text-xs font-mono" style={{ color: "var(--ledger-muted)" }}>{a.violation_category}</span>
              <span className="text-sm font-mono font-bold text-left sm:text-right" style={{ color: a.penalty_amount_sgd ? "var(--ledger-accent)" : "var(--ledger-muted)" }}>
                {formatSGD(a.penalty_amount_sgd)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
