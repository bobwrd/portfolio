import { useEffect, useState } from "react";
import type { Puzzle } from "@portfolio/tradewinds";
import { formatCountdown, msUntilNextLocalMidnight } from "../lib/date";
import type { StoredGuess } from "../lib/storage";
import ShareGrid from "./ShareGrid";

interface ResultViewProps {
  puzzle: Puzzle;
  history: StoredGuess[];
  status: "won" | "lost";
}

export default function ResultView({ puzzle, history, status }: ResultViewProps) {
  const [countdown, setCountdown] = useState(msUntilNextLocalMidnight());

  useEffect(() => {
    const id = setInterval(() => setCountdown(msUntilNextLocalMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-lg border p-6 space-y-4"
      style={{ backgroundColor: "var(--tw-surface)", borderColor: "var(--tw-border)" }}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--tw-muted)" }}>
          {status === "won" ? `Solved in ${history.length} of 10 guesses` : "Not solved this time"}
        </p>
        <h2 className="text-xl font-bold mt-1" style={{ color: "var(--tw-text)" }}>
          {puzzle.shipName}
        </h2>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--tw-text)" }}>
        {puzzle.reveal}
      </p>

      <ShareGrid runDate={puzzle.runDate} history={history} status={status} />

      <div className="pt-3 border-t text-sm" style={{ borderColor: "var(--tw-border)", color: "var(--tw-muted)" }}>
        Next voyage in <span style={{ color: "var(--tw-text)" }}>{formatCountdown(countdown)}</span>
      </div>
    </div>
  );
}
