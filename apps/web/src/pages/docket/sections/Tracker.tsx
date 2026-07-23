import { useState, useMemo } from "react";
import { Plus, X, Check, Clock, AlertCircle, Filter } from "lucide-react";
import { Section, Card, Caption } from "../shared";
import {
  sampleCases,
  type TrackerCase,
  type CaseStatus,
  type CasePriority,
  type CaseType,
  type CourtLevelKey,
} from "../model";

// Compute how many days a case has been open.
function daysOpen(filingDate: string): number {
  const filed = new Date(filingDate);
  const now = new Date("2024-07-01"); // fixed reference so numbers are stable
  return Math.floor((now.getTime() - filed.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDays(days: number): string {
  if (days >= 365) return `${(days / 365).toFixed(1)} yrs`;
  return `${days}d`;
}

const STATUS_COLORS: Record<CaseStatus, string> = {
  "Pending":     "var(--docket-muted)",
  "In Progress": "var(--docket-accent)",
  "Adjourned":   "var(--docket-high)",
  "Resolved":    "var(--docket-low)",
};

const PRIORITY_COLORS: Record<CasePriority, string> = {
  "Urgent": "var(--docket-crit)",
  "High":   "var(--docket-high)",
  "Normal": "var(--docket-mod)",
  "Low":    "var(--docket-muted)",
};

function StatusIcon({ status }: { status: CaseStatus }) {
  if (status === "Resolved") return <Check className="h-3.5 w-3.5" style={{ color: "var(--docket-low)" }} />;
  if (status === "Adjourned") return <Clock className="h-3.5 w-3.5" style={{ color: "var(--docket-high)" }} />;
  if (status === "In Progress") return <AlertCircle className="h-3.5 w-3.5" style={{ color: "var(--docket-accent)" }} />;
  return <Clock className="h-3.5 w-3.5" style={{ color: "var(--docket-muted)" }} />;
}

const EMPTY_FORM: Omit<TrackerCase, "id"> = {
  caseId: "",
  title: "",
  filingDate: "",
  courtLevel: "District",
  judge: "",
  nextHearing: "",
  status: "Pending",
  priority: "Normal",
  type: "Civil",
  notes: "",
};

export default function Tracker() {
  const [cases, setCases] = useState<TrackerCase[]>(sampleCases);
  const [filterStatus, setFilterStatus] = useState<CaseStatus | "All">("All");
  const [filterPriority, setFilterPriority] = useState<CasePriority | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<TrackerCase, "id">>(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Summary stats
  const pending   = cases.filter((c) => c.status !== "Resolved").length;
  const resolved  = cases.filter((c) => c.status === "Resolved").length;
  const urgent    = cases.filter((c) => c.priority === "Urgent" && c.status !== "Resolved").length;
  const adjourned = cases.filter((c) => c.status === "Adjourned").length;
  const avgAge    = cases.length
    ? Math.floor(cases.reduce((sum, c) => sum + daysOpen(c.filingDate || "2024-01-01"), 0) / cases.length)
    : 0;

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (filterStatus !== "All" && c.status !== filterStatus) return false;
      if (filterPriority !== "All" && c.priority !== filterPriority) return false;
      return true;
    });
  }, [cases, filterStatus, filterPriority]);

  function addCase() {
    if (!form.caseId || !form.title || !form.filingDate) return;
    const id = String(Date.now());
    setCases((prev) => [{ ...form, id }, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function resolveCase(id: string) {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Resolved" as CaseStatus } : c))
    );
  }

  function removeCase(id: string) {
    setCases((prev) => prev.filter((c) => c.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  return (
    <Section
      id="tracker"
      eyebrow="Chapter 3 · The Docket"
      title="What a digital case register could look like"
    >
      <p className="text-sm sm:text-base mb-6 max-w-2xl" style={{ color: "var(--docket-muted)" }}>
        This is a working prototype — not a real court system. It shows what a citizen tracking a
        case in India's courts would see if the judiciary published structured, real-time data:
        status, next hearing date, judge assigned, days open. Like tracking a parcel. You can add
        cases, filter, and mark them resolved.
      </p>

      {/* Summary stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Open",      val: pending,           color: "var(--docket-text)" },
          { label: "Resolved",  val: resolved,          color: "var(--docket-low)" },
          { label: "Urgent",    val: urgent,            color: "var(--docket-crit)" },
          { label: "Adjourned", val: adjourned,         color: "var(--docket-high)" },
          { label: "Avg age",   val: formatDays(avgAge), color: "var(--docket-mod)" },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            className="rounded-lg border p-3 text-center"
            style={{ borderColor: "var(--docket-border)", backgroundColor: "var(--docket-surface)" }}
          >
            <div className="text-xl font-mono font-bold" style={{ color }}>
              {val}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--docket-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters + add button */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <Filter className="h-4 w-4" style={{ color: "var(--docket-muted)" }} />

        <div className="flex gap-1">
          {(["All", "Pending", "In Progress", "Adjourned", "Resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-2 py-0.5 rounded text-xs font-mono border transition-all"
              style={{
                borderColor: filterStatus === s ? "var(--docket-accent)" : "var(--docket-border)",
                color: filterStatus === s ? "var(--docket-accent)" : "var(--docket-muted)",
                backgroundColor: filterStatus === s ? "var(--docket-accent-dim)" : "transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(["All", "Urgent", "High", "Normal", "Low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className="px-2 py-0.5 rounded text-xs font-mono border transition-all"
              style={{
                borderColor: filterPriority === p ? "var(--docket-accent)" : "var(--docket-border)",
                color: filterPriority === p
                  ? "var(--docket-accent)"
                  : p === "All"
                  ? "var(--docket-muted)"
                  : PRIORITY_COLORS[p as CasePriority],
                backgroundColor: filterPriority === p ? "var(--docket-accent-dim)" : "transparent",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
          style={{
            borderColor: "var(--docket-accent)",
            color: "var(--docket-accent)",
            backgroundColor: "var(--docket-accent-dim)",
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add case
        </button>
      </div>

      {/* Add case form */}
      {showForm && (
        <Card className="mb-5">
          <div className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: "var(--docket-accent)" }}>
            New case
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { field: "caseId",    label: "Case ID",       type: "text",  placeholder: "e.g. CS-2024-001" },
                { field: "title",     label: "Title",         type: "text",  placeholder: "Brief description" },
                { field: "filingDate",label: "Filing date",   type: "date",  placeholder: "" },
                { field: "nextHearing",label:"Next hearing",  type: "date",  placeholder: "" },
                { field: "judge",     label: "Judge / court", type: "text",  placeholder: "Optional" },
                { field: "notes",     label: "Notes",         type: "text",  placeholder: "Optional" },
              ] as const
            ).map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="text-xs mb-1 block" style={{ color: "var(--docket-muted)" }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[field] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded text-xs font-mono border bg-transparent outline-none focus:border-[var(--docket-accent)]"
                  style={{
                    borderColor: "var(--docket-border)",
                    color: "var(--docket-text)",
                    backgroundColor: "var(--docket-surface-2)",
                  }}
                />
              </div>
            ))}

            {/* Selects */}
            {(
              [
                { field: "courtLevel", label: "Court level",  options: ["District", "High Court", "Supreme Court"] },
                { field: "status",     label: "Status",       options: ["Pending", "In Progress", "Adjourned", "Resolved"] },
                { field: "priority",   label: "Priority",     options: ["Urgent", "High", "Normal", "Low"] },
                { field: "type",       label: "Type",         options: ["Civil", "Criminal"] },
              ] as const
            ).map(({ field, label, options }) => (
              <div key={field}>
                <label className="text-xs mb-1 block" style={{ color: "var(--docket-muted)" }}>
                  {label}
                </label>
                <select
                  value={(form as Record<string, string>)[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-2.5 py-1.5 rounded text-xs font-mono border outline-none"
                  style={{
                    borderColor: "var(--docket-border)",
                    color: "var(--docket-text)",
                    backgroundColor: "var(--docket-surface-2)",
                  }}
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addCase}
              className="px-4 py-1.5 rounded text-xs font-mono font-semibold border transition-all"
              style={{
                borderColor: "var(--docket-accent)",
                color: "var(--docket-accent)",
                backgroundColor: "var(--docket-accent-dim)",
              }}
            >
              Add to docket
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded text-xs font-mono border transition-all"
              style={{ borderColor: "var(--docket-border)", color: "var(--docket-muted)" }}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Case list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="text-xs font-mono py-8 text-center" style={{ color: "var(--docket-muted)" }}>
            No cases match this filter.
          </div>
        )}
        {filtered.map((c) => {
          const isExpanded = expandedId === c.id;
          const days = daysOpen(c.filingDate || "2024-01-01");
          const isUrgent = c.priority === "Urgent" && c.status !== "Resolved";

          return (
            <div
              key={c.id}
              className="rounded-xl border transition-all"
              style={{
                borderColor: isUrgent ? "var(--docket-crit)" : "var(--docket-border)",
                backgroundColor: "var(--docket-surface)",
                borderWidth: isUrgent ? "1.5px" : "1px",
              }}
            >
              {/* Row header */}
              <div
                className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <StatusIcon status={c.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono" style={{ color: "var(--docket-muted)" }}>
                      {c.caseId}
                    </span>
                    <span
                      className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        color: PRIORITY_COLORS[c.priority],
                        backgroundColor: `${PRIORITY_COLORS[c.priority]}18`,
                      }}
                    >
                      {c.priority}
                    </span>
                    <span
                      className="text-[0.65rem] font-mono"
                      style={{ color: "var(--docket-muted)" }}
                    >
                      {c.type} · {c.courtLevel}
                    </span>
                  </div>
                  <div
                    className="text-sm font-medium mt-0.5 leading-snug truncate"
                    style={{ color: c.status === "Resolved" ? "var(--docket-muted)" : "var(--docket-text)" }}
                  >
                    {c.title}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs flex-wrap" style={{ color: "var(--docket-muted)" }}>
                    <span>
                      Age:{" "}
                      <span
                        style={{
                          color:
                            days > 1460 ? "var(--docket-crit)"
                            : days > 730 ? "var(--docket-high)"
                            : "var(--docket-text)",
                          fontFamily: "monospace",
                        }}
                      >
                        {formatDays(days)}
                      </span>
                    </span>
                    <span style={{ color: STATUS_COLORS[c.status] }}>{c.status}</span>
                    {c.nextHearing && (
                      <span>Next: {new Date(c.nextHearing).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {c.status !== "Resolved" && (
                    <button
                      title="Mark resolved"
                      onClick={() => resolveCase(c.id)}
                      className="p-1.5 rounded border transition-all"
                      style={{ borderColor: "var(--docket-border)", color: "var(--docket-low)" }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    title="Remove"
                    onClick={() => removeCase(c.id)}
                    className="p-1.5 rounded border transition-all"
                    style={{ borderColor: "var(--docket-border)", color: "var(--docket-muted)" }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  className="border-t px-4 py-3 text-xs"
                  style={{ borderColor: "var(--docket-border)", color: "var(--docket-muted)" }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div>
                      <span className="font-mono uppercase tracking-wide text-[0.6rem]" style={{ color: "var(--docket-muted)" }}>
                        Filed
                      </span>
                      <div style={{ color: "var(--docket-text)" }}>
                        {new Date(c.filingDate).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <span className="font-mono uppercase tracking-wide text-[0.6rem]" style={{ color: "var(--docket-muted)" }}>
                        Court
                      </span>
                      <div style={{ color: "var(--docket-text)" }}>{c.courtLevel}</div>
                    </div>
                    {c.judge && (
                      <div>
                        <span className="font-mono uppercase tracking-wide text-[0.6rem]" style={{ color: "var(--docket-muted)" }}>
                          Judge / note
                        </span>
                        <div style={{ color: "var(--docket-text)" }}>{c.judge}</div>
                      </div>
                    )}
                    {c.nextHearing && (
                      <div>
                        <span className="font-mono uppercase tracking-wide text-[0.6rem]" style={{ color: "var(--docket-muted)" }}>
                          Next hearing
                        </span>
                        <div style={{ color: "var(--docket-text)" }}>
                          {new Date(c.nextHearing).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    )}
                  </div>
                  {c.notes && (
                    <div
                      className="rounded-lg px-3 py-2 text-xs leading-relaxed"
                      style={{ backgroundColor: "var(--docket-surface-2)", color: "var(--docket-muted)" }}
                    >
                      {c.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Caption>
        Pre-loaded cases are illustrative and anonymised. Add your own. Data is stored in browser
        memory only and resets on page reload — this is a demonstration of what structured court
        data could look like, not a live system.
      </Caption>

      {/* Why this matters box */}
      <div
        className="mt-8 rounded-xl border p-5"
        style={{ borderColor: "var(--docket-accent)", backgroundColor: "var(--docket-accent-dim)" }}
      >
        <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--docket-accent)" }}>
          What this prototype argues
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--docket-text)" }}>
          Nothing above requires new legislation or more judges. It requires a standardised data
          schema across courts, a public-facing status API, and automated notifications. Singapore
          built this in 2000. India's eCourts phase III is attempting it now — but rollout is
          fragmented across 25 high court jurisdictions. The single highest-leverage change is a
          national standard for case IDs and status fields, so a case can be looked up from any
          court system the way a parcel can be tracked from any courier's website.
        </p>
      </div>
    </Section>
  );
}
