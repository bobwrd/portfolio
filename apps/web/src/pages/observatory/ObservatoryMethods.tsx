import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Eq } from "./shared";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mt-10 mb-3 tracking-tight" style={{ color: "var(--obs-text)" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold mt-6 mb-2" style={{ color: "var(--obs-accent)" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--obs-text)" }}>
      {children}
    </p>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="text-xs px-1 py-0.5 rounded font-mono"
      style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-accent)" }}
    >
      {children}
    </code>
  );
}

function ParamRow({
  slider, param, range, baseline,
}: {
  slider: string; param: string; range: string; baseline: string;
}) {
  return (
    <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
      <td className="py-2 pr-4 text-sm font-medium" style={{ color: "var(--obs-text)" }}>{slider}</td>
      <td className="py-2 pr-4 text-xs font-mono" style={{ color: "var(--obs-accent)" }}>{param}</td>
      <td className="py-2 pr-4 text-xs" style={{ color: "var(--obs-muted)" }}>{range}</td>
      <td className="py-2 text-xs" style={{ color: "var(--obs-muted)" }}>{baseline}</td>
    </tr>
  );
}

export default function ObservatoryMethods() {
  useEffect(() => {
    document.title = "Technical Note — The Observatory · Arin Jain";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link
        to="/mini/observatory"
        className="text-xs font-mono tracking-wider mb-8 inline-block transition-opacity hover:opacity-70"
        style={{ color: "var(--obs-muted)" }}
      >
        ← Back to The Observatory
      </Link>

      {/* Title block */}
      <div className="mt-4 mb-10 border-b pb-8" style={{ borderColor: "var(--obs-border)" }}>
        <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "var(--obs-accent)" }}>
          Technical Note · Methods Appendix
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--obs-text)" }}>
          The Observatory — AI, Productivity and Prices: Data Sources, Transformations and Model Structure
        </h1>
        <p className="text-xs font-mono mb-6" style={{ color: "var(--obs-muted)" }}>
          Arin Jain · {new Date().getFullYear()}
        </p>
        <div
          className="rounded-lg p-4 text-sm leading-relaxed border"
          style={{ borderColor: "var(--obs-border)", backgroundColor: "var(--obs-surface)", color: "var(--obs-text)" }}
        >
          <strong className="text-xs font-mono uppercase tracking-wider block mb-2" style={{ color: "var(--obs-muted)" }}>
            Abstract
          </strong>
          The Observatory pairs public macroeconomic data with a small simulation model to trace how AI adoption might move productivity, inflation, unemployment, and wages across skill groups. This note covers the series used, the transformations applied, and the model's structure in enough detail to replicate the computations. No observed series is used to calibrate the model directly; data and model run in parallel. All outputs are illustrative.
        </div>
      </div>

      {/* 1 */}
      <H2>1. Objective and scope</H2>
      <P>
        The driving question is narrow: through which channels can AI adoption affect productivity, inflation, unemployment, and the wage gap between higher- and lower-skill workers — and do the available data series show any signal yet?
      </P>
      <P>
        Two things run side by side to answer it. An atlas of observed series — World Bank and FRED data covering price indices, productivity, investment, and wages for five countries — sits alongside a simulation model: a small, deterministic system that generates 15-year paths for inflation, unemployment, the policy rate, and real wages under assumptions the user controls. The model isn't calibrated to any specific country and doesn't use the observed data as inputs. The two inform each other conceptually, not computationally.
      </P>

      {/* 2 */}
      <H2>2. Data sources and transformations</H2>

      <H3>2.1 World Bank series</H3>
      <P>
        The baseline dataset draws on 2 World Bank Development Indicators, available for all 5 countries in the atlas (United States, United Kingdom, Germany, Japan, Singapore):
      </P>
      <ul className="list-none space-y-2 mb-4 text-sm" style={{ color: "var(--obs-text)" }}>
        <li>
          <Mono>FP.CPI.TOTL.ZG</Mono> — Annual headline CPI inflation (percent). Used as-is, filtered to the selected time window.
        </li>
        <li>
          <Mono>SL.GDP.PCAP.EM.KD</Mono> — GDP per person employed, constant PPP dollars. Converted to annual growth rates for the Walkthrough productivity panel. The 5- and 10-year averages are simple arithmetic means of the most recent 5 and 10 complete annual observations.
        </li>
      </ul>
      <P>
        Both series are annual. Data is refreshed weekly by <Mono>fetch-observatory.mjs</Mono> and baked into the static build, so the atlas doesn't depend on live API calls at render time. The <Mono>generated</Mono> timestamp in the API response records when the last fetch ran.
      </P>

      <H3>2.2 FRED series (US only, requires API key)</H3>
      <P>
        With a FRED API key configured, 7 additional series enrich the US panels. Without it, the atlas uses the World Bank baseline for all countries.
      </P>
      <ul className="list-none space-y-2 mb-4 text-sm" style={{ color: "var(--obs-text)" }}>
        <li>
          <Mono>CPIAUCSL</Mono> — Headline CPI, monthly. Transformed to year-over-year percent change: <em>((P_t / P_{"t−12"}) − 1) × 100</em>.
        </li>
        <li>
          <Mono>CPILFESL</Mono> — Core CPI (excluding food and energy), monthly. Same YoY transformation.
        </li>
        <li>
          <Mono>PCEPILFE</Mono> — Core PCE deflator, monthly. Same transformation. PCE is the Fed's preferred inflation gauge and tends to run slightly below core CPI.
        </li>
        <li>
          <Mono>PPIITM</Mono> or equivalent — Software or IT-related PPI, monthly. Same YoY transformation; a proxy for AI-related deflation pressure in the Prices panel.
        </li>
        <li>
          <Mono>Y033RC1Q027SBEA</Mono> or equivalent — Non-residential information-processing equipment and software investment, quarterly. Shown in levels; tracks the AI capital build-out.
        </li>
        <li>
          <Mono>CES5000000001</Mono> or equivalent — Information-sector employment, monthly, thousands. A labour-market read on tech hiring.
        </li>
        <li>
          <Mono>LES1252881600Q</Mono> or equivalent — Real median usual weekly earnings for full-time workers, quarterly. Deflated at source; shown as a level series.
        </li>
      </ul>
      <P>
        AI milestone markers — ChatGPT public release, GPT-4, GPT-4o — are hard-coded reference dates overlaid on the monthly price and investment charts. They're not derived from any series.
      </P>

      <H3>2.3 Data and model</H3>
      <P>
        The observed data are used descriptively. No series calibrates the model's parameters. The stylised values in Section 4 are chosen to produce plausible dynamics for a generic advanced economy, not to fit any country's actual history.
      </P>

      {/* 3 */}
      <H2>3. Model structure</H2>
      <P>
        The simulation is a small, deterministic, New-Keynesian-flavoured system solved one year at a time. No stochastic shocks, no financial sector, no exchange rate, no sectoral disaggregation. Each period's state depends only on last period's variables and two current-period exogenous inputs: the AI productivity flow <em>g_t</em> and an investment demand term <em>inv_t</em>.
      </P>

      <H3>3.1 AI adoption and the productivity flow</H3>
      <P>
        Cumulative AI adoption follows a logistic curve:
      </P>
      <Eq>A(t) = 1 / (1 + exp(−s · (t − t₀)))</Eq>
      <P>
        where <em>s</em> controls the steepness and <em>t₀</em> the inflection year. The per-period flow <em>g_t</em> is the first difference of <em>A(t)</em>, re-scaled so the cumulative sum hits a target total gain (in percentage points). Faster adoption concentrates the impulse earlier without changing the long-run total.
      </P>

      <H3>3.2 Investment demand channel</H3>
      <P>
        Firms invest in AI infrastructure before productivity gains materialise. In the Lab, <em>inv_t</em> is a function of the current productivity flow plus a front-loaded Gaussian hump peaking around years 1–2, scaled by adoption speed. It enters the output-gap equation as a positive demand shift — demand pressure before the supply-side payoff arrives.
      </P>

      <H3>3.3 Output gap, inflation, and expectations</H3>
      <P>
        Inflation expectations are partly anchored to the 2% target and partly backward-looking:
      </P>
      <Eq>πₑₜ = ω · π* + (1 − ω) · πₜ₋₁</Eq>
      <P>
        The output gap evolves with inertia, rises with investment demand, and falls when the real interest rate exceeds neutral:
      </P>
      <Eq>yₜ = ρ · yₜ₋₁ + invₜ − σ · (iₜ₋₁ − πₜ₋₁ − r*)</Eq>
      <P>
        A linearised Phillips curve closes the inflation block. The output gap adds inflationary pressure; the productivity flow subtracts it:
      </P>
      <Eq>πₜ = πₑₜ + κ · yₜ − λ · gₜ</Eq>
      <P>
        The coefficient <em>λ = 0.7</em> governs pass-through speed: how quickly unit-cost reductions from AI reach consumer prices. Set it to zero and productivity gains have no disinflationary effect at all.
      </P>

      <H3>3.4 Monetary policy</H3>
      <P>
        The policy rate follows a Taylor-type rule with a zero lower bound:
      </P>
      <Eq>iₜ = max(0,  r* + π* + φπ · (πₜ − π*) + φy · yₜ)</Eq>
      <P>
        <em>φπ {`>`} 1</em> satisfies the Taylor principle — the real rate rises when inflation overshoots. Without this, inflation can drift permanently. <em>φy = 0.3</em> is fixed across all runs; only <em>φπ</em> moves with the hawkishness slider.
      </P>

      <H3>3.5 Unemployment</H3>
      <P>
        An Okun-type relation links unemployment to the output gap:
      </P>
      <Eq>uₜ = u* − Okun · yₜ</Eq>
      <P>
        The result is clamped to [1.5%, 14%] to prevent implausible paths at extreme slider settings.
      </P>

      <H3>3.6 Wage distribution</H3>
      <P>
        Each period, <em>wageShare</em> determines what fraction of <em>g_t</em> flows to wages at all; the rest goes to profits. Of the labour share, a higher-skill group (whose tasks AI complements) and a lower-skill group (whose tasks AI can replace) divide it unevenly:
      </P>
      <Eq>pool_t = g_t × wageShare</Eq>
      <Eq>highGrowthₜ = pool_t · (1 + 0.8 · replace)</Eq>
      <Eq>lowGrowthₜ  = pool_t · (1 − 1.7 · replace) − 0.6 · g_t · replace</Eq>
      <P>
        When <em>replace = 0</em>, both groups get equal shares. As <em>replace</em> rises, the lower-skill group loses out twice: a smaller share of the pool, plus a displacement drag proportional to the raw productivity flow. At high enough values of <em>replace</em>, lower-skill real wages fall even while aggregate productivity grows. Wage indices are cumulative products of (1 + growthₜ / 100), starting at 100.
      </P>

      {/* 4 */}
      <H2>4. Slider-to-parameter mapping</H2>
      <P>
        Four sliders drive the Lab. The table maps each to the parameters it touches, the range it spans, and the baseline value at the midpoint setting (0.5).
      </P>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--obs-border)" }}>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Slider</th>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Parameter(s)</th>
              <th className="text-left pb-2 pr-4 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Range</th>
              <th className="text-left pb-2 font-mono uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>Baseline (slider = 0.5)</th>
            </tr>
          </thead>
          <tbody className="leading-relaxed">
            <ParamRow
              slider="Speed of AI adoption"
              param="s, t₀, total gains, inv hump, ω"
              range="s: 0.5→1.6; total: 4→9 pp; ω: 0.75→0.45"
              baseline="s ≈ 1.05; midpoint ~yr 5; ~6.5 pp cumulative"
            />
            <ParamRow
              slider="Share of AI gains going to wages"
              param="wageShare"
              range="0 → 1"
              baseline="0.5 (equal split, wages and profits)"
            />
            <ParamRow
              slider="Central bank hawkishness"
              param="φπ"
              range="1.1 (dovish) → 2.5 (hawkish)"
              baseline="φπ = 1.8 (Taylor principle satisfied)"
            />
            <ParamRow
              slider="Labour-replacing vs complementing"
              param="replace"
              range="0 (complement) → 1 (replace)"
              baseline="0.5 (symmetric)"
            />
          </tbody>
        </table>
      </div>
      <P>
        Faster adoption also reduces <em>ω</em>, the expectation-anchoring weight. The logic: if productivity gains arrive quickly and unexpectedly, agents are slower to update their expectations toward target. At the slow extreme, <em>ω = 0.75</em>; at fast, <em>ω = 0.45</em>. All other parameters — <em>κ = 0.35</em>, <em>λ = 0.7</em>, <em>ρ = 0.55</em>, <em>σ = 0.5</em>, <em>φy = 0.3</em>, <em>Okun = 0.5</em>, <em>u* = 4.5%</em>, <em>r* = 1%</em>, <em>π* = 2%</em> — are fixed.
      </P>

      {/* 5 */}
      <H2>5. Outputs and comparisons</H2>

      <H3>5.1 Simulated paths</H3>
      <P>
        The model runs 15 annual steps starting from steady state: <em>π₀ = π*</em>, <em>y₋₁ = 0</em>, <em>i₋₁ = r* + π*</em>, both wage indices at 100. Each step applies the 6 equations above in sequence. All outputs are rounded to 2 decimal places.
      </P>

      <H3>5.2 Baseline vs scenario</H3>
      <P>
        The Lab holds 2 independent slider states: the current scenario and a saved baseline (default: all sliders at 0.5). Each produces its own complete set of paths. Charts show the baseline as a dashed line and the scenario as a solid line — distinguished by linestyle and opacity so the comparison works for colour-blind readers too.
      </P>
      <P>
        The wage-gap statistic is the difference in the 2 groups' indices at year 10 (position 9 in the zero-indexed 15-element array): <em>gap = wageHigh[9] − wageLow[9]</em>. This is reported separately for baseline and scenario so you can see what the slider change actually shifts, not just the absolute level.
      </P>

      <H3>5.3 Paycheque illustration</H3>
      <P>
        The paycheque calculator takes a starting nominal wage <em>W₀</em> and a worker type, then applies the wage index at year 10:
      </P>
      <Eq>W₁₀ = W₀ × (index[9] / 100)</Eq>
      <P>
        The wage indices are real — they reflect the model's productivity path, not a nominal deflator — so the result is expressed in approximate today's dollars without a separate CPI adjustment. The calculator runs for both baseline and scenario. It doesn't store user input.
      </P>

      {/* 6 */}
      <H2>6. Limitations</H2>
      <P>
        The model has no stochastic shocks. No uncertainty bands, no Monte Carlo draws — every path is deterministic given the sliders. That's a feature for intuition but a real constraint for any quantitative use.
      </P>
      <P>
        There's no financial sector. Credit conditions, asset prices, and bank lending don't appear. The policy rate feeds demand only through the simple IS-curve term in the output-gap equation, which misses most of how monetary tightening actually transmits in practice.
      </P>
      <P>
        It's a closed economy. No exchange rate, no export demand, no import competition. For small open economies like Singapore, that's a significant omission.
      </P>
      <P>
        "AI adoption" is treated as a single economy-wide aggregate. There's no sector decomposition, no distinction between general-purpose technology diffusion and narrow task automation, and no heterogeneity in how fast different industries adopt.
      </P>
      <P>
        The parameters aren't estimated from data. <em>κ = 0.35</em>, <em>λ = 0.7</em> and the rest are calibrated by feel to produce qualitatively plausible paths for a generic advanced economy. They won't match the cyclical properties of any specific country, and small changes in <em>κ</em> or <em>λ</em> can shift the qualitative story.
      </P>
      <P>
        What the model can speak to: direction of effects (does faster adoption tend to depress or raise inflation?), rough sequencing (does the demand boom arrive before or after the productivity dividend?), and which channel dominates under a given set of assumptions. What it can't do: point forecasts, country-specific projections, or policy scoring of any kind. Push the sliders to extremes and you'll get paths no real economy would follow.
      </P>
      <P>
        Every number the model produces — including the paycheque figures and the wage-gap statistics — follows from the internal logic of this particular simple system, not from any empirical estimate of AI's macroeconomic impact. Treat them accordingly.
      </P>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-xs font-mono" style={{ borderColor: "var(--obs-border)", color: "var(--obs-muted)" }}>
        <p>THE OBSERVATORY · Arin Jain · Technical Note</p>
        <p className="mt-1">
          Data: World Bank (<Mono>FP.CPI.TOTL.ZG</Mono>, <Mono>SL.GDP.PCAP.EM.KD</Mono>); FRED optional. Model: <Mono>model.ts</Mono>. Not a forecast. Not investment, financial, or policy advice.
        </p>
        <Link
          to="/mini/observatory"
          className="mt-3 inline-block hover:opacity-70 transition-opacity"
          style={{ color: "var(--obs-accent)" }}
        >
          ← Return to The Observatory
        </Link>
      </div>
    </div>
  );
}
