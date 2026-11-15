import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";

/* Each card borrows its tool's own theme class so the accent here is the
   same one the visitor meets on the tool's page. */
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
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Research tools</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Six interactive tools, each a hand-built dataset or model. They
            come out of the same question as the{" "}
            <Link to="/writing" className="text-foreground underline decoration-warm-accent underline-offset-4">
              writing
            </Link>
            : where do formal institutions fall short of the people they serve?
          </p>
        </header>

        <ul className="flex flex-col gap-4">
          {PROJECTS.map((p) => (
            <li key={p.to} className={p.theme} style={{ backgroundColor: "transparent", color: "inherit" }}>
              <Link
                to={p.to}
                className="group block rounded-lg border border-border border-l-4 bg-card px-5 py-4 transition-colors duration-150 hover:border-foreground/30"
                style={{ borderLeftColor: p.accent }}
              >
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-semibold" style={{ color: p.accent }}>
                    {p.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{p.kind}</span>
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
