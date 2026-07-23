import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Section wrapper with anchor id + eyebrow heading band.
export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t" style={{ borderColor: "var(--arena-border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-8">
          <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--arena-accent)" }}>
            {eyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--arena-text)" }}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

// Card surface used across panels and charts.
export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ borderColor: "var(--arena-border)", backgroundColor: "var(--arena-surface)" }}
    >
      {title && (
        <div className="text-xs font-mono mb-4 uppercase tracking-wider" style={{ color: "var(--arena-muted)" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// Collapsible disclosure for model detail and sources.
export function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-lg border" style={{ borderColor: "var(--arena-border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-mono uppercase tracking-wider transition-colors"
        style={{ color: "var(--arena-muted)" }}
        aria-expanded={open}
      >
        <span>{summary}</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div
          className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t"
          style={{ color: "var(--arena-text)", borderColor: "var(--arena-border)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--arena-muted)" }}>
      {children}
    </p>
  );
}

// Inline monospace equation block (no external math lib needed).
export function Eq({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="block my-2 px-3 py-2 rounded text-[0.8rem] overflow-x-auto"
      style={{ backgroundColor: "var(--arena-surface-2)", color: "var(--arena-text)" }}
    >
      {children}
    </code>
  );
}

// A simple labelled slider that reads the Arena range styling.
export function Slider({
  label,
  lo,
  hi,
  value,
  badge,
  onChange,
}: {
  label: string;
  lo: string;
  hi: string;
  value: number;
  badge?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--arena-text)" }}>
          {label}
        </label>
        {badge && (
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ color: "var(--arena-accent)", backgroundColor: "var(--arena-accent-dim)" }}
          >
            {badge}
          </span>
        )}
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="arena-range w-full"
      />
      <div className="flex justify-between text-[0.65rem] font-mono mt-0.5" style={{ color: "var(--arena-muted)" }}>
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}

// Shared recharts theming.
export function useChartTheme(theme: "dark" | "light") {
  return {
    tooltip: {
      backgroundColor: theme === "dark" ? "#211a36" : "#ffffff",
      border: "1px solid var(--arena-border)",
      borderRadius: 8,
      fontFamily: "ui-monospace, monospace",
      fontSize: 12,
      color: "var(--arena-text)",
    } as React.CSSProperties,
    tick: { fill: "var(--arena-muted)", fontSize: 10, fontFamily: "ui-monospace, monospace" },
    grid: "var(--arena-border)",
  };
}
