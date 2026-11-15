import ToolIntro from "@/components/ToolIntro";

export default function Intro() {
  return (
    <ToolIntro
      prefix="arena"
      meta="Four chapters"
      number="02.4"
      title="When does competition make things better?"
      byline="More rivals can cut prices and sharpen quality. They can also push people to waste effort fighting each other. The question is when each happens."
      abstract={
        <p>
          An interactive model environment. Move a slider and the firms, the
          prices and the workers' effort all shift with it, so you can see where
          more competition helps and where it tips into waste.
        </p>
      }
      chapters={[
        { href: "#firms", number: "1", title: "How many firms", summary: "How many firms is too many?" },
        { href: "#lab", number: "2", title: "Effort lab", summary: "What competition does to effort inside a team." },
        { href: "#outcomes", number: "3", title: "Market outcomes", summary: "How market structure and behavioural distortion combine." },
        { href: "#lenses", number: "4", title: "Policy lenses", summary: "How antitrust, consumer and firm-level lenses read the same evidence differently." },
      ]}
    >
      <p>
        Every curve is a closed-form model anchored to published industrial
        organisation work: Bertrand and Cournot on firm count and price, Aghion
        et al. on competition and innovation, Harbring and Irlenbusch on
        tournament incentives and sabotage, De Loecker et al. on markups. The
        numbers are rescaled for readability; the shapes follow the published
        results.
      </p>
    </ToolIntro>
  );
}
