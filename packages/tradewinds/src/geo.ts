const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Great-circle midpoint between two lat/lon points, in degrees. */
export function midpoint(lat1: number, lon1: number, lat2: number, lon2: number): [number, number] {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const lambda1 = toRad(lon1);
  const deltaLambda = toRad(lon2 - lon1);

  const bx = Math.cos(phi2) * Math.cos(deltaLambda);
  const by = Math.cos(phi2) * Math.sin(deltaLambda);

  const phiM = Math.atan2(
    Math.sin(phi1) + Math.sin(phi2),
    Math.sqrt((Math.cos(phi1) + bx) ** 2 + by ** 2),
  );
  const lambdaM = lambda1 + Math.atan2(by, Math.cos(phi1) + bx);

  return [toDeg(phiM), toDeg(lambdaM)];
}

/** Initial great-circle bearing from point 1 to point 2, in degrees [0, 360). */
export function bearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);

  return (toDeg(theta) + 360) % 360;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle (haversine) distance between two lat/lon points, in kilometres. */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Rounds to a readable precision — exact metres are noise at this scale. */
export function formatDistanceKm(km: number): string {
  if (km < 1) return "0 km";
  if (km < 100) return `${Math.round(km)} km`;
  return `${(Math.round(km / 10) * 10).toLocaleString("en-US")} km`;
}

const COMPASS_LABELS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

/** 16-point compass label for a bearing, so direction is always readable as text, not just an arrow glyph. */
export function compassLabel(bearingDeg: number): string {
  const index = Math.round(bearingDeg / 22.5) % 16;
  return COMPASS_LABELS[index];
}
