import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import SectionSwitcher from "@/components/SectionSwitcher";

type DocketTheme = "dark" | "light";

interface DocketThemeContextType {
  theme: DocketTheme;
  toggle: () => void;
}

const DocketThemeContext = createContext<DocketThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useDocketTheme() {
  return useContext(DocketThemeContext);
}

export function DocketThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DocketTheme>(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("docket-theme") : null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  const toggle = () => {
    const next: DocketTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("docket-theme", next);
  };

  return (
    <DocketThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`docket-section${theme === "light" ? " docket-light" : ""} min-h-screen`}
        style={{ backgroundColor: "var(--docket-bg)", color: "var(--docket-text)" }}
      >
        {children}
      </div>
    </DocketThemeContext.Provider>
  );
}

export default function DocketLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useDocketTheme();
  const location = useLocation();
  const isMethodsPage = location.pathname.endsWith("/methods");

  const [active, setActive] = useState<string>("intro");
  useEffect(() => {
    if (isMethodsPage) return;
    const ids = ["intro", "backlog", "bottlenecks", "tracker", "indosing", "methodology"];
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
    { label: "Backlog", href: "#backlog" },
    { label: "Bottlenecks", href: "#bottlenecks" },
    { label: "Tracker", href: "#tracker" },
    { label: "India vs SG", href: "#indosing" },
    { label: "Method", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor:
            theme === "dark" ? "rgba(9,16,10,0.92)" : "rgba(240,250,243,0.92)",
          borderColor: "var(--docket-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--docket-muted)" }}
            >
              ← Mini Projects
            </Link>
            <a
              href="#intro"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--docket-accent)" }}
            >
              <span className="font-mono text-xs opacity-70">⚖</span>
              THE DOCKET
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
                      color: isActive ? "var(--docket-accent)" : "var(--docket-muted)",
                      backgroundColor: isActive ? "var(--docket-accent-dim)" : "transparent",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            {isMethodsPage && (
              <Link
                to="/mini/docket"
                className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                style={{ color: "var(--docket-muted)" }}
              >
                ← The Docket
              </Link>
            )}
            <Link
              to="/mini/docket/methods"
              className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--docket-accent)" : "var(--docket-border)",
                color: isMethodsPage ? "var(--docket-accent)" : "var(--docket-muted)",
                backgroundColor: isMethodsPage ? "var(--docket-accent-dim)" : "transparent",
              }}
            >
              Methods
            </Link>
          </nav>

          <button
            onClick={toggle}
            className="p-1.5 rounded transition-colors duration-150 shrink-0"
            style={{ color: "var(--docket-muted)" }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--docket-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div
            className="flex items-center justify-between text-xs font-mono"
            style={{ color: "var(--docket-muted)" }}
          >
            <span>THE DOCKET · Arin Jain</span>
            <div className="flex items-center gap-3">
              <a
                href="#methodology"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--docket-muted)" }}
              >
                Methodology ↑
              </a>
              <Link
                to="/mini/docket/methods"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--docket-accent)" }}
              >
                Full methods →
              </Link>
            </div>
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed" style={{ color: "var(--docket-muted)" }}>
            Data sourced from NJDG, eCourts project reports, Ministry of Law &amp; Justice annual
            reports, DAKSH India, and Supreme Court annual reports. Figures are approximate and
            aggregated; individual case data is not used. Singapore comparison from Singapore
            Judiciary statistics and eLitigation annual reports. Nothing here is legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
