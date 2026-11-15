import Nav from "./Nav";
import SectionSwitcher from "./SectionSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionSwitcher current="writing" />
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-8">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-7 font-sans text-[0.9375rem] text-muted-foreground sm:px-8">
          <span>Margin of Error, by Arin Jain</span>
          <a
            href="https://linkedin.com/in/arin-jain-69a954270"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}
