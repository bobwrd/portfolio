import { useEffect, useMemo, useState } from "react";
import {
  MAX_GUESSES,
  allHints,
  findPort,
  gradeEra,
  gradeRole,
  gradeRoute,
  isWin,
  revealedHints,
  revealedManifestRows,
  type Feedback,
  type Guess,
  type Port,
  type Puzzle,
} from "@portfolio/tradewinds";
import TradewindsShell from "../TradewindsShell";
import Manifest from "../components/Manifest";
import GuessBuilder from "../components/GuessBuilder";
import GuessHistory from "../components/GuessHistory";
import Hints from "../components/Hints";
import WorldMap from "../components/WorldMap";
import ResultView from "../components/ResultView";
import HowToPlay from "../components/HowToPlay";
import StatsPanel from "../components/StatsPanel";
import { fetchPorts, fetchPuzzle } from "../lib/api";
import { todayLocalDate } from "../lib/date";
import { deriveLocks, NO_LOCKS } from "../lib/locks";
import { loadProgress, recordResult, saveProgress, type DailyProgress, type StoredGuess } from "../lib/storage";

type LoadState = "loading" | "ready" | "not-scheduled" | "error";

export default function TradewindsGame() {
  const runDate = useMemo(() => todayLocalDate(), []);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [ports, setPorts] = useState<Port[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchPuzzle(runDate), fetchPorts()])
      .then(([loadedPuzzle, loadedPorts]) => {
        if (cancelled) return;
        setPorts(loadedPorts);
        if (!loadedPuzzle) {
          setLoadState("not-scheduled");
          return;
        }
        setPuzzle(loadedPuzzle);
        const existing = loadProgress(runDate);
        setProgress(existing ?? { runDate, history: [], status: "in-progress" });
        setLoadState("ready");
      })
      .catch(() => !cancelled && setLoadState("error"));
    return () => {
      cancelled = true;
    };
  }, [runDate]);

  function handleGuess(guess: Guess) {
    if (!puzzle || !progress || progress.status !== "in-progress") return;

    const feedback: Feedback = {
      route: gradeRoute(guess.originPortId, guess.destinationPortId, puzzle.originPortId, puzzle.destinationPortId, ports),
      era: gradeEra(guess.eraId, puzzle.decade),
      role: gradeRole(guess.economicRole, puzzle.economicRole),
    };

    const entry: StoredGuess = { guess, feedback };
    const history = [...progress.history, entry];
    const won = isWin(feedback);
    const exhausted = history.length >= MAX_GUESSES;
    const status: DailyProgress["status"] = won ? "won" : exhausted ? "lost" : "in-progress";

    const next: DailyProgress = { runDate, history, status };
    saveProgress(next);
    setProgress(next);

    if (won) recordResult(runDate, "won", history.length);
    else if (exhausted) recordResult(runDate, "lost");
  }

  const originPort = puzzle ? findPort(ports, puzzle.originPortId) : undefined;
  const destinationPort = puzzle ? findPort(ports, puzzle.destinationPortId) : undefined;
  const finished = progress?.status === "won" || progress?.status === "lost";
  const guessesUsed = progress?.history.length ?? 0;
  const locks = useMemo(
    () => (progress ? deriveLocks(progress.history) : NO_LOCKS),
    [progress],
  );
  const hints = useMemo(
    () => (puzzle ? allHints(puzzle, ports) : []),
    [puzzle, ports],
  );

  return (
    <TradewindsShell>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--tw-text)" }}>
            Today's voyage
          </h1>
          <p className="text-sm" style={{ color: "var(--tw-muted)" }}>
            {runDate}
            {loadState === "ready" && !finished && ` · Guess ${guessesUsed + 1} of ${MAX_GUESSES}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowStats(true)}
            className="rounded border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
          >
            Stats
          </button>
          <button
            type="button"
            onClick={() => setShowHowTo(true)}
            className="rounded border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
          >
            How to play
          </button>
        </div>
      </div>

      {loadState === "loading" && (
        <p style={{ color: "var(--tw-muted)" }}>Loading today's voyage…</p>
      )}

      {loadState === "error" && (
        <p style={{ color: "var(--tw-muted)" }}>
          Couldn't load today's voyage. Try reloading the page.
        </p>
      )}

      {loadState === "not-scheduled" && (
        <p style={{ color: "var(--tw-muted)" }}>
          Tomorrow's voyage isn't loaded yet — check back soon.
        </p>
      )}

      {loadState === "ready" && puzzle && progress && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="space-y-6">
            <Manifest
              rows={
                finished
                  ? puzzle.manifest
                  : revealedManifestRows(puzzle.manifest, guessesUsed)
              }
              currencyName={puzzle.currencyName}
              totalRows={puzzle.manifest.length}
            />

            {!finished && (
              <Hints
                revealed={revealedHints(puzzle, ports, guessesUsed)}
                all={hints}
                guessesUsed={guessesUsed}
              />
            )}

            {finished ? (
              <ResultView puzzle={puzzle} history={progress.history} status={progress.status as "won" | "lost"} />
            ) : (
              <GuessBuilder ports={ports} disabled={finished} locks={locks} onSubmit={handleGuess} />
            )}
          </div>

          <div className="space-y-6">
            <WorldMap origin={originPort} destination={destinationPort} revealed={finished} />

            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase mb-2" style={{ color: "var(--tw-muted)" }}>
                Guess log
              </h2>
              <GuessHistory history={progress.history} ports={ports} />
            </div>
          </div>
        </div>
      )}

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
      {showStats && <StatsPanel onClose={() => setShowStats(false)} />}
    </TradewindsShell>
  );
}
