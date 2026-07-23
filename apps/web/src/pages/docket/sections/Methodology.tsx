import { Section, Card, Eq, Details } from "../shared";

export default function Methodology() {
  return (
    <Section
      id="methodology"
      eyebrow="Methodology · The Docket"
      title="What is and isn't in this analysis"
    >
      <div className="max-w-2xl space-y-6 text-sm leading-relaxed" style={{ color: "var(--docket-muted)" }}>
        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            Scope
          </h3>
          <p>
            This subproject covers Indian civil and criminal courts at three levels: district and
            subordinate courts, High Courts, and the Supreme Court. It does not cover tribunals
            (NCLT, NGT, ITAT, etc.), consumer fora, family courts, or revenue courts — all of
            which have their own backlogs. Total pending cases across all judicial and quasi-judicial
            bodies in India exceeds 100 million if tribunals are included; the figures here are
            conservative and court-only.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            Data sources and their limits
          </h3>
          <p className="mb-2">
            India does not have a single authoritative public dataset for court backlog statistics.
            This analysis cross-references four sources:
          </p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>
              <strong style={{ color: "var(--docket-text)" }}>NJDG (njdg.gov.in)</strong> — the
              National Judicial Data Grid, maintained by eCourts. Provides near-real-time pending
              case counts by state and court level. The primary source for the backlog map. Limitation:
              data completeness varies; some states update less frequently, and older cases may be
              mislabelled.
            </li>
            <li>
              <strong style={{ color: "var(--docket-text)" }}>Ministry of Law &amp; Justice Annual Reports</strong> — used for judge
              strength data (sanctioned vs actual) and infrastructure figures. Published annually;
              figures here are from 2022-23.
            </li>
            <li>
              <strong style={{ color: "var(--docket-text)" }}>DAKSH India</strong> — an NGO that
              has done field-level sampling of court efficiency across multiple states. Used for
              adjournment estimates and state-level comparisons. DAKSH data is the most granular
              available but is sampled, not census.
            </li>
            <li>
              <strong style={{ color: "var(--docket-text)" }}>Supreme Court Annual Reports</strong> — for Supreme Court-specific
              pending case counts and disposal rates.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            Backlog Severity Index (BSI) — construction
          </h3>
          <p className="mb-3">
            The BSI is a composite index of five factors, each normalised to 0–100 where 100 is the
            worst observed value in the dataset.
          </p>
          <Eq>
            BSI = 0.20 × V + 0.25 × D + 0.25 × A + 0.20 × P + 0.10 × I
          </Eq>
          <div className="mt-2 space-y-1 text-xs" style={{ color: "var(--docket-muted)" }}>
            <p><strong style={{ color: "var(--docket-text)" }}>V</strong> = Vacancy score: (% vacant judge posts) / (max observed % across states) × 100</p>
            <p><strong style={{ color: "var(--docket-text)" }}>D</strong> = Digital gap: (1 − e-filing adoption rate) × 100</p>
            <p><strong style={{ color: "var(--docket-text)" }}>A</strong> = Adjournment score: (avg adjournments per disposed case) / (max observed) × 100</p>
            <p><strong style={{ color: "var(--docket-text)" }}>P</strong> = Pendency score: (avg years pending) / (max observed) × 100</p>
            <p><strong style={{ color: "var(--docket-text)" }}>I</strong> = Infrastructure score: (courtroom deficit per million pop) / (max observed) × 100</p>
          </div>
          <p className="mt-3 text-xs">
            Weights were set to reflect the relative tractability of each factor for data-infrastructure reforms specifically: digitalization (D) and adjournment frequency (A) are most directly addressed by the type of system improvements this subproject advocates. Vacancy and pendency reflect structural constraints that require different policy levers (judicial appointments, staffing). Infrastructure reflects physical investment.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            India–Singapore comparison scores
          </h3>
          <p>
            The ten comparison dimensions use constructed indices, not official league tables. Each
            score reflects a qualitative assessment of deployment completeness, cross-referenced
            against official reports from both judiciaries. "India" scores represent a national
            average; several states (Delhi High Court, some Tamil Nadu district courts, some High
            Courts with active CMS deployments) perform better than the mean. Singapore's scores
            reflect the national system.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            The tracker prototype
          </h3>
          <p>
            The case tracking dashboard uses entirely fabricated illustrative cases. Field names and
            status values are designed to reflect what a standardised Indian court CMS schema could
            look like if courts adopted a national standard. No individual case data from real courts
            is used anywhere in this subproject.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2" style={{ color: "var(--docket-text)" }}>
            What this analysis cannot tell you
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Case-level outcomes or individual litigant experiences</li>
            <li>Whether specific pending cases are meritorious or frivolous</li>
            <li>The precise causal share of each bottleneck factor in producing delays</li>
            <li>Current real-time figures (check njdg.gov.in directly)</li>
            <li>Tribunal, arbitration, or consumer forum backlogs</li>
          </ul>
        </div>

        <div className="pt-2 border-t text-xs" style={{ borderColor: "var(--docket-border)" }}>
          <p>
            This is a student research project, not a policy paper. The analysis is exploratory and
            the scoring is illustrative. Nothing here constitutes legal or policy advice. Errors and
            feedback:{" "}
            <a href="/contact" className="underline" style={{ color: "var(--docket-accent)" }}>
              contact
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
