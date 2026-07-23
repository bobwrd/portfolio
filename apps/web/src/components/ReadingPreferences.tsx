import { useState, useEffect } from "react";
import { Moon, Sun, Share2, Link2, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const FONT_SIZES = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
  { label: "XL", value: "xl" },
];

const FONTS = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
  { label: "Mono", value: "mono" },
];

type Theme = "light" | "dark";

export default function ReadingPreferences() {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("moe-font-size") || "md");
  const [font, setFont] = useState(() => localStorage.getItem("moe-font") || "serif");
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    localStorage.setItem("moe-font-size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.dataset.font = font;
    localStorage.setItem("moe-font", font);
  }, [font]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vite-ui-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const articleUrl = encodeURIComponent(window.location.href);
  const articleTitle = encodeURIComponent(document.title || "");
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${articleUrl}&text=${articleTitle}`;

  return (
    <div className="flex items-center gap-1">
      {/* Font */}
      <div className="flex items-center border border-border rounded-md overflow-hidden mr-1">
        {FONTS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFont(f.value)}
            title={`Font: ${f.label}`}
            className={`px-2 py-1.5 text-xs transition-colors ${
              font === f.value
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Font size */}
      <div className="flex items-center border border-border rounded-md overflow-hidden mr-1">
        {FONT_SIZES.map((size) => (
          <button
            key={size.value}
            onClick={() => setFontSize(size.value)}
            title={`Font size ${size.label}`}
            className={`px-2 py-1.5 text-xs transition-colors ${
              fontSize === size.value
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Share button */}
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setShareOpen((o) => !o)} title="Share">
          <Share2 className="h-4 w-4" />
        </Button>

        {shareOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShareOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-md shadow-md w-44 overflow-hidden">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-secondary transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy link"}
              </button>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-secondary transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-secondary transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                X / Twitter
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}