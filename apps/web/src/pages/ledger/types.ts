export interface Respondent {
  name: string;
  is_individual: boolean;
  fi_type: string | null;
}

export interface LedgerAction {
  action_id: number;
  date_published: string;
  respondents: Respondent[];
  respondent_type: "FI" | "individual" | "both";
  fi_subtype: string | null;
  action_type: string;
  violation_category: string;
  penalty_amount_sgd: number | null;
  prohibition_years: number | null;
  statutes: string[];
  conduct_start: string | null;
  conduct_end: string | null;
  enforcement_lag_days: number | null;
  repeat_offender: boolean;
  joint_action_with: string[];
  group: string | null;
  source_url: string;
  summary: string;
  coding_confidence: number;
}

export async function fetchActions(): Promise<LedgerAction[]> {
  const res = await fetch("/api/ledger/actions", { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.actions ?? [];
}

export async function fetchAction(id: number): Promise<LedgerAction | null> {
  const res = await fetch(`/api/ledger/actions/${id}`, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.action ?? null;
}

// Severity colouring by action type — most coercive at the top.
export const SEVERITY: Record<string, string> = {
  "Criminal prosecution": "var(--ledger-sev-1)",
  "Licence revocation": "var(--ledger-sev-1)",
  "Composition penalty": "var(--ledger-sev-2)",
  "Civil penalty": "var(--ledger-sev-2)",
  "Conditional warning": "var(--ledger-sev-2)",
  "Prohibition order": "var(--ledger-sev-3)",
  "Reprimand": "var(--ledger-sev-4)",
  "Warning": "var(--ledger-sev-4)",
  "Investigation": "var(--ledger-sev-5)",
};

export function severityColor(actionType: string): string {
  return SEVERITY[actionType] ?? "var(--ledger-muted)";
}

export function formatSGD(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `S$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}m`;
  if (n >= 1_000) return `S$${(n / 1_000).toFixed(0)}k`;
  return `S$${n.toLocaleString()}`;
}

export function fmtDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-SG", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
