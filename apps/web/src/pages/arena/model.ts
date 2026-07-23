// The Arena — toy models for competition and efficiency.
//
// Everything here is a closed-form teaching model. No data is fetched. Each
// behavioural curve is shaped by published empirical or experimental work:
// the DIRECTION and ROUGH MAGNITUDE come from the literature, the exact
// numbers are rescaled into 0..100 indices so the visuals stay legible.
// Citations sit in a comment block above each function; the on-page
// Methodology and the /arena/methods Tech Note list them in full.
//
// Two places are extrapolations beyond a clean published magnitude and are
// flagged as such in the methodology: the Chapter-2 "choking" threshold and
// the Chapter-4 concentration-to-HHI mapping.

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const round1 = (x: number) => Math.round(x * 10) / 10;

// ===========================================================================
// CHAPTER 1 — How many firms is "too many?"
// number of firms (1..12) -> price, quality, slack indices (0..100)
// ===========================================================================

export interface Ch1Point {
  firms: number;
  price: number;
  quality: number;
  slack: number;
}

/*
 * PRICE vs number of competitors.
 * Anchor: Bresnahan & Reiss (1991), "Entry and Competition in Concentrated
 *   Markets", JPE. In isolated retail/professional markets, almost all of the
 *   competitive price effect is realised by the time the 3rd-5th firm enters;
 *   adding further firms barely moves price.
 * Borrowed: the convex, fast-decaying shape that flattens to an asymptote.
 *   Monopoly indexed at 100; floor ~60.
 */
export function priceIndex(n: number): number {
  return 60 + 40 * Math.exp(-0.55 * (n - 1));
}

/*
 * QUALITY / innovation vs competition.
 * Anchor: Aghion, Bloom, Blundell, Griffith & Howitt (2005), "Competition and
 *   Innovation: An Inverted-U Relationship", QJE. Innovation (and the quality
 *   it drives) is low under monopoly, peaks at intermediate competition, and
 *   falls again when many firms compete away the rents that fund investment.
 * Borrowed: the inverted-U with an interior peak around 4-5 firms.
 */
export function qualityIndex(n: number): number {
  return 40 + 55 * Math.exp(-Math.pow(n - 4.5, 2) / (2 * Math.pow(2.6, 2)));
}

/*
 * SLACK / waste / idle effort vs number of firms.
 * Anchors:
 *   - Leibenstein (1966), "Allocative Efficiency vs X-Efficiency", AER, and
 *     Bertrand & Mullainathan (2003), "Enjoying the Quiet Life?", JPE: weak
 *     competition lets managers run slack (the "quiet life"). -> high at monopoly.
 *   - Mankiw & Whinston (1986), "Free Entry and Social Inefficiency", RAND:
 *     with fixed costs, business-stealing drives excess entry and duplicated
 *     overhead. -> slack rises again when the market fragments.
 * Borrowed: a U-shape, minimised at moderate competition.
 */
export function slackIndex(n: number): number {
  const quietLife = 50 * Math.exp(-0.6 * (n - 1)); // monopoly slack, decays fast
  const duplication = 3.2 * Math.max(0, n - 5);    // excess-entry overhead
  return 25 + quietLife + duplication;
}

export function chapter1Curve(maxFirms = 12): Ch1Point[] {
  const out: Ch1Point[] = [];
  for (let n = 1; n <= maxFirms; n++) {
    out.push({
      firms: n,
      price: round1(priceIndex(n)),
      quality: round1(qualityIndex(n)),
      slack: round1(slackIndex(n)),
    });
  }
  return out;
}

// Short captions keyed to specific firm counts (front-end paraphrase, no cites).
export function chapter1Caption(n: number): string {
  if (n <= 1) return "One firm. No pressure on price, and little reason to trim slack: the classic quiet life.";
  if (n <= 3) return "The second and third entrant arrive. Price falls sharply and quality climbs as rivals push each other.";
  if (n <= 6) return "Around four or five firms, quality peaks and slack is lowest. Competition is doing useful work here.";
  if (n <= 9) return "Margins thin out. Duplicated overhead and churn start to show up as waste again.";
  return "Many small firms fight over thin margins. Quality and investment slip; effort gets duplicated across rivals.";
}

// ===========================================================================
// CHAPTER 2 — Behavioural competition lab
// (prizeSpread, monitoring, competition) -> effort allocation per worker
// ===========================================================================

export interface EffortMix {
  productive: number; // 0..1 share of the effort budget
  sabotage: number;   // 0..1
  rest: number;       // 0..1
}

