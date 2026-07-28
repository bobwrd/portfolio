import { useState } from "react";
import { buildShareText } from "../lib/shareGrid";
import type { StoredGuess } from "../lib/storage";

interface ShareGridProps {
  runDate: string;
  history: StoredGuess[];
  status: "won" | "lost";
}

export default function ShareGrid({ runDate, history, status }: ShareGridProps) {
  const [copied, setCopied] = useState(false);
  const text = buildShareText(runDate, history, status);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the pre-formatted text is still visible to select/copy manually.
    }
  }

  return (
    <div className="space-y-3">
      <pre
        className="rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono"
        style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface-2)", color: "var(--tw-text)" }}
      >
        {text}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded px-4 py-2 text-sm font-medium"
        style={{ backgroundColor: "var(--tw-accent)", color: "var(--tw-surface)" }}
      >
        {copied ? "Copied!" : "Copy result"}
      </button>
    </div>
  );
}
