import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

type ArenaTheme = "light";

interface ArenaThemeContextType {
  theme: ArenaTheme;
}

const ArenaThemeContext = createContext<ArenaThemeContextType>({
  theme: "light",
});

export function useArenaTheme() {
  return useContext(ArenaThemeContext);
}

export function ArenaThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ArenaThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="arena-section arena-light min-h-screen"
        style={{ backgroundColor: "var(--arena-bg)", color: "var(--arena-text)" }}
      >
        {children}
      </div>
    </ArenaThemeContext.Provider>
  );
}

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMethodsPage = location.pathname.endsWith("/methods");

  // Anchor nav highlights the section currently in view (index page only).
  const [active, setActive] = useState<string>("intro");
  useEffect(() => {
    if (isMethodsPage) return;
    const ids = ["intro", "firms", "lab", "outcomes", "lenses", "methodology"];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [isMethodsPage]);

  const navLinks = [
    { label: "Intro", href: "#intro" },
    { label: "Firms", href: "#firms" },
    { label: "Lab", href: "#lab" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "Lenses", href: "#lenses" },
    { label: "Methodology", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="tools" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--arena-bg)",
          borderBottomColor: "var(--arena-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-2 min-h-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="font-sans text-[0.875rem] underline-offset-4 hover:underline"
              style={{ color: "var(--arena-muted)" }}
            >
              Research tools
            </Link>
            <a
              href="#intro"
              className="font-serif text-xl leading-none"
              style={{ color: "var(--arena-text)" }}
            >
              The Arena
            </a>
          </div>

          <nav aria-label="Sections of this tool" className="-mx-1.5 flex w-full items-center gap-0.5 overflow-x-auto scrollbar-none whitespace-nowrap md:mx-0 md:w-auto">
            {!isMethodsPage &&
              navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150"
                    style={{
                      color: isActive ? "var(--arena-accent)" : "var(--arena-muted)",
                      textDecoration: isActive ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            {isMethodsPage && (
              <Link
                to="/mini/arena"
                className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150"
                style={{ color: "var(--arena-muted)" }}
              >
                Back to the Arena
              </Link>
            )}
            <Link
              to="/mini/arena/methods"
              className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--arena-accent)" : "var(--arena-border)",
                color: isMethodsPage ? "var(--arena-accent)" : "var(--arena-muted)",
                textDecoration: isMethodsPage ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
              }}
            >
              Technical note
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--arena-border)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between font-sans text-[0.875rem]" style={{ color: "var(--arena-muted)" }}>
            <span>The Arena, by Arin Jain</span>
            <div className="flex items-center gap-3">
              <a href="#methodology" className="hover:opacity-80 transition-opacity" style={{ color: "var(--arena-muted)" }}>
                Methodology
              </a>
              <Link to="/mini/arena/methods" className="hover:opacity-80 transition-opacity" style={{ color: "var(--arena-accent)" }}>
                Technical note
              </Link>
            </div>
          </div>
          <p className="mt-3 font-sans text-[0.8125rem] leading-relaxed" style={{ color: "var(--arena-muted)" }}>
            An interactive sandbox, not a forecast. The curves are deliberately simple teaching models whose
            shapes and directions are drawn from published empirical and experimental work on competition,
            tournaments, and market structure. Numbers are rescaled for legibility. Nothing here is investment,
            financial, or policy advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
