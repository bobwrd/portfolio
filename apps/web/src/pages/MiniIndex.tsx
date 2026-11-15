import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";
import PaperHeader from "@/components/PaperHeader";

const PROJECTS = [
  {
    to: "/mini/verdict",
    theme: "verdict-section verdict-light",
    accent: "var(--verdict-accent)",
    title: "The Verdict",
    kind: "AI regulation index",
    summary:
      "AI-related legal and regulatory events, each scored on five factors into an Enforcement-Driven Index (EDI) so jurisdictions can be compared.",
  },
  {
    to: "/mini/ledger",
    theme: "ledger-section ledger-light",
    accent: "var(--ledger-accent)",
    title: "The Ledger",
    kind: "MAS enforcement register",
    summary:
      "A hand-built database of Monetary Authority of Singapore enforcement actions, coded by sector, violation, sanction and outcome.",
  },
  {
    to: "/mini/observatory",
    theme: "obs-section obs-light",
    accent: "var(--obs-accent)",
    title: "The Observatory",
    kind: "AI, productivity and prices",
    summary:
      "A small macro model of how AI adoption feeds through to productivity, wages, prices and markups, beside live World Bank and FRED data.",
  },
  {
    to: "/mini/arena",
    theme: "arena-section arena-light",
    accent: "var(--arena-accent)",
    title: "The Arena",
    kind: "Competition and market structure",
    summary:
      "Closed-form industrial-organization models you can adjust: number of firms, tournament incentives, market outcomes and policy lenses.",
  },
  {
    to: "/mini/lab",
    theme: "distlab-section distlab-light",
    accent: "var(--dl-accent)",
    title: "The Distribution Lab",
    kind: "Inequality and institutions",
    summary:
      "A panel of 465 country-years (1990 to 2020). History mode shows observed distributional data; Playground maps institutional settings to outcomes by kernel weighting.",
  },
  {
    to: "/mini/docket",
    theme: "docket-section docket-light",
    accent: "var(--docket-accent)",
    title: "The Docket",
    kind: "India's court backlog",
    summary:
      "Maps India's 49-million-case backlog by state and court level, scores the structural bottlenecks, and prototypes a case tracker for citizens.",
  },
];

export default function MiniIndex() {
  usePageTitle("Research tools");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="tools" />
      <main className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
        <PaperHeader
          series="Working Paper Series, No. 02"
          meta="Six tools, each with a technical note"
          title="Research tools"
          byline="Hand-built datasets and models, each asking where an institution falls short."
          abstract={
            <p>
              Each tool is a dataset or model I built by hand, with its sources
              and method published beside it. They come out of the same
              question as the{" "}
              <Link to="/writing" className="text-link underline">
                writing
              </Link>
              : where do formal institutions fall short of the people they
              serve?
            </p>
          }
        />

        <section aria-labelledby="tools-heading" className="mt-14 max-w-4xl">
          <h2 id="tools-heading" className="font-sans text-[0.9375rem] font-semibold">
            Contents
          </h2>
          {/* Each row borrows its tool's theme class so the number carries the
              same colour the visitor meets on that tool's page. */}
          <ol className="mt-3 border-t border-border">
            {PROJECTS.map((p, i) => (
              <li key={p.to} className={`${p.theme} border-b border-border`} style={{ backgroundColor: "transparent", color: "inherit" }}>
                <Link
                  to={p.to}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_14rem]"
                >
                  <span className="pt-1.5 font-sans text-[0.9375rem] font-semibold tabular-nums" style={{ color: p.accent }}>
                    2.{i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-xl leading-snug decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                      {p.title}
                    </span>
                    <span className="mt-1.5 block font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {p.summary}
                    </span>
                  </span>
                  <span className="hidden pt-1.5 font-sans text-[0.9375rem] sm:block sm:text-right" style={{ color: p.accent }}>
                    {p.kind}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