export interface TeamResult {
  workers: EffortMix[];
  avgProductive: number;
  avgSabotage: number;
  avgRest: number;
  measuredOutput: number; // productive + gaming inflation, 0..100
  trueEfficiency: number; // productive only, 0..100
}

export interface Ch2Controls {
  prizeSpread: number; // 0 = proportional rewards .. 1 = winner-take-all
  monitoring: number;  // 0 = weak .. 1 = strong detection/penalty
  competition: number; // 0 = low pressure .. 1 = high pressure
}

/*
 * EFFORT ALLOCATION under competition.
 * Anchors:
 *   - Harbring & Irlenbusch (2011), "Sabotage in Tournaments: Evidence from a
 *     Laboratory Experiment", Management Science: destructive (sabotage) effort
 *     rises with the prize spread; widening the gap between winner and loser
 *     payoffs pulls effort out of production and into sabotage.
 *   - Lazear (1989), "Pay Equality and Industrial Politics", JPE: large pay
 *     spreads invite uncooperative/sabotaging behaviour ("hawk" play).
 *   - Charness, Masclet & Villeval (2014), "The Dark Side of Competition for
 *     Status", Management Science: salient competition raises sabotage and
 *     money-burning; monitoring/sanctions reduce it.
 *   - Ariely, Gneezy, Loewenstein & Mazar (2009), "Large Stakes and Big
 *     Mistakes", REStud: very high pressure can DEGRADE performance (choking).
 *
 * Borrowed shapes:
 *   sabotage  = sMax * spread^1.5 * (1 - monitoring)   (nonlinear in spread,
 *               multiplicatively suppressed by monitoring)
 *   rest      falls as competitive pressure rises
 *   choke     a productivity penalty that appears only at extreme pressure
 *             (threshold c > 0.8 is an EXTRAPOLATION, flagged in methodology)
 */
export function allocateEffort(c: Ch2Controls, workerBias = 0): EffortMix {
  const sMax = 0.45;
  let sabotage = sMax * Math.pow(c.prizeSpread, 1.5) * (1 - c.monitoring);
  // Small per-worker heterogeneity so a team doesn't render as identical bars.
  sabotage = clamp(sabotage + workerBias, 0, 0.7);

  let rest = 0.35 * (1 - c.competition) + 0.1;
  // Choking: above ~0.8 pressure, some productive effort decays into stress /
  // disengagement (Ariely et al.). The 0.8 knee is illustrative, not estimated.
  const choke = 0.15 * Math.max(0, c.competition - 0.8) / 0.2;
  rest = clamp(rest + choke, 0, 0.85);

  let productive = 1 - sabotage - rest;
  productive = clamp(productive, 0, 1);

  // Renormalise to a clean unit budget.
  const total = productive + sabotage + rest || 1;
  return {
    productive: productive / total,
    sabotage: sabotage / total,
    rest: rest / total,
  };
}

/*
 * Team aggregation.
 * measuredOutput counts productive effort plus a fraction of sabotage, because
 * gaming can inflate the metric the firm actually observes (KPI manipulation).
 * trueEfficiency counts only productive effort. The wedge between them is the
 * behavioural cost of the incentive scheme.
 */
export function teamResult(c: Ch2Controls, size = 4): TeamResult {
  const GAMING_INFLATION = 0.5;
  const biases = [-0.04, 0.0, 0.05, -0.02, 0.03].slice(0, size);
  const workers = biases.map((b) => allocateEffort(c, b));
  const avg = (sel: (w: EffortMix) => number) =>
    workers.reduce((a, w) => a + sel(w), 0) / workers.length;

  const avgProductive = avg((w) => w.productive);
  const avgSabotage = avg((w) => w.sabotage);
  const avgRest = avg((w) => w.rest);

  return {
    workers,
    avgProductive,
    avgSabotage,
    avgRest,
    measuredOutput: round1((avgProductive + GAMING_INFLATION * avgSabotage) * 100),
    trueEfficiency: round1(avgProductive * 100),
  };
}

