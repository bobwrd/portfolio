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
        className="sticky top-0 z-40 border-b"
        style={{ borderTop: "6px solid var(--tw-accent)", borderBottomColor: "var(--tw-border)", backgroundColor: "var(--tw-bg)" }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center gap-3">
          <Link to="/tradewinds" className="font-serif text-xl leading-none" style={{ color: "var(--tw-text)" }}>
            Tradewinds
          </Link>
          <span className="font-sans text-[0.875rem]" style={{ color: "var(--tw-muted)" }}>
            A daily puzzle: deduce the voyage from its cargo
          </span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">{children}</main>
    </div>
  );
}
