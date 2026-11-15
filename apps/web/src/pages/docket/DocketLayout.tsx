import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

type DocketTheme = "light";

interface DocketThemeContextType {
  theme: DocketTheme;
}

const DocketThemeContext = createContext<DocketThemeContextType>({
  theme: "light",
});

export function useDocketTheme() {
  return useContext(DocketThemeContext);
}

export function DocketThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <DocketThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="docket-section docket-light min-h-screen"
        style={{ backgroundColor: "var(--docket-bg)", color: "var(--docket-text)" }}
      >
        {children}
      </div>
    </DocketThemeContext.Provider>
  );
}

export default function DocketLayout({ children }: { children: React.ReactNode }) {
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
    { label: "Methodology", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="tools" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "color-mix(in srgb, var(--docket-bg) 92%, transparent)",
          borderColor: "var(--docket-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="text-xs underline-offset-4 hover:underline"
              style={{ color: "var(--docket-muted)" }}
            >
              Research tools
            </Link>
            <a
              href="#intro"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--docket-accent)" }}
            >
              The Docket
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
                    className="px-2.5 py-1.5 rounded text-xs transition-colors duration-150"
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
                className="px-2.5 py-1.5 rounded text-xs transition-colors duration-150"
                style={{ color: "var(--docket-muted)" }}
              >
                Back to the Docket
              </Link>
            )}
            <Link
              to="/mini/docket/methods"
              className="px-2.5 py-1.5 rounded text-xs transition-colors duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--docket-accent)" : "var(--docket-border)",
                color: isMethodsPage ? "var(--docket-accent)" : "var(--docket-muted)",
                backgroundColor: isMethodsPage ? "var(--docket-accent-dim)" : "transparent",
              }}
            >
              Technical note
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--docket-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "var(--docket-muted)" }}
          >
            <span>The Docket, by Arin Jain</span>
            <div className="flex items-center gap-3">
              <a
                href="#methodology"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--docket-muted)" }}
              >
                Methodology
              </a>
              <Link
                to="/mini/docket/methods"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--docket-accent)" }}
              >
                Technical note
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
