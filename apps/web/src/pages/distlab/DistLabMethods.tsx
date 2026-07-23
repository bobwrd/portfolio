import { useEffect } from "react";
import { Section, Card, Eq, Details } from "./shared";
import { REGIME_KEYS, REGIME_META } from "./types";

export default function DistLabMethods() {
  useEffect(() => { document.title = "Arin Jain — The Distribution Lab: Methods"; }, []);
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-2">
        <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--dl-accent)" }}>
          Technical note · Arin Jain
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--dl-text)" }}>
          The Distribution Lab: data, indices and mapping
        </h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--dl-muted)" }}>
          Where the numbers come from, how the regime indices are constructed, and what the Playground analogue mapping
          actually does. The Lab is not a forecasting tool; every output traces back to observed country-years.
        </p>
      </div>

      <Section id="modes" eyebrow="Two modes" title="History and Playground">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          History mode shows one country across 1990 to 2020. The year scrubber drives three panels: distribution (Gini,
          top-10% share, poverty headcount), education-based mobility, and macro and wellbeing indicators. The regime bar
          shows eight discretised dimensions for that country-year; interpolated values are flagged.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          Playground mode turns the regime bar into sliders. The question shifts: among real country-years with a similar
          regime, what did distribution, mobility, and wellbeing look like? The answer comes from observed episodes
          weighted by proximity, not from a fitted model.
        </p>
      </Section>

      <Section id="sources" eyebrow="Data" title="Sources and coverage">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text)" }}>
          Five visible countries (United States, Sweden, India, Brazil, Nigeria) plus ten calibration countries that
          populate the analogue space. Sources split by how they are acquired:
        </p>
        <Card title="World Bank WDI (fetched)">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
            GDP per capita (PPP), GNI per capita, Gini, poverty headcount at $2.15/day, secondary enrolment, trade
            openness, sector shares, self-employment, tax revenue, GDP per worker. Pulled 1990–2020 by{" "}
            <code>scripts/distlab/fetch-wdi.mjs</code>; when present, supersedes curated benchmarks.
          </p>
        </Card>
        <div className="mt-4" />
        <Card title="Curated (WID, UNDP, OECD, ICTWSS, GDIM)">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
            Top-10% income share (WID), schooling years and HDI (UNDP HDR), union density and bargaining coverage
            (OECD/AIAS ICTWSS), social expenditure (OECD SOCX), minimum-wage-to-median ratio and top marginal tax rate
            (OECD), and education-based mobility matrices (GDIM). Not in WDI or too sparse there; interpolated between
            benchmark years.
          </p>
        </Card>
        <p className="text-xs leading-relaxed mt-4" style={{ color: "var(--dl-muted)" }}>
          Every field carries a source tag and an interpolation flag, visible in panel tooltips. Linear interpolation
          only; no extrapolation beyond a country's observed span.
        </p>
      </Section>

      <Section id="indices" eyebrow="Regime indices" title="How the eight dimensions are built">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-text)" }}>
          Each regime dimension is a raw metric (or a small blend) normalised to 0 to 1 by min-max scaling across the
          whole country pool, winsorised at the 2nd and 98th percentiles so a single outlier year does not compress the
          scale. The continuous value drives the distance metric; a 5-level bucket drives the display dots.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {REGIME_KEYS.map((k) => (
            <div key={k} className="rounded-lg border p-3" style={{ borderColor: "var(--dl-border)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--dl-text)" }}>{REGIME_META[k].label}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--dl-muted)" }}>{REGIME_META[k].blurb}</div>
              <div className="text-[0.65rem] font-mono mt-1" style={{ color: "var(--dl-accent)" }}>raw: {REGIME_META[k].rawLabel}</div>
            </div>
          ))}
        </div>
        <Details summary="Blended indices">
          <p>Two dimensions combine more than one raw metric:</p>
          <Eq>tax_progressivity = 0.7 · top_marginal_rate + 0.3 · tax_revenue_%GDP</Eq>
          <Eq>labour_power = 0.6 · union_density + 0.4 · bargaining_coverage</Eq>
          <p>Sector mix is carried as three shares for display, but only the services share feeds the distance metric (the structural axis), so structure is not triple-counted.</p>
        </Details>
      </Section>

      <Section id="mapping" eyebrow="Playground" title="From sliders to outcomes">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          Every observed country-year is a point in 8-dimensional regime space. For a slider configuration: measure
          distance to each point, weight by a Gaussian kernel, take weighted means.
        </p>
        <Eq>distance(target, point) = sqrt( Σ wᵢ · (targetᵢ − pointᵢ)² )</Eq>
        <Eq>weight(point) = exp( −distance² / (2 · h²) ),  h = median(distance) · 0.6</Eq>
        <Eq>estimate(metric) = Σ weight · metric / Σ weight</Eq>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--dl-text)" }}>
          Distance uses raw 0-1 indices, not z-scores. The indices already share a common scale; z-scoring would
          amplify a dimension just because countries cluster on it, inverting what similarity should mean. A Gaussian
          kernel rather than fixed k-NN lets weight decay to zero: when no observed point is close, the effective
          neighbour count collapses and the Lab says so explicitly.
        </p>
        <Details summary="Effective neighbour count and the extrapolation gate">
          <p>The number of episodes that actually back an estimate is the effective sample size of the weights:</p>
          <Eq>effectiveN = (Σ weight)² / Σ weight²</Eq>
          <p>
            An estimate is flagged as extrapolation when effectiveN falls below 4, or when the nearest observed point is
            more than 1.0 away in raw index units (roughly an average mismatch of 0.35 per axis across eight axes). In
            that state the panels desaturate, the Lorenz area switches to a hatched fill, and the evidence strip warns
            that there is no close real-world analogue.
          </p>
        </Details>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--dl-text)" }}>
          The evidence drawer lists the highest-weight contributing episodes with their country, year and key outcomes,
          so any simulated state can be traced back to the real observations that produced it.
        </p>
      </Section>

      <Section id="mobility" eyebrow="Mobility" title="The sparsest panel">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--dl-text)" }}>
          The mobility panel is the least complete. GDIM reports intergenerational education mobility by 10-year birth
          cohort — not income decile transitions. Two GDIM numbers (absolute upward mobility and persistence) generate a
          3×3 row-stochastic matrix over bottom, middle, and top education groups:
        </p>
        <Eq>bottom→stay = 0.25 + 0.55 · persistence    bottom→top = 0.45 · upward_mobility</Eq>
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          This is an approximation, labelled as such. Where a country-cohort has no usable GDIM data, the panel shows a
          data-unavailable state rather than a synthetic matrix. In Playground mode the nearest analogue country's matrix
          is shown, with attribution.
        </p>
      </Section>

      <Section id="limits" eyebrow="Limits" title="What this is not">
        <p className="text-sm leading-relaxed" style={{ color: "var(--dl-text)" }}>
          Moving a slider does not predict what would happen if a country changed that policy. It shows what distribution
          looked like in real episodes with a similar regime configuration — which bundles the policy with every other
          feature those countries had. Correlations in the analogue space are not treatment effects. Benchmark values are
          interpolated, so trends are more reliable than individual year readings. Nothing here is policy advice.
        </p>
      </Section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t" style={{ borderColor: "var(--dl-border)" }}>
        <a href="/mini/lab" className="text-sm hover:underline" style={{ color: "var(--dl-accent)" }}>← Back to the Lab</a>
      </div>
    </div>
  );
}
