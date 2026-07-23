import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function ChangedMyMind() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          What I've changed my mind about
        </h1>
        <p className="text-muted-foreground text-base">
          Positions I held, evidence that pushed me off them, and what I think now.
        </p>
      </div>

      <div className="space-y-14 text-sm text-muted-foreground leading-relaxed max-w-prose">

        {/* Entry — Distribution Lab */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On what policy levers actually predict in distribution data
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated June 2026</p>

          <p className="mb-4">
            My assumption before working through the cross-country data was that three regime dimensions
            would dominate distributional outcomes: welfare generosity, labour power, and tax progressivity.
            The Nordic-vs-liberal model story. Set those three high enough and inequality comes down.
          </p>

          <p className="mb-4">
            Two things pushed against that. First, poverty headcount is largely a development-stage
            variable. GDP per capita and structural mix — services share, informality — predict it better
            than any of the welfare-state dimensions. Countries with similar welfare generosity scores can
            sit 15 percentage points apart on poverty headcount depending on where they are in structural
            transition. The lever matters less than the starting position.
          </p>

          <p className="mb-4">
            Second, Gini and top-10% share do respond to welfare regime, but within-group variance is
            high. A slider configuration in the Playground matching Sweden circa 2000 still produces wide
            uncertainty because the analogue pool contains episodes from countries with similar formal
            settings and different outcomes. The regime indices capture contemporaneous policy choices; they
            do not capture path dependence, and path dependence turns out to matter a lot.
          </p>

          <p>
            I still think welfare and labour institutions reduce inequality. But the effect is conditional
            on structural context in ways that make the standard story incomplete. The Distribution Lab makes
            that visible — and it is not a reassuring result if you wanted a clean policy prescription.
          </p>
        </section>

        {/* Entry 0 — Arena */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On whether more competition always produces better outcomes
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated June 2026</p>

          <p className="mb-4">
            My default assumption going into the IO literature was a clean version of the standard story:
            more firms means more competition, more competition means lower prices and higher quality, and
            policy should therefore make markets less concentrated wherever possible. The antitrust
            instinct. It seemed robust.
          </p>

          <p className="mb-4">
            Working through the empirical literature for The Arena broke that. The Bresnahan-Reiss result
            is striking: most of the competitive discipline in a market arrives with the second and third
            entrant. After that, adding more firms has diminishing returns on prices. The relationship is
            not linear — it flattens fast. That alone complicates any simple "more competition = better"
            rule, because it means the relevant question is whether you have one firm or a few, not
            whether you have fifteen or twenty.
          </p>

          <p className="mb-4">
            The innovation piece is stranger. Aghion et al. find an inverted-U between competition and
            innovation: industries with intermediate concentration innovate more than industries that are
            either monopolistic or intensely competitive. The mechanism is that competitive pressure raises
            the return to escaping the pack, but only up to the point where firms still have enough margin
            to fund R&D. Push competition hard enough and you kill the slack that innovation requires.
            I had not expected the relationship to be non-monotonic.
          </p>

          <p className="mb-4">
            Tournament theory made this more complicated still. Firms and regulators often use competition
            as a motivational device — prize spreads between winners and losers are supposed to drive
            effort. The Harbring and Irlenbusch experiments show that large prize spreads do increase
            effort, but past a threshold they also induce sabotage. The same incentive structure that
            raises productive effort can raise destructive effort proportionally. Whether competition
            produces good outcomes depends on which lever dominates, and the answer varies by context.
          </p>

          <p>
            I still think concentrated markets are usually worth scrutinising. But I no longer think the
            direction of the effect is obvious without knowing where you are on the concentration spectrum,
            what the innovation dynamics look like, and whether the behavioural response to competitive
            pressure is primarily productive or adversarial. The Arena is an attempt to build intuition
            about those trade-offs interactively — the same way the Observatory is for AI and macro.
          </p>
        </section>

        {/* Entry 1 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On whether AI regulation can be genuinely cross-jurisdictional
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated May 2026</p>

          <p className="mb-4">
            When I started building The Verdict, I assumed the most important regulatory events would be
            the ones with explicit international coordination behind them — joint statements, mutual
            recognition frameworks, treaty-level commitments. The EU AI Act scored high on my Policy
            Synergy factor partly because it claimed to set a global baseline.
          </p>

          <p className="mb-4">
            Working through the cases changed that. The Act has had real downstream effects — companies
            outside the EU redesigning compliance pipelines, other jurisdictions drafting similar
            risk-tier frameworks — but those effects are not the result of coordination. They are the
            result of market pressure. If you want to sell into the EU, you comply. That is Brussels
            Effect, not international governance.
          </p>

          <p className="mb-4">
            The distinction matters. Brussels Effect is fragile in ways that actual coordination is not:
            it depends on the EU remaining a large enough market to be worth the compliance cost, and it
            does not bind anyone who is not selling there. It also tends to produce compliance with the
            letter of the regulation rather than the spirit, because there is no enforcement mechanism
            beyond market access.
          </p>

          <p>
            I still score Policy Synergy highly for cases that align with international frameworks. But I
            weight genuine coordination mechanisms differently from market-driven convergence, and I am
            more sceptical that the latter produces durable governance. The Verdict's methodology page
            has not caught up with this yet — that update is in progress.
          </p>
        </section>

        {/* Entry 2 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On what the informal sector in India actually tells you
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated April 2026</p>

          <p className="mb-4">
            My prior going into the PLFS data was that informal sector persistence was primarily a
            failure of policy — that with better enforcement of labour regulations, workers would move
            into formal employment and wages would rise. The standard development economics story.
          </p>

          <p className="mb-4">
            The data does not support a clean version of that story. Informality in India is not
            primarily a compliance failure. It is a structural feature: small firms have strong
            incentives to stay below the thresholds that trigger formal employment obligations, and
            workers in many sectors have limited outside options that would make formal employment
            attractive even if it were offered. The informal sector is also not uniformly low-wage —
            in some sub-sectors, informal piece-rate workers earn more than formal employees in the
            same industry.
          </p>

          <p>
            I now think the more useful frame is not "how do we formalise the informal sector" but
            "what protections can be extended to informal workers without requiring formalisation as
            the gateway." That is a harder policy problem with fewer obvious levers, and it is what
            the research paper is trying to be precise about.{" "}
            <Link to="/writing/others/issue-002-india-labour" className="text-warm-accent hover:underline">
              Early findings →
            </Link>
          </p>
        </section>

        {/* Entry 3 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            On whether access to justice is primarily a funding problem
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Updated February 2026</p>

          <p className="mb-4">
            I started thinking about legal access as a resource allocation problem: not enough legal
            aid, not enough lawyers willing to do pro bono work, not enough courts. The obvious fix
            was more funding.
          </p>

          <p className="mb-4">
            The more I read, the less confident I became in that framing. In systems where legal aid
            funding has increased significantly — parts of England and Wales, some Canadian provinces —
            the access gap has not closed proportionally. The bottleneck is often not funding but
            complexity: the law itself is hard to navigate even with a lawyer, let alone without one.
            Forms, procedures, deadlines, jurisdictional questions. People who give up do not always
            give up because they cannot afford representation. They give up because the process is
            opaque enough that they cannot figure out where to start.
          </p>

          <p>
            That is the premise behind CivicAid — not that it replaces legal aid funding, but that
            navigability is a distinct problem from affordability, and one that is more tractable. You
            can structure information without needing a larger legal aid budget. Whether that actually
            changes outcomes is something I want to test once there is an MVP to test it with.
          </p>
        </section>

        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Last updated: June 2026. I add to this when I notice I've actually moved, not just refined.
          </p>
        </div>

      </div>
    </Layout>
  );
}
