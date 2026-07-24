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
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b shrink-0"
        style={{
          backgroundColor: "rgba(246,244,255,0.92)",
          borderColor: "var(--dl-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/mini" className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity" style={{ color: "var(--dl-muted)" }}>
              ← Mini Projects
            </Link>
            <Link to="/mini/lab" className="font-semibold tracking-tight text-sm flex items-center gap-2" style={{ color: "var(--dl-accent)" }}>
              <span className="font-mono text-xs opacity-70">◣◢</span>
              THE DISTRIBUTION LAB
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              to={isMethods ? "/mini/lab" : "/mini/lab/methods"}
              className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide border transition-all duration-150"
              style={{
                borderColor: isMethods ? "var(--dl-accent)" : "var(--dl-border)",
                color: isMethods ? "var(--dl-accent)" : "var(--dl-muted)",
                backgroundColor: isMethods ? "var(--dl-accent-dim)" : "transparent",
              }}
            >
              {isMethods ? "← Lab" : "Methods"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
}
