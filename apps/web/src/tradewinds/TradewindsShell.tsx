import { Link } from "react-router-dom";
import SectionSwitcher from "@/components/SectionSwitcher";

export default function TradewindsShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="tradewinds-section min-h-screen"
      style={{ backgroundColor: "var(--tw-bg)", color: "var(--tw-text)" }}
    >
      <SectionSwitcher current="Tradewinds" />
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: "var(--tw-border)", backgroundColor: "rgba(247,241,225,0.9)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/tradewinds" className="font-semibold tracking-tight" style={{ color: "var(--tw-text)" }}>
            ⛵ Tradewinds
          </Link>
          <span className="text-xs" style={{ color: "var(--tw-muted)" }}>
            A daily trade-voyage deduction game
          </span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
