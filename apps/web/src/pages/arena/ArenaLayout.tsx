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
    { label: "Method", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(247,245,251,0.92)",
          borderColor: "var(--arena-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--arena-muted)" }}
            >
              ← Mini Projects
            </Link>
            <a
              href="#intro"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--arena-accent)" }}
            >
              <span className="font-mono text-xs opacity-70">⚔</span>
              THE ARENA
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {!isMethodsPage &&
              navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                    style={{
                      color: isActive ? "var(--arena-accent)" : "var(--arena-muted)",
                      backgroundColor: isActive ? "var(--arena-accent-dim)" : "transparent",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            {isMethodsPage && (
              <Link
                to="/mini/arena"
                className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                style={{ color: "var(--arena-muted)" }}
              >
                ← The Arena
              </Link>
            )}
            <Link
              to="/mini/arena/methods"
              className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--arena-accent)" : "var(--arena-border)",
                color: isMethodsPage ? "var(--arena-accent)" : "var(--arena-muted)",
                backgroundColor: isMethodsPage ? "var(--arena-accent-dim)" : "transparent",
              }}
            >
              Tech note
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--arena-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between text-xs font-mono" style={{ color: "var(--arena-muted)" }}>
            <span>THE ARENA · Arin Jain</span>
            <div className="flex items-center gap-3">
              <a href="#methodology" className="hover:opacity-80 transition-opacity" style={{ color: "var(--arena-muted)" }}>
                Methodology ↑
              </a>
              <Link to="/mini/arena/methods" className="hover:opacity-80 transition-opacity" style={{ color: "var(--arena-accent)" }}>
                Technical note →
              </Link>
            </div>
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed" style={{ color: "var(--arena-muted)" }}>
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
