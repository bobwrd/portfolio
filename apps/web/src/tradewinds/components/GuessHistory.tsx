import { compassLabel, findPort, formatDecade, type FeedbackLevel, type Port } from "@portfolio/tradewinds";
import type { StoredGuess } from "../lib/storage";

interface GuessHistoryProps {
  history: StoredGuess[];
  ports: Port[];
}

const LEVEL_LABEL: Record<FeedbackLevel, string> = {
  green: "Match",
  yellow: "Close",
  grey: "Off",
};

function levelColor(level: FeedbackLevel): string {
  if (level === "green") return "var(--tw-green)";
  if (level === "yellow") return "var(--tw-yellow)";
  return "var(--tw-grey)";
}

function FeedbackCell({ level, glyph, detail }: { level: FeedbackLevel; glyph: string; detail: string }) {
  return (
    <div
      className="rounded px-3 py-2 flex items-center gap-2 text-sm text-white"
      style={{ backgroundColor: levelColor(level) }}
    >
      <span aria-hidden="true">{glyph}</span>
      <span className="font-medium">{detail}</span>
      <span className="text-xs opacity-90 ml-auto">{LEVEL_LABEL[level]}</span>
    </div>
  );
}

export default function GuessHistory({ history, ports }: GuessHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--tw-muted)" }}>
        No guesses yet — your first guess starts the log below.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry, i) => {
        const origin = findPort(ports, entry.guess.originPortId);
        const dest = findPort(ports, entry.guess.destinationPortId);
        const era = entry.feedback.era;
        const role = entry.feedback.role;
        const route = entry.feedback.route;

        return (
          <div
            key={i}
            className="rounded-lg border p-3"
            style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}
          >
            <div className="text-xs mb-2" style={{ color: "var(--tw-muted)" }}>
              Guess {i + 1}: {origin?.name ?? "?"} → {dest?.name ?? "?"}, {formatDecade(entry.guess.decade)},{" "}
              {entry.guess.economicRole}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <FeedbackCell level={route.level} glyph="🧭" detail={`toward ${compassLabel(route.arrowBearing)}`} />
              <FeedbackCell
                level={era.level}
                glyph="📅"
                detail={era.direction === "later" ? "▲ later" : era.direction === "earlier" ? "▼ earlier" : "exact"}
              />
              <FeedbackCell level={role.level} glyph="💰" detail={role.nudge ?? "correct"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
