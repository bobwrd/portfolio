import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import { siteConfig } from "@/config/site";
import { Link } from "react-router-dom";

const categories = [
  {
    href: "/writing/weekly",
    title: "Weekly Briefing",
    summary: "A running digest of what I'm reading and thinking about, most weeks.",
  },
  {
    href: "/writing/personal",
    title: "Personal Pieces",
    summary: "Longer essays — arguments I want to make carefully, not on a schedule.",
  },
  {
    href: "/writing/others",
    title: "Analysis",
    summary: "Research notes and shorter analysis pieces that don't fit the other two.",
  },
];

export default function WritingHome() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
          {siteConfig.title}
        </h1>
        <p className="text-muted-foreground text-sm mb-0.5">Arin Jain · IB Year 1</p>
        <p className="text-muted-foreground text-base">{siteConfig.tagline}</p>
      </div>

      <section className="mb-14">
        <div className="flex flex-col gap-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className="group block border border-border rounded-lg px-5 py-4 hover:border-warm-accent transition-colors duration-150"
            >
              <p className="font-semibold text-foreground group-hover:text-warm-accent transition-colors duration-150 mb-1">
                {c.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-14">
        <NewsletterSignup />
      </div>

      <section className="mb-10">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Margin of Error is a self-directed research project working through
          one question: where formal institutions — legal systems, economic
          policy, regulatory frameworks — fall short of the people they're
          supposed to serve, and why.{" "}
          <Link to="/writing/about" className="text-warm-accent hover:underline">
            Full project overview →
          </Link>
        </p>
      </section>

      <div className="border-t border-border pt-6 pb-2">
        <p className="text-xs text-muted-foreground">
          Last updated: June 2026. Currently working on: a quantitative paper on Indian sectoral employment
          using PLFS data (2017–2024), and CivicAid (legal literacy tool for Singapore, MVP in progress).
        </p>
      </div>
    </Layout>
  );
}
