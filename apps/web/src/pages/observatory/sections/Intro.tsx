import ToolIntro from "@/components/ToolIntro";

export default function Intro() {
  return (
    <ToolIntro
      prefix="obs"
      meta="Live World Bank and FRED data"
      number="02.3"
      title="AI, productivity and prices"
      byline="How could AI affect productivity, inflation and who gets the gains over time, and what does the data so far suggest about where we are in that process?"
      abstract={
        <p>
          A working sandbox for tracing how AI adoption might flow through to
          productivity, wages, prices and markups. Pick a named scenario or move
          the sliders directly; the model details sit behind the Details
          toggles.
        </p>
      }
      chapters={[
        { href: "#walkthrough", number: "1", title: "Walkthrough", summary: "A conceptual walk through the channels." },
        { href: "#atlas", number: "2", title: "Data atlas", summary: "Live series across five countries." },
        { href: "#lab", number: "3", title: "Lab", summary: "Drive the model yourself." },
      ]}
    >
      <p>
        The model walks the transmission channels and makes no forecast: from AI
        adoption through productivity, to wages and inflation, to how the gains
        split between capital and labour. Live World Bank and
        FRED data sit alongside the model to show what the relevant series look
        like in the real economy. The questions connect to ongoing debates about
        automation, labour share, and the wage-profit split of productivity
        gains.
      </p>
    </ToolIntro>
  );
}
