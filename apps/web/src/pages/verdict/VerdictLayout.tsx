import { createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";

type VerdictTheme = "light";

interface VerdictThemeContextType {
  theme: VerdictTheme;
}

const VerdictThemeContext = createContext<VerdictThemeContextType>({
  theme: "light",
});

export function useVerdictTheme() {
  return useContext(VerdictThemeContext);
}

export function VerdictThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <VerdictThemeContext.Provider value={{ theme: "light" }}>
      <div
        className="verdict-section verdict-light min-h-screen"
        style={{
          backgroundColor: "var(--verdict-bg)",
          color: "var(--verdict-text)",
        }}
      >
        {children}
      </div>
    </VerdictThemeContext.Provider>
  );
}

export default function VerdictLayout({ children }: { children: React.ReactNode }) {
  usePageTitle("The Verdict, an AI regulation index");
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Index", href: "/mini/verdict" },
    { label: "Charts", href: "/mini/verdict/charts" },
    { label: "Methodology", href: "/mini/verdict/about" },
    { label: "Submit", href: "/mini/verdict/submit" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <SectionSwitcher current="tools" />
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "color-mix(in srgb, var(--verdict-bg) 92%, transparent)",
          borderColor: "var(--verdict-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/mini"
              className="text-xs underline-offset-4 hover:underline"
              style={{ color: "var(--verdict-muted)" }}
            >
              Research tools
            </Link>
            <Link
              to="/mini/verdict"
              className="font-semibold tracking-tight text-sm flex items-center gap-2"
              style={{ color: "var(--verdict-accent)" }}
            >
              The Verdict
            </Link>
          </div>

          <nav className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = link.href === "/mini/verdict"
                ? pathname === "/mini/verdict"
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-2.5 py-1.5 rounded text-xs transition-colors duration-150"
                  style={{
                    color: active ? "var(--verdict-accent)" : "var(--verdict-muted)",
                    backgroundColor: active ? "var(--verdict-accent-dim)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-20"
        style={{ borderColor: "var(--verdict-border)" }}
      >
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs"
          style={{ color: "var(--verdict-muted)" }}
        >
          <span>The Verdict, by Arin Jain</span>
          <Link
            to="/mini/verdict/about"
            className="hover:opacity-80 transition-opacity"
            style={{ color: "var(--verdict-accent)" }}
          >
            Methodology
          </Link>
        </div>
      </footer>
    </div>
  );
}
