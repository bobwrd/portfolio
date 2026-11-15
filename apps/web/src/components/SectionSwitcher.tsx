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
  { key: "about", to: "/", label: "About" },
  { key: "writing", to: "/writing", label: "Writing" },
  { key: "tools", to: "/mini", label: "Research tools" },
  { key: "onebook", to: "/onebook", label: "OneBook" },
  { key: "ask", to: "/ask", label: "Ask" },
  { key: "tradewinds", to: "/tradewinds", label: "Tradewinds" },
  { key: "guide", to: "/overview", label: "Site guide" },
];

/**
 * The portfolio's one top bar: the name on the left, the sections on the
 * right, the current one marked by a rule rather than a colour. It sits in
 * normal flow above each section's own header, identical everywhere.
 */
export default function SectionSwitcher({ current }: { current?: SiteSection }) {
  return (
    <div className="site-bar border-b border-border bg-background font-sans text-[0.9375rem] text-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-5 sm:px-8">
        <Link to="/" className="shrink-0 font-serif text-[1.0625rem]">
          Arin Jain
        </Link>
        <nav aria-label="Portfolio sections" className="ml-auto min-w-0 overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,black_80%,transparent)] md:[mask-image:none]">
          <ul className="flex items-center gap-6 whitespace-nowrap pr-10 md:pr-0">
            {SECTIONS.map((s) => {
              const active = s.key === current;
              return (
                <li key={s.key}>
                  <Link
                    to={s.to}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block py-1 underline-offset-[0.4em] ${
                      active
                        ? "underline decoration-2 decoration-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
