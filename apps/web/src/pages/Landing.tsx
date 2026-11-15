import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import PaperHeader from "@/components/PaperHeader";
import ContentsList, { type ContentsEntry } from "@/components/ContentsList";
import { usePageTitle } from "@/hooks/use-page-title";

const CONTENTS: ContentsEntry[] = [
  { href: "#who-i-am", title: "Who I am", meta: "Interests and plans" },
  { href: "#academics", title: "Academics", meta: "Grades, courses, tests" },
  { href: "#awards", title: "Awards and achievements", meta: "Competitions, papers" },
  { href: "#research", title: "Research and projects", meta: "Margin of Error, PLFS, CivicAid" },
  { href: "#leadership", title: "Leadership", meta: "MUN, Law Academy, TEDx" },
  { href: "#volunteering", title: "Volunteering", meta: "Outreach, literacy" },
  { href: "#skills", title: "Skills, languages and interests" },
  { href: "#appendix", title: "Links" },
];

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2.5 pl-5 leading-relaxed marker:text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function Landing() {
  usePageTitle();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="about" />

      <main className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
        <PaperHeader
          series="Working Paper Series, No. 00"
          meta="Updated July 2026"
          title="Arin Jain"
          byline="Economics and law. Grade 11 (IB Year 1), Overseas Family School, Singapore. He/him."
          keywords={
            <span className="flex flex-col gap-2">
            <span>
              Keywords: development economics, governance, legal systems,
              access to justice, financial inclusion.
            </span>
            <span className="flex flex-wrap gap-x-5 gap-y-1">
              <a className="text-link underline" href="mailto:arinjain.mail@gmail.com">
                arinjain.mail@gmail.com
              </a>
              <a className="text-link underline" href="https://github.com/bobwrd" target="_blank" rel="noopener noreferrer">
                github.com/bobwrd
              </a>
              <a
                className="text-link underline"
                href="https://linkedin.com/in/arin-jain-69a954270"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </span>
            </span>
          }
          abstractLabel="Snapshot"
          abstract={
            <p id="snapshot" className="scroll-mt-20">
              I study economics and law, and I build research around one
              question: where do legal systems and economic policy fail the
              people they are meant to serve? This site holds that work: essays,
              six interactive research tools, and two software projects. At
              Overseas Family School since August 2017.
            </p>
          }
        />

        <section aria-labelledby="contents-heading" className="mt-14 max-w-3xl">
          <h2 id="contents-heading" className="font-sans text-[0.9375rem] font-semibold">
            Contents
          </h2>
          <ContentsList className="mt-3" entries={CONTENTS} />
          <p className="mt-6 font-sans text-[0.9375rem] leading-relaxed text-muted-foreground">
            The work itself:{" "}
            <Link to="/mini" className="text-link underline">research tools</Link>,{" "}
            <Link to="/writing" className="text-link underline">writing</Link>, and the{" "}
            <Link to="/overview" className="text-link underline">site guide</Link>.
          </p>
        </section>

        <div className="paper-body mt-16 max-w-[42rem] font-serif text-[1.0625rem]">
        {/* Who I Am */}
        <section id="who-i-am" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">1.</span> Who I am</h2>
          <p className="mt-4 leading-relaxed">
            I'm a Grade 11 student at Overseas Family School in Singapore. I
            plan to study economics at the undergraduate level and law at the
            postgraduate level. I care most about using law and economics to
            improve access to justice, financial inclusion, and opportunity
            for underserved communities. I'm especially drawn to development
            economics, governance, and legal systems — and to the question of
            where formal institutions fall short of the people they're meant
            to serve.
          </p>
        </section>

        <hr className="my-12 border-border" />

        {/* Academics */}
        <section id="academics" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">2.</span> Academics</h2>
          <List
            items={[
              "GPA: 4.00/4.00 current (Grade 10, Sem 2); 3.93/4.00 cumulative (Grades 9–10)",
              "IGCSE / IB MYP courses: Computer Science; Coordinated Sciences (Double Award); Economics; English Language & Literature; Mathematics (Accelerated); Additional Mathematics; French (DELF B1); PE",
              <>
                Intended IB Diploma:
                <List
                  items={[
                    "Higher Level: Economics; Mathematics: Analysis & Approaches (AA); Physics",
                    "Standard Level: Global Politics; Spanish Ab Initio; English A Language & Literature",
                  ]}
                />
              </>,
              "Standardized testing: PSAT/NMSQT 1460/1520 — 700 Reading & Writing, 760 Math, NMSC 216 (best in school; ~99th percentile worldwide)",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Awards */}
        <section id="awards" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">3.</span> Awards and achievements</h2>
          <List
            items={[
              <>
                Peer-reviewed conference author: paper accepted after
                double-blind review for the 10th International Conference on
                New Trends in Social Sciences (Stockholm, Aug 2026) —
                "Sectoral Employment Dynamics and Economic Growth in India: A
                Gender- and Region-Wise Analysis Across NIC Industries."
                Rated original and policy-relevant; eligible for indexed
                journal publication.
              </>,
              <>
                Shortlisted, John Locke Institute Essay Competition
                (International Relations) — top 17.5% of ~100,000 global
                participants; essay on{" "}
                <Link
                  to="/writing/personal/us-economy-cheap-imports-china"
                  className="text-link underline"
                >
                  the impact of cheap Chinese imports on the US economy
                </Link>
              </>,
              "SASMO 2026 — 1st in school; 126th in award category (~45,000 students).",
              "UKMT Intermediate Maths Challenge — Gold (top ~7–8%).",
              "UKMT Junior Maths Challenge — Gold (top 7%).",
              "OFS Debate Competition — Winner, Best Speaker.",
              "Mock trials — won 3 of 3 at the SJII LawCon nationwide forum.",
              "NYAA (National Youth Achievement Award) — completed Bronze and Silver; pursuing Gold.",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Research */}
        <section id="research" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">4.</span> Research and projects</h2>
          <List
            items={[
              <>
                Margin of Error — self-directed, full-stack research project
                (economics + law + development) built around one question:
                where do legal systems, economic policy, and regulatory
                frameworks fail the people they serve, and why? On this site it
                takes two forms: the writing, and six interactive research
                tools:
                <List
                  items={[
                    "The Verdict — reproducible Enforcement-Driven Index (EDI) scoring AI legal/regulatory events on five factors, updated weekly (EU AI Act scored highest at 87.3).",
                    "The Ledger — hand-built database of Monetary Authority of Singapore enforcement actions.",
                    "The Observatory — interactive macro model tracing how AI adoption feeds through to productivity, wages and prices, using live World Bank and FRED data.",
                    "The Arena — interactive industrial-organization models (Bertrand, Cournot, innovation/tournament incentives).",
                    "The Distribution Lab — 465-country-year panel (1990–2020) mapping institutional configurations to distributional outcomes via kernel weighting.",
                    "The Docket — map of India's 49-million-case court backlog with a prototype citizen case-tracking dashboard and an India–Singapore comparison.",
                  ]}
                />
                <p className="mt-2">
                  Explore the{" "}
                  <Link
                    to="/mini"
                    className="text-link underline"
                  >
                    research tools
                  </Link>{" "}
                  and the{" "}
                  <Link
                    to="/writing"
                    className="text-link underline"
                  >
                    writing
                  </Link>
                  ; source code at{" "}
                  <a
                    className="text-link underline"
                    href="https://github.com/bobwrd/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/bobwrd/portfolio
                  </a>
                  .
                </p>
              </>,
              <>
                Indian PLFS economics research — completed research paper on
                sectoral employment trends in India by region, industry, and
                gender using Periodic Labour Force Survey data (the paper
                accepted at NTSS above).{" "}
                <Link
                  to="/writing/others/issue-002-india-labour"
                  className="text-link underline"
                >
                  Read the early findings
                </Link>
              </>,
              "Supervised literature review — reviewing the South Asian gig economy under Dr. Shreshti Rawat of the Meghnad Desai Academy of Economics (MDAE) / Indira Gandhi Institute of Development Research.",
              "CivicAid — a legal literacy app informing the public about key Singapore laws; live on Google Play, with It's Raining Raincoats as partner to expand its reach.",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Leadership */}
        <section id="leadership" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">5.</span> Leadership</h2>
          <List
            items={[
              "Under-Secretary-General, MUN@OFS (executive team) — organize MY-MUNOFS (~413 attendees) and MUNOFS (~550 attendees); help lead a ~70–80 delegate club; 19+ conferences as delegate, chaired 9+, focused on international law, human rights, and global governance.",
              "President, Law Academy @ OFS — application-only club (~21 members, ~65 interested); teach advocacy, case theory, cross-examination; design mock trial and moot court cases; previously advocate in 4 winning mock trials and 2 winning moot courts.",
              "Co-Founder & President, NYAA Club @ OFS — lead ~70 students through Bronze/Silver/Gold; plan service-learning and outdoor workshops.",
              <>
                Director of Speakers, TEDxOFS 2026 (former 2025 speaker) —
                select and mentor speakers, run rehearsals for a live
                audience of 100+. My own talk:{" "}
                <a
                  className="text-link underline"
                  href="https://www.youtube.com/watch?v=GucwscPHSGs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  "Do Our Dreams Belong to Us?"
                </a>{" "}
                on how society shapes ambition.
              </>,
              "Co-Founder & President, Trader Society / Financial Literacy Club @ OFS — cross-school club teaching markets, trading, and investing basics; reached ~30 people.",
              "Student Voice @ OFS — President of Alumni Network (team of 10 connecting students with alumni); founding member of the student newsletter (opinion pieces on the end of globalization and privatization/inequality).",
              "FT Student Advocate, Financial Times (internship, remote) — only selected OFS student advocate; surveying, material creation, and awareness work.",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Volunteering */}
        <section id="volunteering" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">6.</span> Volunteering</h2>
          <List
            items={[
              <>
                Director of Education &amp; Outreach, Netraheen Vikas
                Sansthan (Jodhpur, India) — digital outreach and fundraising
                lead for a school serving ~550 blind, deaf, and verbally
                challenged students; conceptualized and built the school's
                e-commerce site (
                <a
                  className="text-link underline"
                  href="https://jodhpurblindschool.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  jodhpurblindschool.in
                </a>
                ) selling student-made crafts; social-media fundraising
                strategy raised ~INR 11,000 in testing.
              </>,
              "Country Director (India), ARISE — student-led financial literacy org; leading expansion into low-income rural India (starting in Rajasthan) via partnerships; cumulatively reached ~1,000 people.",
              "Public Relations Volunteer, NLB Singapore — ~30 hours across libraries promoting reading programs and helping patrons.",
              "Community volunteer, Jodhpur NGOs — ~40 hours across 3 NGOs supporting animals, birds, and people in need.",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Skills */}
        <section id="skills" className="scroll-mt-20">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">7.</span> Skills, languages and interests</h2>
          <List
            items={[
              "Languages: English (native/bilingual); Hindi (fluent/full professional); French (conversational).",
              "Technical: Python, Java, C++, SQL, HTML; data analysis; econometrics; full-stack development; Google Suite, Microsoft 365, Canva.",
              "Strengths: public speaking, debate, mock trial advocacy, quantitative and empirical research, team leadership, project management.",
              "Passions: development economics, financial inclusion, access to justice, non-profits, and ethics.",
              "Hobbies: cycling, reading, podcasts, and philosophy (especially ethics).",
            ]}
          />
        </section>

        <hr className="my-12 border-border" />

        {/* Appendix */}
        <section id="appendix" className="scroll-mt-20 pb-16">
          <h2 className="text-[1.75rem] leading-tight"><span className="text-muted-foreground">8.</span> Links</h2>
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
                to="/overview"
                className="text-link underline"
              >
                Site guide: what is here and why it is built this way
              </Link>
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
