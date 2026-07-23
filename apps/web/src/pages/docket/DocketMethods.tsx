import { useEffect } from "react";
import { Eq } from "./shared";

export default function DocketMethods() {
  useEffect(() => {
    document.title = "The Docket — Methods · Arin Jain";
  }, []);

  const h2 = "text-lg font-semibold mb-3 mt-8 first:mt-0";
  const h3 = "text-sm font-semibold mb-2 mt-5";
  const p = "text-sm leading-relaxed mb-3";
  const muted = "var(--docket-muted)";
  const text = "var(--docket-text)";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="max-w-3xl">
        <div
          className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-3"
          style={{ color: "var(--docket-accent)" }}
        >
          Methods appendix · The Docket
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
          style={{ color: text }}
        >
          Indian Court Backlogs: Data Sources, Scoring and Design
        </h1>
        <p className="text-xs font-mono mb-8" style={{ color: muted }}>
          Working Paper · Arin Jain · 2024
        </p>

        <h2 className={h2} style={{ color: text }}>Abstract</h2>
        <p className={p} style={{ color: muted }}>
          This note documents the data sources, scoring methodology, and design choices behind
          The Docket, an interactive tool mapping India's court backlogs, scoring structural
          bottlenecks, and demonstrating what a citizen-facing case management system could look
          like. The tool does not attempt to produce causal estimates; it is descriptive and
          advocacy-oriented, designed to make the scale and structure of the problem legible to a
          general audience.
        </p>

        <h2 className={h2} style={{ color: text }}>1 · Data sources</h2>

        <h3 className={h3} style={{ color: text }}>1.1 Pending case counts</h3>
        <p className={p} style={{ color: muted }}>
          The primary source for state-level and court-level pending case counts is the National
          Judicial Data Grid (NJDG), publicly accessible at njdg.gov.in. NJDG aggregates data from
          district and subordinate courts across most states through the eCourts CMS, and from High
          Courts directly. Coverage and update frequency vary by state.
        </p>
        <p className={p} style={{ color: muted }}>
          All figures in The Docket are approximate, rounded to the nearest thousand cases, and
          represent a snapshot of late 2023 / early 2024. The 2024 total of approximately 49.6
          million cases reflects estimates from eCourts project reports; real-time figures should
          be verified at njdg.gov.in.
        </p>

        <h3 className={h3} style={{ color: text }}>1.2 Judge strength data</h3>
        <p className={p} style={{ color: muted }}>
          Sanctioned and actual judge strength figures come from the Ministry of Law and Justice
          Annual Report 2022-23 and the Supreme Court of India Annual Report 2022-23. Vacancy
          percentages are computed as (sanctioned − actual) / sanctioned × 100.
        </p>

        <h3 className={h3} style={{ color: text }}>1.3 Adjournment estimates</h3>
        <p className={p} style={{ color: muted }}>
          Field-level adjournment data comes from DAKSH India's court monitoring reports (2015-19,
          the most recent available). DAKSH sampled cause lists and disposals across district courts
          in seven states. Figures for non-sampled states are estimated by interpolation from
          pendency ratios and court vacancy rates. These are the weakest estimates in the dataset
          and should be treated as indicative only.
        </p>

        <h3 className={h3} style={{ color: text }}>1.4 Trend data</h3>
        <p className={p} style={{ color: muted }}>
          The 2015–2023 trend series is reconstructed from eCourts project annual reports, Law
          Ministry annual reports, and the India Justice Report (published by Tata Trusts). Before
          NJDG became comprehensive (roughly 2017), national figures require cross-referencing
          multiple sources and carry ±5% uncertainty. The 2020 spike reflects COVID-19 court
          closures reducing disposal while filings continued.
        </p>

        <h2 className={h2} style={{ color: text }}>2 · Backlog Severity Index</h2>
        <p className={p} style={{ color: muted }}>
          The Backlog Severity Index (BSI) is a descriptive index intended to make state-level
          variation legible, not to serve as a precise quantitative ranking. It is not calibrated
          to outcomes data.
        </p>

        <h3 className={h3} style={{ color: text }}>2.1 Factor construction</h3>
        <p className={p} style={{ color: muted }}>
          Five factors are constructed and each normalised to [0, 100]:
        </p>
        <div className="space-y-2 text-sm mb-4" style={{ color: muted }}>
          <p>
            <strong style={{ color: text }}>Vacancy (V)</strong>: % of sanctioned district/sessions
            court judge posts vacant per state. Source: Ministry of Law & Justice 2022-23.
            Normalised: worst = Jharkhand (approx. 41%), best = Kerala (approx. 6%).
          </p>
          <p>
            <strong style={{ color: text }}>Digital gap (D)</strong>: Inverse of e-filing adoption
            rate. Based on eCourts project phase-II/III rollout reports. States with mandatory
            e-filing or high CMS adoption score lower; states with minimal deployment score higher.
            Captures both infrastructure availability and actual usage.
          </p>
          <p>
            <strong style={{ color: text }}>Adjournments (A)</strong>: Estimated average
            adjournments per disposed case from DAKSH sampling data, extrapolated to non-sampled
            states via vacancy-pendency ratio. Range: approx. 7–14 adjournments per disposed case
            across the dataset.
          </p>
          <p>
            <strong style={{ color: text }}>Pendency (P)</strong>: Average age of pending cases in
            years. Derived from NJDG pendency distribution data. Higher = cases sit longer on
            average before disposal.
          </p>
          <p>
            <strong style={{ color: text }}>Infrastructure (I)</strong>: Courtroom deficit per
            million population. The Department of Justice estimated a 21,000+ courtroom shortfall
            nationally; this is allocated to states proportionally by the ratio of actual judges to
            sanctioned strength relative to population.
          </p>
        </div>

        <h3 className={h3} style={{ color: text }}>2.2 Weighting</h3>
        <Eq>BSI = 0.20·V + 0.25·D + 0.25·A + 0.20·P + 0.10·I</Eq>
        <p className={p} style={{ color: muted }}>
          D and A receive the highest weight (0.25 each) because they are the most directly
          addressable by data infrastructure reforms — the advocacy focus of this subproject. V
          and P reflect structural constraints that require judicial appointment processes and
          longer time horizons. I receives the lowest weight as physical infrastructure is a
          necessary but not sufficient condition for efficiency improvement.
        </p>
        <p className={p} style={{ color: muted }}>
          The weighting scheme is subjective and normative, reflecting the author's view of what
          levers are relevant to digital reform advocacy. Alternative weighting schemes would
          produce different state rankings. The BSI should not be used for resource allocation
          decisions without adjustment by a domain expert.
        </p>

        <h2 className={h2} style={{ color: text }}>3 · India–Singapore comparison</h2>
        <p className={p} style={{ color: muted }}>
          Ten dimensions are scored as constructed indices, not official cross-country rankings.
          Each score reflects a qualitative assessment of deployment completeness — from 0 (no
          capability) to 100 (fully deployed and functional at scale) — cross-referenced against:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 mb-4" style={{ color: muted }}>
          <li>Singapore Judiciary: Statistics 2023 and Annual Report 2023</li>
          <li>eLitigation: Annual Report 2023</li>
          <li>Ministry of Law Singapore: Digitalisation of legal services reports</li>
          <li>eCourts India: Phase II completion report and Phase III roadmap</li>
          <li>National Informatics Centre: e-filing portal deployment status</li>
          <li>Law Commission of India: Reports 230 and 245 (court data, backlog)</li>
        </ul>
        <p className={p} style={{ color: muted }}>
          India scores represent national averages. Individual court systems — Delhi High Court,
          some Tamil Nadu district courts, the Supreme Court's own portal — perform substantially
          better than the mean on e-filing and digital access. The comparison is intended to show
          the system-wide picture, not penalise early adopters.
        </p>

        <h2 className={h2} style={{ color: text }}>4 · The tracker prototype</h2>
        <p className={p} style={{ color: muted }}>
          The interactive case tracking dashboard uses entirely fabricated illustrative cases. No
          individual case data from real courts is used anywhere in this subproject. The schema
          (case ID, filing date, status, next hearing, judge, priority) is designed to reflect what
          a standardised national court CMS schema could look like.
        </p>
        <p className={p} style={{ color: muted }}>
          The prototype does not persist data beyond the browser session. It is intended as a
          demonstration of what citizen-facing court transparency could look like, not as a
          functional case management system.
        </p>

        <h2 className={h2} style={{ color: text }}>5 · Limitations and honest gaps</h2>
        <ul className="list-disc list-inside text-sm space-y-1.5 mb-4" style={{ color: muted }}>
          <li>Adjournment estimates are extrapolated from limited sampling and are the weakest part of the BSI.</li>
          <li>Tribunal, arbitration, and consumer forum backlogs are excluded entirely.</li>
          <li>No causal identification: the BSI describes correlation between factors and backlog, not causation.</li>
          <li>NJDG data quality varies; some states may be underreporting or have data lags.</li>
          <li>The analysis does not control for case complexity, which varies systematically across states.</li>
          <li>Singapore comparison scores are qualitative; they are not derived from a common measurement instrument.</li>
        </ul>

        <div
          className="mt-10 border-t pt-6 text-xs"
          style={{ borderColor: "var(--docket-border)", color: muted }}
        >
          <p>
            The Docket · Arin Jain · 2024
          </p>
          <p className="mt-1">
            Student research project. Not legal or policy advice. Errors and corrections welcome:{" "}
            <a href="/contact" className="underline" style={{ color: "var(--docket-accent)" }}>
              contact
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
