export default function Intro() {
  return (
    <section id="intro" className="scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl">
          <div
            className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--obs-accent)" }}
          >
            The Observatory
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "var(--obs-text)" }}
          >
            AI, Productivity and Prices
          </h1>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed" style={{ color: "var(--obs-text)" }}>
            How could AI affect productivity, inflation and who gets the gains over time, and
            what does the data so far suggest about where we are in that process?
          </p>
          <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            <p>
              This is a working sandbox for tracing how AI adoption might flow through to productivity,
              wages, prices, and markups. Pick a named scenario or move the sliders directly. The model
              details are behind{" "}
              <span className="font-mono" style={{ color: "var(--obs-accent)" }}>Details</span>{" "}
              toggles if you want them.
            </p>
            <p>
              This is not a forecast. It is a structured way to walk the transmission channels — from
              AI adoption through productivity, to wages and inflation, to who captures the gains between
              capital and labour. Live World Bank and FRED data sit alongside the model to show what
              the relevant series look like in the real economy. The questions connect to ongoing debates
              about automation, labour share, and the wage-profit split of productivity gains.
            </p>
            <p>
              Read top to bottom: a conceptual walkthrough of the channels, then a live data atlas
              across five countries, then the sandbox.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "#walkthrough", label: "1 · Walkthrough" },
              { href: "#atlas", label: "2 · Data atlas" },
              { href: "#lab", label: "3 · Lab" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors"
                style={{ borderColor: "var(--obs-border)", color: "var(--obs-text)", backgroundColor: "var(--obs-surface)" }}
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
