import { useEffect, useRef, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";

// Section wrapper (used by the methods page; the app body is a fixed grid, not
// a stack of sections).
export function Section({
  id, eyebrow, title, children,
}: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 border-t" style={{ borderColor: "var(--dl-border)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-8">
          <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--dl-accent)" }}>
            {eyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--dl-text)" }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Card({
  title, children, className = "", right,
}: { title?: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${className}`} style={{ borderColor: "var(--dl-border)", backgroundColor: "var(--dl-surface)" }}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-3 gap-2">
          {title && <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--dl-muted)" }}>{title}</div>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-lg border" style={{ borderColor: "var(--dl-border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-mono uppercase tracking-wider"
        style={{ color: "var(--dl-muted)" }}
        aria-expanded={open}
      >
        <span>{summary}</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t" style={{ color: "var(--dl-text)", borderColor: "var(--dl-border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--dl-muted)" }}>{children}</p>;
}

export function Eq({ children }: { children: React.ReactNode }) {
  return (
    <code className="block my-2 px-3 py-2 rounded text-[0.8rem] overflow-x-auto" style={{ backgroundColor: "var(--dl-surface-2)", color: "var(--dl-text)" }}>
      {children}
    </code>
  );
}

// Small provenance pill: source family + an "est." marker when interpolated.
export function SourceTag({ src, interp }: { src: string; interp?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-mono uppercase tracking-wide"
      style={{ color: "var(--dl-muted)", backgroundColor: "var(--dl-surface-2)" }}
      title={interp ? `${src} (interpolated)` : src}
    >
      {src}{interp ? " · est." : ""}
    </span>
  );
}

// A labelled slider used by the regime bar in Playground mode. Discrete stops
// when `stops` is given. Locked sliders render disabled with a lock icon.
export function Slider({
  label, value, onChange, locked, onToggleLock, level, levelLabels,
}: {
  label: string;
  value: number;          // 0..1
  onChange: (v: number) => void;
  locked?: boolean;
  onToggleLock?: () => void;
  level?: number | null;  // 1..5 display bucket
  levelLabels?: string[];
}) {
  return (
    <div className="select-none">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[0.7rem] font-medium" style={{ color: "var(--dl-text)" }}>{label}</span>
        {onToggleLock && (
          <button onClick={onToggleLock} title={locked ? "Unlock" : "Lock this dimension"} className="p-0.5 rounded" style={{ color: locked ? "var(--dl-accent)" : "var(--dl-muted)" }}>
            <Lock className="h-3 w-3" style={{ opacity: locked ? 1 : 0.4 }} />
          </button>
        )}
      </div>
      <input
        type="range" min={0} max={1} step={0.01} value={value} disabled={locked}
        onChange={(e) => onChange(Number(e.target.value))}
        className="dl-range w-full"
      />
      <div className="mt-0.5 text-[0.6rem] font-mono" style={{ color: "var(--dl-muted)" }}>
        {level != null && levelLabels ? levelLabels[Math.min(levelLabels.length - 1, Math.max(0, level - 1))] : `${Math.round(value * 100)}`}
      </div>
    </div>
  );
}

// Counts a number from its previous value to the next over ~500ms, rAF-driven.
// Snaps instantly under reduced motion (the section CSS also zeroes transitions).
export function useAnimatedNumber(target: number | null, ms = 500): number | null {
  const [val, setVal] = useState<number | null>(target);
  const from = useRef<number>(target ?? 0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (target == null) { setVal(null); return; }
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const a = from.current ?? target;
    if (reduce) { from.current = target; setVal(target); return; }
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(a + (target - a) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, ms]);

  return val;
}

export function useChartTheme() {
  return {
    tick: { fill: "var(--dl-muted)", fontSize: 10, fontFamily: "ui-monospace, monospace" },
    grid: "var(--dl-border)",
  };
}
