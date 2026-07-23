// A deliberately small, deterministic macro engine shared by the walkthrough
// scenarios (Step 3) and the Lab sandbox. It is NOT a forecast. It is a
// reduced-form, New-Keynesian-flavoured system, chosen so the qualitative
// patterns match the labels users select. Parameters are kept readable.
//
// One step = one year. All rates are in percentage points.
//
//   expected inflation   πe = ω·π* + (1-ω)·π₋₁           (partly anchored)
//   output gap            y = ρ·y₋₁ + invest − σ·(i₋₁ − π₋₁ − r*)
//   inflation             π = πe + κ·y − λ·g              (g = AI productivity flow)
//   policy rate           i = max(0, r* + π* + φπ·(π−π*) + φy·y)   (Taylor, ZLB)
//   unemployment          u = u* − Okun·y
//   real wages (2 groups) depend on how much of g goes to labour (wageShare)
//                          and whether AI replaces or complements each group.

export interface ModelParams {
  H: number;        // horizon in years
  piStar: number;   // inflation target
  rStar: number;    // neutral real rate
  kappa: number;    // Phillips slope on output gap
  lambda: number;   // disinflationary pull of productivity growth
  omega: number;    // expectation anchoring (1 = fully anchored)
  rho: number;      // output-gap persistence
  sigma: number;    // demand sensitivity to the real rate
  phiPi: number;    // Taylor response to inflation (hawkishness)
  phiY: number;     // Taylor response to output
  okun: number;     // output gap -> unemployment
  uNat: number;     // natural unemployment rate
  wageShare: number;     // share of AI gains flowing to wages (0..1)
  labourReplace: number; // 0 = pure complement, 1 = strongly labour-replacing
}

export interface Exogenous {
  gains: number[];   // per-year AI productivity growth contribution (pp), length H
  invest: number[];  // per-year demand boost from AI investment/hype (pp), length H
}

export interface SimResult {
  years: number[];
  inflation: number[];
  unemployment: number[];
  outputGap: number[];
  policyRate: number[];
  realWageHigh: number[]; // index, base 100 — higher-skill / complemented tasks
  realWageLow: number[];  // index, base 100 — lower-skill / replaceable tasks
}

