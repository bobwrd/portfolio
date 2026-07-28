import { useEffect, useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import type { GeometryCollection } from "topojson-specification";
import landTopology from "world-atlas/land-110m.json";
import type { Port } from "@portfolio/tradewinds";

const WIDTH = 960;
const HEIGHT = 500;

const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
const landGeo = feature(topology, topology.objects.land);

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], landGeo as GeoJSON.GeoJSON);
const pathGenerator = geoPath(projection);
const LAND_PATH = pathGenerator(landGeo as GeoJSON.GeoJSON) ?? "";

interface WorldMapProps {
  origin?: Port;
  destination?: Port;
  /** Whether to draw the true route (win, loss, or a previously-completed day). */
  revealed: boolean;
}

/**
 * Blank world map (land silhouette only) until `revealed`, at which point the
 * true route animates in as a drawn line between the two ports.
 */
export default function WorldMap({ origin, destination, revealed }: WorldMapProps) {
  const lineRef = useRef<SVGPathElement | null>(null);
  const [dashLength, setDashLength] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  const points = useMemo(() => {
    if (!origin || !destination) return null;
    const o = projection([origin.lon, origin.lat]);
    const d = projection([destination.lon, destination.lat]);
    if (!o || !d) return null;
    return { o, d };
  }, [origin, destination]);

  const routeD = useMemo(() => {
    if (!points) return "";
    const { o, d } = points;
    const mx = (o[0] + d[0]) / 2;
    const my = (o[1] + d[1]) / 2 - Math.abs(d[0] - o[0]) * 0.15;
    return `M ${o[0]},${o[1]} Q ${mx},${my} ${d[0]},${d[1]}`;
  }, [points]);

  useEffect(() => {
    if (!revealed || !routeD) {
      setAnimateIn(false);
      setDashLength(null);
      return;
    }
    const length = lineRef.current?.getTotalLength() ?? null;
    setDashLength(length);
    setAnimateIn(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
    return () => cancelAnimationFrame(raf);
  }, [revealed, routeD]);

  const label = revealed && origin && destination
    ? `Map showing the true route from ${origin.name} to ${destination.name}`
    : "Map, blank until the voyage is revealed";

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto rounded-md"
      role="img"
      aria-label={label}
    >
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="var(--tw-ocean)" />
      <path d={LAND_PATH} fill="var(--tw-land)" stroke="var(--tw-land-border)" strokeWidth={0.6} />
      {revealed && points && (
        <>
          <path
            ref={lineRef}
            d={routeD}
            fill="none"
            stroke="var(--tw-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={dashLength ?? undefined}
            strokeDashoffset={dashLength == null ? 0 : animateIn ? 0 : dashLength}
            style={{ transition: "stroke-dashoffset 1.4s ease-in-out" }}
          />
          <circle cx={points.o[0]} cy={points.o[1]} r={5} fill="var(--tw-accent)" stroke="var(--tw-surface)" strokeWidth={1.5} />
          <circle cx={points.d[0]} cy={points.d[1]} r={5} fill="var(--tw-accent)" stroke="var(--tw-surface)" strokeWidth={1.5} />
          <text x={points.o[0] + 8} y={points.o[1] - 8} fontSize={12} fill="var(--tw-text)">
            {origin!.name}
          </text>
          <text x={points.d[0] + 8} y={points.d[1] - 8} fontSize={12} fill="var(--tw-text)">
            {destination!.name}
          </text>
        </>
      )}
    </svg>
  );
}