// The 4-step autoplay sequence shown on scroll-entry, then handed to the user.
export const CH2_SEQUENCE: { label: string; controls: Ch2Controls; note: string }[] = [
  {
    label: "Balanced & watched",
    controls: { prizeSpread: 0.2, monitoring: 0.8, competition: 0.4 },
    note: "Proportional rewards and strong monitoring. Almost all effort is productive.",
  },
  {
    label: "Raise the stakes",
    controls: { prizeSpread: 0.85, monitoring: 0.8, competition: 0.6 },
    note: "Winner-take-all, but still watched closely. Effort rises; sabotage stays contained.",
  },
  {
    label: "Look away",
    controls: { prizeSpread: 0.85, monitoring: 0.15, competition: 0.6 },
    note: "Same big prize gap, weak monitoring. Sabotage jumps as gaming goes undetected.",
  },
  {
    label: "Crank the pressure",
    controls: { prizeSpread: 0.85, monitoring: 0.15, competition: 0.95 },
    note: "Extreme pressure on top of weak monitoring. Some effort tips into stress and disengagement.",
  },
];

export const CH2_DEFAULT: Ch2Controls = { prizeSpread: 0.5, monitoring: 0.5, competition: 0.5 };

// Plain-language read of the current Chapter-2 state.
export function chapter2Narrative(c: Ch2Controls, t: TeamResult): string {
  const wedge = Math.round(t.measuredOutput - t.trueEfficiency);
  const spreadHi = c.prizeSpread >= 0.6;
  const monLo = c.monitoring < 0.4;
  if (spreadHi && monLo) {
    return `Wide prize spread with weak monitoring pulls effort into sabotage. Measured output reads ${t.measuredOutput} but true efficiency is only ${t.trueEfficiency} — a ${wedge}-point gap that is pure gaming.`;
  }
  if (c.competition > 0.85) {
    return `Pressure is high enough that some workers disengage rather than push harder. Productive effort stops rising and true efficiency sits at ${t.trueEfficiency}.`;
  }
  if (!spreadHi && !monLo) {
    return `Rewards are fairly flat and monitoring is tight, so there is little to gain from gaming. Measured output (${t.measuredOutput}) and true efficiency (${t.trueEfficiency}) nearly coincide.`;
  }
  return `Measured output is ${t.measuredOutput}; true efficiency is ${t.trueEfficiency}. The gap is the share of "performance" that is really sabotage or gaming.`;
}

// ===========================================================================
// CHAPTER 3 — Market outcomes explorer
// (concentration C in 0..1, distortion D in 0..0.4) -> four outcome indices
// ===========================================================================

export interface Ch3Result {
  price: number;
  quality: number;
  innovation: number;
  surplus: number;
  deadweight: number;
}

/*
 * Outcome model on the concentration-distortion plane.
 * C = market concentration (0 highly competitive .. 1 monopoly)
 * D = behavioural distortion = share of effort wasted (0 .. 0.4)
 *
 * Anchors:
 *   - Price rising with concentration: De Loecker, Eeckhout & Unger (2020),
 *     "The Rise of Market Power and the Macroeconomic Implications", QJE —
 *     markups rise with concentration.
 *   - Quality & innovation inverted-U in competition: Aghion et al. (2005),
 *     as in Chapter 1 (here expressed over concentration, so the peak sits at
 *     intermediate C).
 *   - Distortion eroding quality/innovation and inflating deadweight loss:
 *     Harberger (1954) for the baseline welfare triangle; Tullock (1967) and
 *     Posner (1975) on rent-seeking, where wasted effort dissipates the gains
 *     from a position rather than creating value.
 * Borrowed: directions and rough curvature; coefficients rescaled to 0..100.
 */
export function marketOutcomes(C: number, D: number): Ch3Result {
  const price = 62 + 38 * Math.pow(C, 0.7);

  const qBase = 45 + 55 * Math.exp(-Math.pow(C - 0.45, 2) / (2 * Math.pow(0.22, 2)));
  const quality = qBase * (1 - 0.8 * D);

  const iBase = 40 + 60 * Math.exp(-Math.pow(C - 0.4, 2) / (2 * Math.pow(0.25, 2)));
  const innovation = iBase * (1 - 0.5 * D);

  // Consumer surplus: better when prices are low, quality high, distortion low.
  const surplusRaw = 0.5 * (100 - price) + 0.4 * quality - 60 * D;
  const surplus = clamp(surplusRaw, 0, 100);

  // Deadweight loss: market power (Harberger) + rent-seeking waste (Tullock/
  // Posner) + an interaction (distortion bites harder where power is high).
  const deadweight = clamp(8 + 35 * Math.pow(C, 1.3) + 60 * D + 25 * C * D, 0, 100);

  return {
    price: round1(price),
    quality: round1(quality),
    innovation: round1(innovation),
    surplus: round1(surplus),
    deadweight: round1(deadweight),
  };
}

