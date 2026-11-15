import { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

type ObsTheme = "light";

interface ObsThemeContextType {
  theme: ObsTheme;
}

const ObsThemeContext = createContext<ObsThemeContextType>({
  theme: "light",
});

export function useObservatoryTheme() {
  return useContext(ObsThemeContext);
}

export function ObservatoryThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ObsThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="obs-section obs-light min-h-screen"
        style={{ backgroundColor: "var(--obs-bg)", color: "var(--obs-text)" }}
      >
        {children}
      </div>
    </ObsThemeContext.Provider>
  );
}

export default function ObservatoryLayout({ children }: { children: React.ReactNode }) {
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
    { label: "Methodology", href: "#methodology" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="tools" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--obs-bg)",
          borderBottomColor: "var(--obs-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-2 min-h-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="font-sans text-[0.875rem] underline-offset-4 hover:underline"
              style={{ color: "var(--obs-muted)" }}
            >
              Research tools
            </Link>
            <a
              href="#intro"
              className="font-serif text-xl leading-none"
              style={{ color: "var(--obs-text)" }}
            >
              The Observatory
            </a>
          </div>

          <nav aria-label="Sections of this tool" className="-mx-1.5 flex w-full items-center gap-0.5 overflow-x-auto scrollbar-none whitespace-nowrap md:mx-0 md:w-auto">
            {!isMethodsPage && navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150"
                  style={{
                    color: isActive ? "var(--obs-accent)" : "var(--obs-muted)",
                    textDecoration: isActive ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
            {isMethodsPage && (
              <Link
                to="/mini/observatory"
                className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150"
                style={{ color: "var(--obs-muted)" }}
              >
                Back to the Observatory
              </Link>
            )}
            <Link
              to="/mini/observatory/methods"
              className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--obs-accent)" : "var(--obs-border)",
                color: isMethodsPage ? "var(--obs-accent)" : "var(--obs-muted)",
                textDecoration: isMethodsPage ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
              }}
            >
              Technical note
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--obs-border)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between font-sans text-[0.875rem]" style={{ color: "var(--obs-muted)" }}>
            <span>The Observatory, by Arin Jain</span>
            <div className="flex items-center gap-3">
              <a href="#methodology" className="hover:opacity-80 transition-opacity" style={{ color: "var(--obs-muted)" }}>
                Methodology
              </a>
              <Link to="/mini/observatory/methods" className="hover:opacity-80 transition-opacity" style={{ color: "var(--obs-accent)" }}>
                Technical note
              </Link>
            </div>
          </div>
          <p className="mt-3 font-sans text-[0.8125rem] leading-relaxed" style={{ color: "var(--obs-muted)" }}>
            An exploratory tool, not a forecast. Charts use public data from the World Bank and FRED; the walkthrough
            and lab use deliberately simple, stylised models to illustrate mechanisms. Figures may lag or be revised at
            source. Nothing here is investment, financial, or policy advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
