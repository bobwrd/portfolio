import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";

const ANCHORS = [
  { href: "#abstract", label: "Abstract" },
  { href: "#focus-areas", label: "Focus areas" },
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
    title: "Research tools",
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
    body: "A small data-analysis language for beginners. Load a file, clean it, filter it, group it, chart it, in that order, with no Python to learn first.",
  },
  {
    number: "2.5",
    title: "Tradewinds",
    to: "/tradewinds",
    body: "A daily deduction puzzle. Each day brings a cargo manifest from a real historical voyage; work out its route, its era and its economic role in ten guesses.",
  },
];

const SELECTED_WORK = [
  {
    href: "/mini/docket",
    tag: "Research tool",
    title: "The Docket: India's court backlog",
    summary:
      "49 million pending cases. Maps the delays by state, scores the structural bottlenecks, and prototypes a citizen case-tracking dashboard.",
  },
  {
    href: "/mini/observatory",
    tag: "Research tool",
    title: "The Observatory: AI, productivity and prices",
    summary:
      "An interactive sandbox tracing how AI adoption might flow through to inflation, wages, and who captures the gains.",
  },
  {
    href: "/mini/verdict/1",
    tag: "The Verdict, one case",
    title: "EU AI Act: full entry into force",
    summary:
      "The world's first comprehensive AI regulation, scored 87.3 EDI — the highest in the database.",
  },
  {
    href: "/writing/others/access-to-justice-the-gap-nobody-measures",
    tag: "Analysis",
    title: "Access to justice: the gap nobody measures",
    summary:
      "Most legal systems track case outcomes, not whether people could get to court in the first place.",
  },
  {
    href: "/writing/personal/us-economy-cheap-imports-china",
    tag: "Essay",
    title: "Is the US economy harmed by cheap imports from China?",
    summary:
      "What counts as harm has to be defined distributionally and geopolitically, not just by GDP.",
  },
];

export default function Overview() {
  usePageTitle("Site guide");
  return (
    <div className="min-h-screen bg-background font-serif text-foreground">
      <SectionSwitcher current="guide" />

      <nav aria-label="On this page" className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl justify-center gap-6 px-6 py-3 font-sans text-sm">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {a.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Title block */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl leading-tight">Site guide</h1>
          <p className="mt-3 text-base text-muted-foreground">
            What this portfolio holds, and why it is built this way.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Updated July 2026</p>
          <p className="mt-3 font-sans text-sm">
            <Link
              className="underline decoration-warm-accent underline-offset-4"
              to="/"
            >
              About Arin Jain
            </Link>
          </p>
        </header>

        {/* Abstract */}
        <section id="abstract" className="scroll-mt-16">
          <h2 className="text-lg font-bold">Abstract</h2>
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
          <p className="mt-4 text-sm italic text-muted-foreground">
            Keywords: institutional economics, regulatory analysis, applied
            econometrics, portfolio risk, programming language design.
          </p>
        </section>

        <hr className="my-10 border-border" />

        {/* Focus Areas */}
        <section id="focus-areas" className="scroll-mt-16">
          <h2 className="text-lg font-bold">1. Focus areas</h2>
          <p className="mt-4 leading-relaxed">
            Economics is the thing I keep coming back to — not because it
            explains everything, but because it's the discipline most honest
            about trade-offs: someone gains, someone pays, and the
            interesting question is always who and why. Every project here
            is that interest applied somewhere specific. Margin of Error and
            the research tools read regulatory decisions, enforcement records,
            and market structure as economics problems, not just legal ones —
            The Ledger codes MAS enforcement actions to see who actually gets
            penalised; The Arena and The Observatory build the standard
            industrial-organisation and macro models by hand to see what they
            actually predict, not just what they're claimed to predict.
          </p>
          <p className="mt-4 leading-relaxed">
            OneBook comes at the same interest from a different angle: risk
            is a distribution problem, and a dashboard that shows a mixed
            book of stocks, options, and bonds as one coherent picture is
            applied economics as much as it's software. Ask looks like the
            outlier — a programming language, not an economics project — but
            it comes from the same instinct that drives the rest of this
            site: taking something with real explanatory power and making it
            legible to someone without the background, instead of leaving it
            locked behind jargon only specialists can use.
          </p>
        </section>

        <hr className="my-10 border-border" />

        {/* Projects */}
        <section id="projects" className="scroll-mt-16">
          <h2 className="text-lg font-bold">2. Projects</h2>
          <p className="mt-4 leading-relaxed">
            Five sections, described below. Each is linked from the bar at
            the top of every page.
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
                  className="mt-2 inline-block font-sans text-sm underline decoration-warm-accent underline-offset-4"
                >
                  Open {s.title}
                </Link>
              </div>
            ))}
          </div>

          <h3 className="mt-10 font-bold">2.6 Start here</h3>
          <p className="mt-2 leading-relaxed">
            Five pieces that show what the whole site is about.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {SELECTED_WORK.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group block rounded-lg border border-border px-5 py-4 transition-colors duration-150 hover:border-warm-accent"
              >
                <p className="font-sans text-sm text-muted-foreground">
                  {item.tag}
                </p>
                <p className="mt-1 font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <hr className="my-10 border-border" />

        {/* Appendix */}
        <section id="appendix" className="scroll-mt-16 pb-16">
          <h2 className="text-lg font-bold">3. Links</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              <a
                className="underline decoration-border underline-offset-4"
                href="https://github.com/bobwrd"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub: github.com/bobwrd
              </a>
            </li>
            <li>
              <a
                className="underline decoration-border underline-offset-4"
                href="https://linkedin.com/in/arin-jain-69a954270"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn: linkedin.com/in/arin-jain-69a954270
              </a>
            </li>
            <li>
              <Link
                to="/writing/about"
                className="underline decoration-border underline-offset-4"
              >
                About Margin of Error, the research project
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
