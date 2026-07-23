import { Download } from "lucide-react";

function DownloadButton({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <a
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
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-mono font-bold uppercase tracking-wider mt-10 mb-3" style={{ color: "var(--ledger-accent)" }}>{children}</h2>;
}

export default function LedgerAbout() {
  const textStyle = { color: "var(--ledger-text)" };
  const muted = { color: "var(--ledger-muted)" };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-2" style={textStyle}>Methodology</h1>
      <p className="text-sm leading-relaxed" style={muted}>
        The Ledger turns the Monetary Authority of Singapore's unstructured list of enforcement notices into a coded,
        analysable dataset. One row is one published enforcement action; multi-party actions carry a nested list of
        respondents. The goal is a clean, citable panel for research on regulatory deterrence and financial-sector conduct.
      </p>

      {/* Disclaimer */}
      <div
        className="mt-6 rounded-lg border p-4 text-xs leading-relaxed"
        style={{ borderColor: "var(--ledger-sev-1)", backgroundColor: "var(--ledger-surface)", color: "var(--ledger-muted)" }}
      >
        <span className="font-mono font-bold uppercase tracking-wider" style={{ color: "var(--ledger-sev-1)" }}>Disclaimer.</span>{" "}
        The Ledger is an independent research project by Arin Jain. It is <span style={{ color: "var(--ledger-text)" }}>not affiliated with,
        endorsed by, or produced in conjunction with the Monetary Authority of Singapore, the Singapore Government, or
        any of their agencies</span>. All information is compiled from public sources and reproduced in good faith for research
        and educational use. The data may contain errors, omissions, or outdated entries and is provided "as is" without
        warranty of any kind. The author accepts no liability for any loss or decision arising from its use. For
        authoritative information, always consult the primary MAS notice linked from each entry. Nothing here is legal,
        financial, or compliance advice.
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <DownloadButton href="/api/ledger/download/json" label="JSON" sub="full nested dataset" />
        <DownloadButton href="/api/ledger/download/csv" label="CSV" sub="flat, one row per respondent" />
        <DownloadButton href="/api/ledger/download/codebook" label="Codebook" sub="full data dictionary" />
      </div>

      <H>What is coded</H>
      <p className="text-sm leading-relaxed mb-3" style={muted}>Each action carries:</p>
      <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5" style={muted}>
        <li><span style={textStyle}>Respondent(s)</span> — name(s), individual vs institution, and firm subtype (bank, insurer, capital markets, fund manager, etc.).</li>
        <li><span style={textStyle}>Action type</span> — composition penalty, civil penalty, criminal prosecution, prohibition order, licence revocation, conditional warning, reprimand, warning, or investigation.</li>
        <li><span style={textStyle}>Violation category</span> — AML-CFT, market abuse, fraud/dishonesty, conduct/mis-selling, disclosure/reporting, licensing breach, tech/operational risk, or other.</li>
        <li><span style={textStyle}>Penalty</span> — monetary amount in SGD, prohibition length in years, and statutes cited.</li>
        <li><span style={textStyle}>Timing</span> — conduct period and enforcement lag (days from end of conduct to the action).</li>
        <li><span style={textStyle}>Flags</span> — repeat offender, joint action with other agencies (AGC, CAD, SPF, SGX RegCo), and a case-cluster tag.</li>
        <li><span style={textStyle}>Coding confidence</span> — 0 to 10, described below.</li>
      </ul>

      <H>Coding confidence (0–10)</H>
      <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5" style={muted}>
        <li><span style={textStyle}>9–10</span> — sourced to a specific MAS notice with the amount, parties, and basis explicitly stated.</li>
        <li><span style={textStyle}>7–8</span> — MAS plus reputable secondary reporting; one or two fields inferred.</li>
        <li><span style={textStyle}>5–6</span> — confirmed on the MAS list but detail fields are thin.</li>
        <li><span style={textStyle}>0–4</span> — stub or weakly sourced; not for analysis without further verification.</li>
      </ul>

      <H>Sources and validation</H>
      <p className="text-sm leading-relaxed" style={muted}>
        The primary source is MAS (mas.gov.sg/regulation/enforcement). Penalty totals are validated against MAS's own
        aggregate figures: the 1MDB penalties reconcile to S$29.1m, the 2023 Wirecard-linked set to S$3.8m, and the 2025
        S$3-billion-case set to S$27.45m. Secondary reporting is used only to corroborate. Because MAS keeps most notices
        on its site for five years, older actions are reconstructed from MAS media releases and the biennial Enforcement
        Reports.
      </p>

      <H>Coverage and roadmap</H>
      <p className="text-sm leading-relaxed" style={muted}>
        This is a curated v1 focused on the most significant and best-documented actions from 2016 to 2025, not yet the
        complete MAS register. A harvest script enumerates the full notice list so remaining actions can be coded and
        merged over time. Coverage is reported on the register, never implied.
      </p>

      <H>Citation</H>
      <p className="text-sm leading-relaxed font-mono text-xs p-3 rounded border" style={{ ...muted, borderColor: "var(--ledger-border)", backgroundColor: "var(--ledger-surface)" }}>
        Jain, A. The Ledger: MAS Enforcement Actions Database. Primary source: Monetary Authority of Singapore.
      </p>
    </div>
  );
}
