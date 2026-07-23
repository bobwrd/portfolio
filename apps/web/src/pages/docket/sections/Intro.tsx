export default function Intro() {
  return (
    <section id="intro" className="scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14">
        <div className="max-w-3xl">
          <div
            className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--docket-accent)" }}
          >
            The Docket
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
            style={{ color: "var(--docket-text)" }}
          >
            49 million cases. One broken paper trail.
          </h1>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed" style={{ color: "var(--docket-text)" }}>
            India's courts have more pending cases than any country on earth. The problem is not
            just volume. It is that citizens cannot see where their case stands, judges cannot
            easily see what is ahead of them, and no one is tracking the delays with enough
            precision to fix them.
          </p>

          <div className="mt-6 space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--docket-muted)" }}>
            <p>
              This subproject maps the backlog using aggregated public data — pending cases by
              state, court level, and case type — scores the structural bottlenecks driving those
              numbers, and builds a prototype case-tracking dashboard that shows what better
              record-keeping could look like for an ordinary citizen.
            </p>
            <p>
              The comparison is personal. I moved from India to Singapore to study, and the
              contrast is stark. Singapore's eLitigation system files, tracks, and notifies
              digitally. India's courts still rely on handwritten cause lists, postal notices, and
              manual registers in most district courts. The gap is not about legal culture; it is
              about data infrastructure.
            </p>
            <p>
              The central question: could better data organisation and simple digital tools — not
              more judges, not new laws — meaningfully reduce the backlog? The evidence says yes,
              for a specific, tractable subset of delays.
            </p>
          </div>

          {/* Stat strip */}
          <div
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl border"
            style={{ borderColor: "var(--docket-border)", backgroundColor: "var(--docket-surface)" }}
          >
            {[
              { stat: "49.6M", label: "pending cases (2024)" },
              { stat: "30%", label: "judge vacancies (High Courts)" },
              { stat: "5.2 yrs", label: "avg case age, UP district courts" },
              { stat: "75%", label: "undertrials in Indian prisons" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold font-mono" style={{ color: "var(--docket-accent)" }}>
                  {stat}
                </div>
                <div className="text-xs mt-1 leading-snug" style={{ color: "var(--docket-muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Chapter nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "#backlog", label: "1 · Map the backlog" },
              { href: "#bottlenecks", label: "2 · Score the bottlenecks" },
              { href: "#tracker", label: "3 · Case tracker prototype" },
              { href: "#indosing", label: "4 · India vs Singapore" },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="rounded-full border px-3.5 py-1.5 text-xs font-mono transition-colors"
                style={{
                  borderColor: "var(--docket-border)",
                  color: "var(--docket-text)",
                  backgroundColor: "var(--docket-surface)",
                }}
              >
                {c.label}
              </a>
            ))}
          </div>

          <p className="mt-6 text-xs" style={{ color: "var(--docket-muted)" }}>
            Data: NJDG, eCourts project, Ministry of Law &amp; Justice (2022-24). Figures are
            aggregated and approximate; see{" "}
            <a href="/mini/docket/methods" className="underline" style={{ color: "var(--docket-accent)" }}>
              methods
            </a>{" "}
            for sourcing notes.
          </p>
        </div>
      </div>
    </section>
  );
}
