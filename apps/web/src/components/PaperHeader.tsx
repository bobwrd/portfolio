import type { ReactNode } from "react";

interface PaperHeaderProps {
  /** Series line on the left of the band, e.g. "Working Paper Series, No. 00". */
  series: string;
  /** Right side of the band: a date or a status. */
  meta?: ReactNode;
  /** Band colour: a CSS colour or var(), the section's own. Defaults to the site's oxblood. */
  color?: string;
  title: ReactNode;
  byline?: ReactNode;
  keywords?: ReactNode;
  /** Ruled abstract box beside the title on wide screens, below it on narrow ones. */
  abstract?: ReactNode;
  abstractLabel?: string;
  /** Text colour for the title and body where a section overrides the site ink. */
  ink?: string;
  muted?: string;
  rule?: string;
  className?: string;
}

/**
 * The cover sheet every section opens with: a coloured series band, then the
 * title block and, when given, an abstract. One component so every page in
 * the series is issued the same way.
 */
export default function PaperHeader({
  series,
  meta,
  color = "var(--warm-accent)",
  title,
  byline,
  keywords,
  abstract,
  abstractLabel = "Abstract",
  ink,
  muted,
  rule,
  className = "",
}: PaperHeaderProps) {
  const mutedColor = muted ?? "var(--muted-foreground)";
  const ruleColor = rule ?? "var(--border)";
  return (
    <header className={`paper-header ${className}`} style={ink ? { color: ink } : undefined}>
      <div
        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-2.5 font-sans text-[0.9375rem]"
        style={{ borderTop: `6px solid ${color}`, borderBottomColor: ruleColor, color: mutedColor }}
      >
        <span>{series}</span>
        {meta && <span>{meta}</span>}
      </div>
      <div
        className={`grid gap-8 pt-10 pb-2 ${
          abstract ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16" : ""
        }`}
      >
        <div className="min-w-0">
          <h1 className="text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          {byline && (
            <p className="mt-5 font-serif text-lg sm:text-xl" style={{ color: mutedColor }}>
              {byline}
            </p>
          )}
          {keywords && (
            <p className="mt-4 font-sans text-[0.9375rem]" style={{ color: mutedColor }}>
              {keywords}
            </p>
          )}
        </div>
        {abstract && (
          <div className="self-start border px-6 py-5" style={{ borderColor: ink ?? "var(--foreground)" }}>
            <h2 className="font-sans text-[0.9375rem] font-semibold">{abstractLabel}</h2>
            <div className="mt-2 font-serif text-[1.0625rem] leading-relaxed">{abstract}</div>
          </div>
        )}
      </div>
    </header>
  );
}
