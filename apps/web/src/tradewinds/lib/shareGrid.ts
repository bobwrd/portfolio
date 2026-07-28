import { MAX_GUESSES, type FeedbackLevel } from "@portfolio/tradewinds";
import type { StoredGuess } from "./storage";

const EMOJI: Record<FeedbackLevel, string> = {
  green: "🟩",
  yellow: "🟨",
  grey: "⬜",
};

export function buildShareText(
  runDate: string,
  history: StoredGuess[],
  status: "won" | "lost",
): string {
  const result = status === "won" ? `${history.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const rows = history.map(
    (h) => `${EMOJI[h.feedback.route.level]}${EMOJI[h.feedback.era.level]}${EMOJI[h.feedback.role.level]}`,
  );
  return [`Tradewinds ${runDate}  ${result}`, ...rows, "🧭📅💰"].join("\n");
}
