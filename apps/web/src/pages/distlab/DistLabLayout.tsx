import { createContext, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import SectionSwitcher from "@/components/SectionSwitcher";

type DLTheme = "dark" | "light";

interface DLThemeContextType { theme: DLTheme; toggle: () => void; }
const DLThemeContext = createContext<DLThemeContextType>({ theme: "dark", toggle: () => {} });
export function useDistLabTheme() { return useContext(DLThemeContext); }

export function DistLabThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DLTheme>(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("distlab-theme") : null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });
  const toggle = () => {
    const next: DLTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("distlab-theme", next);
  };
  return (
    <DLThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`distlab-section${theme === "light" ? " distlab-light" : ""} min-h-screen`}
        style={{ backgroundColor: "var(--dl-bg)", color: "var(--dl-text)" }}
      >
        {children}
      </div>
    </DLThemeContext.Provider>
  );
}

export default function DistLabLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useDistLabTheme();
  const location = useLocation();
  const isMethods = location.pathname.endsWith("/methods");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b shrink-0"
        style={{
          backgroundColor: theme === "dark" ? "rgba(11,15,31,0.92)" : "rgba(246,244,255,0.92)",
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
            <button onClick={toggle} className="p-1.5 rounded transition-colors duration-150 shrink-0" style={{ color: "var(--dl-muted)" }} title="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">{children}</main>
    </div>
  );
}
