import { Link } from "react-router-dom";

export type SiteSection =
  | "about"
  | "guide"
  | "writing"
  | "tools"
  | "onebook"
  | "ask"
  | "tradewinds";

const SECTIONS: { key: SiteSection; to: string; label: string }[] = [
  { key: "writing", to: "/writing", label: "Writing" },
  { key: "tools", to: "/mini", label: "Research tools" },
  { key: "onebook", to: "/onebook", label: "OneBook" },
  { key: "ask", to: "/ask", label: "Ask" },
  { key: "tradewinds", to: "/tradewinds", label: "Tradewinds" },
  { key: "guide", to: "/overview", label: "Site guide" },
];

/**
 * The portfolio's one shared strip. It sits in normal flow above each
 * section's own header, so it never covers that header's controls, and it
 * looks the same everywhere so the sections read as one site. Each section
 * keeps its own chrome below it.
 */
export default function SectionSwitcher({ current }: { current?: SiteSection }) {
  return (
    <div className="site-bar border-b border-border bg-background font-sans text-[0.8125rem] text-muted-foreground">
      <div className="mx-auto flex h-10 max-w-6xl items-center gap-5 px-4 sm:px-6">
        <Link
          to="/"
          aria-current={current === "about" ? "page" : undefined}
          className="shrink-0 font-semibold text-foreground hover:text-warm-accent transition-colors duration-150"
        >
          Arin Jain
        </Link>
        <nav aria-label="Portfolio sections" className="min-w-0 flex-1 overflow-x-auto scrollbar-none">
          <ul className="flex items-center gap-4 whitespace-nowrap">
            {SECTIONS.map((s) => {
              const active = s.key === current;
              return (
                <li key={s.key}>
                  <Link
                    to={s.to}
                    aria-current={active ? "page" : undefined}
                    className={`transition-colors duration-150 underline-offset-4 ${
                      active
                        ? "text-foreground underline decoration-warm-accent decoration-2"
                        : "hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
