import Layout from "@/components/Layout";

type ChangeEntry = {
  date: string;
  items: string[];
};

const entries: ChangeEntry[] = [
  {
    date: "June 2026",
    items: [
      "The Distribution Lab launched: a fixed full-screen app covering five countries (US, Sweden, India, Brazil, Nigeria) from 1990 to 2020. History mode shows observed regime and outcome data; Playground maps slider configurations to outcomes via Gaussian kernel weighting over 465 real country-years. Covers distribution (Gini, top-10% share, poverty), education mobility (GDIM), and macro and wellbeing indicators. Data: WDI, WID, UNDP HDR, OECD SOCX and ICTWSS, GDIM. Methods at /lab/methods.",
      "Distribution Lab: added CSV, JSON, and HTML data downloads below the timeline strip. Client-side generation from the loaded dataset — 465 rows, 15 countries, 1990–2020.",
      "The Arena launched: a scroll-driven interactive explorer on competition and efficiency. Four chapters — number of firms vs. price and quality, tournament effort lab, market-outcomes 2×2 over concentration and behavioural distortion, and three policy lenses — plus a full technical note at /arena/methods. All curves are closed-form teaching models anchored to published IO literature; no data fetch.",
      "Added 'Why this question' page — the origin of the institutional-gap question across all five projects.",
      "Rewrote About page: project dates, 'Currently reading' section, 'How this site is built' note.",
      "Observatory: added casual reader entry paragraph so you can interact before parsing the model framing.",
      "Verdict: added cross-links to Observatory and essays at the bottom of the case index.",
      "Nav: renamed 'Others' to 'Analysis'. Added 'Why this?' and 'Changed my mind' to nav.",
      "Homepage: thesis block added above everything else; Observatory moved to first in highlights; 'Last updated / Currently working on' footer added.",
    ],
  },
  {
    date: "April–May 2026",
    items: [
      "Observatory launched: intro walkthrough, live data atlas (World Bank + FRED, five countries), toy macro model with four sliders and three named scenarios.",
      "Observatory data pipeline set up via GitHub Actions — refreshes weekly.",
      "Added three named scenarios to the Lab: Rapid Adoption, Slow Burn, and Capital Capture.",
      "Observatory methodology section written and published.",
    ],
  },
  {
    date: "February–March 2026",
    items: [
      "The Ledger launched: coded database of MAS enforcement actions, searchable by sector, violation type, and sanction.",
      "Ledger charts page added (sector breakdown, sanction distribution).",
      "Weekly Verdict radar scan automated via GitHub Actions — new cases added every Monday morning.",
      "Verdict database expanded; scoring script updated to renormalise across published cases.",
    ],
  },
  {
    date: "January 2026",
    items: [
      "Site migrated from Zo to Cloudflare Workers + D1. Static assets served via Cloudflare's edge.",
      "Weekly digest automation set up (Saturday 23:59 SGT).",
      "Daily intelligence summary pipeline added.",
      "Profile and About pages written.",
    ],
  },
  {
    date: "Late 2025",
    items: [
      "The Verdict launched: five-factor scoring methodology (LI, SE, ER, SF, PS), EDI composite score, Disruption Potential / Disturbance Reach radar.",
      "First eight cases published and scored.",
      "Site launched at margin-of-error.arinjain-mail.workers.dev.",
    ],
  },
];

export default function Changelog() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          Changelog
        </h1>
        <p className="text-muted-foreground text-base">
          What has been added or changed, and when.
        </p>
      </div>

      <div className="space-y-10">
        {entries.map((entry) => (
          <section key={entry.date}>
            <h2 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider mb-3">
              {entry.date}
            </h2>
            <ul className="space-y-2">
              {entry.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-warm-accent mt-0.5 shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>
  );
}
