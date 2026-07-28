import { bearing, midpoint } from "./geo.js";
import { findPort } from "./ports.js";
import { roleMarginIndex } from "./roles.js";
import type {
  EconomicRole,
  EraFeedback,
  Feedback,
  ManifestRow,
  Port,
  RevealAt,
  RoleFeedback,
  RouteFeedback,
} from "./types.js";

export function gradeRoute(
  guessOriginId: string,
  guessDestId: string,
  trueOriginId: string,
  trueDestId: string,
  ports: Port[],
): RouteFeedback {
  const originMatch = guessOriginId === trueOriginId;
  const destMatch = guessDestId === trueDestId;
  const swapped = guessOriginId === trueDestId && guessDestId === trueOriginId;

  let level: RouteFeedback["level"];
  if (originMatch && destMatch) {
    level = "green";
  } else if (originMatch || destMatch || swapped) {
    level = "yellow";
  } else {
    const guessOrigin = findPort(ports, guessOriginId);
    const guessDest = findPort(ports, guessDestId);
    const trueOrigin = findPort(ports, trueOriginId);
    const trueDest = findPort(ports, trueDestId);
    const regionMatch =
      (!!guessOrigin && !!trueOrigin && guessOrigin.region === trueOrigin.region) ||
      (!!guessDest && !!trueDest && guessDest.region === trueDest.region);
    level = regionMatch ? "yellow" : "grey";
  }

  const arrowBearing = computeRouteArrow(guessOriginId, guessDestId, trueOriginId, trueDestId, ports);

  return { level, arrowBearing };
}

function computeRouteArrow(
  guessOriginId: string,
  guessDestId: string,
  trueOriginId: string,
  trueDestId: string,
  ports: Port[],
): number {
  const guessOrigin = findPort(ports, guessOriginId);
  const guessDest = findPort(ports, guessDestId);
  const trueOrigin = findPort(ports, trueOriginId);
  const trueDest = findPort(ports, trueDestId);
  if (!guessOrigin || !guessDest || !trueOrigin || !trueDest) return 0;

  const [gLat, gLon] = midpoint(guessOrigin.lat, guessOrigin.lon, guessDest.lat, guessDest.lon);
  const [tLat, tLon] = midpoint(trueOrigin.lat, trueOrigin.lon, trueDest.lat, trueDest.lon);

  return bearing(gLat, gLon, tLat, tLon);
}

export function gradeEra(guessDecade: number, trueDecade: number): EraFeedback {
  const diff = Math.abs(guessDecade - trueDecade);
  let level: EraFeedback["level"];
  if (diff === 0) level = "green";
  else if (diff <= 20) level = "yellow";
  else level = "grey";

  const direction = diff === 0 ? null : trueDecade > guessDecade ? "later" : "earlier";

  return { level, direction };
}

export function gradeRole(guessRole: EconomicRole, trueRole: EconomicRole): RoleFeedback {
  if (guessRole === trueRole) return { level: "green", nudge: null };

  const guessIndex = roleMarginIndex(guessRole);
  const trueIndex = roleMarginIndex(trueRole);
  const nudge = guessIndex < trueIndex ? "undervalued" : "overvalued";

  return { level: "grey", nudge };
}

export function isWin(feedback: Feedback): boolean {
  return (
    feedback.route.level === "green" &&
    feedback.era.level === "green" &&
    feedback.role.level === "green"
  );
}

export function revealedManifestRows(manifest: ManifestRow[], guessCount: number): ManifestRow[] {
  return manifest.filter((row) => isRevealed(row.revealAt, guessCount));
}

function isRevealed(revealAt: RevealAt, guessCount: number): boolean {
  return revealAt === null || revealAt <= guessCount;
}
