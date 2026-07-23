import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

const PROJECTS = [
  {
    to: "/mini/verdict",
    accent: "border-cyan-500/30 hover:border-cyan-500/60",
    title: "The Verdict",
    summary:
      "A methodology-driven index of AI-related legal and regulatory events, scored on five factors into an Enforcement-Driven Index (EDI) for cross-jurisdictional comparison.",
  },
  {
    to: "/mini/ledger",
    accent: "border-amber-600/30 hover:border-amber-600/60",
    title: "The Ledger",
    summary:
      "A hand-built database of MAS (Monetary Authority of Singapore) enforcement actions, coded by sector, violation type, sanction, and outcome.",
  },
  {
    to: "/mini/observatory",
    accent: "border-teal-600/30 hover:border-teal-600/60",
    title: "The Observatory",
    summary:
      "A toy macro model tracing how AI adoption flows through to productivity, wages, prices, and markups — live World Bank and FRED data alongside an adjustable sandbox.",
  },
  {
    to: "/mini/arena",
    accent: "border-rose-500/30 hover:border-rose-500/60",
    title: "The Arena",
    summary:
      "An interactive explorer on competition and efficiency, built on closed-form industrial-organization models — firm count, tournament incentives, market outcomes, policy lenses.",
  },
  {
    to: "/mini/lab",
    accent: "border-amber-500/30 hover:border-amber-500/60",
    title: "The Distribution Lab",
    summary:
      "A cross-country panel of 465 country-years (1990–2020). History mode shows observed distributional data; Playground maps institutional configurations to outcomes via kernel weighting.",
  },
  {
    to: "/mini/docket",
    accent: "border-emerald-500/30 hover:border-emerald-500/60",
    title: "The Docket",
    summary:
      "Maps India's 49-million-case court backlog by state and court level, scores the structural bottlenecks, and prototypes a citizen case-tracking dashboard.",
  },
];

export default function MiniIndex() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <SectionSwitcher current="Mini Projects" />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Mini Projects</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Six standalone interactive tools — hand-built databases and
            closed-form models grown out of the same institutional-gap
            question that runs through{" "}
            <Link to="/writing" className="underline decoration-neutral-300 underline-offset-4">
              Margin of Error
            </Link>
            .
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={`block rounded-lg border px-5 py-4 transition-colors ${p.accent}`}
            >
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{p.summary}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
