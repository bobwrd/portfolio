import Nav from "./Nav";
import SectionSwitcher from "./SectionSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="Margin of Error" />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">{children}</main>
      <footer className="border-t border-border mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 text-sm text-muted-foreground flex items-center justify-between">
          <span className="tracking-tight">Margin of Error · Arin Jain · IB Year 1</span>
          <a
            href="https://linkedin.com/in/arin-jain-69a954270"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-warm-accent transition-colors duration-150"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
