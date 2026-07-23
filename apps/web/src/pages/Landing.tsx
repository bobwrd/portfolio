import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

const ANCHORS = [
  { href: "#abstract", label: "Abstract" },
  { href: "#focus-areas", label: "Focus Areas" },
  { href: "#projects", label: "Projects" },
  { href: "#appendix", label: "Appendix" },
];

const SECTION_CARDS = [
  {
    number: "2.1",
    title: "Margin of Error",
    to: "/writing",
    body: "Essays, a weekly briefing, and personal pieces working through one question: where formal institutions — legal systems, economic policy, regulatory frameworks — fall short of the people they're supposed to serve, and why.",
  },
  {
    number: "2.2",
    title: "Mini Projects",
    to: "/mini",
    body: "Six standalone interactive tools grown out of that same question: an AI-governance case index, a MAS enforcement database, an industrial-organization sandbox, a macro model of AI and prices, a cross-country distribution explorer, and a map of India's court backlog.",
  },
  {
    number: "2.3",
    title: "OneBook",
    to: "/onebook",
    body: "A risk dashboard for a mixed book of equities, options, and bonds — correlation, volatility, Value-at-Risk, aggregate Greeks, and a scenario engine, with an optional mode that connects real brokerage accounts.",
  },
  {
    number: "2.4",
    title: "Ask",
    to: "/ask",
    body: "A tiny, beginner-friendly data-analysis language. Load a file, clean it, filter it, group it, chart it — no query planner, no hidden magic, no Python to learn first.",
  },
];

const SELECTED_WORK = [
  {
    href: "/mini/docket",
    tag: "Mini Projects · Docket",
    title: "The Docket — Indian Court Backlogs",
    summary:
      "49 million pending cases. Maps the delays by state, scores the structural bottlenecks, and prototypes a citizen case-tracking dashboard.",
  },
  {
    href: "/mini/observatory",
    tag: "Mini Projects · Observatory",
    title: "The Observatory — AI, Productivity and Prices",
    summary:
      "An interactive sandbox tracing how AI adoption might flow through to inflation, wages, and who captures the gains.",
  },
  {
    href: "/mini/verdict/1",
    tag: "Mini Projects · Verdict",
    title: "EU AI Act — Full Entry into Force",
    summary:
      "The world's first comprehensive AI regulation, scored 87.3 EDI — the highest in the database.",
  },
  {
    href: "/writing/others/access-to-justice-the-gap-nobody-measures",
    tag: "Margin of Error · Analysis",
    title: "Access to Justice — The Gap Nobody Measures",
    summary:
      "Most legal systems track case outcomes, not whether people could get to court in the first place.",
  },
  {
    href: "/writing/personal/us-economy-cheap-imports-china",
    tag: "Margin of Error · Personal Essay",
    title: "Is the US economy harmed by cheap imports from China?",
    summary:
      "What counts as harm has to be defined distributionally and geopolitically, not just by GDP.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-serif text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <SectionSwitcher current="Home" />

      <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-3xl justify-center gap-6 px-6 py-3 font-sans text-sm">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              {a.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Title block */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl leading-tight">Arin Jain</h1>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-400">
            Economics &amp; Law · IB Year 1
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
            Updated July 2026
          </p>
          <p className="mt-3 font-sans text-sm text-neutral-700 dark:text-neutral-300">
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="mailto:arinjain.mail@gmail.com"
            >
              arinjain.mail@gmail.com
            </a>{" "}
            |{" "}
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="https://github.com/bobwrd"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/bobwrd
            </a>{" "}
            |{" "}
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/arin-jain-69a954270
            </a>
          </p>
        </header>

        {/* Abstract */}
        <section id="abstract" className="scroll-mt-16">
          <h2 className="text-center text-lg font-bold">Abstract</h2>
          <p className="mt-4 leading-relaxed">
            I'm 15, studying economics and law. The question running through
            everything here is where formal institutions — legal systems,
            economic policy, regulatory frameworks — fall short of the people
            they're supposed to serve, and why. This site collects the
            research, tools, and writing that come out of chasing that
            question, plus two things next to it: a portfolio-risk dashboard
            built for a related institutional question — how a retail
            investor is supposed to see risk when brokerages show fragmented,
            broker-specific views — and a small programming language built to
            make data analysis legible to beginners instead of powerful for
            experts.
          </p>
          <p className="mt-4 text-sm italic text-neutral-600 dark:text-neutral-400">
            Keywords: institutional economics, regulatory analysis, applied
            econometrics, portfolio risk, programming language design.
          </p>
        </section>

        <hr className="my-10 border-neutral-200 dark:border-neutral-800" />

        {/* Focus Areas */}
        <section id="focus-areas" className="scroll-mt-16">
          <h2 className="text-lg font-bold">1 Focus Areas</h2>
          <p className="mt-4 leading-relaxed">
            Margin of Error and its six Mini Projects work through the
            institutions question directly, combining hand-built structured
            databases drawn from primary regulatory sources, interactive
            economic models grounded in published theory, and analysis of how
            institutions operate in practice. OneBook comes at institutions
            from the other side: how risk should be shown to a retail
            investor holding a mixed book, when the standard answer is a
            brokerage statement that doesn't aggregate anything. Ask asks a
            narrower question — what a data-analysis tool looks like if
            "guessable" is the design constraint instead of "powerful."
          </p>
        </section>

        <hr className="my-10 border-neutral-200 dark:border-neutral-800" />

        {/* Projects */}
        <section id="projects" className="scroll-mt-16">
          <h2 className="text-lg font-bold">2 Projects</h2>
          <p className="mt-4 leading-relaxed">
            Four sections, described below. Each is reachable from the
            switcher in the corner of every page.
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {SECTION_CARDS.map((s) => (
              <div key={s.to}>
                <h3 className="font-bold">
                  {s.number} {s.title}
                </h3>
                <p className="mt-2 leading-relaxed">{s.body}</p>
                <Link
                  to={s.to}
                  className="mt-2 inline-block font-sans text-sm underline decoration-neutral-300 underline-offset-4"
                >
                  {s.title} →
                </Link>
              </div>
            ))}
          </div>

          <h3 className="mt-10 font-bold">2.5 Start here</h3>
          <p className="mt-2 leading-relaxed">
            A few pieces that represent what this whole site is about.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {SELECTED_WORK.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group block rounded-lg border border-neutral-200 px-5 py-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <p className="font-sans text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
                  {item.tag}
                </p>
                <p className="mt-1 font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <hr className="my-10 border-neutral-200 dark:border-neutral-800" />

        {/* Appendix */}
        <section id="appendix" className="scroll-mt-16 pb-16">
          <h2 className="text-lg font-bold">3 Appendix</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              <a
                className="underline decoration-neutral-300 underline-offset-4"
                href="https://github.com/bobwrd"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub — github.com/bobwrd
              </a>
            </li>
            <li>
              <a
                className="underline decoration-neutral-300 underline-offset-4"
                href="https://linkedin.com/in/arin-jain-69a954270"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn — linkedin.com/in/arin-jain-69a954270
              </a>
            </li>
            <li>
              <Link
                to="/writing/about"
                className="underline decoration-neutral-300 underline-offset-4"
              >
                Full project overview →
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-500">
            Last updated July 2026.
          </p>
        </section>
      </main>
    </div>
  );
}
