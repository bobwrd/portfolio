// 2D interactive world map for The Verdict index page.
//
// Replaces the old three.js globe (react-globe.gl): same data, same tier
// colors, same click-to-open behavior, but rendered as plain SVG — no WebGL,
// no runtime network fetches, and ~15 KB gzipped instead of ~1.8 MB.
//
// Interactions: hover a point for a tooltip, click to open the case,
// drag to pan, scroll/buttons to zoom.

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerdictTheme } from "./VerdictLayout";
import type { VerdictCase } from "./types";
import { WORLD_PATH, MAP_W, MAP_H, LAT_TOP, LAT_BOTTOM } from "./world-map-path";

const TIER_HEX: Record<string, string> = {
  Seismic: "#f87171",
  Major: "#fb923c",
  Moderate: "#facc15",
  Marginal: "#94a3b8",
};

function getCoords(jurisdiction: string): [number, number] {
  switch (jurisdiction) {
    case "European Union": return [52, 10];
    case "United States": return [38, -98];
    case "United Kingdom": return [54, -2];
    case "Canada": return [56, -106];
    case "Australia": return [-25, 134];
    case "China": return [35, 105];
    case "Japan": return [36, 138];
    case "India": return [22, 78];
    case "Singapore": return [1.4, 104];
    case "South Korea": return [36, 128];
    case "Brazil": return [-10, -52];
    case "Germany": return [51, 10];
    case "France": return [46, 2];
    default: return [20, 0];
  }
}

// Must mirror the generator script's projection exactly.
function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * MAP_H;
  return [x, y];
}

interface PointEntry {
  id: number;
  x: number;
  y: number;
  name: string;
  tier: string;
  edi: number;
}

// Fan out same-jurisdiction cases in small rings so points never stack.
// Ported from the globe version; degrees are smaller because the flat map
// doesn't get the globe's perspective spreading.
function spreadPoints(cases: VerdictCase[], baseStepDeg = 1.8): PointEntry[] {
  const groups = new Map<string, VerdictCase[]>();
  for (const c of cases) {
    const list = groups.get(c.jurisdiction) ?? [];
    list.push(c);
    groups.set(c.jurisdiction, list);
  }

  const out: PointEntry[] = [];
  const push = (c: VerdictCase, lat: number, lng: number) => {
    const [x, y] = project(lat, lng);
    out.push({ id: c.case_id, x, y, name: c.title, tier: c.computed.tier, edi: c.computed.EDI });
  };

  for (const [jurisdiction, list] of groups) {
    const [baseLat, baseLng] = getCoords(jurisdiction);
    let placed = 0;
    let ringIndex = 0;
    while (placed < list.length) {
      const capacity = ringIndex === 0 ? 1 : 6 * ringIndex;
      const ringEnd = Math.min(list.length, placed + capacity);
      const ringCount = ringEnd - placed;
      for (let i = 0; i < ringCount; i++) {
        const c = list[placed + i];
        if (ringIndex === 0) {
          push(c, baseLat, baseLng);
        } else {
          const angle = (i / ringCount) * Math.PI * 2;
          const jitter = (((c.case_id * 9301 + 49297) % 233280) / 233280 - 0.5) * (baseStepDeg * 0.35);
          const r = baseStepDeg * ringIndex + jitter;
          push(c, baseLat + Math.sin(angle) * r, baseLng + Math.cos(angle) * r);
        }
      }
      placed = ringEnd;
      ringIndex++;
    }
  }
  return out;
}

interface ViewBox { x: number; y: number; w: number }
const FULL_VIEW: ViewBox = { x: 0, y: 0, w: MAP_W };
const MIN_W = MAP_W / 8; // max zoom 8x
const MAX_W = MAP_W;

function clampView(v: ViewBox): ViewBox {
  const w = Math.min(MAX_W, Math.max(MIN_W, v.w));
  const h = w * (MAP_H / MAP_W);
  const x = Math.min(Math.max(v.x, 0), MAP_W - w);
  const y = Math.min(Math.max(v.y, 0), MAP_H - h);
  return { x, y, w };
}

interface Hover { entry: PointEntry; px: number; py: number }

