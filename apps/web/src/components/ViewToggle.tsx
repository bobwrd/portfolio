import { LayoutList, LayoutGrid } from "lucide-react";

export type ViewMode = "list" | "grid";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  storageKey?: string;
}

export function readStoredView(key: string, fallback: ViewMode = "list"): ViewMode {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v === "grid" || v === "list" ? v : fallback;
}

export default function ViewToggle({ value, onChange, storageKey }: ViewToggleProps) {
  const handle = (mode: ViewMode) => {
    onChange(mode);
    if (storageKey) localStorage.setItem(storageKey, mode);
  };

  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden" title="View mode">
      <button
        onClick={() => handle("list")}
        aria-label="List view"
        aria-pressed={value === "list"}
        className={`px-2 py-1.5 transition-colors ${
          value === "list"
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        <LayoutList className="h-4 w-4" />
      </button>
      <button
        onClick={() => handle("grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        className={`px-2 py-1.5 transition-colors ${
          value === "grid"
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}
