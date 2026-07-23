import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Section wrapper with anchor id + sticky heading band.
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
    <section id={id} className="scroll-mt-16 border-t" style={{ borderColor: "var(--obs-border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-8">
          <div className="text-[0.7rem] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--obs-accent)" }}>
            {eyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--obs-text)" }}>
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
      style={{ borderColor: "var(--obs-border)", backgroundColor: "var(--obs-surface)" }}
    >
      {title && (
        <div className="text-xs font-mono mb-4 uppercase tracking-wider" style={{ color: "var(--obs-muted)" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// Collapsible "Details / model" disclosure for math and sources.
export function Details({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 rounded-lg border" style={{ borderColor: "var(--obs-border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs font-mono uppercase tracking-wider transition-colors"
        style={{ color: "var(--obs-muted)" }}
        aria-expanded={open}
      >
        <span>{summary}</span>
        <ChevronDown className="h-4 w-4 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div
          className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t"
          style={{ color: "var(--obs-text)", borderColor: "var(--obs-border)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--obs-muted)" }}>
      {children}
    </p>
  );
}

// Inline monospace equation block (no external math lib needed).
export function Eq({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="block my-2 px-3 py-2 rounded text-[0.8rem] overflow-x-auto"
      style={{ backgroundColor: "var(--obs-surface-2)", color: "var(--obs-text)" }}
    >
      {children}
    </code>
  );
}

// Shared recharts theming.
export function useChartTheme(theme: "dark" | "light") {
  return {
    tooltip: {
      backgroundColor: theme === "dark" ? "#16282e" : "#ffffff",
      border: "1px solid var(--obs-border)",
      borderRadius: 8,
      fontFamily: "ui-monospace, monospace",
      fontSize: 12,
      color: "var(--obs-text)",
    } as React.CSSProperties,
    tick: { fill: "var(--obs-muted)", fontSize: 10, fontFamily: "ui-monospace, monospace" },
    grid: "var(--obs-border)",
  };
}
