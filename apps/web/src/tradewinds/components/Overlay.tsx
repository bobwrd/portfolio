import { useEffect } from "react";
import type { ReactNode } from "react";

interface OverlayProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Overlay({ title, onClose, children }: OverlayProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-10 px-4"
      style={{ backgroundColor: "rgba(20, 16, 10, 0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border p-6"
        style={{ backgroundColor: "var(--tw-surface)", borderColor: "var(--tw-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--tw-text)" }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-sm px-2 py-1 rounded"
            style={{ color: "var(--tw-muted)" }}
          >
            ✕ Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
