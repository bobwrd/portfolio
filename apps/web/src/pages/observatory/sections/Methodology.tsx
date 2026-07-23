import { Section, Card } from "../shared";
import type { ObservatoryData } from "../types";

export default function Methodology({ data }: { data: ObservatoryData | null }) {
  return (
    <Section id="methodology" eyebrow="Methodology" title="Data, models, and what this is not">
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Data sources">
          <ul className="space-y-2 text-sm">
            {(data?.sources ?? []).map((s) => (
              <li key={s.name} className="leading-relaxed">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
                  {s.name}
                </a>
                {s.id && s.id !== "FRED" && <span className="font-mono text-xs ml-1" style={{ color: "var(--obs-muted)" }}>({s.id})</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            World Bank series are annual and cover every listed country. FRED series are US monthly or quarterly and
            enrich the atlas only when a FRED API key is configured; without it the page falls back to the World Bank
            baseline. Data is refreshed weekly by a scheduled job and baked into the site build.
          </p>
        </Card>

        <Card title="Transformations">
          <ul className="list-disc pl-5 space-y-1.5 text-sm leading-relaxed" style={{ color: "var(--obs-text)" }}>
            <li>Monthly price indices are converted to year-over-year percent change (value vs. the same month a year earlier).</li>
            <li>Productivity growth in Step 1 is the annualised change in GDP per person employed, averaged over the last 5 and 10 years.</li>
            <li>Real wage lines in the Lab are indices (base 100), not levels.</li>
            <li>AI milestone markers (ChatGPT, GPT-4, GPT-4o) are hard-coded reference dates, not derived from data.</li>
          </ul>
        </Card>

        <Card title="The toy model" className="lg:col-span-2">
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--obs-text)" }}>
            The walkthrough scenarios and the Lab share one small, deterministic, New-Keynesian-flavoured system,
            solved one year at a time. A logistic curve represents AI adoption and the productivity flow it
            delivers; an investment term represents the demand side of the build-out; a Phillips curve, a Taylor
            rule, and Okun's law close the loop. Full equations sit behind the <span className="font-mono" style={{ color: "var(--obs-accent)" }}>Details</span> toggles
            in each section and in <span className="font-mono">model.ts</span>.
          </p>

          <div className="mt-4 mb-4 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
                  <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Lab slider</th>
                  <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Model object(s) it drives</th>
                  <th className="text-left pb-2 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Baseline value</th>
                </tr>
              </thead>
              <tbody className="leading-relaxed" style={{ color: "var(--obs-text)" }}>
                <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
                  <td className="py-2 pr-4 font-medium">Speed of AI adoption</td>
                  <td className="py-2 pr-4">Steepness and midpoint of the logistic productivity path <span className="font-mono" style={{ color: "var(--obs-accent)" }}>g(t)</span>; size of the investment hump; expectation-anchoring weight <span className="font-mono" style={{ color: "var(--obs-accent)" }}>ω</span> (faster → less anchored)</td>
                  <td className="py-2 font-mono" style={{ color: "var(--obs-muted)" }}>medium — logistic speed 1.05, midpoint ~year 5, cumulative gains ~6.5 pp</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
                  <td className="py-2 pr-4 font-medium">Share of AI gains going to wages</td>
                  <td className="py-2 pr-4">Parameter <span className="font-mono" style={{ color: "var(--obs-accent)" }}>wageShare</span> (0–1): the fraction of each year's productivity flow that flows to real wages rather than profit margins</td>
                  <td className="py-2 font-mono" style={{ color: "var(--obs-muted)" }}>0.5 (equal split)</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
                  <td className="py-2 pr-4 font-medium">Central bank hawkishness</td>
                  <td className="py-2 pr-4">Taylor-rule inflation coefficient <span className="font-mono" style={{ color: "var(--obs-accent)" }}>φπ</span>. A 1 pp deviation of inflation above target raises the policy rate by <span className="font-mono" style={{ color: "var(--obs-accent)" }}>φπ</span> pp. (Baseline satisfies the Taylor principle: φπ &gt; 1, so real rates rise with inflation.)</td>
                  <td className="py-2 font-mono" style={{ color: "var(--obs-muted)" }}>φπ = 1.8 (mid-range); range: 1.1 (dovish) → 2.5 (hawkish)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Labour-replacing vs complementing</td>
                  <td className="py-2 pr-4">Parameter <span className="font-mono" style={{ color: "var(--obs-accent)" }}>labourReplace</span> (0–1): tilts the labour share of gains toward complemented (high-skill) tasks and adds a displacement drag on replaceable (low-skill) wages</td>
                  <td className="py-2 font-mono" style={{ color: "var(--obs-muted)" }}>0.5 (symmetric)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            <strong style={{ color: "var(--obs-warn)" }}>What it is not:</strong> it is not a forecast, not calibrated to any
            country, and not a structural model. It has no random shocks, no financial sector, no exchange rate, and
            no sectoral detail. It is built to make the <em>direction</em> of effects and the trade-offs between them
            intuitive, and it will happily produce paths that no real economy would follow if you push the sliders to
            extremes. Treat every number as illustrative.
          </p>
          <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--obs-border)" }}>
            <a
              href="/pdfs/observatory-model-note.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono hover:underline"
              style={{ color: "var(--obs-accent)" }}
            >
              ↓ Download model note (PDF, 2 pages)
            </a>
            <p className="mt-1 text-xs" style={{ color: "var(--obs-muted)" }}>
              Data sources, parameter table, one illustrative scenario worked through, and what the model cannot do.
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}