export default function VerdictMap({ cases }: { cases: VerdictCase[] }) {
  const navigate = useNavigate();
  const { theme } = useVerdictTheme();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ px: number; py: number; dist: number } | null>(null);
  const lastDragDist = useRef(0);

  const [view, setView] = useState<ViewBox>(FULL_VIEW);
  const [hover, setHover] = useState<Hover | null>(null);

  const points = useMemo(() => spreadPoints(cases), [cases]);

  const viewH = view.w * (MAP_H / MAP_W);
  const scale = MAP_W / view.w; // current zoom factor
  // Keep marker size roughly constant on screen as the user zooms.
  const r = 5.5 / Math.sqrt(scale);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const h = v.w * (MAP_H / MAP_W);
      // Default anchor: viewport center.
      const ax = cx ?? v.x + v.w / 2;
      const ay = cy ?? v.y + h / 2;
      const w = Math.min(MAX_W, Math.max(MIN_W, v.w / factor));
      const k = w / v.w;
      return clampView({ x: ax - (ax - v.x) * k, y: ay - (ay - v.y) * k, w });
    });
  }, []);

  // Convert a pointer event to SVG user-space coordinates.
  const toSvgCoords = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return [
      view.x + ((e.clientX - rect.left) / rect.width) * view.w,
      view.y + ((e.clientY - rect.top) / rect.height) * viewH,
    ] as const;
  }, [view, viewH]);

  // Wheel zoom via a native non-passive listener: React's onWheel is passive,
  // so preventDefault() there can't stop the page from scrolling under the map.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const [ax, ay] = toSvgCoords(e);
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, ax, ay);
    };
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
  }, [toSvgCoords, zoomAt]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { px: e.clientX, py: e.clientY, dist: 0 };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    d.px = e.clientX;
    d.py = e.clientY;
    d.dist += Math.abs(dx) + Math.abs(dy);
    setView((v) => clampView({
      x: v.x - dx * (v.w / rect.width),
      y: v.y - dy * (v.w * (MAP_H / MAP_W) / rect.height),
      w: v.w,
    }));
  }, []);

  const onPointerUp = useCallback(() => {
    // Keep the distance briefly so marker onClick can tell drag from click.
    const d = dragRef.current;
    dragRef.current = null;
    if (d) lastDragDist.current = d.dist;
  }, []);

  const openCase = useCallback((id: number) => {
    if (lastDragDist.current > 6) return; // it was a pan, not a click
    navigate(`/verdict/${id}`);
  }, [navigate]);

  const showTooltip = useCallback((entry: PointEntry, e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    setHover({ entry, px: e.clientX - rect.left, py: e.clientY - rect.top });
  }, []);

  const land = isDark ? "#1b2a3a" : "#b9d9e6";
  const landStroke = isDark ? "#2c4257" : "#8fbccf";
  const sea = "transparent";

  return (
    <div>
      <div
        ref={containerRef}
        className="rounded-lg border overflow-hidden relative select-none"
        style={{ borderColor: "var(--verdict-border)", backgroundColor: "var(--verdict-surface)" }}
      >
        <svg
          ref={svgRef}
          viewBox={`${view.x} ${view.y} ${view.w} ${viewH}`}
          className="block w-full cursor-grab active:cursor-grabbing"
          style={{ backgroundColor: sea, touchAction: "none", aspectRatio: `${MAP_W} / ${MAP_H}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { onPointerUp(); setHover(null); }}
          role="img"
          aria-label="World map showing the locations of verdict cases"
        >
          <path d={WORLD_PATH} fill={land} stroke={landStroke} strokeWidth={0.5 / Math.sqrt(scale)} />

          {points.map((p) => (
            <g key={p.id}>
              {/* Soft halo */}
              <circle cx={p.x} cy={p.y} r={r * 1.9} fill={TIER_HEX[p.tier] ?? "#22d3ee"} opacity={0.18} />
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={TIER_HEX[p.tier] ?? "#22d3ee"}
                stroke={isDark ? "#0b1220" : "#ffffff"}
                strokeWidth={r * 0.28}
                className="cursor-pointer"
                onClick={() => openCase(p.id)}
                onPointerEnter={(e) => showTooltip(p, e)}
                onPointerMove={(e) => showTooltip(p, e)}
                onPointerLeave={() => setHover(null)}
              />
            </g>
          ))}
        </svg>

        {/* Zoom controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {([["+", () => zoomAt(1.5)], ["−", () => zoomAt(1 / 1.5)], ["⤾", () => setView(FULL_VIEW)]] as const).map(
            ([label, fn]) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                className="w-7 h-7 rounded border font-mono text-sm leading-none transition-opacity hover:opacity-75"
                style={{
                  borderColor: "var(--verdict-border)",
                  backgroundColor: "var(--verdict-surface)",
                  color: "var(--verdict-accent)",
                }}
                aria-label={label === "+" ? "Zoom in" : label === "−" ? "Zoom out" : "Reset view"}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Tooltip */}
        {hover && (
          <div
            className="absolute pointer-events-none z-10 rounded-lg border px-3 py-2 font-mono"
            style={{
              left: Math.min(hover.px + 12, (containerRef.current?.clientWidth ?? 300) - 230),
              top: hover.py + 12,
              maxWidth: 220,
              backgroundColor: isDark ? "#111827" : "#fff",
              borderColor: isDark ? "rgba(34,211,238,0.35)" : "rgba(14,116,144,0.25)",
              color: isDark ? "#e2e8f0" : "#0f172a",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div className="text-[11px] font-semibold mb-1.5">{hover.entry.name}</div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: TIER_HEX[hover.entry.tier] ?? "#22d3ee" }}
              />
              <span className="text-[13px] font-bold" style={{ color: isDark ? "#22d3ee" : "#0e7490" }}>
                EDI {hover.entry.edi}
              </span>
              <span className="text-[10px]" style={{ color: TIER_HEX[hover.entry.tier] }}>
                {hover.entry.tier}
              </span>
            </div>
            <div className="text-[10px] mt-1.5" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              Click to open →
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <span className="text-[0.6rem] font-mono" style={{ color: "var(--verdict-muted)" }}>
          Click any point to open that verdict · drag to pan · scroll to zoom
        </span>
        <div className="flex items-center gap-4 flex-wrap">
          {(["Seismic", "Major", "Moderate", "Marginal"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TIER_HEX[tier] }} />
              <span className="text-[0.6rem] font-mono" style={{ color: "var(--verdict-muted)" }}>
                {tier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
