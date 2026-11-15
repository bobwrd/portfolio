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
          backgroundColor: "var(--docket-bg)",
          borderBottomColor: "var(--docket-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-2 min-h-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/mini"
              className="font-sans text-[0.875rem] underline-offset-4 hover:underline"
              style={{ color: "var(--docket-muted)" }}
            >
              Research tools
            </Link>
            <a
              href="#intro"
              className="font-serif text-xl leading-none"
              style={{ color: "var(--docket-text)" }}
            >
              The Docket
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
                      color: isActive ? "var(--docket-accent)" : "var(--docket-muted)",
                      textDecoration: isActive ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            {isMethodsPage && (
              <Link
                to="/mini/docket"
                className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150"
                style={{ color: "var(--docket-muted)" }}
              >
                Back to the Docket
              </Link>
            )}
            <Link
              to="/mini/docket/methods"
              className="px-1.5 py-1.5 font-sans text-[0.875rem] transition-colors duration-150 border"
              style={{
                borderColor: isMethodsPage ? "var(--docket-accent)" : "var(--docket-border)",
                color: isMethodsPage ? "var(--docket-accent)" : "var(--docket-muted)",
                textDecoration: isMethodsPage ? "underline" : "none", textDecorationThickness: "2px", textUnderlineOffset: "0.4em",
              }}
            >
              Technical note
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--docket-border)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <div
            className="flex items-center justify-between font-sans text-[0.875rem]"
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
          <p className="mt-3 font-sans text-[0.8125rem] leading-relaxed" style={{ color: "var(--docket-muted)" }}>
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
