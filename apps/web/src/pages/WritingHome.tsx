import Layout from "@/components/Layout";
import NewsletterSignup from "@/components/NewsletterSignup";
import PaperHeader from "@/components/PaperHeader";
import ContentsList from "@/components/ContentsList";
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
      <PaperHeader
        series="Working Paper Series, No. 03"
        meta="Updated June 2026"
        title={siteConfig.title}
        byline={`By ${siteConfig.author}. ${siteConfig.tagline}`}
        abstract={
          <p>
            A self-directed research project working through one question:
            where do formal institutions (legal systems, economic policy,
            regulatory frameworks) fall short of the people they are supposed
            to serve, and why?{" "}
            <Link to="/writing/about" className="text-link underline">
              About the project
            </Link>
          </p>
        }
      />

      <section aria-labelledby="sections-heading" className="mt-14 max-w-3xl">
        <h2 id="sections-heading" className="font-sans text-[0.9375rem] font-semibold">
          Contents
        </h2>
        <ContentsList className="mt-3" entries={categories} />
      </section>

      <section aria-labelledby="newsletter-heading" className="mt-16 max-w-3xl">
        <h2 id="newsletter-heading" className="text-[1.75rem] leading-tight">
          The weekly briefing by email
        </h2>
        <div className="mt-4">
          <NewsletterSignup />
        </div>
      </section>

      <p className="mt-12 max-w-3xl border-t border-border pt-6 font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
        In progress: a quantitative paper on Indian sectoral employment using
        PLFS data (2017–2024). CivicAid, a legal literacy app for Singapore, is
        now on Google Play.
      </p>
    </Layout>
  );
}