// Sweep one axis for the small multiples in Chapter 3. Return rows carry an
// index signature so they drop straight into recharts data props.
export function sweepConcentration(D: number, steps = 25): Record<string, number>[] {
  const out: Record<string, number>[] = [];
  for (let i = 0; i <= steps; i++) {
    const C = i / steps;
    out.push({ C: Math.round(C * 100) / 100, ...marketOutcomes(C, D) });
  }
  return out;
}

export const CH3_DEFAULT = { concentration: 0.45, distortion: 0.1 };

// ===========================================================================
// CHAPTER 4 — Policy lenses
// Same C-D space, three interpretive overlays.
// ===========================================================================

export type LensKey = "antitrust" | "consumer" | "firm";

export interface Lens {
  key: LensKey;
  label: string;
  blurb: string;
  // Region predicate: given C and D, is this point inside the lens's flagged
  // zone? Used to shade the C-D heat grid.
  zone: (C: number, D: number) => "danger" | "sweet" | "watch" | "neutral";
  commentary: string;
}

/*
 * Concentration -> HHI proxy.
 * Under a symmetric-firm assumption, n equal firms give HHI = 10000 / n. We map
 * C in [0,1] to an effective firm count and read off HHI so the antitrust bands
 * land near the published screens. This symmetric mapping is an EXTRAPOLATION
 * (real markets are asymmetric); flagged in the methodology.
 * Screens: US Horizontal Merger Guidelines 2010 — 1500 (unconcentrated /
 *   moderate) and 2500 (highly concentrated); 2023 Merger Guidelines tightened
 *   the structural presumption to HHI 1800 with a 100-point delta-HHI screen.
 */
export function concentrationToHHI(C: number): number {
  // C=0 -> ~12 firms (HHI ~830), C=1 -> 1 firm (HHI 10000).
  const nFirms = clamp(12 - 11 * C, 1, 12);
  return Math.round(10000 / nFirms);
}

export const LENSES: Lens[] = [
  {
    key: "antitrust",
    label: "Antitrust regulator",
    blurb:
      "Watches for concentration high enough to raise prices and deter entry. Flags the high-concentration, high-price corner as a danger zone.",
    zone: (C) => {
      const hhi = concentrationToHHI(C);
      if (hhi >= 2500) return "danger"; // highly concentrated (2010 HMG)
      if (hhi >= 1800) return "watch";  // structural presumption (2023 MG)
      return "neutral";
    },
    commentary:
      "On the merger-guidelines screens, HHI above 2500 is highly concentrated and above 1800 trips the 2023 structural presumption. In that corner prices run high and the risk is under-entry or exclusion, not wasteful rivalry.",
  },
  {
    key: "consumer",
    label: "Consumer advocate",
    blurb:
      "Looks for the band where prices are low, quality is high, and little effort is wasted. That sweet spot sits at moderate competition with low distortion.",
    zone: (C, D) => {
      const o = marketOutcomes(C, D);
      if (o.price < 80 && o.quality > 80 && D < 0.12) return "sweet";
      if (o.price > 92 || D > 0.28) return "watch";
      return "neutral";
    },
    commentary:
      "Consumers do best in a fairly narrow band: enough competition to hold prices down and quality up, but not so much distortion that effort is burned on gaming. Both extremes — monopoly pricing and waste-heavy fragmentation — push them out of it.",
  },
  {
    key: "firm",
    label: "Firm strategist",
    blurb:
      "Cares about stable margins. Likes intermediate concentration; fears the low-concentration, high-distortion corner where competition turns destructive.",
    zone: (C, D) => {
      if (C < 0.25 && D > 0.2) return "danger"; // destructive competition
      if (C >= 0.35 && C <= 0.7 && D < 0.2) return "sweet"; // stable margins
      return "neutral";
    },
    commentary:
      "A strategist wants room to earn a return. Intermediate concentration with low distortion gives stable margins. The corner to fear is fragmented and waste-heavy: thin margins, churn, and effort spent fighting rivals rather than serving customers (excess entry, Mankiw & Whinston).",
  },
];

// Build the C-D heat grid a lens shades. Returns a grid of zone labels.
export function lensGrid(lens: Lens, cols = 12, rows = 8): { C: number; D: number; zone: string }[] {
  const cells: { C: number; D: number; zone: string }[] = [];
  for (let r = 0; r < rows; r++) {
    const D = (r / (rows - 1)) * 0.4;
    for (let cI = 0; cI < cols; cI++) {
      const C = cI / (cols - 1);
      cells.push({ C: Math.round(C * 100) / 100, D: Math.round(D * 1000) / 1000, zone: lens.zone(C, D) });
    }
  }
  return cells;
}
