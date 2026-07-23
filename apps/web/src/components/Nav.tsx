import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          to="/writing"
          className="font-semibold text-foreground tracking-tight text-[0.9375rem] hover:text-warm-accent transition-colors duration-150 shrink-0"
        >
          {siteConfig.title}
        </Link>
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {siteConfig.navItems.map((item) => {
            const active =
              item.href === "/writing"
                ? pathname === "/writing"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors duration-150 ${
                  active
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