export const DEFAULT_PARAMS: ModelParams = {
  H: 15,
  piStar: 2,
  rStar: 1,
  kappa: 0.35,
  lambda: 0.7,
  omega: 0.7,
  rho: 0.55,
  sigma: 0.5,
  phiPi: 1.5,
  phiY: 0.3,
  okun: 0.5,
  uNat: 4.5,
  wageShare: 0.5,
  labourReplace: 0.5,
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export function simulate(exog: Exogenous, p: ModelParams, startYear = new Date().getFullYear()): SimResult {
  const H = p.H;
  const years: number[] = [];
  const inflation: number[] = [];
  const unemployment: number[] = [];
  const outputGap: number[] = [];
  const policyRate: number[] = [];
  const realWageHigh: number[] = [];
  const realWageLow: number[] = [];

  let piPrev = p.piStar;
  let yPrev = 0;
  let iPrev = p.rStar + p.piStar;
  let wHigh = 100;
  let wLow = 100;

  for (let t = 0; t < H; t++) {
    const g = exog.gains[t] ?? 0;
    const inv = exog.invest[t] ?? 0;

    const pe = p.omega * p.piStar + (1 - p.omega) * piPrev;
    const y = p.rho * yPrev + inv - p.sigma * (iPrev - piPrev - p.rStar);
    const pi = pe + p.kappa * y - p.lambda * g;
    const i = Math.max(0, p.rStar + p.piStar + p.phiPi * (pi - p.piStar) + p.phiY * y);
    const u = clamp(p.uNat - p.okun * y, 1.5, 14);

    // Distribute the labour share of productivity gains across two groups.
    // replace=1 tilts gains to the complemented (high-skill) group and imposes
    // a displacement drag on the replaceable (low-skill) group.
    const pool = g * p.wageShare; // pp of real wage growth available to labour
    const highGrowth = pool * (1 + 0.8 * p.labourReplace);
    const lowGrowth = pool * (1 - 1.7 * p.labourReplace) - 0.6 * g * p.labourReplace;

    wHigh *= 1 + highGrowth / 100;
    wLow *= 1 + lowGrowth / 100;

    years.push(startYear + t);
    inflation.push(round(pi));
    unemployment.push(round(u));
    outputGap.push(round(y));
    policyRate.push(round(i));
    realWageHigh.push(round(wHigh));
    realWageLow.push(round(wLow));

    piPrev = pi;
    yPrev = y;
    iPrev = i;
  }

  return { years, inflation, unemployment, outputGap, policyRate, realWageHigh, realWageLow };
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}

// --- Exogenous-path builders ----------------------------------------------

// Logistic adoption curve; returns the per-year *flow* (new adoption each year),
// scaled so the cumulative effect equals `total`.
export function logisticFlow(H: number, speed: number, total: number, midFrac: number): number[] {
  const t0 = midFrac * (H - 1);
  const level = (t: number) => 1 / (1 + Math.exp(-speed * (t - t0)));
  const raw: number[] = [];
  let prev = level(-1);
  for (let t = 0; t < H; t++) {
    const cur = level(t);
    raw.push(cur - prev);
    prev = cur;
  }
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  return raw.map((r) => (r / sum) * total);
}

// --- Walkthrough scenarios (Step 3) ---------------------------------------

export type ScenarioKey = "real" | "hype-then-real" | "hype-only";

export interface Scenario {
  key: ScenarioKey;
  label: string;
  blurb: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "real",
    label: "Unexpected productivity gains",
    blurb:
      "Real, broad AI gains arrive faster than expectations adjust. Falling unit costs pull inflation below target; the central bank can ease.",
  },
  {
    key: "hype-then-real",
    label: "AI hype, then real gains",
    blurb:
      "An investment boom lifts demand and inflation first; rates rise. Productivity catches up a few years later and inflation drifts back down.",
  },
  {
    key: "hype-only",
    label: "AI hype without gains",
    blurb:
      "A demand and investment boom with little productivity payoff. Inflation rises, the bank tightens, and the unwind leaves higher unemployment.",
  },
];

export function buildScenario(key: ScenarioKey): { exog: Exogenous; params: ModelParams } {
  const H = 12;
  const params: ModelParams = { ...DEFAULT_PARAMS, H };
  const gains = new Array(H).fill(0);
  const invest = new Array(H).fill(0);

  if (key === "real") {
    // Sticky expectations let the disinflation show through.
    params.omega = 0.45;
    const g = logisticFlow(H, 0.9, 6, 0.4); // ~6pp cumulative productivity
    for (let t = 0; t < H; t++) {
      gains[t] = g[t];
      invest[t] = 0.4 * g[t]; // modest investment that accompanies real gains
    }
  } else if (key === "hype-then-real") {
    // Investment hump in years 1-4, gains arrive from year 4.
    for (let t = 0; t < H; t++) {
      invest[t] = 2.2 * Math.exp(-Math.pow(t - 2, 2) / 2.5);
    }
    const g = logisticFlow(H, 1.0, 5.5, 0.6);
    for (let t = 0; t < H; t++) gains[t] = g[t];
  } else {
    // Hype only: large early investment boom, negligible gains, then unwind.
    for (let t = 0; t < H; t++) {
      invest[t] = 3.0 * Math.exp(-Math.pow(t - 2, 2) / 3) - 1.2 * Math.exp(-Math.pow(t - 6, 2) / 4);
    }
    // near-zero productivity payoff
    for (let t = 0; t < H; t++) gains[t] = 0.05;
  }

  return { exog: { gains, invest }, params };
}

// --- Lab sandbox -----------------------------------------------------------

export interface LabSliders {
  adoptionSpeed: number;  // 0..1  (slow -> fast)
  wageShare: number;      // 0..1  (profits -> wages)
  hawkishness: number;    // 0..1  (dovish -> hawkish)
  labourReplace: number;  // 0..1  (complement -> replace)
}

export const DEFAULT_SLIDERS: LabSliders = {
  adoptionSpeed: 0.5,
  wageShare: 0.5,
  hawkishness: 0.5,
  labourReplace: 0.5,
};

