import { MAX_GUESSES, type Feedback, type Guess } from "@portfolio/tradewinds";
import { isConsecutiveDay } from "./date";

export interface StoredGuess {
  guess: Guess;
  feedback: Feedback;
}

export type GameStatus = "in-progress" | "won" | "lost";

export interface DailyProgress {
  runDate: string;
  history: StoredGuess[];
  status: GameStatus;
}

export interface Stats {
  currentStreak: number;
  maxStreak: number;
  gamesPlayed: number;
  /** distribution[i] = number of wins on guess i+1 (index 0..MAX_GUESSES-1). */
  distribution: number[];
  lastPlayedDate: string | null;
}

// v2: guesses store an `eraId` instead of a raw `decade`, and route feedback
// carries per-endpoint results. Bumping the prefix drops incompatible v1
// progress rather than trying to migrate a half-played day.
const PROGRESS_PREFIX = "tradewinds:progress:v2:";
const STATS_KEY = "tradewinds:stats";

function emptyStats(): Stats {
  return {
    currentStreak: 0,
    maxStreak: 0,
    gamesPlayed: 0,
    distribution: new Array(MAX_GUESSES).fill(0),
    lastPlayedDate: null,
  };
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private browsing, quota) — progress just won't persist.
  }
}

export function loadProgress(runDate: string): DailyProgress | null {
  return readJson<DailyProgress>(PROGRESS_PREFIX + runDate);
}

export function saveProgress(progress: DailyProgress): void {
  writeJson(PROGRESS_PREFIX + progress.runDate, progress);
}

export function loadStats(): Stats {
  return readJson<Stats>(STATS_KEY) ?? emptyStats();
}

/** Call exactly once, when a day's game finishes (win or exhausted guesses). */
export function recordResult(runDate: string, status: "won" | "lost", wonOnGuess?: number): Stats {
  const stats = loadStats();
  stats.gamesPlayed += 1;

  if (status === "won" && wonOnGuess) {
    stats.distribution[wonOnGuess - 1] += 1;
    stats.currentStreak =
      stats.lastPlayedDate && isConsecutiveDay(stats.lastPlayedDate, runDate)
        ? stats.currentStreak + 1
        : 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = runDate;
  writeJson(STATS_KEY, stats);
  return stats;
}
