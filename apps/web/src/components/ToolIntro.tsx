import type { ReactNode } from "react";
import PaperHeader from "@/components/PaperHeader";
import ContentsList, { type ContentsEntry } from "@/components/ContentsList";

/**
 * The cover sheet that opens a research tool: its numbered series band in the
 * tool's own colour, title, abstract, then the chapters as a numbered
 * contents list. Prose below the cover is set in the reading face.
 */
export default function ToolIntro({
  prefix,
  number,
  meta,
  title,
  byline,
  keywords,
  abstract,
  chapters,
  children,
  note,
}: {
  /** CSS custom-property prefix of the tool's theme, e.g. "obs". */
  prefix: string;
  number: string;
  /** Right side of the series line: scope or date, never the section name. */
  meta?: ReactNode;
  title: ReactNode;
  byline?: ReactNode;
  keywords?: ReactNode;
  abstract: ReactNode;
  chapters: ContentsEntry[];
  children?: ReactNode;
  note?: ReactNode;
}) {
  const v = (name: string) => `var(--${prefix}-${name})`;
  return (
    <section id="intro" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-14 sm:px-8">
        <PaperHeader
          series={`Working Paper Series, No. ${number}`}
          meta={meta}
          color={v("accent")}
          ink={v("text")}
          muted={v("muted")}
          rule={v("border")}
          title={title}
          byline={byline}
          keywords={keywords}
          abstract={abstract}
        />
        {children && (
          <div className="mt-12 max-w-[42rem] space-y-4 font-serif text-[1.0625rem] leading-relaxed" style={{ color: v("text") }}>
            {children}
          </div>
        )}
        <div className="mt-12 max-w-3xl">
          <h2 className="font-sans text-[0.9375rem] font-semibold" style={{ color: v("text") }}>
            Contents
          </h2>
          <ContentsList
            className="mt-3"
            rule={v("border")}
            muted={v("muted")}
            entries={chapters.map((c) => ({ ...c, color: c.color ?? v("accent") }))}
          />
        </div>
        {note && (
          <p className="mt-6 max-w-3xl font-sans text-[0.875rem] leading-relaxed" style={{ color: v("muted") }}>
            {note}
          </p>
        )}
      </div>
    </section>
  );
}
