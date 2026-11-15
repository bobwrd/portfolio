import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-6 px-5 font-sans text-[0.9375rem] sm:px-8">
        <Link
          to="/writing"
          className="shrink-0 font-serif text-[1.0625rem] text-foreground"
        >
          {siteConfig.title}
        </Link>
        <nav aria-label="Margin of Error" className="flex items-center gap-5 overflow-x-auto scrollbar-none">
          {siteConfig.navItems.map((item) => {
            const active =
              item.href === "/writing"
                ? pathname === "/writing"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap py-1 underline-offset-[0.4em] ${
                  active
                    ? "text-foreground underline decoration-2 decoration-warm-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
