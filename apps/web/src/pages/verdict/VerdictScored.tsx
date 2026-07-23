import { Link } from "react-router-dom";
import { useVerdictTheme } from "./VerdictLayout";

export default function VerdictScored() {
  const { theme } = useVerdictTheme();

  const sectionClass = "rounded-lg border p-5 mb-5";
  const sectionStyle = {
    backgroundColor: "var(--verdict-surface)",
    borderColor: "var(--verdict-border)",
  };
  const labelStyle = "text-[0.65rem] font-mono tracking-widest uppercase mb-2";
  const labelColor = { color: "var(--verdict-muted)" };
  const bodyStyle = "text-sm leading-relaxed mb-3";
  const bodyColor = { color: "var(--verdict-text)" };
  const mutedStyle = "text-xs leading-relaxed";
  const mutedColor = { color: "var(--verdict-muted)" };

  const factors = [
    {
      key: "LI",
      name: "Legislative Impact",
      score: 9,
      why:
        "The EU AI Act is an Article 114 regulation — directly binding on all 27 member states without national transposition. That is the highest-force legal instrument available in EU law. The only reason it is not a 10 is that it is still phased (full high-risk obligations apply from August 2026), so the binding force is real but not yet fully activated.",
      rubric: "EU-level binding regulation = 10. Phased application knocks it to 9.",
    },
    {
      key: "SE",
      name: "Sectoral Effect",
      score: 8,
      why:
        "The risk-tier framework cuts across virtually every industry: healthcare AI, hiring systems, credit scoring, biometric identification, autonomous vehicles, critical infrastructure. In principle this is a 10 — horizontal application. In practice, the highest obligations attach only to systems classified as high-risk, which is a defined and bounded category. A chatbot or a recommendation engine sits outside it. So the effect is broad but not uniform. Score: 8.",
      rubric: "Horizontal application across sectors, but uneven depth = 8.",
    },
    {
      key: "ER",
      name: "Enforcement Risk",
      score: 9,
      why:
        "Hard sanctions: fines up to €35M or 7% of global annual turnover, whichever is higher. National market surveillance authorities with mandatory enforcement. The EU AI Office sits above them for general-purpose AI models. This is not guidance or aspirational policy — non-compliance has a concrete and large financial consequence. Score: 9. (Not 10 because enforcement infrastructure is still being built in most member states as of mid-2026.)",
      rubric: "Hard sanctions with criminal-adjacent severity = 9.",
    },
    {
      key: "SF",
      name: "Sanction Force",
      score: 9,
      why:
        "The 7% of global turnover ceiling is larger than GDPR's 4% ceiling, which was already the largest regulatory fine in history for tech companies. For a company like Google or Meta, 7% of global revenue is in the tens of billions. The fines are administrative, not criminal, but the magnitude puts them in the same practical tier as criminal liability. Score: 9.",
      rubric: "Heavy fines at GDPR-plus scale = 9.",
    },
    {
      key: "PS",
      name: "Policy Synergy",
      score: 8,
      why:
        "The Act references the OECD AI Principles and is explicitly designed to be compatible with EU data protection law (GDPR) and product safety frameworks. Other jurisdictions — the UK, Canada, Brazil, Singapore — are all drafting with awareness of the EU framework. This is genuine international influence. But it is market-driven convergence (Brussels Effect) rather than coordinated governance. Score: 8. I would score a multilateral treaty-level instrument 10; unilateral regulation that others are forced to track by market access sits at 8.",
      rubric: "Strong international influence via Brussels Effect, not coordinated governance = 8.",
    },
  ];

  const edi = 8.54;
  const dp = 8.55;
  const dr = 8.75;

  return (
    <div>
      {/* Back */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/mini/verdict/about"
          className="text-xs font-mono transition-opacity hover:opacity-80"
          style={{ color: "var(--verdict-accent)" }}
        >
          ← Methodology
        </Link>
        <Link
          to="/mini/verdict/1"
          className="text-xs font-mono transition-opacity hover:opacity-80"
          style={{ color: "var(--verdict-muted)" }}
        >
          Full case record →
        </Link>
      </div>

      {/* Intro */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>How I score a case</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: "var(--verdict-text)" }}>
          EU AI Act — Full Entry into Force
        </h1>
        <p className={bodyStyle} style={bodyColor}>
          The five-factor methodology produces a single EDI score, but the number is only useful if you can
          see the reasoning behind it. This page walks through how I scored the EU AI Act entry into force
          — every factor, why I gave it the score I did, and where I could be wrong.
        </p>
        <p className={mutedStyle} style={mutedColor}>
          Final scores: LI=9 · SE=8 · ER=9 · SF=9 · PS=8 · EDI={edi} · Tier: Seismic ·
          DP={dp} · DR={dr}
        </p>
      </div>

      {/* Factors */}
      {factors.map((f) => (
        <div key={f.key} className={sectionClass} style={sectionStyle}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className={labelStyle} style={labelColor}>{f.key} — {f.name}</div>
            </div>
            <div
              className="text-4xl font-mono font-bold shrink-0"
              style={{ color: "var(--verdict-accent)" }}
            >
              {f.score}
              <span className="text-base font-normal ml-0.5" style={{ color: "var(--verdict-muted)" }}>/10</span>
            </div>
          </div>
          <p className={bodyStyle} style={bodyColor}>{f.why}</p>
          <p
            className="text-xs font-mono px-3 py-2 rounded"
            style={{
              color: "var(--verdict-accent)",
              backgroundColor: theme === "dark" ? "rgba(34,211,238,0.06)" : "rgba(13,148,136,0.06)",
              borderLeft: "2px solid var(--verdict-accent)",
            }}
          >
            {f.rubric}
          </p>
        </div>
      ))}

      {/* Computed */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>From factors to EDI</div>
        <p className={bodyStyle} style={bodyColor}>
          The five raw scores feed two composite dimensions before producing the EDI:
        </p>
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: "var(--verdict-muted)" }}>
              DP (Disruption Potential) = (LI×0.30 + SF×0.35 + PS×0.35) = {dp}
            </p>
            <p className={mutedStyle} style={mutedColor}>
              DP asks: how forceful is the legal action, and how hard will it be to ignore? LI captures
              the instrument's binding force; SF captures the sanction magnitude; PS captures whether
              other jurisdictions will feel pressure to follow. The EU AI Act scores {dp} here because
              all three are high — it is binding, carries large fines, and has already triggered
              regulatory responses elsewhere.
            </p>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: "var(--verdict-muted)" }}>
              DR (Distributional Reach) = (SE×0.40 + ER×0.40 + PS×0.20) = {dr}
            </p>
            <p className={mutedStyle} style={mutedColor}>
              DR asks: how widely do the effects propagate through the economy and society? SE captures
              sectoral breadth; ER captures compliance intensity. The Act scores {dr} on DR — broad
              sectoral application and demanding compliance obligations push both components high.
            </p>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: "var(--verdict-muted)" }}>
              EDI = normalised composite of DP and DR across all published cases = {edi}
            </p>
            <p className={mutedStyle} style={mutedColor}>
              EDI is normalised across the full database, so it shifts as new cases are added. At the
              current database size (8 cases), the EU AI Act scores {edi} — Seismic tier. That ranking
              is stable: even under conservative scenario weighting it stays the highest-scoring case.
              But the exact number will change as the database grows.
            </p>
          </div>
        </div>
      </div>

      {/* Where I could be wrong */}
      <div className={sectionClass} style={sectionStyle}>
        <div className={labelStyle} style={labelColor}>Where I could be wrong</div>
        <div className="space-y-3">
          {[
            {
              q: "Is LI=9 right for a phased regulation?",
              a: "Possibly not. You could argue that a regulation which does not fully activate until 2026 should score lower on legislative impact now, and be rescored when each phase enters into force. I chose to score the instrument at its eventual full force rather than its current activation state. That is a methodological choice, not a fact.",
            },
            {
              q: "Is PS=8 giving too much credit to Brussels Effect?",
              a: "Maybe. Brussels Effect is real but fragile — it depends on the EU remaining a market large enough to impose compliance costs globally. A future where AI development concentrates outside the EU could reduce that leverage significantly. I scored it 8 rather than 10 specifically to leave room for this, but 7 would be defensible.",
            },
            {
              q: "Does SE=8 underweight the excluded categories?",
              a: "Possibly the reverse — SE=8 might overweight the breadth of formal scope relative to the narrowness of what actually gets classified as high-risk. If enforcement ends up touching only a small share of real-world AI deployments, an 8 looks too high. This is an implementation question that will only be answerable in 2027 or later.",
            },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--verdict-text)" }}>{item.q}</p>
              <p className={mutedStyle} style={mutedColor}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div
        className="text-xs font-mono pt-4 border-t flex flex-wrap gap-4"
        style={{ borderColor: "var(--verdict-border)", color: "var(--verdict-muted)" }}
      >
        <Link to="/mini/verdict/1" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
          Full case record with data →
        </Link>
        <Link to="/mini/verdict/about" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
          Full methodology →
        </Link>
        <Link to="/mini/verdict" className="hover:underline" style={{ color: "var(--verdict-accent)" }}>
          ← All cases
        </Link>
      </div>
    </div>
  );
}
