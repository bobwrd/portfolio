import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      title="Toggle theme"
      className={`rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors duration-150 ${
        compact ? "p-1.5" : "p-2"
      }`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
