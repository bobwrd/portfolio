import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import SectionSwitcher from "@/components/SectionSwitcher";

type ObsTheme = "dark" | "light";

interface ObsThemeContextType {
  theme: ObsTheme;
  toggle: () => void;
}

const ObsThemeContext = createContext<ObsThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useObservatoryTheme() {
  return useContext(ObsThemeContext);
}

export function ObservatoryThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ObsTheme>(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("observatory-theme") : null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  const toggle = () => {
    const next: ObsTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("observatory-theme", next);
  };

  return (
    <ObsThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`obs-section${theme === "light" ? " obs-light" : ""} min-h-screen`}
        style={{ backgroundColor: "var(--obs-bg)", color: "var(--obs-text)" }}
      >
        {children}
      </div>
    </ObsThemeContext.Provider>
  );
}

export default function ObservatoryLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useObservatoryTheme();
  const location = useLocation();
  const isMethodsPage = location.pathname.endsWith("/methods");

  // Anchor nav highlights the section currently in view (index page only).
  const [active, setActive] = useState<string>("intro");
  useEffect(() => {
    if (isMethodsPage) return;
    const ids = ["intro", "walkthrough", "atlas", "lab", "methodology"];
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
    { label: "Walkthrough", href: "#walkthrough" },
    { label: "Data atlas", href: "#atlas" },
    { label: "Lab", href: "#lab" },
    { label: "Method", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: theme === "dark" ? "rgba(11,20,24,0.92)" : "rgba(243,250,248,0.92)",
          borderColor: "var(--obs-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--obs-muted)" }}
            >
              ← Mini Projects
            </Link>
            <a
              href="#intro"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--obs-accent)" }}
            >
              <span className="font-mono text-xs opacity-70">◉</span>
              THE OBSERVATORY
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {!isMethodsPage && navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                  style={{
                    color: isActive ? "var(--obs-accent)" : "var(--obs-muted)",
                    backgroundColor: isActive ? "var(--obs-accent-dim)" : "transparent",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
            {isMethodsPage && (
              <Link
                to="/mini/observatory"
                className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                style={{ color: "var(--obs-muted)" }}
              >
                ← Observatory
              </Link>
            )}
            <Link
              to="/mini/observatory/methods"
              className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--obs-accent)" : "var(--obs-border)",
                color: isMethodsPage ? "var(--obs-accent)" : "var(--obs-muted)",
                backgroundColor: isMethodsPage ? "var(--obs-accent-dim)" : "transparent",
              }}
            >
              Tech note
            </Link>
          </nav>

          <button
            onClick={toggle}
            className="p-1.5 rounded transition-colors duration-150 shrink-0"
            style={{ color: "var(--obs-muted)" }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--obs-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between text-xs font-mono" style={{ color: "var(--obs-muted)" }}>
            <span>THE OBSERVATORY · Arin Jain</span>
            <div className="flex items-center gap-3">
              <a href="#methodology" className="hover:opacity-80 transition-opacity" style={{ color: "var(--obs-muted)" }}>
                Methodology ↑
              </a>
              <Link to="/mini/observatory/methods" className="hover:opacity-80 transition-opacity" style={{ color: "var(--obs-accent)" }}>
                Technical note →
              </Link>
            </div>
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            An exploratory tool, not a forecast. Charts use public data from the World Bank and FRED; the walkthrough
            and lab use deliberately simple, stylised models to illustrate mechanisms. Figures may lag or be revised at
            source. Nothing here is investment, financial, or policy advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
