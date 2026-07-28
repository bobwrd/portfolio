import { loadStats } from "../lib/storage";
import Overlay from "./Overlay";

export default function StatsPanel({ onClose }: { onClose: () => void }) {
  const stats = loadStats();
  const maxCount = Math.max(1, ...stats.distribution);

  return (
    <Overlay title="Your stats" onClose={onClose}>
      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div>
          <div className="text-2xl font-bold" style={{ color: "var(--tw-text)" }}>
            {stats.gamesPlayed}
          </div>
          <div className="text-xs" style={{ color: "var(--tw-muted)" }}>
            Played
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: "var(--tw-text)" }}>
            {stats.currentStreak}
          </div>
          <div className="text-xs" style={{ color: "var(--tw-muted)" }}>
            Current streak
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: "var(--tw-text)" }}>
            {stats.maxStreak}
          </div>
          <div className="text-xs" style={{ color: "var(--tw-muted)" }}>
            Max streak
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--tw-text)" }}>
        Guess distribution
      </h3>
      <div className="space-y-1">
        {stats.distribution.map((count, i) => (
          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--tw-text)" }}>
            <span className="w-4 text-right">{i + 1}</span>
            <div className="flex-1 rounded" style={{ backgroundColor: "var(--tw-surface-2)" }}>
              <div
                className="rounded px-1.5 text-white text-right"
                style={{
                  backgroundColor: "var(--tw-accent)",
                  width: `${Math.max(8, (count / maxCount) * 100)}%`,
                }}
              >
                {count > 0 ? count : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Overlay>
  );
}
