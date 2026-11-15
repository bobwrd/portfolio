import { createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

type DLTheme = "light";

interface DLThemeContextType { theme: DLTheme; }
const DLThemeContext = createContext<DLThemeContextType>({ theme: "light" });
export function useDistLabTheme() { return useContext(DLThemeContext); }

export function DistLabThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <DLThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="distlab-section distlab-light min-h-screen"
        style={{ backgroundColor: "var(--dl-bg)", color: "var(--dl-text)" }}
      >
        {children}
      </div>
    </DLThemeContext.Provider>
  );
}

export default function DistLabLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMethods = location.pathname.endsWith("/methods");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SectionSwitcher current="tools" />
      <header
        className="sticky top-0 z-50 border-b shrink-0"
        style={{
          backgroundColor: "color-mix(in srgb, var(--dl-bg) 92%, transparent)",
          borderColor: "var(--dl-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/mini" className="text-xs underline-offset-4 hover:underline" style={{ color: "var(--dl-muted)" }}>
              Research tools
            </Link>
            <Link to="/mini/lab" className="font-semibold tracking-tight text-sm flex items-center gap-2" style={{ color: "var(--dl-accent)" }}>
              The Distribution Lab
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              to={isMethods ? "/mini/lab" : "/mini/lab/methods"}
              className="px-2.5 py-1.5 rounded text-xs border transition-colors duration-150"
              style={{
                borderColor: isMethods ? "var(--dl-accent)" : "var(--dl-border)",
                color: isMethods ? "var(--dl-accent)" : "var(--dl-muted)",
                backgroundColor: isMethods ? "var(--dl-accent-dim)" : "transparent",
              }}
            >
              {isMethods ? "Back to the lab" : "Technical note"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
}
