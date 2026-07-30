import type { Hint } from "@portfolio/tradewinds";

interface HintsProps {
  revealed: Hint[];
  /** Every hint the puzzle can give, so we can tease the next one. */
  all: Hint[];
  guessesUsed: number;
}

export default function Hints({ revealed, all, guessesUsed }: HintsProps) {
  const next = all.find((h) => h.revealAt > guessesUsed);
  if (revealed.length === 0 && !next) return null;

  return (
    <div
      className="rounded-lg border p-5"
      style={{ backgroundColor: "var(--tw-surface)", borderColor: "var(--tw-border)" }}
    >
      <h2 className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--tw-muted)" }}>
        Hints
      </h2>

      {revealed.length > 0 && (
        <ul className="space-y-2">
          {revealed.map((hint) => (
            <li key={hint.id} className="text-sm" style={{ color: "var(--tw-text)" }}>
              <span className="font-medium">{hint.label}:</span> {hint.text}
            </li>
          ))}
        </ul>
      )}

      {next && (
        <p
          className={`text-xs ${revealed.length > 0 ? "mt-3 pt-3 border-t" : ""}`}
          style={{ color: "var(--tw-muted)", borderColor: "var(--tw-border)" }}
        >
          Next hint ({next.label.toLowerCase()}) unlocks after guess {next.revealAt}.
        </p>
      )}
    </div>
  );
}
