import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Linkedin, Youtube, FileText } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          About
        </h1>
        <p className="text-muted-foreground text-base">
          What Margin of Error is, who's behind it, and what else I'm building.
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-10">

        {/* MOE */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Margin of Error</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Margin of Error is a self-directed, multi-year writing project combining economics, law, and coding.
            The central question running through it: where do formal institutions — legal systems,
            economic policy, regulatory frameworks — fall short of the people they are supposed to serve, and why?
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The writing itself takes three forms:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Personal essays</strong> — longer, argued pieces on specific
              economic or legal questions. These usually start with a research question, engage with the evidence, and
              land somewhere opinionated. Most have an accompanying PDF.
            </li>
            <li>
              <strong className="text-foreground">Weekly briefing</strong> — a short weekly digest synthesising
              developments across three themes: development and access to justice; everyday microeconomics;
              and technology, AI, and political economy. Auto-generated from a curated set of sources and published
              every Saturday.
            </li>
            <li>
              <strong className="text-foreground">Others</strong> — analysis pieces and research notes that don't
              fit neatly into either category above.
            </li>
          </ul>
        </section>

        {/* CivicAid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">CivicAid</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            CivicAid is a legal literacy tool I'm building for Singapore. It is designed for people who encounter legal
            problems — employment disputes, tenancy issues, consumer rights — but don't know where to start or can't
            afford a lawyer.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The premise is that legal information should be navigable without a law degree. CivicAid structures
            Singapore's legal aid landscape, relevant statutes, and practical next steps into something a non-expert
            can actually use. MVP in progress.
          </p>
        </section>

        {/* Research */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Research</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            I'm working on an economics paper analysing sectoral employment trends in India using PLFS
            (Periodic Labour Force Survey) data from 2017 to 2024. The paper looks at structural shifts between formal
            and informal sectors, across agriculture, manufacturing, and services, and how those shifts map onto policy
            interventions over the period.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Early findings on informal sector persistence and non-uniform gender gaps are in the{" "}
            <Link to="/writing/others/issue-002-india-labour" className="text-warm-accent hover:underline">
              research notes →
            </Link>
          </p>
        </section>

        {/* About me */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">About me</h2>
          <p className="text-muted-foreground leading-relaxed mb-5">
            I'm Arin Jain, currently in IB Year 1. I study economics and law and am interested in the gap between how
            institutions are designed and how they actually function — especially for people who have the least access
            to them. Margin of Error has been running since early 2025. The technical side covers data work in Python
            and R, basic econometrics, interactive model implementation in TypeScript, and full-stack web development.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/watch?v=GucwscPHSGs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <Youtube className="size-4" />
              TEDx Talk
            </a>
            <a
              href="https://drive.google.com/file/d/17Zxrc2eKob4WHcAnGsNgLUb-xrgRgJQ_/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-card/80 transition-all duration-200 no-underline"
            >
              <FileText className="size-4" />
              Download CV
            </a>
          </div>
        </section>

        {/* Currently reading */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Currently reading</h2>
          <p className="text-muted-foreground leading-relaxed">
            Acemoglu and Restrepo on AI, automation, and the task model of labour. Working through
            New Keynesian macro slowly — specifically how the standard model handles productivity shocks.
          </p>
        </section>

        {/* How this site is built */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How this site is built</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vite + React + TypeScript, deployed on Cloudflare Workers with a D1 database for dynamic data.
            Weekly content pipelines run automatically via GitHub Actions. Source is public on{" "}
            <a
              href="https://github.com/bobwrd/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-accent hover:underline"
            >
              GitHub →
            </a>
          </p>
        </section>

        {/* More */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">More</h2>
          <div className="flex flex-col gap-2">
            <Link to="/writing/why" className="text-sm text-warm-accent hover:underline">
              Why this question — the origin of the institutional-gap question →
            </Link>
            <Link to="/writing/changed-my-mind" className="text-sm text-warm-accent hover:underline">
              What I've changed my mind about — positions, evidence, and where I moved →
            </Link>
            <Link to="/writing/changelog" className="text-sm text-warm-accent hover:underline">
              Changelog — what has been added or changed, and when →
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
