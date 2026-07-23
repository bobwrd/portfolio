import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Eq } from "./shared";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mt-10 mb-3 tracking-tight" style={{ color: "var(--arena-text)" }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold mt-6 mb-2" style={{ color: "var(--arena-accent)" }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--arena-text)" }}>
      {children}
    </p>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs px-1 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--arena-surface-2)", color: "var(--arena-accent)" }}>
      {children}
    </code>
  );
}

export default function ArenaMethods() {
  useEffect(() => {
    document.title = "Technical Note — The Arena · Arin Jain";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link
        to="/mini/arena"
        className="text-xs font-mono tracking-wider mb-8 inline-block transition-opacity hover:opacity-70"
        style={{ color: "var(--arena-muted)" }}
      >
        ← Back to The Arena
      </Link>

      {/* Title block */}
      <div className="mt-4 mb-10 border-b pb-8" style={{ borderColor: "var(--arena-border)" }}>
        <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "var(--arena-accent)" }}>
          Technical Note · Methods Appendix
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--arena-text)" }}>
          The Arena — Competition and Efficiency: Behavioural Curves, Outcome Functions, and Policy Thresholds
        </h1>
        <p className="text-xs font-mono mb-6" style={{ color: "var(--arena-muted)" }}>
          Arin Jain · {new Date().getFullYear()}
        </p>
        <div
          className="rounded-lg p-4 text-sm leading-relaxed border"
          style={{ borderColor: "var(--arena-border)", backgroundColor: "var(--arena-surface)", color: "var(--arena-text)" }}
        >
          <strong className="text-xs font-mono uppercase tracking-wider block mb-2" style={{ color: "var(--arena-muted)" }}>
            Abstract
          </strong>
          The Arena is an interactive sandbox on a single question: when does more competition raise efficiency,
          and when does it waste effort or hurt quality? It pairs four behavioural and industrial-organisation
          toy models with continuous controls. This note documents each function, the empirical or experimental
          work that fixes its shape, the parameters, and the limitations in enough detail to replicate the
          computations. No data is fetched; all values are illustrative and rescaled for legibility.
        </div>
      </div>

      <H2>1. Objective and scope</H2>
      <P>
        The page does not estimate anything. It turns a set of well-documented qualitative findings into smooth,
        continuous functions a reader can drive with sliders. The aim is intuition for direction and trade-offs:
        which way an outcome moves, where it peaks, and when competition stops helping. Every numeric output
        follows from the internal logic of these particular functions, not from any econometric estimate.
      </P>
      <P>
        Four chapters: a number-of-firms model (prices, quality, slack), a tournament-style effort-allocation
        model (productive work, sabotage, rest), a market-outcomes model over concentration and behavioural
        distortion, and a policy overlay that re-reads the same plane through three different objectives.
      </P>

      <H2>2. Chapter 1 — Firms, prices, quality, slack</H2>
      <P>Three indices as a function of the firm count <em>n</em> (1 to 12):</P>
      <Eq>price(n) = 60 + 40 · exp(−0.55 · (n − 1))</Eq>
      <Eq>quality(n) = 40 + 55 · exp(−(n − 4.5)² / (2 · 2.6²))</Eq>
      <Eq>slack(n) = 25 + 50 · exp(−0.6 · (n − 1)) + 3.2 · max(0, n − 5)</Eq>
      <P>
        The price curve is convex and flattens quickly. This matches Bresnahan and Reiss (1991), who found that
        in isolated markets almost all of the competitive effect on prices and margins is realised by the time
        the third to fifth firm enters; further entry barely moves price. Quality is an inverted-U with an
        interior peak near four to five firms, following Aghion, Bloom, Blundell, Griffith and Howitt (2005):
        innovation, and the quality it funds, is low under monopoly, highest at intermediate competition, and
        falls again when rivalry competes away the rents that pay for investment. Slack is U-shaped. The high
        monopoly end is the X-inefficiency and quiet life of weak competition (Leibenstein 1966; Bertrand and
        Mullainathan 2003). The rising fragmented end is excess entry: with fixed costs, business-stealing draws
        in more firms than is efficient, duplicating overhead (Mankiw and Whinston 1986).
      </P>

      <H2>3. Chapter 2 — Effort, sabotage, rest</H2>
      <P>
        Each worker divides a unit effort budget given the prize spread <em>s</em>, monitoring <em>m</em>, and
        competitive pressure <em>c</em>, all in [0,1]:
      </P>
      <Eq>sabotage = 0.45 · s^1.5 · (1 − m)</Eq>
      <Eq>choke = 0.15 · max(0, c − 0.8) / 0.2</Eq>
      <Eq>rest = clamp(0.35 · (1 − c) + 0.1 + choke, 0, 0.85)</Eq>
      <Eq>productive = clamp(1 − sabotage − rest, 0, 1)</Eq>
      <P>
        Sabotage rising nonlinearly with the prize spread is the central finding of Harbring and Irlenbusch
        (2011): widening the gap between winner and loser payoffs pulls effort out of production and into
        destroying rivals' output. Lazear (1989) gives the same direction from a different angle. The monitoring
        term, where stronger detection multiplicatively suppresses sabotage, follows Charness, Masclet and
        Villeval (2014), who show that competition for status raises sabotage and money-burning while sanctions
        cut it. The choke term, where pressure above roughly 0.8 tips effort into stress and disengagement, is a
        loose reading of Ariely, Gneezy, Loewenstein and Mazar (2009) on performance degrading at very high
        stakes. The exact 0.8 knee is illustrative, not estimated, and is flagged as speculative.
      </P>
      <P>
        Team output is the worker average. Measured output counts productive effort plus half of sabotage,
        because gaming can inflate the metric a firm actually observes:
      </P>
      <Eq>measuredOutput = (productive + 0.5 · sabotage) · 100</Eq>
      <Eq>trueEfficiency = productive · 100</Eq>
      <P>
        The wedge between the two is the behavioural cost of the incentive design: the share of apparent
        performance that is gaming rather than work. Small per-worker offsets are added so a team renders as
        varied bars rather than identical ones; they do not change the team average materially.
      </P>

      <H2>4. Chapter 3 — Market outcomes and surplus</H2>
      <P>
        Concentration <em>C</em> in [0,1] and behavioural distortion <em>D</em> in [0,0.4] drive four outcomes:
      </P>
      <Eq>price = 62 + 38 · C^0.7</Eq>
      <Eq>quality = (45 + 55 · exp(−(C − 0.45)² / (2 · 0.22²))) · (1 − 0.8 · D)</Eq>
      <Eq>innovation = (40 + 60 · exp(−(C − 0.40)² / (2 · 0.25²))) · (1 − 0.5 · D)</Eq>
      <Eq>surplus = clamp(0.5 · (100 − price) + 0.4 · quality − 60 · D, 0, 100)</Eq>
      <Eq>deadweight = clamp(8 + 35 · C^1.3 + 60 · D + 25 · C · D, 0, 100)</Eq>
      <P>
        Price rises with concentration, consistent with the markup evidence in De Loecker, Eeckhout and Unger
        (2020). Quality and innovation keep the Aghion et al. (2005) inverted-U, here written over concentration
        so the peak sits at intermediate <em>C</em>; distortion shifts both curves down, since wasted effort
        does not improve the product. Consumer surplus is higher where prices are low, quality high, and
        distortion low. Deadweight loss combines the Harberger (1954) welfare triangle from market power with
        rent-seeking waste, where effort spent capturing or defending a position dissipates the gains rather
        than creating value (Tullock 1967; Posner 1975); the interaction term lets distortion bite harder where
        power is already high. All coefficients are rescaled to 0 to 100.
      </P>

      <H2>5. Chapter 4 — Policy thresholds and lenses</H2>
      <P>
        The fourth chapter does not add a model. It re-reads the concentration-distortion plane through three
        objectives. Concentration maps to a Herfindahl-Hirschman Index under a symmetric-firm assumption:
      </P>
      <Eq>HHI = 10000 / nFirms,  nFirms = clamp(12 − 11 · C, 1, 12)</Eq>
      <P>
        The antitrust lens uses the US merger-guidelines screens: HHI above 2500 is highly concentrated under
        the 2010 Horizontal Merger Guidelines, and the 2023 Merger Guidelines tightened the structural
        presumption to HHI 1800 with a 100-point change screen. Those cutoffs shade the high-concentration
        danger and watch zones directly. The symmetric mapping is a simplification: real markets have unequal
        firms, so the HHI proxy is illustrative and is flagged as such. The consumer lens shades the band where
        price is low, quality high, and distortion under about 12 percent, using the Chapter 3 outcome model.
        The firm-strategist lens shades intermediate concentration with low distortion as stable margins, and
        the low-concentration, high-distortion corner as destructive competition, drawing on the excess-entry
        result of Mankiw and Whinston (1986). No threshold is invented for dramatic effect.
      </P>

      <H2>6. Limitations</H2>
      <P>
        These are teaching functions, not estimated models. The curves are smooth by construction; real
        relationships are noisy, context-dependent, and often non-monotone in ways a single function cannot
        capture. Parameters are chosen so the shapes read clearly, not to fit any market.
      </P>
      <P>
        The chapters are stylised in isolation. Behavioural distortion in Chapter 3 is treated as an exogenous
        dial, even though Chapter 2 shows it is itself produced by incentive design; the page does not close
        that loop computationally. The HHI mapping assumes symmetric firms. The choking threshold in Chapter 2
        is a guess at where pressure becomes counterproductive, not a measured point.
      </P>
      <P>
        What the page can speak to: the direction of each effect, where competition stops helping, and how the
        same structure looks different depending on whose objective you adopt. What it cannot do: predict prices
        or quality in any specific market, score a real merger, or substitute for an empirical IO study.
      </P>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-xs font-mono" style={{ borderColor: "var(--arena-border)", color: "var(--arena-muted)" }}>
        <p>THE ARENA · Arin Jain · Technical Note</p>
        <p className="mt-1">
          Models: <Mono>model.ts</Mono>. Sources: Bresnahan-Reiss (1991), Aghion et al. (2005), Leibenstein
          (1966), Bertrand-Mullainathan (2003), Mankiw-Whinston (1986), Harbring-Irlenbusch (2011), Lazear
          (1989), Charness-Masclet-Villeval (2014), Ariely et al. (2009), De Loecker-Eeckhout-Unger (2020),
          Harberger (1954), Tullock (1967), Posner (1975), US Merger Guidelines (2010, 2023). Not a forecast.
          Not investment, financial, or policy advice.
        </p>
        <Link to="/mini/arena" className="mt-3 inline-block hover:opacity-70 transition-opacity" style={{ color: "var(--arena-accent)" }}>
          ← Return to The Arena
        </Link>
      </div>
    </div>
  );
}