export function buildLab(s: LabSliders): { exog: Exogenous; params: ModelParams } {
  const H = 15;
  // Faster adoption => steeper logistic, earlier midpoint, slightly larger total.
  const speed = 0.5 + s.adoptionSpeed * 1.1;
  const midFrac = 0.65 - s.adoptionSpeed * 0.35;
  const total = 4 + s.adoptionSpeed * 5; // 4..9 pp cumulative productivity
  const gains = logisticFlow(H, speed, total, midFrac);

  // Investment anticipates gains; faster adoption => bigger, earlier boom.
  const invest = gains.map((g, t) => g * (0.6 + 0.8 * s.adoptionSpeed) + 0.4 * s.adoptionSpeed * Math.exp(-Math.pow(t - 1, 2) / 2));

  const params: ModelParams = {
    ...DEFAULT_PARAMS,
    H,
    phiPi: 1.1 + s.hawkishness * 1.4,   // 1.1 (dovish) .. 2.5 (hawkish)
    omega: 0.75 - s.adoptionSpeed * 0.3, // fast surprises are less anchored
    wageShare: s.wageShare,
    labourReplace: s.labourReplace,
  };

  return { exog: { gains, invest }, params };
}

export function labLabel(value: number): "low" | "medium" | "high" {
  return value < 0.34 ? "low" : value < 0.67 ? "medium" : "high";
}

// --- Named Lab presets --------------------------------------------------------

export interface LabPreset {
  key: string;
  label: string;
  sliders: LabSliders;
  description: string;
}

export const LAB_PRESETS: LabPreset[] = [
  {
    key: "hype-no-gains",
    label: "Hype, no gains",
    sliders: { adoptionSpeed: 0.82, wageShare: 0.25, hawkishness: 0.78, labourReplace: 0.72 },
    description: "Fast expected adoption, weak productivity payoff, hawkish bank, labour-replacing.",
  },
  {
    key: "slow-broad-gains",
    label: "Slow, broad gains",
    sliders: { adoptionSpeed: 0.18, wageShare: 0.82, hawkishness: 0.22, labourReplace: 0.18 },
    description: "Slow diffusion, gains broadly shared via wages, dovish bank, tasks complement labour.",
  },
  {
    key: "profit-heavy-boom",
    label: "Profit-heavy boom",
    sliders: { adoptionSpeed: 0.82, wageShare: 0.12, hawkishness: 0.22, labourReplace: 0.5 },
    description: "Fast adoption, productivity dividend tilts heavily to profits, bank stays loose.",
  },
  {
    key: "worker-friendly",
    label: "Worker-friendly AI",
    sliders: { adoptionSpeed: 0.78, wageShare: 0.88, hawkishness: 0.5, labourReplace: 0.12 },
    description: "Fast adoption, high wage share, moderate CB response, strongly complementing.",
  },
];

// --- Dynamic narrative (3 sentences keyed to model outputs) -------------------

export interface DynamicNarrative {
  inflation: string;
  unemployment: string;
  wageGap: string;
}

