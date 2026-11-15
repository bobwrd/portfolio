import { createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";

type LedgerTheme = "light";

interface LedgerThemeContextType {
  theme: LedgerTheme;
}

const LedgerThemeContext = createContext<LedgerThemeContextType>({
  theme: "light",
});

export function useLedgerTheme() {
  return useContext(LedgerThemeContext);
}

export function LedgerThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <LedgerThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="ledger-section ledger-light min-h-screen"
        style={{ backgroundColor: "var(--ledger-bg)", color: "var(--ledger-text)" }}
      >
        {children}
      </div>
    </LedgerThemeContext.Provider>
  );
}

export default function LedgerLayout({ children }: { children: React.ReactNode }) {
  usePageTitle("The Ledger, a MAS enforcement register");
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Register", href: "/mini/ledger" },
    { label: "Charts", href: "/mini/ledger/charts" },
    { label: "Methodology", href: "/mini/ledger/about" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="tools" />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "color-mix(in srgb, var(--ledger-bg) 92%, transparent)",
          borderColor: "var(--ledger-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/mini"
              className="text-xs underline-offset-4 hover:underline"
              style={{ color: "var(--ledger-muted)" }}
            >
              Research tools
            </Link>
            <Link
              to="/mini/ledger"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--ledger-accent)" }}
            >
              The Ledger
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
                  className="px-2.5 py-1.5 rounded text-xs transition-colors duration-150"
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
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">{children}</main>

      <footer className="border-t mt-20" style={{ borderColor: "var(--ledger-border)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--ledger-muted)" }}>
            <span>The Ledger, by Arin Jain</span>
            <Link
              to="/mini/ledger/about"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--ledger-accent)" }}
            >
              Methodology
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
