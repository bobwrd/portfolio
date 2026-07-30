import {
  compassLabel,
  findEra,
  findPort,
  formatDistanceKm,
  type FeedbackLevel,
  type Port,
  type PortFeedback,
} from "@portfolio/tradewinds";
import type { StoredGuess } from "../lib/storage";

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

function Cell({ level, glyph, title, detail }: { level: FeedbackLevel; glyph: string; title: string; detail: string }) {
  return (
    <div className="rounded px-3 py-2 text-white" style={{ backgroundColor: levelColor(level) }}>
      <div className="flex items-baseline gap-2">
        <span aria-hidden="true">{glyph}</span>
        <span className="text-xs uppercase tracking-wide opacity-90">{title}</span>
        <span className="text-xs opacity-90 ml-auto">{LEVEL_LABEL[level]}</span>
      </div>
      <div className="text-sm font-medium mt-0.5">{detail}</div>
    </div>
  );
}

/** Exact match needs no arrow; anything else gets distance plus a compass direction. */
function portDetail(fb: PortFeedback): string {
  if (fb.level === "green") return "exact";
  return `${formatDistanceKm(fb.distanceKm)} ${compassLabel(fb.bearing)}`;
}

function eraDetail(era: StoredGuess["feedback"]["era"]): string {
  if (era.level === "green") return "exact";
  if (era.distance < 0) return "unknown era";
  const plural = era.distance === 1 ? "era" : "eras";
  return `${era.distance} ${plural} ${era.direction === "later" ? "▲ later" : "▼ earlier"}`;
}

export default function GuessHistory({ history, ports }: { history: StoredGuess[]; ports: Port[] }) {
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
        const { guess, feedback } = entry;
        const origin = findPort(ports, guess.originPortId);
        const dest = findPort(ports, guess.destinationPortId);
        const era = findEra(guess.eraId);

        return (
          <div
            key={i}
            className="rounded-lg border p-3"
            style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface)" }}
          >
            <div className="text-xs mb-2" style={{ color: "var(--tw-muted)" }}>
              Guess {i + 1}: {origin?.name ?? "?"} → {dest?.name ?? "?"}, {era?.label ?? guess.eraId},{" "}
              {guess.economicRole}
            </div>

            {feedback.route.swapped && (
              <div
                className="rounded px-2 py-1 text-xs mb-2"
                style={{ backgroundColor: "var(--tw-accent-dim)", color: "var(--tw-text)" }}
              >
                Right pair of ports — wrong way round.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Cell level={feedback.route.origin.level} glyph="⚓" title="Origin" detail={portDetail(feedback.route.origin)} />
              <Cell
                level={feedback.route.destination.level}
                glyph="🧭"
                title="Destination"
                detail={portDetail(feedback.route.destination)}
              />
              <Cell level={feedback.era.level} glyph="📅" title="Era" detail={eraDetail(feedback.era)} />
              <Cell level={feedback.role.level} glyph="💰" title="Role" detail={feedback.role.nudge ?? "correct"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
