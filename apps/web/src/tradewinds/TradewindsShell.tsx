import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";
import { usePageTitle } from "@/hooks/use-page-title";

export default function TradewindsShell({ children }: { children: React.ReactNode }) {
  usePageTitle("Tradewinds, a daily trade puzzle");
  return (
    <div
      className="tradewinds-section min-h-screen"
      style={{ backgroundColor: "var(--tw-bg)", color: "var(--tw-text)" }}
    >
      <SectionSwitcher current="tradewinds" />
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: "var(--tw-border)", backgroundColor: "color-mix(in srgb, var(--tw-bg) 90%, transparent)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/tradewinds" className="font-semibold tracking-tight" style={{ color: "var(--tw-text)" }}>
            Tradewinds
          </Link>
          <span className="text-xs" style={{ color: "var(--tw-muted)" }}>
            A daily puzzle: deduce the voyage from its cargo
          </span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
