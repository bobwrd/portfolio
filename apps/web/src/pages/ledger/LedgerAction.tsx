import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAction, severityColor, formatSGD, fmtDate, type LedgerAction } from "./types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--ledger-muted)" }}>{label}</div>
      <div className="text-sm" style={{ color: "var(--ledger-text)" }}>{children}</div>
    </div>
  );
}

export default function LedgerActionPage() {
  const { id } = useParams();
  const [action, setAction] = useState<LedgerAction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAction(parseInt(id, 10)).then((a) => { setAction(a); setLoading(false); });
  }, [id]);

  if (loading) return <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--ledger-muted)" }}>Loading…</div>;
  if (!action) return (
    <div className="py-16 text-center text-sm font-mono" style={{ color: "var(--ledger-muted)" }}>
      Action not found. <Link to="/mini/ledger" style={{ color: "var(--ledger-accent)" }}>Back to register →</Link>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <Link to="/mini/ledger" className="text-xs font-mono opacity-60 hover:opacity-100 transition-opacity" style={{ color: "var(--ledger-muted)" }}>
        ← Register
      </Link>

      {/* Header */}
      <div className="mt-4 mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[0.65rem] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase"
            style={{ color: severityColor(action.action_type), border: `1px solid ${severityColor(action.action_type)}` }}
          >
            {action.action_type}
          </span>
          <span className="text-[0.65rem] font-mono tracking-wider uppercase px-2 py-0.5 rounded" style={{ color: "var(--ledger-muted)", backgroundColor: "var(--ledger-surface-2)" }}>
            {action.violation_category}
          </span>
          {action.repeat_offender && (
            <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded" style={{ color: "var(--ledger-sev-1)", border: "1px solid var(--ledger-sev-1)" }}>repeat offender</span>
          )}
        </div>
        {action.penalty_amount_sgd != null && (
          <div className="text-right shrink-0">
            <div className="text-2xl font-mono font-bold" style={{ color: "var(--ledger-accent)" }}>{formatSGD(action.penalty_amount_sgd)}</div>
            <div className="text-[0.6rem] font-mono" style={{ color: "var(--ledger-muted)" }}>penalty</div>
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold leading-snug mb-1" style={{ color: "var(--ledger-text)" }}>
        {action.respondents.map((r) => r.name).join(", ")}
      </h1>
      <div className="text-xs font-mono mb-6" style={{ color: "var(--ledger-muted)" }}>{fmtDate(action.date_published)}</div>

      <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--ledger-text)" }}>{action.summary}</p>

      {/* Field grid */}
      <div
        className="grid grid-cols-2 gap-5 rounded-lg border p-5 mb-6"
        style={{ borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}
      >
        <Field label="Respondent type">{action.respondent_type}</Field>
        <Field label="Firm subtype">{action.fi_subtype ?? "—"}</Field>
        <Field label="Prohibition">{action.prohibition_years != null ? `${action.prohibition_years} years` : "—"}</Field>
        <Field label="Enforcement lag">{action.enforcement_lag_days != null ? `${action.enforcement_lag_days} days` : "—"}</Field>
        <Field label="Conduct period">
          {action.conduct_start || action.conduct_end ? `${action.conduct_start ?? "?"} → ${action.conduct_end ?? "?"}` : "—"}
        </Field>
        <Field label="Joint action with">{action.joint_action_with.length ? action.joint_action_with.join(", ") : "—"}</Field>
        <Field label="Statutes">{action.statutes.length ? action.statutes.join(", ") : "—"}</Field>
        <Field label="Coding confidence">
          <span className="font-mono" style={{ color: "var(--ledger-accent)" }}>{action.coding_confidence}/10</span>
        </Field>
      </div>

      {/* Respondents */}
      {action.respondents.length > 1 && (
        <div className="mb-6">
          <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--ledger-muted)" }}>Respondents</div>
          <div className="flex flex-col gap-1.5">
            {action.respondents.map((r, i) => (
              <div key={i} className="text-sm flex items-center gap-2" style={{ color: "var(--ledger-text)" }}>
                <span className="text-[0.6rem] font-mono px-1.5 py-0.5 rounded" style={{ color: "var(--ledger-muted)", backgroundColor: "var(--ledger-surface-2)" }}>
                  {r.is_individual ? "individual" : (r.fi_type ?? "entity")}
                </span>
                {r.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <a
        href={action.source_url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-colors"
        style={{ color: "var(--ledger-accent)", borderColor: "var(--ledger-border)" }}
      >
        Primary source (MAS) →
      </a>
    </div>
  );
}
