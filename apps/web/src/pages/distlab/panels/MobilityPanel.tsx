import { Card, SourceTag } from "../shared";
import type { MobilityMatrix, MobilityGroup } from "../types";

const GROUPS: MobilityGroup[] = ["bottom", "middle", "top"];
const GLABEL: Record<MobilityGroup, string> = { bottom: "Bottom", middle: "Middle", top: "Top" };

// Map a probability 0-1 to the sequential ramp colour.
function rampColor(p: number): string {
  const stops = ["--dl-s1", "--dl-s2", "--dl-s3", "--dl-s4", "--dl-s5"];
  const i = Math.min(stops.length - 1, Math.max(0, Math.round(p * (stops.length - 1) * 1.6)));
  return `var(${stops[i]})`;
}

function EmptyState({ note }: { note: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-10" style={{ color: "var(--dl-muted)" }}>
      <div className="text-3xl mb-2 opacity-40">◌</div>
      <div className="text-sm font-medium mb-1" style={{ color: "var(--dl-text)" }}>Mobility data not available</div>
      <p className="text-xs max-w-[16rem] leading-relaxed">{note}</p>
    </div>
  );
}

export default function MobilityPanel({
  matrix, estimatedFrom,
}: {
  matrix?: MobilityMatrix;
  estimatedFrom?: string; // Playground: which analogue country this came from
}) {
  if (!matrix || matrix.sparse) {
    return (
      <Card title="Mobility" className="h-full">
        <EmptyState note={matrix?.notes || "No comparable intergenerational mobility series for this country-cohort. Mobility is the sparsest of the three panels."} />
      </Card>
    );
  }

  const cell = (o: MobilityGroup, d: MobilityGroup) =>
    matrix.cells.find((c) => c.origin === o && c.destination === d)?.probability ?? 0;

  return (
    <Card title="Mobility" className="h-full">
      <div className="text-[0.65rem] font-mono mb-2" style={{ color: "var(--dl-muted)" }}>
        Parent education → child education · cohort {matrix.cohort}
        {estimatedFrom && <span style={{ color: "var(--dl-accent-2)" }}> · est. from {estimatedFrom}</span>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 2 }}>
        <div />
        {GROUPS.map((d) => (
          <div key={d} className="text-[0.6rem] font-mono text-center pb-1" style={{ color: "var(--dl-muted)" }}>{GLABEL[d]}</div>
        ))}
        {GROUPS.map((o) => (
          <Row key={o} origin={o} cellFn={cell} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[0.6rem]" style={{ color: "var(--dl-muted)" }}>rows = parent group, sum to 100%</span>
        <SourceTag src={matrix.source_family} />
      </div>
      <p className="text-[0.6rem] mt-2 leading-relaxed" style={{ color: "var(--dl-muted)" }}>{matrix.notes}</p>
    </Card>
  );
}

function Row({ origin, cellFn }: { origin: MobilityGroup; cellFn: (o: MobilityGroup, d: MobilityGroup) => number }) {
  return (
    <>
      <div className="text-[0.6rem] font-mono flex items-center pr-1" style={{ color: "var(--dl-muted)" }}>{GLABEL[origin]}</div>
      {GROUPS.map((d) => {
        const p = cellFn(origin, d);
        return (
          <div
            key={d}
            className="aspect-square rounded flex items-center justify-center text-[0.7rem] font-bold tabular-nums transition-colors duration-300"
            style={{ backgroundColor: rampColor(p), color: p > 0.35 ? "#1a1205" : "var(--dl-text)" }}
            title={`${Math.round(p * 100)}%`}
          >
            {Math.round(p * 100)}
          </div>
        );
      })}
    </>
  );
}
