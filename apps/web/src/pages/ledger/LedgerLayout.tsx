import { createContext, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import SectionSwitcher from "@/components/SectionSwitcher";

type LedgerTheme = "dark" | "light";

interface LedgerThemeContextType {
  theme: LedgerTheme;
  toggle: () => void;
}

const LedgerThemeContext = createContext<LedgerThemeContextType>({
  theme: "dark",
  toggle: () => {},
});

export function useLedgerTheme() {
  return useContext(LedgerThemeContext);
}

export function LedgerThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<LedgerTheme>(() => {
    const stored = localStorage.getItem("ledger-theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  const toggle = () => {
    const next: LedgerTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ledger-theme", next);
  };

  return (
    <LedgerThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={`ledger-section${theme === "light" ? " ledger-light" : ""} min-h-screen`}
        style={{ backgroundColor: "var(--ledger-bg)", color: "var(--ledger-text)" }}
      >
        {children}
      </div>
    </LedgerThemeContext.Provider>
  );
}

export default function LedgerLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useLedgerTheme();

  const navLinks = [
    { label: "Register", href: "/mini/ledger" },
    { label: "Charts", href: "/mini/ledger/charts" },
    { label: "Methodology", href: "/mini/ledger/about" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="Mini Projects" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: theme === "dark" ? "rgba(22,19,15,0.95)" : "rgba(250,247,240,0.95)",
          borderColor: "var(--ledger-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/mini"
              className="text-xs font-mono tracking-wider opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--ledger-muted)" }}
            >
              ← Mini Projects
            </Link>
            <Link
              to="/mini/ledger"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--ledger-accent)" }}
            >
              <span className="font-mono text-xs opacity-70">§</span>
              THE LEDGER
            </Link>
          </div>

          <nav className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active =
                link.href === "/mini/ledger" ? pathname === "/mini/ledger" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-2.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all duration-150"
                  style={{
                    color: active ? "var(--ledger-accent)" : "var(--ledger-muted)",
                    backgroundColor: active ? "var(--ledger-accent-dim)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={toggle}
            className="p-1.5 rounded transition-colors duration-150"
            style={{ color: "var(--ledger-muted)" }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--ledger-border)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between text-xs font-mono" style={{ color: "var(--ledger-muted)" }}>
            <span>THE LEDGER · Arin Jain</span>
            <Link
              to="/mini/ledger/about"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--ledger-accent)" }}
            >
              Methodology →
            </Link>
          </div>
          <p className="mt-3 text-[0.65rem] leading-relaxed" style={{ color: "var(--ledger-muted)" }}>
            Independent research project. Not affiliated with or endorsed by the Monetary Authority of Singapore or the
            Singapore Government. Compiled from public sources in good faith; provided "as is" with no warranty, and the
            author accepts no liability for errors or for any use of the data. Not legal, financial, or compliance advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
