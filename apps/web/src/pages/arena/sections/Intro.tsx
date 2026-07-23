export default function Intro() {
  return (
    <section id="intro" className="scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl">
          <div
            className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--arena-accent)" }}
          >
            The Arena
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "var(--arena-text)" }}
          >
            When does competition make things better?
          </h1>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed" style={{ color: "var(--arena-text)" }}>
            More rivals can cut prices and sharpen quality. They can also push people to waste effort
            fighting each other. The question is when each happens.
          </p>
          <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-muted)" }}>
            <p>
              This is an interactive model environment, not an essay. Move a slider and the firms, the
              prices, the workers' effort all shift with it. The point is to feel where more competition
              helps and where it tips into waste.
            </p>
            <p>
              Every curve here is a closed-form model anchored to published industrial organisation work —
              Bertrand and Cournot on firm count and price, Aghion et al. on competition and innovation,
              Harbring and Irlenbusch on tournament incentives and sabotage, De Loecker et al. on markups.
              The numbers are rescaled for readability; the shapes are not made up.
            </p>
            <p>
              Four chapters: how many firms is too many, what competition does to effort inside a team,
              how market structure and behavioural distortion combine, and how antitrust, consumer, and
              firm-level policy lenses read the same evidence differently.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "#firms", label: "1 · How many firms" },
              { href: "#lab", label: "2 · Effort lab" },
              { href: "#outcomes", label: "3 · Market outcomes" },
              { href: "#lenses", label: "4 · Policy lenses" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors"
                style={{ borderColor: "var(--arena-border)", color: "var(--arena-text)", backgroundColor: "var(--arena-surface)" }}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
