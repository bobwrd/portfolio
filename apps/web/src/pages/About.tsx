import Layout from "@/components/Layout";
import PaperHeader from "@/components/PaperHeader";
import { Link } from "react-router-dom";
import { Linkedin, Youtube, FileText } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function About() {
  usePageTitle("About Margin of Error");
  return (
    <Layout>
      <div className="mb-12">
        <PaperHeader series="Margin of Error" title="About Margin of Error" byline="What Margin of Error is, who writes it, and what else I am building." />
      </div>

      <div className="max-w-[42rem] space-y-12 font-serif text-[1.0625rem] text-foreground">

        {/* MOE */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">Margin of Error</h2>
          <p className="leading-relaxed mb-3">
            Margin of Error is a self-directed, multi-year writing project combining economics, law, and coding.
            The central question running through it: where do formal institutions — legal systems,
            economic policy, regulatory frameworks — fall short of the people they are supposed to serve, and why?
          </p>
          <p className="leading-relaxed mb-3">
            The writing itself takes three forms:
          </p>
          <ul className="list-disc space-y-2.5 pl-5 leading-relaxed marker:text-muted-foreground">
            <li>
              <strong className="text-foreground">Essays</strong>: longer, argued pieces on specific
              economic or legal questions. These usually start with a research question, engage with the evidence, and
              land somewhere opinionated. Most have an accompanying PDF.
            </li>
            <li>
              <strong className="text-foreground">Weekly Briefing</strong>: a short weekly digest synthesising
              developments across three themes: development and access to justice; everyday microeconomics;
              and technology, AI, and political economy. Generated from a curated set of sources and published
              each weekend.
            </li>
            <li>
              <strong className="text-foreground">Analysis</strong>: research notes and shorter pieces that don't
              fit either category above.
            </li>
          </ul>
        </section>

        {/* CivicAid */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">CivicAid</h2>
          <p className="leading-relaxed mb-3">
            CivicAid is a legal literacy app I built for Singapore, now on Google Play. It is designed for people who encounter legal
            problems — employment disputes, tenancy issues, consumer rights — but don't know where to start or can't
            afford a lawyer.
          </p>
          <p className="leading-relaxed">
            The premise is that legal information should be navigable without a law degree. CivicAid structures
            Singapore's legal aid landscape, relevant statutes, and practical next steps into something a non-expert
            can actually use. It's Raining Raincoats is partnering on it to reach more people.
          </p>
        </section>

        {/* Research */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">Research</h2>
          <p className="leading-relaxed mb-3">
            I'm working on an economics paper analysing sectoral employment trends in India using PLFS
            (Periodic Labour Force Survey) data from 2017 to 2024. The paper looks at structural shifts between formal
            and informal sectors, across agriculture, manufacturing, and services, and how those shifts map onto policy
            interventions over the period.
          </p>
          <p className="leading-relaxed">
            Early findings on informal sector persistence and non-uniform gender gaps are in the{" "}
            <Link to="/writing/others/issue-002-india-labour" className="text-link underline">
              research notes
            </Link>
          </p>
        </section>

        {/* About me */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">About me</h2>
          <p className="leading-relaxed mb-5">
            I'm Arin Jain, in Grade 11 (IB Year 1). I study economics and law and am interested in the gap between how
            institutions are designed and how they actually function — especially for people who have the least access
            to them. Margin of Error has been running since early 2025. The technical side covers data work in Python
            and R, basic econometrics, interactive model implementation in TypeScript, and full-stack web development.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[0.9375rem] text-link underline"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/watch?v=GucwscPHSGs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[0.9375rem] text-link underline"
            >
              <Youtube className="size-4" />
              TEDx Talk
            </a>
            <a
              href="https://drive.google.com/file/d/17Zxrc2eKob4WHcAnGsNgLUb-xrgRgJQ_/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[0.9375rem] text-link underline"
            >
              <FileText className="size-4" />
              Download CV
            </a>
          </div>
        </section>

        {/* Currently reading */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">Currently reading</h2>
          <p className="leading-relaxed">
            Acemoglu and Restrepo on AI, automation, and the task model of labour. Working through
            New Keynesian macro slowly — specifically how the standard model handles productivity shocks.
          </p>
        </section>

        {/* How this site is built */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">How this site is built</h2>
          <p className="leading-relaxed">
            Vite + React + TypeScript, deployed on Cloudflare Workers with a D1 database for dynamic data.
            Weekly content pipelines run automatically via GitHub Actions. Source is public on{" "}
            <a
              href="https://github.com/bobwrd/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline"
            >
              GitHub
            </a>
          </p>
        </section>

        {/* More */}
        <section>
          <h2 className="text-[1.625rem] leading-tight text-foreground mb-3">More</h2>
          <div className="flex flex-col gap-2">
            <Link to="/writing/why" className="font-sans text-[0.9375rem] text-link underline">
              Why this question: where the institutional-gap question came from
            </Link>
            <Link to="/writing/changed-my-mind" className="font-sans text-[0.9375rem] text-link underline">
              What I've changed my mind about: positions, evidence and where I moved
            </Link>
            <Link to="/writing/changelog" className="font-sans text-[0.9375rem] text-link underline">
              Changelog: what changed on the site, and when
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
