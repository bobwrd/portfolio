import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

const ANCHORS = [
  { href: "#snapshot", label: "Snapshot" },
  { href: "#who-i-am", label: "Who I Am" },
  { href: "#academics", label: "Academics" },
  { href: "#awards", label: "Awards" },
  { href: "#research", label: "Research" },
  { href: "#leadership", label: "Leadership" },
  { href: "#volunteering", label: "Volunteering" },
  { href: "#skills", label: "Skills" },
];

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-serif text-neutral-900">
      <SectionSwitcher current="About Me" />

      <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl justify-center gap-5 overflow-x-auto px-6 py-3 font-sans text-sm">
          {ANCHORS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="whitespace-nowrap text-neutral-700 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950"
            >
              {a.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Title block */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl leading-tight">Arin Jain</h1>
          <p className="mt-3 text-base text-neutral-600">He/him · Singapore</p>
          <p className="mt-1 text-sm text-neutral-500">
            Overseas Family School — Grade 11
          </p>
          <p className="mt-1 text-sm text-neutral-500">Updated July 2026</p>
          <p className="mt-3 font-sans text-sm text-neutral-700">
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="mailto:arinjain.mail@gmail.com"
            >
              arinjain.mail@gmail.com
            </a>{" "}
            |{" "}
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="https://github.com/bobwrd"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/bobwrd
            </a>{" "}
            |{" "}
            <a
              className="underline decoration-neutral-300 underline-offset-4"
              href="https://linkedin.com/in/arin-jain-69a954270"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/arin-jain-69a954270
            </a>
          </p>
        </header>

        {/* Snapshot */}
        <section id="snapshot" className="scroll-mt-16">
          <h2 className="text-center text-lg font-bold">Snapshot</h2>
          <p className="mt-4 leading-relaxed">
            Aspiring economist and future legal scholar combining strong
            quantitative rigor, policy leadership, and real-world impact
            across law, economics, and global affairs.
          </p>
          <List
            items={[
              "Name: Arin Jain (he/him)",
              "Location: Singapore",
              "School: Overseas Family School (OFS), Singapore — Grade 11 (attending since Aug 2017)",
            ]}
          />
        </section>

        <hr className="my-10 border-neutral-200" />

        {/* Who I Am */}
        <section id="who-i-am" className="scroll-mt-16">
          <h2 className="text-lg font-bold">1 Who I Am</h2>
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

        <hr className="my-10 border-neutral-200" />

        {/* Academics */}
        <section id="academics" className="scroll-mt-16">
          <h2 className="text-lg font-bold">2 Academics</h2>
          <List
            items={[
              "GPA: 4.00/4.00 current (Grade 10, Sem 2); 3.93/4.00 cumulative (Grades 9–10)",
              "IGCSE / IB MYP courses: Computer Science; Coordinated Sciences (Double Award); Economics; English Language & Literature; Mathematics (Accelerated); Additional Mathematics; French (DELF B1); PE",
              <>
                Intended IB Diploma:
                <List
                  items={[
                    "Higher Level: Economics; Mathematics: Analysis & Approaches (AA); Physics",
                    "Standard Level: Global Politics; French B (also listed elsewhere as Spanish Ab Initio); English A Language & Literature",
                  ]}
                />
              </>,
              "Standardized testing: PSAT/NMSQT 1460/1520 — 700 Reading & Writing, 760 Math, NMSC 216 (best in school; ~99th percentile worldwide)",
            ]}
          />
        </section>

        <hr className="my-10 border-neutral-200" />

        {/* Awards */}
        <section id="awards" className="scroll-mt-16">
          <h2 className="text-lg font-bold">3 Awards &amp; Achievements</h2>
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
                  className="underline decoration-neutral-300 underline-offset-4"
                >
                  the impact of cheap Chinese imports on the US economy →
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

        <hr className="my-10 border-neutral-200" />

        {/* Research */}
        <section id="research" className="scroll-mt-16">
          <h2 className="text-lg font-bold">4 Research &amp; Projects</h2>
          <List
            items={[
              <>
                Margin of Error — self-directed, full-stack research project
                (economics + law + development) built around one question:
                where do legal systems, economic policy, and regulatory
                frameworks fail the people they serve, and why? Six
                subprojects:
                <List
                  items={[
                    "The Verdict — reproducible Enforcement-Driven Index (EDI) scoring AI legal/regulatory events on five factors, updated weekly (EU AI Act scored highest at 87.3).",
                    "The Ledger — hand-built database of Monetary Authority of Singapore enforcement actions.",
                    "The Observatory — interactive macro model tracing AI adoption → productivity, wages, prices, using live World Bank and FRED data.",
                    "The Arena — interactive industrial-organization models (Bertrand, Cournot, innovation/tournament incentives).",
                    "The Distribution Lab — 465-country-year panel (1990–2020) mapping institutional configurations to distributional outcomes via kernel weighting.",
                    "The Docket — map of India's 49-million-case court backlog with a prototype citizen case-tracking dashboard and an India–Singapore comparison.",
                  ]}
                />
                <p className="mt-2">
                  Live in this site's{" "}
                  <Link
                    to="/mini"
                    className="underline decoration-neutral-300 underline-offset-4"
                  >
                    Mini Projects
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/writing"
                    className="underline decoration-neutral-300 underline-offset-4"
                  >
                    Margin of Error
                  </Link>{" "}
                  sections; source at{" "}
                  <a
                    className="underline decoration-neutral-300 underline-offset-4"
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
                  className="underline decoration-neutral-300 underline-offset-4"
                >
                  Early findings →
                </Link>
              </>,
              "Supervised literature review — reviewing the South Asian gig economy under Dr. Shreshti Rawat of the Meghnad Desai Academy of Economics (MDAE) / Indira Gandhi Institute of Development Research.",
              "CivicAid — a legal literacy app informing the public about key Singapore laws; on Google Play, partnering with the Center for Domestic Employees (100,000+ workers/year) to expand reach.",
            ]}
          />
        </section>

        <hr className="my-10 border-neutral-200" />

        {/* Leadership */}
        <section id="leadership" className="scroll-mt-16">
          <h2 className="text-lg font-bold">5 Leadership</h2>
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
                  className="underline decoration-neutral-300 underline-offset-4"
                  href="https://www.youtube.com/watch?v=GucwscPHSGs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  "Do Our Dreams Belong to Us?" →
                </a>{" "}
                on how society shapes ambition.
              </>,
              "Co-Founder & President, Trader Society / Financial Literacy Club @ OFS — cross-school club teaching markets, trading, and investing basics; reached ~30 people.",
              "Student Voice @ OFS — President of Alumni Network (team of 10 connecting students with alumni); founding member of the student newsletter (opinion pieces on the end of globalization and privatization/inequality).",
              "FT Student Advocate, Financial Times (internship, remote) — only selected OFS student advocate; surveying, material creation, and awareness work.",
            ]}
          />
        </section>

        <hr className="my-10 border-neutral-200" />

        {/* Volunteering */}
        <section id="volunteering" className="scroll-mt-16">
          <h2 className="text-lg font-bold">6 Volunteering &amp; Impact</h2>
          <List
            items={[
              <>
                Director of Education &amp; Outreach, Netraheen Vikas
                Sansthan (Jodhpur, India) — digital outreach and fundraising
                lead for a school serving ~550 blind, deaf, and verbally
                challenged students; conceptualized and built the school's
                e-commerce site (
                <a
                  className="underline decoration-neutral-300 underline-offset-4"
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

        <hr className="my-10 border-neutral-200" />

        {/* Skills */}
        <section id="skills" className="scroll-mt-16">
          <h2 className="text-lg font-bold">7 Skills, Languages &amp; Interests</h2>
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

        <hr className="my-10 border-neutral-200" />

        {/* Appendix */}
        <section id="appendix" className="scroll-mt-16 pb-16">
          <h2 className="text-lg font-bold">8 Appendix</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              <a
                className="underline decoration-neutral-300 underline-offset-4"
                href="https://github.com/bobwrd"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub — github.com/bobwrd
              </a>
            </li>
            <li>
              <a
                className="underline decoration-neutral-300 underline-offset-4"
                href="https://linkedin.com/in/arin-jain-69a954270"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn — linkedin.com/in/arin-jain-69a954270
              </a>
            </li>
            <li>
              <Link
                to="/overview"
                className="underline decoration-neutral-300 underline-offset-4"
              >
                Site overview — what this portfolio is and how it's built →
              </Link>
            </li>
            <li>
              <Link
                to="/writing/about"
                className="underline decoration-neutral-300 underline-offset-4"
              >
                Full project overview →
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm text-neutral-500">
            Last updated July 2026.
          </p>
        </section>
      </main>
    </div>
  );
}
