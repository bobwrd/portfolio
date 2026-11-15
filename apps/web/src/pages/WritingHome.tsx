import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import { siteConfig } from "@/config/site";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";

const categories = [
  {
    href: "/writing/weekly",
    title: "Weekly Briefing",
    summary: "What I read and thought about this week in economics, law and policy. Published each weekend.",
  },
  {
    href: "/writing/personal",
    title: "Essays",
    summary: "Longer arguments I want to make carefully, written when they are ready rather than on a schedule.",
  },
  {
    href: "/writing/others",
    title: "Analysis",
    summary: "Research notes and shorter pieces: early findings, data and working arguments.",
  },
];

export default function WritingHome() {
  usePageTitle("Margin of Error");
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
          {siteConfig.title}
        </h1>
        <p className="text-muted-foreground text-sm mb-0.5">By Arin Jain</p>
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
          <Link to="/writing/about" className="text-foreground underline decoration-warm-accent underline-offset-4">
            About the project
          </Link>
        </p>
      </section>

      <div className="border-t border-border pt-6 pb-2">
        <p className="text-xs text-muted-foreground">
          Updated June 2026. In progress: a quantitative paper on Indian sectoral employment using PLFS
          data (2017–2024). CivicAid, a legal literacy app for Singapore, is now on Google Play.
        </p>
      </div>
    </Layout>
  );
}
