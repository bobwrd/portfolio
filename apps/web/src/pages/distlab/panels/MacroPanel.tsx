import { Card, SourceTag, useAnimatedNumber } from "../shared";
import type { CountryYearBase } from "../types";

function Row({ label, value, fmt, src, interp, bar }: {
  label: string; value: number | null; fmt: (v: number) => string;
  src?: string; interp?: boolean; bar?: number; // bar 0-1 optional
}) {
  const a = useAnimatedNumber(value);
  return (
    <div className="py-2 border-b last:border-b-0" style={{ borderColor: "var(--dl-border)" }}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[0.7rem]" style={{ color: "var(--dl-muted)" }}>{label}</span>
        <span className="text-base font-bold tabular-nums" style={{ color: "var(--dl-text)" }}>
          {a == null ? <span style={{ color: "var(--dl-muted)" }} className="text-sm font-normal">n/a</span> : fmt(a)}
        </span>
      </div>
      {bar != null && a != null && (
        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--dl-surface-2)" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, bar * 100))}%`, backgroundColor: "var(--dl-accent)", transition: "width 400ms" }} />
        </div>
      )}
      {src && <div className="mt-1"><SourceTag src={src} interp={interp} /></div>}
    </div>
  );
}

const money = (v: number) => "$" + Math.round(v).toLocaleString();

export default function MacroPanel({ base, uncertain }: { base?: Partial<CountryYearBase> & { meta?: CountryYearBase["meta"] }; uncertain?: boolean }) {
  const m = (k: string) => base?.meta?.[k];
  return (
    <Card title="Macro & wellbeing" className="h-full">
      <div style={{ opacity: uncertain ? 0.55 : 1, transition: "opacity 200ms" }}>
        <Row label="GDP per capita (PPP)" value={base?.gdp_per_capita_ppp ?? null} fmt={money} src={m("gdp_per_capita_ppp")?.src} interp={m("gdp_per_capita_ppp")?.interp} />
        <Row label="GNI per capita" value={base?.gni_per_capita ?? null} fmt={money} src={m("gni_per_capita")?.src} interp={m("gni_per_capita")?.interp} />
        <Row label="Mean years schooling" value={base?.education_years ?? null} fmt={(v) => v.toFixed(1)} src={m("education_years")?.src} interp={m("education_years")?.interp} bar={base?.education_years != null ? base.education_years / 14 : undefined} />
        <Row label="Secondary enrolment" value={base?.secondary_enrolment ?? null} fmt={(v) => v.toFixed(0) + "%"} src={m("secondary_enrolment")?.src} interp={m("secondary_enrolment")?.interp} bar={base?.secondary_enrolment != null ? base.secondary_enrolment / 100 : undefined} />
        <Row label="Education spend (% GDP)" value={base?.education_spend_pct_gdp ?? null} fmt={(v) => v.toFixed(1) + "%"} src={m("education_spend_pct_gdp")?.src} interp={m("education_spend_pct_gdp")?.interp} />
        <Row label="Competitiveness (0-100)" value={base?.competitiveness_index ?? null} fmt={(v) => v.toFixed(0)} src={m("competitiveness_index")?.src} interp={m("competitiveness_index")?.interp} bar={base?.competitiveness_index != null ? base.competitiveness_index / 100 : undefined} />
        <Row label="Wellbeing (HDI)" value={base?.wellbeing_index ?? null} fmt={(v) => v.toFixed(3)} src={m("wellbeing_index")?.src} interp={m("wellbeing_index")?.interp} bar={base?.wellbeing_index ?? undefined} />
      </div>
    </Card>
  );
}
