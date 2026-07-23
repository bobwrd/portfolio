import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Section, Card, Details, Eq, Slider } from "../shared";
import { useReducedMotion, useEnterOnce, useAutoplay } from "../hooks";
import { priceIndex, qualityIndex, slackIndex, chapter1Caption } from "../model";

const MAX_FIRMS = 12;

// A horizontal gauge. `good` says which direction is healthy so we can colour
// the bar (low price = good, high quality = good, low slack = good).
function Gauge({
  label,
  value,
  good,
  hint,
}: {
  label: string;
  value: number;
  good: "low" | "high";
  hint: string;
}) {
  // Map value to a health score in [0,1]; 1 = healthy.
  const health = good === "high" ? value / 100 : 1 - value / 100;
  const color =
    health > 0.62 ? "var(--arena-good)" : health > 0.4 ? "var(--arena-c4)" : "var(--arena-warn)";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium" style={{ color: "var(--arena-text)" }}>
          {label}
        </span>
        <span className="text-sm font-mono" style={{ color }}>
          {value.toFixed(0)}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--arena-surface-2)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color, transition: "width 200ms ease, background-color 200ms ease" }}
        />
      </div>
      <div className="text-[0.65rem] font-mono mt-1" style={{ color: "var(--arena-muted)" }}>
        {hint}
      </div>
    </div>
  );
}

export default function Chapter1() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [firms, setFirms] = useState(reduced ? 5 : 1);
  const [autoplay, setAutoplay] = useState(false);
  const [touched, setTouched] = useState(false);

  // Auto-sweep 1 -> 12 the first time the chapter scrolls in (motion only).
  useEnterOnce(sectionRef, () => {
    if (!reduced && !touched) setAutoplay(true);
  });

  useAutoplay(
    autoplay,
    MAX_FIRMS,
    300,
    (i) => setFirms(i + 1),
    () => setAutoplay(false)
  );

  function handleSlider(v: number) {
    const n = Math.round(1 + v * (MAX_FIRMS - 1));
    setFirms(n);
    setTouched(true);
    setAutoplay(false);
  }

  const price = priceIndex(firms);
  const quality = qualityIndex(firms);
  const slack = slackIndex(firms);

  return (
    <Section id="firms" eyebrow="1 · How many firms" title="How many firms is too many?">
      <div ref={sectionRef} className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Sticky visual column */}
        <div className="lg:col-span-3 lg:sticky lg:top-20">
          <Card>
            {/* Firm strip */}
            <div className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: "var(--arena-muted)" }}>
              The market · {firms} {firms === 1 ? "firm" : "firms"}
            </div>
            <div className="flex flex-wrap gap-2 mb-5 min-h-[3.5rem]">
              {Array.from({ length: MAX_FIRMS }).map((_, i) => {
                const on = i < firms;
                return (
                  <div
                    key={i}
                    className="h-12 w-10 rounded-md flex items-end justify-center"
                    style={{
                      backgroundColor: on ? "var(--arena-accent)" : "var(--arena-surface-2)",
                      opacity: on ? 1 : 0.25,
                      transform: on ? "translateY(0) scale(1)" : "translateY(4px) scale(0.92)",
                      transition: "opacity 220ms ease, transform 220ms ease, background-color 220ms ease",
                    }}
                  >
                    <span className="text-[0.55rem] font-mono mb-1" style={{ color: "var(--arena-bg)" }}>
                      {on ? i + 1 : ""}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Consumer bar */}
            <div
              className="h-6 w-full rounded-md flex items-center px-3 mb-6"
              style={{ backgroundColor: "var(--arena-surface-2)" }}
            >
              <span className="text-[0.6rem] font-mono uppercase tracking-wider" style={{ color: "var(--arena-muted)" }}>
                consumers
              </span>
            </div>

            {/* Gauges */}
            <div className="space-y-4">
              <Gauge label="Price" value={price} good="low" hint="index · monopoly = 100" />
              <Gauge label="Quality" value={quality} good="high" hint="index · higher is better" />
              <Gauge label="Slack / waste" value={slack} good="low" hint="index · idle effort + duplication" />
            </div>

            {/* Control */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1">
                <Slider
                  label="Number of firms"
                  lo="1"
                  hi="12"
                  badge={`${firms}`}
                  value={(firms - 1) / (MAX_FIRMS - 1)}
                  onChange={handleSlider}
                />
              </div>
              <button
                onClick={() => {
                  setFirms(1);
                  setTouched(true);
                  setAutoplay(true);
                }}
                className="mt-2 shrink-0 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-mono transition-colors"
                style={{ borderColor: "var(--arena-border)", color: "var(--arena-accent)" }}
                title="Replay the sweep from one firm"
              >
                <Play className="h-3 w-3" /> Sweep
              </button>
            </div>
          </Card>
        </div>

        {/* Scrolling explanation */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--arena-text)" }}>
            Start with a monopoly and add rivals one at a time. Watch which gauge moves, and when.
          </p>
          <div
            className="rounded-lg p-4 text-sm leading-relaxed border"
            style={{ borderColor: "var(--arena-border)", backgroundColor: "var(--arena-surface)", color: "var(--arena-text)" }}
          >
            {chapter1Caption(firms)}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--arena-muted)" }}>
            Three things rarely peak together. Price keeps falling as firms enter, but most of that drop is
            done by the third or fourth rival. Quality is an inverted-U: best at a handful of competitors,
            worse at a monopoly and worse again when the market splinters. Slack is U-shaped: a lazy
            monopoly at one end, duplicated overhead and churn at the other.
          </p>

          <Details summary="Details · curves & sources">
            <p>Three indices as a function of the firm count <em>n</em> (1 to 12):</p>
            <Eq>price(n) = 60 + 40·exp(−0.55·(n−1))</Eq>
            <Eq>quality(n) = 40 + 55·exp(−(n−4.5)² / (2·2.6²))</Eq>
            <Eq>slack(n) = 25 + 50·exp(−0.6·(n−1)) + 3.2·max(0, n−5)</Eq>
            <p className="mt-2">
              The fast-flattening price drop follows Bresnahan and Reiss (1991): most competitive pressure on
              price is realised by the third to fifth entrant. The inverted-U in quality comes from Aghion,
              Bloom, Blundell, Griffith and Howitt (2005). The U-shaped slack pairs the "quiet life" of weak
              competition (Leibenstein 1966; Bertrand and Mullainathan 2003) with excess-entry duplication
              (Mankiw and Whinston 1986). Values are rescaled to 0 to 100.
            </p>
          </Details>
        </div>
      </div>
    </Section>
  );
}
