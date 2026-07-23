import { Card, SourceTag, useAnimatedNumber } from "../shared";

// Power-law Lorenz curve from a Gini coefficient: L(p) = p^a, with
// a = (1+G)/(1-G). This is the standard single-parameter Lorenz family; it is an
// approximation (real curves are not exactly power-law), so the panel labels it
// as derived from Gini and shows the observed top-10% share as a separate anchor.
function lorenzA(giniPct: number): number {
  const g = Math.max(0.01, Math.min(0.95, giniPct / 100));
  return (1 + g) / (1 - g);
}

function lorenzPath(giniPct: number | null, w: number, h: number, pad: number): string {
  if (giniPct == null) return "";
  const a = lorenzA(giniPct);
  const N = 40;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const p = i / N;
    const L = Math.pow(p, a);
    const x = pad + p * (w - 2 * pad);
    const y = h - pad - L * (h - 2 * pad);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
}

function Stat({ label, value, suffix, decimals = 1, src, interp }: {
  label: string; value: number | null; suffix?: string; decimals?: number; src?: string; interp?: boolean;
}) {
  const animated = useAnimatedNumber(value);
  return (
    <div>
      <div className="text-[0.65rem] font-mono uppercase tracking-wider mb-0.5" style={{ color: "var(--dl-muted)" }}>{label}</div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: "var(--dl-text)" }}>
        {animated == null ? <span style={{ color: "var(--dl-muted)" }}>n/a</span> : <>{animated.toFixed(decimals)}<span className="text-sm font-normal" style={{ color: "var(--dl-muted)" }}>{suffix}</span></>}
      </div>
      {src && <div className="mt-1"><SourceTag src={src} interp={interp} /></div>}
    </div>
  );
}

export default function DistributionPanel({
  gini, top10, poverty, uncertain, giniSrc, top10Src, povSrc, giniInterp, top10Interp, povInterp,
}: {
  gini: number | null; top10: number | null; poverty: number | null;
  uncertain?: boolean;
  giniSrc?: string; top10Src?: string; povSrc?: string;
  giniInterp?: boolean; top10Interp?: boolean; povInterp?: boolean;
}) {
  const W = 260, H = 200, PAD = 28;
  const animGini = useAnimatedNumber(gini);
  const path = lorenzPath(animGini, W, H, PAD);
  // top-10% anchor point at p=0.9
  const topAnchor = top10 != null
    ? { x: PAD + 0.9 * (W - 2 * PAD), y: H - PAD - (1 - top10) * (H - 2 * PAD) }
    : null;

  return (
    <Card title="Distribution" className="h-full">
      <div style={{ opacity: uncertain ? 0.55 : 1, transition: "opacity 200ms" }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
          <defs>
            <pattern id="dl-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--dl-muted)" strokeWidth="1" opacity="0.4" />
            </pattern>
          </defs>
          {/* axes + equality line */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--dl-border)" />
          <line x1={PAD} y1={H - PAD} x2={PAD} y2={PAD} stroke="var(--dl-border)" />
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={PAD} stroke="var(--dl-muted)" strokeDasharray="3 3" opacity="0.5" />
          {/* fill between equality and Lorenz (the Gini area) */}
          {path && (
            <path
              d={`${path} L ${W - PAD},${H - PAD} L ${PAD},${H - PAD} Z`}
              fill={uncertain ? "url(#dl-hatch)" : "var(--dl-accent-dim)"}
            />
          )}
          {path && <path d={path} fill="none" stroke="var(--dl-accent)" strokeWidth="2.5" />}
          {topAnchor && <circle cx={topAnchor.x} cy={topAnchor.y} r="3" fill="var(--dl-accent-2)" />}
          <text x={W - PAD} y={H - PAD + 14} textAnchor="end" fontSize="8" fontFamily="ui-monospace,monospace" fill="var(--dl-muted)">population →</text>
        </svg>
        <p className="text-[0.6rem] -mt-1 mb-3" style={{ color: "var(--dl-muted)" }}>
          Lorenz curve derived from Gini; dot marks the top-10% income share.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Gini" value={gini} decimals={1} src={giniSrc} interp={giniInterp} />
          <Stat label="Top 10%" value={top10 != null ? top10 * 100 : null} suffix="%" decimals={1} src={top10Src} interp={top10Interp} />
          <Stat label="Poverty" value={poverty} suffix="%" decimals={1} src={povSrc} interp={povInterp} />
        </div>
      </div>
    </Card>
  );
}
