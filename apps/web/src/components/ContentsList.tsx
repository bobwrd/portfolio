import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface ContentsEntry {
  /** Internal route or external URL. */
  href: string;
  number?: string;
  title: ReactNode;
  /** One-line description under the title. */
  summary?: ReactNode;
  /** Right column: kind, date or section. */
  meta?: ReactNode;
  /** Optional mark colour for the number, e.g. a tool's own colour. */
  color?: string;
}

/**
 * A paper's numbered contents: ruled rows of number, title and meta. Used
 * for every index on the site instead of cards.
 */
export default function ContentsList({
  entries,
  rule = "var(--border)",
  muted = "var(--muted-foreground)",
  className = "",
}: {
  entries: ContentsEntry[];
  rule?: string;
  muted?: string;
  className?: string;
}) {
  return (
    <ol className={`border-t ${className}`} style={{ borderColor: rule }}>
      {entries.map((e, i) => {
        const external = /^https?:/.test(e.href);
        const anchor = e.href.startsWith("#");
        const body = (
          <>
            <span
              className="font-sans text-[0.9375rem] tabular-nums pt-1"
              style={{ color: e.color ?? muted }}
            >
              {e.number ?? i + 1}
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-lg leading-snug sm:text-xl group-hover:underline decoration-1 underline-offset-4">
                {e.title}
              </span>
              {e.summary && (
                <span className="mt-1 block font-sans text-[0.9375rem] leading-relaxed" style={{ color: muted }}>
                  {e.summary}
                </span>
              )}
            </span>
            {e.meta && (
              <span className="hidden font-sans text-[0.9375rem] pt-1 sm:block sm:text-right" style={{ color: muted }}>
                {e.meta}
              </span>
            )}
          </>
        );
        const cls =
          "group grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[2.5rem_minmax(0,1fr)_15rem] gap-x-4 py-4";
        return (
          <li key={e.href} className="border-b" style={{ borderColor: rule }}>
            {external ? (
              <a href={e.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {body}
              </a>
            ) : anchor ? (
              <a href={e.href} className={cls}>
                {body}
              </a>
            ) : (
              <Link to={e.href} className={cls}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
