import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";
import PaperHeader from "@/components/PaperHeader";

const RELEASE_URL = "https://github.com/bobwrd/ask/releases/tag/v0.2.1";
const DOWNLOAD_URL =
  "https://github.com/bobwrd/ask/releases/download/v0.2.1/Ask-macOS-arm64.zip";

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-border bg-secondary px-5 py-4 font-mono text-[0.875rem] leading-relaxed text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function Screenshot({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="mt-4">
      <img
        src={src}
        alt={caption}
        className="w-full border border-border"
      />
      <figcaption className="mt-2 font-sans text-[0.875rem] text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

const PRINCIPLES = [
  {
    title: "Guessability",
    body: "You should be able to predict what a line does before you learn it.",
  },
  {
    title: "One obvious way",
    body: "One way to load, one to filter, one to group. No synonyms.",
  },
  {
    title: "Errors teach",
    body: "Every error says what went wrong, where (line + column + the offending value), and gives a paste-able fix.",
  },
  {
    title: "Read order = run order",
    body: "Clauses execute top to bottom, exactly as written. Nothing silently reorders.",
  },
  {
    title: "The grammar never grows; the vocabulary does",
    body: "New capability is a new verb in an existing slot — never a new sentence shape.",
  },
];

const REFERENCE: { section: string; rows: [string, string][] }[] = [
  {
    section: "Load / save",
    rows: [
      ['load "file"', "Read CSV/Excel/JSON; auto-detect column types"],
      ["from <table>", "Continue on a named/loaded table"],
      ['save as "file"', "Write the current table to disk"],
    ],
  },
  {
    section: "Columns / rows",
    rows: [
      ["keep <cols> / drop <cols>", "Select / remove columns"],
      ["rename a to b", "Rename a column"],
      ["add x = <expr>", "Computed column, vectorized over rows"],
      ["add x as <Type>", "Assign an algebraic type to a column"],
      ["bin <col> into ...", "Bucket a number into named ranges"],
      ["where <condition>", "Keep matching rows"],
    ],
  },
  {
    section: "Group / summarize / combine",
    rows: [
      ["group by <cols>", "Partition rows"],
      ["show <aggs>", "total average count min max median spread share, name with as"],
      ["combine with <t> on <key>", "Join, keeping all rows from this table by default"],
      ["reshape wide/long", "Pivot rows into columns, or unpivot columns into rows"],
    ],
  },
  {
    section: "Chart",
    rows: [
      [
        "chart <y> by <x> as <kind>",
        "bar line area scatter bubble histogram box pie heatmap distribution change flow tree network map story",
      ],
      ["color by / size by / animate by", "Chart modifiers, indented under chart"],
    ],
  },
  {
    section: "Statistics",
    rows: [
      ["compare <value> between <group>", "Welch t / ANOVA / two-proportion z / chi-square, auto-picked"],
      ["relate <a> and <b>", "Pearson + Spearman correlation with a plain interpretation"],
      ["predict <target> from <a>, <b>", "Linear or logistic regression, explained in plain language"],
    ],
  },
];

export default function Ask() {
  usePageTitle("Ask, a data language for beginners");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="ask" />

      <main className="mx-auto max-w-6xl px-5 pt-12 pb-24 sm:px-8">
        <PaperHeader
          series="Working Paper Series, No. 05"
          meta="v0.2.1, MIT licensed"
          color="var(--ask-band)"
          title="Ask"
          byline="A small language for asking questions of your data, with a built-in editor, table and charts."
          abstract={
            <p>
              Ask is a data-analysis language designed to be <em>guessable</em>.
              You read a program top to bottom and it does exactly that, in
              order: load a file, clean it, filter it, group it, chart it. No
              query planner, no hidden steps, no Python to learn. It runs on
              pandas and matplotlib underneath, but you only ever write Ask.
            </p>
          }
        />
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-[0.9375rem]">
          <a
            href={DOWNLOAD_URL}
            className="bg-foreground px-5 py-2.5 font-medium text-background transition-colors duration-150 hover:bg-foreground/85"
          >
            Download for macOS (arm64)
          </a>
          <a href={RELEASE_URL} target="_blank" rel="noopener noreferrer" className="text-link underline">
            v0.2.1 release notes
          </a>
          <a href="https://github.com/bobwrd/ask" target="_blank" rel="noopener noreferrer" className="text-link underline">
            Source on GitHub
          </a>
        </div>

        <div className="paper-body mt-16 max-w-[42rem] font-serif text-[1.0625rem]">
        <section className="mb-14">
          <Code>{`load "sales.csv"
  where region is "West"
  show total revenue as sales
  chart sales by region as bar`}</Code>
          <p className="mt-3 font-sans text-[0.875rem] text-muted-foreground">
            Press Run. You get a table and a chart.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">Why Ask</h2>
          <p className="mt-3 leading-relaxed">
            Most data tools ask beginners to learn either a spreadsheet's
            mouse-maze or a programming language's syntax before they can
            answer a single question. Ask takes a third path, built on five
            principles.
          </p>
          <dl className="mt-6 flex flex-col gap-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title}>
                <dt className="font-semibold">{p.title}</dt>
                <dd className="mt-1 text-foreground/85">{p.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 leading-relaxed">
            The mental model is a <strong>pipeline, not a query</strong>: a
            program is a stack of clauses, each takes a table and returns a
            table, and a trailing <code>chart</code> renders it.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">A two-minute tour</h2>
          <p className="mt-3 leading-relaxed">
            Load a file, add a computed column, bucket it into named ranges,
            group and summarize, then chart it — five steps, read top to
            bottom.
          </p>
          <div className="mt-4">
            <Code>{`# 1. Load a file. Types (Money, Number, Date...) are auto-detected.
load "sales.csv"

# 2. Add a computed column, vectorized over every row.
add margin = (revenue - cost) / revenue

# 3. Bucket a number into named ranges -> creates a \`margin_tier\` column.
bin margin into low, medium, high

# 4. Group, then summarize. \`as\` names the output column.
group by region, margin_tier
show total revenue as sales

# 5. Chart it. Indented lines modify the chart.
chart sales by region as bar
  color by margin_tier
  label "Revenue by region and margin tier"`}</Code>
          </div>
          <Screenshot src="/ask/sample2_grouped_bar.png" caption="Grouped bar chart" />
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">Types can drive the chart</h2>
          <p className="mt-3 leading-relaxed">
            Define an ordered type and the axis follows it (Poor, Fair, Good,
            Great) instead of sorting alphabetically.
          </p>
          <div className="mt-4">
            <Code>{`type Rating = Poor | Fair | Good | Great
load "reviews.csv"
  add score as Rating
  group by score
  show count
  chart count by score as bar`}</Code>
          </div>
          <Screenshot
            src="/ask/sample3_ordered_axis.png"
            caption="Ordered bar chart from an algebraic type"
          />
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">Statistics, in plain English</h2>
          <p className="mt-3 leading-relaxed">
            R makes you know which test to run. Ask picks the right one and
            answers in words, with uncertainty by default.
          </p>
          <div className="mt-4">
            <Code>{`load "sales.csv"
  compare revenue between region      # Welch t / ANOVA / chi-square, chosen automatically
  relate cost and revenue             # correlation + interpretation
  predict revenue from cost           # linear regression, in plain language`}</Code>
          </div>
          <p className="mt-4 leading-relaxed text-foreground/85">
            You get findings like <em>"cost and revenue have a strong
            relationship (r = 0.88) - they tend to rise together. This is
            very unlikely to be chance (p &lt; 0.001)"</em> and <em>"each 1
            more cost is linked to +1.66 in revenue. The model explains 78%
            of the variation."</em>
          </p>
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">Errors that teach</h2>
          <p className="mt-3 leading-relaxed">
            Ask never shows a Python traceback. A mistake produces three
            parts — what, where, and a fix.
          </p>
          <div className="mt-4">
            <Code>{`Column 'price' is text, but you're doing math on it.
line 4
Try: clean price`}</Code>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">The ILOStat acceptance test</h2>
          <p className="mt-3 leading-relaxed">
            Real, messy government data — the economic activity is buried
            inside a free-text notes field under three classification
            schemes — pulled apart, filtered, ranked, and charted in thirteen
            readable lines.
          </p>
          <div className="mt-4">
            <Code>{`load "ilostat.csv"
  understand
  add scheme = extract between "(" and ")" from notes
  add activity = extract after ": " from notes
  add activity = extract after ". " from activity
  where scheme is "ISIC-Rev.4"
  where activity is not "Total"
  where year is 2025
  group by activity
  show total value as employment
  top 10 by employment
  sort by employment descending
  chart employment by activity as bar
    label "Female employment by sector, Chile 2025"`}</Code>
          </div>
          <Screenshot src="/ask/sample5_ilostat.png" caption="ILOStat sector chart" />
        </section>

        <section className="mb-14">
          <h2 className="text-[1.75rem] leading-tight">Language reference</h2>
          <p className="mt-3 leading-relaxed">
            A program is a sequence of statements in a fixed canonical order:
            load, transforms, group by, show, sort, chart, save. Out-of-order
            clauses raise a teaching error rather than silently reordering.
          </p>
          <div className="mt-6 flex flex-col gap-8">
            {REFERENCE.map((group) => (
              <div key={group.section}>
                <h3 className="text-xl">{group.section}</h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {group.rows.map(([cmd, behavior]) => (
                        <tr
                          key={cmd}
                          className="border-b border-border/60"
                        >
                          <td className="whitespace-nowrap py-2 pr-4 align-top font-mono text-xs text-foreground">
                            {cmd}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {behavior}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-sm text-muted-foreground">
            This is a subset — the full reference (text extraction, cleaning,
            every chart modifier, join kinds) lives in the{" "}
            <a
              href="https://github.com/bobwrd/ask#language-reference"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline"
            >
              repo README
            </a>
            .
          </p>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="text-[1.75rem] leading-tight">Get it</h2>
          <p className="mt-3 leading-relaxed">
            Requires Python 3.10+ if running from source. The macOS build
            below is a self-contained app bundle — no Python install needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 font-sans text-sm">
            <a
              href={DOWNLOAD_URL}
              className="bg-foreground px-5 py-2.5 font-medium text-background transition-colors duration-150 hover:bg-foreground/85"
            >
              Ask-macOS-arm64.zip
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            MIT licensed. v0.2.1.
          </p>
        </section>
        </div>
      </main>
    </div>
  );
}
