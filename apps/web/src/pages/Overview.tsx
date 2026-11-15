import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import PaperHeader from "@/components/PaperHeader";
import ContentsList from "@/components/ContentsList";
import { usePageTitle } from "@/hooks/use-page-title";

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
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="guide" />

      <main className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
        <PaperHeader
          series="Working Paper Series, No. 01"
          meta="Updated July 2026"
          title="Site guide"
          byline="What this portfolio holds, and why it is built this way."
          keywords="Keywords: institutional economics, regulatory analysis, applied econometrics, portfolio risk, programming language design."
          abstract={
            <p id="abstract" className="scroll-mt-20">
              I'm 15 and study economics and law. Everything here comes from
              one question: where do legal systems, economic policy and
              regulation fall short of the people they are meant to serve, and
              why? The site holds the research, tools and writing that question
              has produced, plus two related projects: a portfolio-risk
              dashboard, built because brokerages show retail investors a
              fragmented, broker-by-broker view of risk, and a small
              programming language that makes data analysis readable for
              beginners.
            </p>
          }
        />

        <div className="paper-body mt-16 max-w-[42rem] font-serif text-[1.0625rem]">
        <hr className="my-12 border-border" />

        {/* Focus Areas */}
        <section id="focus-areas" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">1.</span> Focus areas</h2>
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

        <hr className="my-12 border-border" />

        {/* Projects */}
        <section id="projects" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">2.</span> Projects</h2>
          <p className="mt-4 leading-relaxed">
            Five sections, described below. Each is linked from the bar at
            the top of every page.
          </p>

          <ContentsList
            className="mt-6 font-sans"
            entries={SECTION_CARDS.map((c) => ({
              href: c.to,
              number: c.number,
              title: c.title,
              summary: c.body,
            }))}
          />

          <h3 className="mt-12 text-xl"><span className="text-muted-foreground">2.6</span> Start here</h3>
          <p className="mt-2 leading-relaxed">
            Five pieces that show what the whole site is about.
          </p>
          <ContentsList
            className="mt-4"
            entries={SELECTED_WORK.map((w, i) => ({
              href: w.href,
              number: `2.6.${i + 1}`,
              title: w.title,
              summary: w.summary,
              meta: w.tag,
            }))}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Appendix */}
        <section id="appendix" className="scroll-mt-20 pb-16">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">3.</span> Links</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              <a
                className="text-link underline"
                href="https://github.com/bobwrd"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub: github.com/bobwrd
              </a>
            </li>
            <li>
              <a
                className="text-link underline"
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
                className="text-link underline"
              >
                About Margin of Error, the research project
              </Link>
            </li>
          </ul>
        </section>
        </div>
      </main>
    </div>
  );
}
