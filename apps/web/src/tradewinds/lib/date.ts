/** The player's local calendar date, YYYY-MM-DD — the daily puzzle is keyed to this, not UTC. */
export function todayLocalDate(): string {
  return toLocalDateString(new Date());
}

export function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Whether `curr` is exactly one calendar day after `prev` (both YYYY-MM-DD). */
export function isConsecutiveDay(prev: string, curr: string): boolean {
  const prevDate = new Date(`${prev}T00:00:00`);
  const currDate = new Date(`${curr}T00:00:00`);
  const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / 86_400_000);
  return diffDays === 1;
}

export function msUntilNextLocalMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}
