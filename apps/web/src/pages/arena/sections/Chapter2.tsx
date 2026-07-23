import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Section, Card, Details, Eq, Slider } from "../shared";
import { useReducedMotion, useEnterOnce, useAutoplay } from "../hooks";
import {
  teamResult,
  chapter2Narrative,
  CH2_SEQUENCE,
  CH2_DEFAULT,
  type Ch2Controls,
  type EffortMix,
} from "../model";

const SEG = [
  { key: "productive" as const, label: "Productive", color: "var(--arena-good)" },
  { key: "sabotage" as const, label: "Sabotage / gaming", color: "var(--arena-warn)" },
  { key: "rest" as const, label: "Rest / disengage", color: "var(--arena-muted)" },
];

function WorkerBar({ mix }: { mix: EffortMix }) {
  return (
    <div className="h-5 w-full rounded overflow-hidden flex" style={{ backgroundColor: "var(--arena-surface-2)" }}>
      {SEG.map((s) => (
        <div
          key={s.key}
          style={{
            width: `${mix[s.key] * 100}%`,
            backgroundColor: s.color,
            transition: "width 260ms ease",
          }}
        />
      ))}
    </div>
  );
}

function TeamPanel({ name, controls, size }: { name: string; controls: Ch2Controls; size: number }) {
  const t = teamResult(controls, size);
  const wedge = Math.round(t.measuredOutput - t.trueEfficiency);
  return (
    <Card title={name}>
      <div className="space-y-2 mb-4">
        {t.workers.map((w, i) => (
          <WorkerBar key={i} mix={w} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ backgroundColor: "var(--arena-surface-2)" }}>
          <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--arena-muted)" }}>
            Measured output
          </div>
          <div className="text-xl font-mono font-semibold" style={{ color: "var(--arena-c2)" }}>
            {t.measuredOutput.toFixed(0)}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: "var(--arena-surface-2)" }}>
          <div className="text-[0.6rem] font-mono uppercase tracking-wider mb-1" style={{ color: "var(--arena-muted)" }}>
            True efficiency
          </div>
          <div className="text-xl font-mono font-semibold" style={{ color: "var(--arena-good)" }}>
            {t.trueEfficiency.toFixed(0)}
          </div>
        </div>
      </div>
      {wedge > 1 && (
        <div className="mt-2 text-[0.65rem] font-mono" style={{ color: "var(--arena-warn)" }}>
          {wedge}-point gap is gaming the metric, not real work.
        </div>
      )}
    </Card>
  );
}

export default function Chapter2() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [controls, setControls] = useState<Ch2Controls>(reduced ? CH2_DEFAULT : CH2_SEQUENCE[0].controls);
  const [autoplay, setAutoplay] = useState(false);
  const [stepNote, setStepNote] = useState<string | null>(reduced ? null : CH2_SEQUENCE[0].note);
  const [touched, setTouched] = useState(false);

  useEnterOnce(sectionRef, () => {
    if (!reduced && !touched) setAutoplay(true);
  });

  useAutoplay(
    autoplay,
    CH2_SEQUENCE.length,
    1500,
    (i) => {
      setControls(CH2_SEQUENCE[i].controls);
      setStepNote(CH2_SEQUENCE[i].note);
    },
    () => setAutoplay(false)
  );

  function set<K extends keyof Ch2Controls>(key: K, v: number) {
    setControls((c) => ({ ...c, [key]: v }));
    setTouched(true);
    setAutoplay(false);
    setStepNote(null);
  }

  const narrative = chapter2Narrative(controls, teamResult(controls, 4));
  const badge = (v: number) => (v < 0.34 ? "low" : v < 0.67 ? "mid" : "high");

  return (
    <Section id="lab" eyebrow="2 · Effort lab" title="What competition does to effort">
      <div className="max-w-3xl mb-6 text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-text)" }}>
        Move inside the firm. Each worker has a fixed budget of effort and splits it three ways: real work,
        sabotage or gaming the metric, and rest. The incentive design decides the split.
      </div>

      <div ref={sectionRef} className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Controls */}
        <Card title="The incentive design" className="lg:col-span-2">
          <div className="space-y-5">
            <Slider
              label="Prize structure"
              lo="proportional"
              hi="winner-take-all"
              badge={badge(controls.prizeSpread)}
              value={controls.prizeSpread}
              onChange={(v) => set("prizeSpread", v)}
            />
            <Slider
              label="Monitoring"
              lo="weak"
              hi="strong"
              badge={badge(controls.monitoring)}
              value={controls.monitoring}
              onChange={(v) => set("monitoring", v)}
            />
            <Slider
              label="Competitive pressure"
              lo="low"
              hi="high"
              badge={badge(controls.competition)}
              value={controls.competition}
              onChange={(v) => set("competition", v)}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setControls(CH2_SEQUENCE[0].controls);
                setStepNote(CH2_SEQUENCE[0].note);
                setTouched(true);
                setAutoplay(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-mono transition-colors"
              style={{ borderColor: "var(--arena-border)", color: "var(--arena-accent)" }}
            >
              <Play className="h-3 w-3" /> Play sequence
            </button>
            <button
              onClick={() => {
                setControls(CH2_DEFAULT);
                setTouched(true);
                setAutoplay(false);
                setStepNote(null);
              }}
              className="rounded-md border px-2.5 py-1.5 text-xs font-mono transition-colors"
              style={{ borderColor: "var(--arena-border)", color: "var(--arena-muted)" }}
            >
              Reset
            </button>
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
            {SEG.map((s) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                <span className="text-[0.65rem] font-mono" style={{ color: "var(--arena-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Teams */}
        <div className="lg:col-span-3 space-y-4">
          {stepNote && (
            <div
              className="rounded-lg px-4 py-2.5 text-sm border"
              style={{ borderColor: "var(--arena-accent)", backgroundColor: "var(--arena-accent-dim)", color: "var(--arena-text)" }}
            >
              {stepNote}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <TeamPanel name="Team A" controls={controls} size={4} />
            <TeamPanel name="Team B" controls={controls} size={5} />
          </div>
          <div
            className="rounded-lg p-4 text-sm leading-relaxed border"
            style={{ borderColor: "var(--arena-border)", backgroundColor: "var(--arena-surface)", color: "var(--arena-text)" }}
          >
            {narrative}
          </div>
        </div>
      </div>

      <Details summary="Details · effort allocation & sources">
        <p>Each worker splits a unit effort budget given the prize spread (s), monitoring (m), and pressure (c):</p>
        <Eq>sabotage = 0.45 · s^1.5 · (1 − m)</Eq>
        <Eq>rest = 0.35 · (1 − c) + 0.1 + choke(c)</Eq>
        <Eq>productive = 1 − sabotage − rest</Eq>
        <p className="mt-2">
          Sabotage rising with the prize spread, and monitoring suppressing it, follow tournament experiments:
          Harbring and Irlenbusch (2011), Lazear (1989), and Charness, Masclet and Villeval (2014). The
          "choke" term, where extreme pressure tips effort into disengagement, is loosely based on Ariely,
          Gneezy, Loewenstein and Mazar (2009); its exact threshold is illustrative, not estimated. Measured
          output counts productive effort plus half of sabotage, because gaming can inflate the metric a firm
          actually sees; true efficiency counts only productive effort.
        </p>
      </Details>
    </Section>
  );
}
