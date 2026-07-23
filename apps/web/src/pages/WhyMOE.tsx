import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function WhyMOE() {
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
          Why this question
        </h1>
        <p className="text-muted-foreground text-base">
          The question behind Margin of Error — where it came from and where it is going.
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-6 text-muted-foreground leading-relaxed">

        <p>
          The question I keep coming back to is a simple one: why do formal institutions so consistently
          fail the people they are supposed to serve?
        </p>

        <p>
          Not fail in the sense of being corrupt or intentionally hostile — though that happens too — but
          fail in the quieter sense. Legal systems that technically work but are practically inaccessible
          to anyone who cannot afford a lawyer. Regulatory frameworks that are well-designed on paper but
          arrive too late, or draw boundaries that don't match where the actual risk sits. Economic policy
          that optimises for aggregate outcomes and misses distributional ones. The gap between the
          institution as designed and the institution as experienced.
        </p>

        <p>
          I started noticing this in different places at roughly the same time. I was reading about AI
          regulation and kept running into the same pattern: frameworks that were serious in intent but
          either over-broad (catching things that posed no real risk) or under-broad (missing the cases
          that mattered). The EU AI Act was impressive as a piece of legislative engineering. Whether it
          would actually constrain the right things was a different question. I built The Verdict partly
          because I wanted a way to track the answer — to score regulatory events not by how ambitious
          they sounded but by how much they were likely to change what actually happens.
        </p>

        <p>
          Around the same time, I was trying to understand how Singapore's financial regulator actually
          behaves in practice, not in theory. The MAS publishes enforcement actions. Nobody structures
          them. You cannot tell, from the public record, whether it is getting stricter or more lenient,
          which sectors it watches most closely, what triggers a fine versus a ban. The Ledger is an
          attempt to make that visible — to turn a pile of press releases into something you can reason
          about.
        </p>

        <p>
          The access to justice piece came from a different direction. I kept encountering the statistic
          that most people who have a legal problem never go to court — not because their claim is weak,
          but because the process is too expensive, too opaque, or too time-consuming. Legal systems
          measure case outcomes. They rarely measure whether the people who needed the system could
          reach it in the first place. That gap in measurement is a gap in accountability. It is also the
          premise behind CivicAid — if people cannot navigate the legal landscape, structuring that
          landscape into something navigable is the first step.
        </p>

        <p>
          The Observatory came out of a different frustration. I wanted to understand what AI adoption
          might actually do to prices and wages — not the confident predictions that fill op-eds, but the
          underlying mechanics. What are the channels? What would you look for in the data if those
          channels were active? How do the trade-offs change depending on whether productivity gains go
          to wages or profits, or whether the central bank responds aggressively or not? I could not
          find a tool that let me walk through that at my own pace with real data alongside it, so I
          built one.
        </p>

        <p>
          The Distribution Lab came out of a gap I noticed after the Observatory was built. The Observatory
          traces aggregate effects — wages, inflation, who captures the gains between capital and labour. It
          says nothing about what sets the shape of the income distribution in the first place: the Gini, the
          top-10% share, who ends up below the poverty line.
        </p>

        <p>
          That question is upstream of the AI-and-wages question. Knowing that AI raises wages in aggregate
          tells you little if the distribution of those wages is already highly concentrated. What determines
          the distribution? Welfare generosity, labour market strength, tax progressivity, minimum wage
          floor — the institutional levers — are the obvious candidates. Whether they actually predict
          distributional outcomes across different structural contexts is harder and not obviously answered
          by the standard story. The Lab is an attempt to look at that empirically: what did distribution
          look like in real country-years with similar institutional configurations?
        </p>

        <p>
          These projects are not a unified research agenda. They are a set of attempts to take the same
          underlying question seriously in different domains: where does the formal system fall short, and
          why, and what would you need to know to answer that precisely rather than impressionistically?
        </p>

        <p>
          What I have learned so far, working across these: the failure modes are usually not random.
          Institutions tend to fall short in predictable ways — along lines of cost, complexity,
          information asymmetry, or political economy. Legal systems are hard to access for the same
          reasons that markets fail: the people who most need the service are least able to pay for it,
          and the people running the service have limited incentive to change that. Regulatory frameworks
          lag because the thing they are trying to regulate changes faster than legislation can move, and
          because the people who benefit from the gap are usually better organised than the people who
          are harmed by it.
        </p>

        <p>
          I do not have a unified theory of why institutions fail. I am not sure one exists that is both
          true and useful. What I do have is a set of specific cases, a set of methods for making those
          cases comparable, and a lot of open questions.
        </p>

        <p>
          That is what this site is for.
        </p>

        <div className="border-t border-border pt-6 mt-8 space-y-2">
          <p className="text-sm">
            Currently working on:{" "}
            <Link to="/writing/others/issue-002-india-labour" className="text-warm-accent hover:underline">
              PLFS research paper on Indian sectoral employment →
            </Link>
            {" "}and CivicAid MVP.
          </p>
          <p className="text-sm text-muted-foreground">
            See also:{" "}
            <Link to="/writing/changed-my-mind" className="text-warm-accent hover:underline">
              What I've changed my mind about →
            </Link>
          </p>
        </div>

      </div>
    </Layout>
  );
}