export function dynamicNarrative(r: SimResult): DynamicNarrative {
  const TARGET = 2;
  const H = r.years.length;

  const peakPi = Math.max(...r.inflation);
  const peakPiYr = r.years[r.inflation.indexOf(peakPi)];
  const troughPi = Math.min(...r.inflation);
  const finalPi = r.inflation[H - 1];

  const peakU = Math.max(...r.unemployment);
  const peakUYr = r.years[r.unemployment.indexOf(peakU)];
  const finalU = r.unemployment[H - 1];

  const yr10 = Math.min(9, H - 1);
  const wH10 = r.realWageHigh[yr10];
  const wL10 = r.realWageLow[yr10];
  const gap10 = wH10 - wL10;

  // Inflation sentence
  let inflation: string;
  if (peakPi > TARGET + 2) {
    if (finalPi > TARGET + 1.5) {
      inflation = `Inflation surges to ${peakPi.toFixed(1)}% around year ${peakPiYr} and remains well above the 2% target by the end of the window (${finalPi.toFixed(1)}%) — the central bank cannot fully contain the overshoot.`;
    } else {
      inflation = `Inflation peaks at ${peakPi.toFixed(1)}% around year ${peakPiYr}, then gradually returns toward 2% — the overshoot is significant but eventually absorbed.`;
    }
  } else if (peakPi > TARGET + 0.4) {
    inflation = `Inflation peaks at ${peakPi.toFixed(1)}% around year ${peakPiYr}, then converges back toward the 2% target — a moderate, manageable overshoot.`;
  } else if (troughPi < TARGET - 0.4) {
    inflation = `Inflation falls below target, reaching ${troughPi.toFixed(1)}% at its trough — the disinflationary pull of productivity dominates the demand effect.`;
  } else {
    inflation = `Inflation stays close to the 2% target throughout, peaking at only ${peakPi.toFixed(1)}% — adoption is smooth enough that neither demand nor supply effects dominate.`;
  }

  // Unemployment sentence
  const unemployment = `Unemployment reaches ${peakU.toFixed(1)}% around year ${peakUYr}${peakU < 5 ? ", staying near natural levels throughout" : ""}, then settles near ${finalU.toFixed(1)}% by year ${r.years[H - 1]}.`;

  // Wage-gap sentence
  let wageGap: string;
  if (gap10 > 10) {
    wageGap = `By year 10, higher-skill wages index at ${wH10.toFixed(0)} vs ${wL10.toFixed(0)} for lower-skill workers — a gap of ${gap10.toFixed(0)} index points, reflecting concentrated gains at the top.`;
  } else if (gap10 > 3) {
    wageGap = `By year 10, higher-skill workers lead with an index of ${wH10.toFixed(0)} vs ${wL10.toFixed(0)} for lower-skill — a ${gap10.toFixed(0)}-point gap that grows over the period.`;
  } else if (gap10 < -2) {
    wageGap = `By year 10, lower-skill workers edge ahead (index ${wL10.toFixed(0)} vs ${wH10.toFixed(0)}), an unusual outcome driven by the complement-heavy adoption path here.`;
  } else {
    wageGap = `By year 10, the two wage indices are close — higher-skill: ${wH10.toFixed(0)}, lower-skill: ${wL10.toFixed(0)} — suggesting fairly broad sharing of the productivity dividend.`;
  }

  return { inflation, unemployment, wageGap };
}

// One-paragraph plain-language read of the current lab settings + result.
export function describeLab(s: LabSliders, r: SimResult): string {
  const adopt = s.adoptionSpeed >= 0.6 ? "fast" : s.adoptionSpeed >= 0.34 ? "moderate" : "slow";
  const wagesWeak = s.wageShare < 0.4;
  const hawkish = s.hawkishness >= 0.6;
  const replacing = s.labourReplace >= 0.6;

  const lowEnd = r.realWageLow[r.realWageLow.length - 1];
  const peakU = Math.max(...r.unemployment);
  const trough = Math.min(...r.inflation);

  const parts: string[] = [];
  parts.push(
    adopt === "fast"
      ? "Fast AI adoption pushes productivity up quickly, which tends to pull inflation down"
      : adopt === "moderate"
        ? "Moderate AI adoption feeds productivity through gradually, nudging inflation down"
        : "Slow AI adoption spreads the productivity effect out, so disinflation is mild and gradual"
  );
  parts.push(
    hawkish
      ? "and a hawkish central bank reinforces that with higher rates, at the cost of more unemployment"
      : "and a dovish central bank lets demand run warmer, keeping unemployment lower"
  );
  let tail: string;
  if (replacing && wagesWeak) {
    tail = `lower-skill real wages fall (index ends near ${lowEnd.toFixed(0)}) while the gains accrue mainly to profits`;
  } else if (replacing) {
    tail = "higher-skill workers capture most of the gains while lower-skill wages lag";
  } else if (wagesWeak) {
    tail = "most of the productivity dividend shows up as profits rather than wages";
  } else {
    tail = "both worker groups share in the productivity dividend fairly evenly";
  }
  return `${parts[0]}, ${parts[1]}. Meanwhile, ${tail}. Inflation troughs around ${trough.toFixed(1)}% and unemployment peaks near ${peakU.toFixed(1)}%.`;
}
