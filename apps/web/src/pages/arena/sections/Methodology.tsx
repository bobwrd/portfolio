import { Link } from "react-router-dom";
import { Section } from "../shared";

interface Ref {
  cite: string;
  note: string;
}

const GROUPS: { chapter: string; refs: Ref[] }[] = [
  {
    chapter: "Chapter 1 — Firms, prices, quality, slack",
    refs: [
      {
        cite: "Bresnahan & Reiss (1991), Entry and Competition in Concentrated Markets, JPE",
        note: "Most of the competitive effect on price shows up by the third to fifth entrant. We borrowed the fast-flattening price curve.",
      },
      {
        cite: "Aghion, Bloom, Blundell, Griffith & Howitt (2005), Competition and Innovation: An Inverted-U Relationship, QJE",
        note: "Innovation peaks at intermediate competition. We borrowed the inverted-U shape for quality.",
      },
      {
        cite: "Leibenstein (1966), Allocative Efficiency vs X-Efficiency, AER; Bertrand & Mullainathan (2003), Enjoying the Quiet Life?, JPE",
        note: "Weak competition lets firms run slack. We used this for the high-slack monopoly end of the curve.",
      },
      {
        cite: "Mankiw & Whinston (1986), Free Entry and Social Inefficiency, RAND",
        note: "With fixed costs, business-stealing drives excess entry. We used this for the rising-slack fragmented end.",
      },
    ],
  },
  {
    chapter: "Chapter 2 — Effort, sabotage, rest",
    refs: [
      {
        cite: "Harbring & Irlenbusch (2011), Sabotage in Tournaments, Management Science",
        note: "Sabotage effort rises with the prize spread. This is the core shape of the sabotage curve.",
      },
      {
        cite: "Lazear (1989), Pay Equality and Industrial Politics, JPE",
        note: "Large pay spreads invite uncooperative, sabotaging behaviour. Supports the prize-spread direction.",
      },
      {
        cite: "Charness, Masclet & Villeval (2014), The Dark Side of Competition for Status, Management Science",
        note: "Salient competition raises sabotage; monitoring and sanctions cut it. Basis for the monitoring term.",
      },
      {
        cite: "Ariely, Gneezy, Loewenstein & Mazar (2009), Large Stakes and Big Mistakes, REStud",
        note: "Very high pressure can degrade performance. Loose basis for the choking term — its exact threshold is speculative and flagged.",
      },
    ],
  },
  {
    chapter: "Chapter 3 — Market outcomes and surplus",
    refs: [
      {
        cite: "De Loecker, Eeckhout & Unger (2020), The Rise of Market Power, QJE",
        note: "Markups rise with concentration. Shapes the price-on-concentration curve.",
      },
      {
        cite: "Aghion et al. (2005), as above",
        note: "Reused for the inverted-U in quality and innovation, expressed over concentration.",
      },
      {
        cite: "Harberger (1954), Monopoly and Resource Allocation, AER; Tullock (1967); Posner (1975), The Social Costs of Monopoly and Regulation, JPE",
        note: "Deadweight loss from market power plus rent-seeking, where wasted effort dissipates the gains. Shapes the deadweight term and the distortion penalty.",
      },
    ],
  },
  {
    chapter: "Chapter 4 — Policy thresholds and lenses",
    refs: [
      {
        cite: "US DOJ/FTC Horizontal Merger Guidelines (2010); Merger Guidelines (2023)",
        note: "HHI screens: 1500 and 2500 (2010); a tighter 1800 structural presumption with a 100-point change screen (2023). Used directly for the antitrust bands.",
      },
      {
        cite: "Mankiw & Whinston (1986), as above",
        note: "Excess entry and thin margins under fragmentation. Basis for the firm strategist's destructive-competition corner.",
      },
    ],
  },
];

export default function Methodology() {
  return (
    <Section id="methodology" eyebrow="Method" title="Methodology and sources">
      <div className="max-w-3xl space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-text)" }}>
        <p>
          Every curve here is a simple teaching function. The numbers are rescaled to 0 to 100 indices for
          legibility. What comes from the literature is the direction and rough shape of each relationship, not
          the exact values. Two pieces are extrapolations beyond a clean published magnitude and are marked
          below: the choking threshold in Chapter 2 and the concentration-to-HHI mapping in Chapter 4.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {GROUPS.map((g) => (
          <div
            key={g.chapter}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--arena-border)", backgroundColor: "var(--arena-surface)" }}
          >
            <div className="text-sm font-semibold mb-3" style={{ color: "var(--arena-accent)" }}>
              {g.chapter}
            </div>
            <ul className="space-y-3">
              {g.refs.map((r) => (
                <li key={r.cite}>
                  <div className="text-xs font-mono leading-snug" style={{ color: "var(--arena-text)" }}>
                    {r.cite}
                  </div>
                  <div className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--arena-muted)" }}>
                    {r.note}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed max-w-3xl" style={{ color: "var(--arena-muted)" }}>
        Relationships and comparative statics come from real work; the magnitudes are simplified. For the full
        write-up of every function, parameter, and limitation, see the{" "}
        <Link to="/mini/arena/methods" className="hover:underline" style={{ color: "var(--arena-accent)" }}>
          technical note
        </Link>
        .
      </p>
    </Section>
  );
}
