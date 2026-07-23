import { Link } from "react-router-dom";

export default function VerdictAbout() {
  const sectionClass = "rounded-lg border p-6 mb-5";
  const sectionStyle = {
    backgroundColor: "var(--verdict-surface)",
    borderColor: "var(--verdict-border)",
  };
  const headingStyle = {
    color: "var(--verdict-text)",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontSize: "0.65rem",
    marginBottom: "0.75rem",
  };
  const bodyStyle = {
    color: "var(--verdict-muted)",
    fontSize: "0.875rem",
    lineHeight: "1.75",
  };
  const accentStyle = { color: "var(--verdict-accent)" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--verdict-text)" }}>
          Methodology
        </h1>
      </div>

      {/* About */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>About The Verdict</div>
        <div style={bodyStyle}>
          <p className="mb-4">
            The Verdict is a structured database of AI-related legal and regulatory events — court rulings, regulatory decisions,
            and major corporate actions — scored for their legal weight, societal effect, economic reach, structural force,
            and political salience. The goal is to build a rigorous, comparable record of how AI governance is actually evolving,
            rather than relying on news coverage which tends toward novelty over significance.
          </p>
          <p>
            Each case is scored on five factors, aggregated into two composite dimensions (Disruption Potential and Distributional Reach),
            and then combined geometrically into an Economic Disruption Index (EDI). Scores are normalised relative to all published cases,
            which means early entries are explicitly provisional — the tier and EDI will shift as the database grows.
            A sensitivity analysis produces an uncertainty band reflecting how much the result changes under different weighting assumptions.
          </p>
        </div>
      </div>

      {/* Five factors */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>The five factors (1–10 scale)</div>
        <div style={bodyStyle} className="space-y-5">
          {[
            {
              key: "LI",
              name: "Legal Instrument",
              desc: "How binding and far-reaching is the legal mechanism? A non-binding guidance note scores low; a directly applicable EU Regulation with criminal penalties scores high. Considers geographic scope (domestic vs. extraterritorial), enforcement mechanism (fines, injunctions, criminal liability), and whether the instrument creates private rights of action.",
              rubric: "1–3: advisory/guidance; 4–6: domestic statute or binding decision; 7–9: multi-jurisdiction binding instrument; 10: globally operative treaty or equivalent",
            },
            {
              key: "SE",
              name: "Societal Effect",
              desc: "How broadly does this decision affect everyday life? Measures the breadth of sectors touched (healthcare, criminal justice, employment, education), the vulnerability of affected populations, and whether effects are reversible. A decision restricting facial recognition in public spaces scores higher than one affecting only financial services AI.",
              rubric: "1–3: narrow sector, limited population; 4–6: one or two sectors, moderate population; 7–9: multiple sectors, broad or vulnerable populations; 10: pervasive societal restructuring",
            },
            {
              key: "ER",
              name: "Economic Reach",
              desc: "How much economic activity does this decision affect, and how directly? Considers the total addressable market of affected AI deployments, compliance cost burden, secondary effects on the AI investment and compliance services market, and whether effects propagate globally (Brussels Effect) or remain local.",
              rubric: "1–3: single company or narrow market; 4–6: one sector or national market; 7–9: multi-sector or multi-national; 10: global AI economy materially affected",
            },
            {
              key: "SF",
              name: "Structural Force",
              desc: "How much does this decision reshape the underlying incentive structure for AI development and deployment? High scores require evidence of: changed investment patterns, new compliance infrastructure, altered development practices (safety-by-design, documentation requirements), or adoption as a reference standard by other jurisdictions.",
              rubric: "1–3: minimal structural change, absorbed by existing practices; 4–6: creates new compliance requirements in one jurisdiction; 7–9: reshapes practices globally or sets a durable precedent; 10: paradigmatic shift in how AI is built and governed",
            },
            {
              key: "PS",
              name: "Political Salience",
              desc: "How visible and contested was this decision in political discourse? Considers duration and intensity of legislative debate, media coverage depth (not just volume), civil society mobilisation, and whether the decision required resolution of genuinely contested value trade-offs (security vs. liberty, innovation vs. precaution).",
              rubric: "1–3: technical administrative decision, low visibility; 4–6: notable media coverage, parliamentary debate; 7–9: sustained multi-year political contest, major public interest groups involved; 10: defining political battle, landmark status widely recognised",
            },
          ].map(({ key, name, desc, rubric }) => (
            <div key={key} className="border-l-2 pl-4" style={{ borderColor: "var(--verdict-border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-sm" style={accentStyle}>{key}</span>
                <span className="font-semibold text-sm" style={{ color: "var(--verdict-text)" }}>{name}</span>
              </div>
              <p className="mb-2">{desc}</p>
              <p className="text-xs italic" style={{ color: "var(--verdict-muted)", opacity: 0.8 }}>
                Rubric: {rubric}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dimensions + formulas */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>Composite dimensions</div>
        <div style={bodyStyle} className="space-y-4">
          <div>
            <span className="font-mono" style={accentStyle}>DP</span>
            {" "}= (LI × 0.55) + (SE × 0.45)
            <p className="mt-1">
              Disruption Potential captures the force of a decision at the level of legal instrument and societal effect.
              LI is weighted slightly higher because the binding strength of the instrument determines whether any of the other effects materialise.
            </p>
          </div>
          <div>
            <span className="font-mono" style={accentStyle}>DR</span>
            {" "}= (ER × 0.40) + (SF × 0.35) + (PS × 0.25)
            <p className="mt-1">
              Distributional Reach captures how widely the disruption propagates through markets and institutions.
              Economic reach leads because it is the most direct and measurable channel; structural force follows because it determines long-run impact;
              political salience is included but down-weighted because visibility does not guarantee substance.
            </p>
          </div>
        </div>
      </div>

      {/* Geometric aggregation */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>Why geometric aggregation beats linear</div>
        <div style={bodyStyle}>
          <p className="mb-3">
            ABS = √(DP × DR)
          </p>
          <p className="mb-3">
            A linear average would allow a decision with very high DP but zero DR to score identically to one with moderate scores on both.
            The geometric mean penalises extreme imbalance: a case needs both force and reach to score high.
            This reflects the real world — a legally powerful but economically narrow decision is less significant than one that is strong on both dimensions.
          </p>
          <p>
            The square root keeps the resulting ABS value in a range comparable to the input scores, which makes z-score normalisation more stable.
          </p>
        </div>
      </div>

      {/* EDI normalisation */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>EDI normalisation</div>
        <div style={bodyStyle}>
          <p className="mb-3">
            EDI = 5 + 2 × ((ABS − mean_ABS) / stddev_ABS), clamped to [1.0, 10.0]
          </p>
          <p className="mb-3">
            This is a z-score transformation centred at 5.0. The mean and standard deviation are computed across all published cases at the time of computation —
            which means adding a new case <em>shifts the scores of every existing case</em>. This is intentional: significance is relative.
            A regulatory action that was unprecedented in 2020 may be routine by 2026.
          </p>
          <p className="font-semibold" style={{ color: "var(--verdict-text)" }}>
            Early scores are explicitly provisional.
          </p>
          <p>
            With only a handful of cases, the standard deviation is unstable, and EDI values will cluster near 5.0.
            Tier assignments made before the database has ~20 cases should be read as rough indicators, not definitive scores.
          </p>
        </div>
      </div>

      {/* Sensitivity analysis */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>Sensitivity analysis</div>
        <div style={bodyStyle} className="space-y-3">
          <p>
            Three scenarios reweight the factors to test robustness. Each scenario produces an ABS value, which is then
            normalised to an EDI using the same mean and stddev as the baseline. The uncertainty band is [min(EDI_c, EDI_s, EDI_b), max(EDI_c, EDI_s, EDI_b)].
          </p>
          {[
            {
              name: "Conservative",
              desc: "ER weight doubled in DR computation (0.80), SF halved (0.175). Tests the view that raw economic exposure is the primary driver of significance.",
            },
            {
              name: "Structural",
              desc: "LI and SE weights doubled in DP (1.10 and 0.90), PS halved in DR (0.125). Tests the view that binding force and societal breadth matter more than political visibility.",
            },
            {
              name: "Balanced",
              desc: "All five factors receive equal 0.20 weight. Tests the most agnostic weighting scheme — no dimension is privileged.",
            },
          ].map(({ name, desc }) => (
            <div key={name} className="border-l-2 pl-4" style={{ borderColor: "var(--verdict-border)" }}>
              <span className="font-mono font-bold text-sm" style={accentStyle}>{name}</span>
              <p className="mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tier definitions */}
      <div className={sectionClass} style={sectionStyle}>
        <div style={headingStyle}>Tier definitions</div>
        <div style={bodyStyle} className="space-y-2">
          {[
            { tier: "Seismic", range: "8.0–10.0", desc: "Landmark decisions that materially reshape the global AI governance landscape." },
            { tier: "Major", range: "6.0–7.9", desc: "Significant decisions with durable effects on at least one major market or institutional framework." },
            { tier: "Moderate", range: "4.0–5.9", desc: "Notable decisions with meaningful but bounded effects." },
            { tier: "Marginal", range: "1.0–3.9", desc: "Decisions with limited scope, easily absorbed by existing practices." },
          ].map(({ tier, range, desc }) => (
            <div key={tier} className="flex items-start gap-3">
              <span className="font-mono font-bold text-xs mt-0.5 w-20 shrink-0" style={{ color: "var(--verdict-accent)" }}>
                {tier}
              </span>
              <span className="font-mono text-xs w-20 shrink-0 mt-0.5">{range}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Worked example CTA */}
      <div className={sectionClass} style={{ ...sectionStyle, borderColor: "var(--verdict-accent)" }}>
        <div style={headingStyle}>See it in practice</div>
        <p style={bodyStyle} className="mb-4">
          The methodology is easier to follow with a real case. The worked example below walks through
          every scoring decision for the EU AI Act — factor by factor, with the reasoning behind each score
          and where the scoring could be wrong.
        </p>
        <Link
          to="/mini/verdict/how-we-score"
          className="inline-block text-xs font-mono px-3 py-2 rounded transition-opacity hover:opacity-80"
          style={{ color: "var(--verdict-bg)", backgroundColor: "var(--verdict-accent)" }}
        >
          How we score: EU AI Act →
        </Link>
      </div>
    </div>
  );
}
