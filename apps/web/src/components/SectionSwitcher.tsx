import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  { to: "/", label: "Home" },
  { to: "/writing", label: "Margin of Error" },
  { to: "/mini", label: "Mini Projects" },
  { to: "/onebook", label: "OneBook" },
  { to: "/ask", label: "Ask" },
];

/**
 * Small, low-weight section switcher meant to be dropped into any section's
 * own layout — not a persistent site-wide nav bar. Each section keeps its
 * own chrome; this is just a way to jump between the four sections.
 */
export default function SectionSwitcher({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="fixed right-3 top-3 z-50 font-sans text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-neutral-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-200"
        aria-expanded={open}
      >
        {current ?? "Sections"} ▾
      </button>
      {open && (
        <div className="mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
